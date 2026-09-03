import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { registerAction } from "../../redux/actions/auth"
import ErrorBanner from "../../components/ErrorBanner"
import { ApiError } from "../../redux/actions/auth"

const ROLES = [
  { value: "CLIENTE", label: "Sono un cliente" },
  { value: "CANDIDATO", label: "Cerco lavoro" },
]

const Registrati = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: location.state?.role ?? "CLIENTE",
  })
  const [error, setError] = useState("")
  const [errorsList, setErrorsList] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (event) =>
    setForm((f) => ({ ...f, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setErrorsList([])
    try {
      await dispatch(registerAction(form))
      navigate("/accedi", { replace: true, state: { registered: true } })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setErrorsList(err.errorsList ?? [])
      } else {
        setError("Registrazione non riuscita. Riprova.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card ">
        <p className="smalltitle">Nuovo account</p>
        <h1 className="h2 mb-4">Crea il tuo profilo</h1>

        <div className="role-toggle">
          {ROLES.map((role) => (
            <button
              key={role.value}
              type="button"
              className={form.role === role.value ? "active" : ""}
              onClick={() => setForm((f) => ({ ...f, role: role.value }))}
            >
              {role.label}
            </button>
          ))}
        </div>

        <ErrorBanner message={error} />
        {errorsList.length > 0 && (
          <ul className="form-text-error ps-3 mb-3">
            {errorsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label" htmlFor="name">
                Nome
              </label>
              <input
                id="name"
                required
                className="form-control"
                value={form.name}
                onChange={update("name")}
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="surname">
                Cognome
              </label>
              <input
                id="surname"
                required
                className="form-control"
                value={form.surname}
                onChange={update("surname")}
              />
            </div>
          </div>
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
              minLength={8}
              className="form-control"
              value={form.password}
              onChange={update("password")}
              autoComplete="new-password"
            />
            <p className="text-steel mt-2 mb-0" style={{ fontSize: "0.78rem" }}>
              Almeno 8 caratteri, con una maiuscola, una minuscola e un numero.
            </p>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={submitting}
          >
            {submitting ? "Creazione…" : "Crea account"}
          </button>
        </form>

        <p className="text-steel small mt-4 mb-0">
          Hai già un account? <Link to="/accedi">Accedi</Link>
        </p>
      </div>
    </div>
  )
}

export default Registrati
