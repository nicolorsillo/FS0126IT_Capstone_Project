import { useState } from "react"
import { NavLink, useNavigate } from "react-router"
import { Navbar, Nav, Container } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { logoutAction } from "../redux/actions/auth"

const LINKS = [
  { to: "/servizi", label: "Servizi" },
  { to: "/chi-siamo", label: "Chi siamo" },
  { to: "/lavora-con-noi", label: "Lavora con noi" },
  { to: "/contatti", label: "Contatti" },
]

const NavBar = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const isStaff = user?.roles?.some((role) =>
    ["ADMIN", "GEOMETRA", "HR"].includes(role),
  )

  const handleLogout = () => {
    dispatch(logoutAction())
    setExpanded(false)
    navigate("/")
  }

  return (
    <Navbar
      expand="lg"
      className="oc-nav"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container className="oc-container">
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="oc-nav__mark"
          onClick={() => setExpanded(false)}
        >
          <img src="/logo-small.svg" alt="" className="oc-nav__mark-glyph" />
          <span className="oc-nav__mark-text">
            Orsillo
            <span>Costruzioni</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="oc-nav-collapse"
          className="border-0 shadow-none"
        />
        <Navbar.Collapse id="oc-nav-collapse">
          <Nav className="mx-lg-auto py-2 py-lg-0">
            {LINKS.map((link) => (
              <Nav.Link
                key={link.to}
                as={NavLink}
                to={link.to}
                onClick={() => setExpanded(false)}
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="align-items-lg-center gap-lg-2 py-2 py-lg-0">
            {user ? (
              <>
                <Nav.Link as={NavLink} to="/area-riservata">
                  Area riservata
                </Nav.Link>
                {isStaff && (
                  <Nav.Link as={NavLink} to="/backoffice">
                    Backoffice
                  </Nav.Link>
                )}
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm oc-nav__cta"
                  onClick={handleLogout}
                >
                  Esci
                </button>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/accedi"
                  onClick={() => setExpanded(false)}
                >
                  Accedi
                </Nav.Link>
                <NavLink
                  to="/area-riservata"
                  className="btn btn-primary btn-sm oc-nav__cta"
                  onClick={() => setExpanded(false)}
                >
                  Richiedi preventivo
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
