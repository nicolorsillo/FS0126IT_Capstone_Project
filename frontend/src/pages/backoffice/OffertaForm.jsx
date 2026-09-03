import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useDispatch } from "react-redux"
import {
  getJobOfferByIdAction,
  createJobOfferAction,
  updateJobOfferAction,
  updateJobOfferStatusAction,
} from "../../redux/actions/jobOffers"
import { ApiError } from "../../redux/actions/auth"
import { JOB_OFFER_STATUS } from "../../redux/reducers/jobOffers"
import StatusBadge from "../../components/StatusBadge"
import ErrorBanner from "../../components/ErrorBanner"
import Loader from "../../components/Loader"
import PageTop from "../../components/PageTop"

const EMPTY = {
  title: "",
  description: "",
  minSalary: "",
  maxSalary: "",
  position: "",
  expiresAt: "",
}

const OffertaForm = () => {
  const { jobOfferId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isEdit = Boolean(jobOfferId)

  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState("DRAFT")
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState("")
  const [errorsList, setErrorsList] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [statusBusy, setStatusBusy] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    dispatch(getJobOfferByIdAction(jobOfferId))
      .then((offer) => {
        setForm({
          title: offer.title,
          description: offer.description,
          minSalary: offer.minSalary ?? "",
          maxSalary: offer.maxSalary ?? "",
          position: offer.position,
          expiresAt: offer.expiresAt,
        })
        setStatus(offer.status)
      })
      .catch(() => setError("Offerta non trovata."))
      .finally(() => setLoading(false))
  }, [isEdit, jobOfferId, dispatch])

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setErrorsList([])
    const payload = {
      ...form,
      minSalary: Number(form.minSalary),
      maxSalary: Number(form.maxSalary),
    }
    try {
      if (isEdit) {
        await dispatch(updateJobOfferAction(jobOfferId, payload))
      } else {
        await dispatch(createJobOfferAction(payload))
      }
      navigate("/backoffice/offerte-lavoro")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setErrorsList(err.errorsList ?? [])
      } else {
        setError("Salvataggio non riuscito.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const changeStatus = async (next) => {
    setStatusBusy(true)
    try {
      await dispatch(updateJobOfferStatusAction(jobOfferId, next))
      setStatus(next)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Aggiornamento stato non riuscito.",
      )
    } finally {
      setStatusBusy(false)
    }
  }

  if (loading)
    return (
      <div className="bo-content">
        <Loader label="Carico l'offerta…" />
      </div>
    )

  return (
    <div>
      <PageTop
        smalltitle="Selezione del personale"
        title={isEdit ? "Modifica offerta" : "Nuova offerta"}
      />
      <div className="bo-content">
        <div className="bo-card" style={{ maxWidth: 640 }}>
          {isEdit && (
            <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
              <StatusBadge map={JOB_OFFER_STATUS} status={status} />
              <div className="d-flex gap-2 flex-wrap">
                {Object.keys(JOB_OFFER_STATUS)
                  .filter((s) => s !== status)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="btn btn-sm btn-outline-dark"
                      disabled={statusBusy}
                      onClick={() => changeStatus(s)}
                    >
                      {JOB_OFFER_STATUS[s].label}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <ErrorBanner message={error} />
          {errorsList.length > 0 && (
            <ul className="form-text-error ps-3 mb-3">
              {errorsList.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <div>
              <label className="form-label">Titolo</label>
              <input
                className="form-control"
                required
                value={form.title}
                onChange={update("title")}
              />
            </div>
            <div>
              <label className="form-label">Posizione</label>
              <input
                className="form-control"
                required
                placeholder="Es. Full-time"
                value={form.position}
                onChange={update("position")}
              />
            </div>
            <div>
              <label className="form-label">Descrizione</label>
              <textarea
                className="form-control"
                rows={5}
                required
                value={form.description}
                onChange={update("description")}
              />
            </div>
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label">RAL minima (€)</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  required
                  value={form.minSalary}
                  onChange={update("minSalary")}
                />
              </div>
              <div className="col-6">
                <label className="form-label">RAL massima (€)</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  required
                  value={form.maxSalary}
                  onChange={update("maxSalary")}
                />
              </div>
            </div>
            <div>
              <label className="form-label">Scadenza</label>
              <input
                type="date"
                className="form-control"
                required
                value={form.expiresAt}
                onChange={update("expiresAt")}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ justifySelf: "start" }}
            >
              {submitting
                ? "Salvataggio…"
                : isEdit
                  ? "Salva modifiche"
                  : "Crea offerta (bozza)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OffertaForm
