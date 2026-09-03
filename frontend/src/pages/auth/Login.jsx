import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { loginAction } from "../../redux/actions/auth"
import ErrorBanner from "../../components/ErrorBanner"
import { ApiError } from "../../redux/actions/auth"

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (event) =>
    setForm((f) => ({ ...f, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      await dispatch(loginAction(form.email, form.password))
      navigate(location.state?.from ?? "/area-riservata", { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Accesso non riuscito. Riprova.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card ">
        <p className="smalltitle">Area riservata</p>
        <h1 className="h2 mb-4">Accedi al tuo profilo</h1>

        {location.state?.registered && !error && (
          <div className="form-banner-success">
            Account creato. Accedi con le tue credenziali.
          </div>
        )}
        <ErrorBanner message={error} />

        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <div>
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="form-control"
              value={form.email}
              onChange={update("email")}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="form-control"
              value={form.password}
              onChange={update("password")}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={submitting}
          >
            {submitting ? "Accesso…" : "Accedi"}
          </button>
        </form>

        <p className="text-steel small mt-4 mb-0">
          Non hai un account? <Link to="/registrati">Registrati</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
