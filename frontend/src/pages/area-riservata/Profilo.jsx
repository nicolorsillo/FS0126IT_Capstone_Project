import { useState } from "react"
import { useNavigate } from "react-router"
import { Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { logoutAction, refreshAuthAction } from "../../redux/actions/auth"
import {
  updateMeAction,
  changePasswordAction,
  deleteMeAction,
} from "../../redux/actions/users"
import { ApiError } from "../../redux/actions/auth"
import ErrorBanner from "../../components/ErrorBanner"

const Profilo = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [profileForm, setProfileForm] = useState({
    name: user.name,
    surname: user.surname,
    email: user.email,
  })
  const [profileError, setProfileError] = useState("")
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileSubmitting, setProfileSubmitting] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    password: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const saveProfile = async (event) => {
    event.preventDefault()
    setProfileSubmitting(true)
    setProfileError("")
    setProfileSuccess(false)
    try {
      await dispatch(updateMeAction(profileForm))
      await dispatch(refreshAuthAction())
      setProfileSuccess(true)
    } catch (err) {
      setProfileError(
        err instanceof ApiError ? err.message : "Aggiornamento non riuscito.",
      )
    } finally {
      setProfileSubmitting(false)
    }
  }

  const savePassword = async (event) => {
    event.preventDefault()
    setPasswordSubmitting(true)
    setPasswordError("")
    setPasswordSuccess(false)
    try {
      await dispatch(changePasswordAction(passwordForm))
      setPasswordForm({ oldPassword: "", password: "" })
      setPasswordSuccess(true)
    } catch (err) {
      setPasswordError(
        err instanceof ApiError ? err.message : "Aggiornamento non riuscito.",
      )
    } finally {
      setPasswordSubmitting(false)
    }
  }

  const deleteAccount = async () => {
    setDeleteError("")
    try {
      await dispatch(deleteMeAction())
      dispatch(logoutAction())
      navigate("/", { replace: true })
    } catch (err) {
      setDeleteError(
        err instanceof ApiError ? err.message : "Eliminazione non riuscita.",
      )
    }
  }

  return (
    <div>
      <p className="smalltitle">Profilo</p>
      <h2 className="h3 mb-4">I tuoi dati</h2>

      <Row className="g-4">
        <Col lg={6}>
          <form onSubmit={saveProfile} className="oc-card d-grid gap-3">
            <h3 className="h5 mb-1">Dati personali</h3>
            {profileSuccess && (
              <div className="form-banner-success mb-0">Dati aggiornati.</div>
            )}
            <ErrorBanner message={profileError} />
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label" htmlFor="profile-name">
                  Nome
                </label>
                <input
                  id="profile-name"
                  className="form-control"
                  value={profileForm.name}
                  onChange={(event) =>
                    setProfileForm((f) => ({ ...f, name: event.target.value }))
                  }
                />
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="profile-surname">
                  Cognome
                </label>
                <input
                  id="profile-surname"
                  className="form-control"
                  value={profileForm.surname}
                  onChange={(event) =>
                    setProfileForm((f) => ({
                      ...f,
                      surname: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                className="form-control"
                value={profileForm.email}
                onChange={(event) =>
                  setProfileForm((f) => ({ ...f, email: event.target.value }))
                }
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={profileSubmitting}
              style={{ justifySelf: "start" }}
            >
              {profileSubmitting ? "Salvataggio…" : "Salva modifiche"}
            </button>
          </form>
        </Col>

        <Col lg={6}>
          <form onSubmit={savePassword} className="oc-card d-grid gap-3">
            <h3 className="h5 mb-1">Password</h3>
            {passwordSuccess && (
              <div className="form-banner-success mb-0">
                Password aggiornata.
              </div>
            )}
            <ErrorBanner message={passwordError} />
            <div>
              <label className="form-label" htmlFor="old-password">
                Password attuale
              </label>
              <input
                id="old-password"
                type="password"
                className="form-control"
                value={passwordForm.oldPassword}
                onChange={(event) =>
                  setPasswordForm((f) => ({
                    ...f,
                    oldPassword: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="form-label" htmlFor="new-password">
                Nuova password
              </label>
              <input
                id="new-password"
                type="password"
                className="form-control"
                value={passwordForm.password}
                onChange={(event) =>
                  setPasswordForm((f) => ({
                    ...f,
                    password: event.target.value,
                  }))
                }
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={passwordSubmitting}
              style={{ justifySelf: "start" }}
            >
              {passwordSubmitting ? "Salvataggio…" : "Aggiorna password"}
            </button>
          </form>
        </Col>
      </Row>

      <div className="oc-card mt-4" style={{ borderColor: "var(--rust)" }}>
        <h3 className="h5 mb-2">Elimina account</h3>
        <p className="text-steel small mb-3">
          L'eliminazione dell'account è permanente e non può essere annullata.
        </p>
        <ErrorBanner message={deleteError} />
        {confirmingDelete ? (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={deleteAccount}
            >
              Conferma eliminazione
            </button>
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={() => setConfirmingDelete(false)}
            >
              Annulla
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => setConfirmingDelete(true)}
          >
            Elimina il mio account
          </button>
        )}
      </div>
    </div>
  )
}

export default Profilo
