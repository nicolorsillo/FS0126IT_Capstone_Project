import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { getWorkByIdAction } from "../../../redux/actions/works"
import {
  getQuotesByWorkAction,
  updateQuoteStatusAction,
} from "../../../redux/actions/quotes"
import {
  getProjectsByWorkAction,
  updateProjectStatusAction,
} from "../../../redux/actions/projects"
import { getInvoicesByWorkAction } from "../../../redux/actions/invoices"
import { ApiError } from "../../../redux/actions/auth"
import { WORK_STATUS, WORK_TYPE } from "../../../redux/reducers/works"
import { QUOTE_STATUS } from "../../../redux/reducers/quotes"
import { PROJECT_STATUS } from "../../../redux/reducers/projects"
import { INVOICE_STATUS } from "../../../redux/reducers/invoices"
import StatusBadge from "../../../components/StatusBadge"
import Loader from "../../../components/Loader"
import ErrorBanner from "../../../components/ErrorBanner"
import FileViewerModal from "../../../components/FileViewerModal"

const QuoteRow = ({ quote }) => {
  const dispatch = useDispatch()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const act = async (status) => {
    setBusy(true)
    setError("")
    try {
      await dispatch(updateQuoteStatusAction(quote.id, status))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Operazione non riuscita.",
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="record-row">
      <div>
        <span className="record-row__date d-block mb-1">
          {new Date(quote.date).toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
        <StatusBadge map={QUOTE_STATUS} status={quote.status} />
        {error && <p className="form-text-error mb-0 mt-1">{error}</p>}
      </div>
      <span className="record-row__amount">
        {quote.amount.toLocaleString("it-IT", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        })}
      </span>
      <div className="d-flex gap-2">
        {quote.status === "PENDING" && (
          <>
            <button
              type="button"
              className="btn btn-sm btn-outline-dark"
              disabled={busy}
              onClick={() => act("ACCEPTED")}
            >
              Accetta
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              disabled={busy}
              onClick={() => act("REJECTED")}
            >
              Rifiuta
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const ProjectRow = ({ project, onOpenFile }) => {
  const dispatch = useDispatch()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState("")

  const approve = async () => {
    setBusy(true)
    setError("")
    try {
      await dispatch(updateProjectStatusAction(project.id, "COMPLETED"))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Operazione non riuscita.",
      )
    } finally {
      setBusy(false)
    }
  }

  const reject = async () => {
    if (!reason.trim()) {
      setError("Indica il motivo del rifiuto.")
      return
    }
    setBusy(true)
    setError("")
    try {
      await dispatch(updateProjectStatusAction(project.id, "REJECTED", reason))
      setRejecting(false)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Operazione non riuscita.",
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="py-3" style={{ borderBottom: "1px solid var(--line)" }}>
      <div className="record-row" style={{ borderBottom: "none", padding: 0 }}>
        <div>
          <button
            type="button"
            className="btn btn-link p-0 pe-2 text-blueprint"
            onClick={() => onOpenFile(project.projectUrl)}
          >
            Apri elaborato
          </button>
          <StatusBadge map={PROJECT_STATUS} status={project.status} />
        </div>
        <span />
        <div className="d-flex gap-2">
          {project.status === "IN_PROGRESS" && !rejecting && (
            <>
              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                disabled={busy}
                onClick={approve}
              >
                Approva
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                disabled={busy}
                onClick={() => setRejecting(true)}
              >
                Rifiuta
              </button>
            </>
          )}
        </div>
      </div>
      {project.status === "REJECTED" && project.rejectionReason && (
        <p className="text-steel small mt-2 mb-0">
          Motivo del rifiuto: {project.rejectionReason}
        </p>
      )}
      {rejecting && (
        <div className="mt-3 d-grid gap-2">
          <textarea
            className="form-control"
            rows={2}
            placeholder="Motivo del rifiuto"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-danger"
              disabled={busy}
              onClick={reject}
            >
              Conferma rifiuto
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-dark"
              onClick={() => setRejecting(false)}
            >
              Annulla
            </button>
          </div>
        </div>
      )}
      {error && <p className="form-text-error mb-0 mt-2">{error}</p>}
    </div>
  )
}

const OperaDettaglio = () => {
  const { workId } = useParams()
  const dispatch = useDispatch()
  const work = useSelector((state) => state.works.current)
  const quotes = useSelector((state) => state.quotes.byWork)
  const projects = useSelector((state) => state.projects.byWork)
  const invoices = useSelector((state) => state.invoices.byWork)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    Promise.all([
      dispatch(getWorkByIdAction(workId)),
      dispatch(getQuotesByWorkAction(workId)),
      dispatch(getProjectsByWorkAction(workId)),
      dispatch(getInvoicesByWorkAction(workId)),
    ])
      .catch(() => setError("Non riusciamo a caricare questa opera."))
      .finally(() => setLoading(false))
  }, [workId, dispatch])

  if (loading) return <Loader label="Carico l'opera…" />
  if (error) return <ErrorBanner message={error} />
  if (!work) return null

  return (
    <div>
      <Link
        to="/area-riservata/opere"
        className="text-steel small d-inline-block mb-3"
      >
        ← Le mie opere
      </Link>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <p className="smalltitle">{WORK_TYPE[work.type]}</p>
          <h2 className="h3 mb-2">{work.description}</h2>
          <p className="work-card__id mb-0">
            RIF. {work.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <StatusBadge map={WORK_STATUS} status={work.status} />
      </div>

      <div className="record-panel">
        <div className="record-panel__head">
          <h3>Preventivi</h3>
          <span className="record-panel__count">{quotes.length}</span>
        </div>
        {quotes.length === 0 ? (
          <p className="empty-note">Nessun preventivo ricevuto ancora.</p>
        ) : (
          quotes.map((quote) => <QuoteRow key={quote.id} quote={quote} />)
        )}
      </div>

      <div className="record-panel">
        <div className="record-panel__head">
          <h3>Elaborati del geometra</h3>
          <span className="record-panel__count">{projects.length}</span>
        </div>
        {projects.length === 0 ? (
          <p className="empty-note">Nessun elaborato caricato ancora.</p>
        ) : (
          projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onOpenFile={setPreviewUrl}
            />
          ))
        )}
      </div>

      <div className="record-panel">
        <div className="record-panel__head">
          <h3>Fatture</h3>
          <span className="record-panel__count">{invoices.length}</span>
        </div>
        {invoices.length === 0 ? (
          <p className="empty-note">Nessuna fattura emessa ancora.</p>
        ) : (
          invoices.map((invoice) => (
            <div className="record-row" key={invoice.id}>
              <div>
                <span className="record-row__date d-block mb-1">
                  {new Date(invoice.date).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <StatusBadge map={INVOICE_STATUS} status={invoice.status} />
              </div>
              <span className="record-row__amount">
                {invoice.amount.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                })}
              </span>
              <span />
            </div>
          ))
        )}
      </div>
      <FileViewerModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </div>
  )
}

export default OperaDettaglio
