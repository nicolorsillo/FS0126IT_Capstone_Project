package nicolorsillo.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import nicolorsillo.backend.entities.User;
import nicolorsillo.backend.exceptions.UnauthorizedException;
import nicolorsillo.backend.services.UsersService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.UUID;

@Component
public class TokenFilter extends OncePerRequestFilter {

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    private final JWTTools jwtTools;
    private final UsersService usersService;
    private final HandlerExceptionResolver exceptionResolver;

    public TokenFilter(JWTTools jwtTools,
                       UsersService usersService,
                       @Qualifier("handlerExceptionResolver") HandlerExceptionResolver exceptionResolver) {
        this.jwtTools = jwtTools;
        this.usersService = usersService;
        this.exceptionResolver = exceptionResolver;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        boolean hasBearerToken = authHeader != null && authHeader.startsWith("Bearer ");

        boolean isPublicJobOfferBrowsing = "GET".equalsIgnoreCase(request.getMethod())
                && PATH_MATCHER.match("/job-offers/**", request.getServletPath());

        if (isPublicJobOfferBrowsing) {
            if (hasBearerToken) {
                try {
                    this.authenticate(authHeader);
                } catch (Exception ignored) {
                    SecurityContextHolder.clearContext();
                }
            }
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (!hasBearerToken)
                throw new UnauthorizedException("Inserire il token nell'authorization header nel formato Bearer ");

            this.authenticate(authHeader);

            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            this.exceptionResolver.resolveException(request, response, null, ex);
        }
    }

    private void authenticate(String authHeader) {
        String accessToken = authHeader.replace("Bearer ", "");

        this.jwtTools.verifyToken(accessToken);

        UUID userId = this.jwtTools.extractIdFromToken(accessToken);
        User authenticatedUser = this.usersService.findByIdWithAuthorities(userId);

        Authentication authentication = new UsernamePasswordAuthenticationToken(authenticatedUser, null, authenticatedUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return PATH_MATCHER.match("/auth/**", request.getServletPath());
    }
}