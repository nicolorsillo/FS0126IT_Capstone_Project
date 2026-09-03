import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import {
  getWorkByIdAction,
  updateWorkStatusAction,
  deleteWorkAction,
} from "../../redux/actions/works"
import {
  getQuotesByWorkAction,
  createQuoteAction,
  updateQuoteStatusAction,
  deleteQuoteAction,
} from "../../redux/actions/quotes"
import {
  getInvoicesByWorkAction,
  createInvoiceAction,
  updateInvoiceStatusAction,
  deleteInvoiceAction,
} from "../../redux/actions/invoices"
import {
  getProjectsByWorkAction,
  createProjectAction,
  updateProjectStatusAction,
  deleteProjectAction,
} from "../../redux/actions/projects"
import { getUsersDirectoryAction } from "../../redux/actions/users"
import { ApiError } from "../../redux/actions/auth"
import { WORK_STATUS, WORK_TYPE } from "../../redux/reducers/works"
import { QUOTE_STATUS } from "../../redux/reducers/quotes"
import { INVOICE_STATUS } from "../../redux/reducers/invoices"
import { PROJECT_STATUS } from "../../redux/reducers/projects"
import StatusBadge from "../../components/StatusBadge"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import FileViewerModal from "../../components/FileViewerModal"
import PageTop from "../../components/PageTop"

const StatusChanger = ({ map, value, onChange, disabled }) => {
  const [next, setNext] = useState(value)
  return (
    <div className="d-flex gap-2 align-items-center flex-wrap">
      <select
        className="form-select form-select-sm"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        style={{ width: "auto" }}
      >
        {Object.keys(map).map((s) => (
          <option key={s} value={s}>
            {map[s].label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-sm btn-outline-dark"
        disabled={disabled || next === value}
        onClick={() => onChange(next)}
      >
        Aggiorna
      </button>
    </div>
  )
}

const QuotesPanel = ({ workId }) => {
  const dispatch = useDispatch()
  const quotes = useSelector((state) => state.quotes.byWork)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: "", amount: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(getQuotesByWorkAction(workId))
      .catch(() => setError("Errore nel caricamento dei preventivi."))
      .finally(() => setLoading(false))
  }, [workId, dispatch])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      await dispatch(
        createQuoteAction({
          date: new Date(form.date).toISOString(),
          amount: Number(form.amount),
          workId,
        }),
      )
      setForm({ date: "", amount: "" })
      setShowForm(false)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Creazione non riuscita.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const updateStatus = async (quoteId, status) => {
    try {
      await dispatch(updateQuoteStatusAction(quoteId, status))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Aggiornamento non riuscito.",
      )
    }
  }

  const remove = async (quoteId) => {
    try {
      await dispatch(deleteQuoteAction(quoteId))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Eliminazione non riuscita.",
      )
    }
  }

  return (
    <div className="bo-card">
      <div className="bo-card__head">
        <h3 className="h5 mb-0">Preventivi ({quotes.length})</h3>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Annulla" : "+ Nuovo preventivo"}
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="d-flex gap-2 align-items-end flex-wrap mb-3"
        >
          <div>
            <label className="form-label">Data</label>
            <input
              type="date"
              required
              className="form-control"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Importo (€)</label>
            <input
              type="number"
              min="1"
              required
              className="form-control"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Invio…" : "Crea"}
          </button>
        </form>
      )}
      <ErrorBanner message={error} />
      {loading ? (
        <Loader />
      ) : quotes.length === 0 ? (
        <p className="empty-note">Nessun preventivo.</p>
      ) : (
        <div className="bo-table-wrap">
          <table className="bo-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Importo</th>
                <th>Stato</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td className="mono">
                    {new Date(q.date).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="mono">
                    {q.amount.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    <StatusBadge map={QUOTE_STATUS} status={q.status} />
                  </td>
                  <td>
                    <div className="bo-table-actions">
                      <StatusChanger
                        map={QUOTE_STATUS}
                        value={q.status}
                        onChange={(s) => updateStatus(q.id, s)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(q.id)}
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const InvoicesPanel = ({ workId }) => {
  const dispatch = useDispatch()
  const invoices = useSelector((state) => state.invoices.byWork)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: "", amount: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(getInvoicesByWorkAction(workId))
      .catch(() => setError("Errore nel caricamento delle fatture."))
      .finally(() => setLoading(false))
  }, [workId, dispatch])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      await dispatch(
        createInvoiceAction({
          date: new Date(form.date).toISOString(),
          amount: Number(form.amount),
          workId,
        }),
      )
      setForm({ date: "", amount: "" })
      setShowForm(false)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Creazione non riuscita.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const updateStatus = async (invoiceId, status) => {
    try {
      await dispatch(updateInvoiceStatusAction(invoiceId, status))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Aggiornamento non riuscito.",
      )
    }
  }

  const remove = async (invoiceId) => {
    try {
      await dispatch(deleteInvoiceAction(invoiceId))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Eliminazione non riuscita.",
      )
    }
  }

  return (
    <div className="bo-card">
      <div className="bo-card__head">
        <h3 className="h5 mb-0">Fatture ({invoices.length})</h3>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Annulla" : "+ Nuova fattura"}
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="d-flex gap-2 align-items-end flex-wrap mb-3"
        >
          <div>
            <label className="form-label">Data</label>
            <input
              type="date"
              required
              className="form-control"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Importo (€)</label>
            <input
              type="number"
              min="1"
              required
              className="form-control"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Invio…" : "Crea"}
          </button>
        </form>
      )}
      <ErrorBanner message={error} />
      {loading ? (
        <Loader />
      ) : invoices.length === 0 ? (
        <p className="empty-note">Nessuna fattura.</p>
      ) : (
        <div className="bo-table-wrap">
          <table className="bo-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Importo</th>
                <th>Stato</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id}>
                  <td className="mono">
                    {new Date(i.date).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="mono">
                    {i.amount.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    <StatusBadge map={INVOICE_STATUS} status={i.status} />
                  </td>
                  <td>
                    <div className="bo-table-actions">
                      <StatusChanger
                        map={INVOICE_STATUS}
                        value={i.status}
                        onChange={(s) => updateStatus(i.id, s)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(i.id)}
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const ProjectsPanel = ({ workId }) => {
  const { user } = useSelector((state) => state.auth)
  const projects = useSelector((state) => state.projects.byWork)
  const directory = useSelector((state) => state.users.directory)
  const dispatch = useDispatch()
  const isAdmin = user?.roles?.includes("ADMIN")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [surveyorId, setSurveyorId] = useState(isAdmin ? "" : user.id)
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const surveyors = directory.filter((u) => u.roles.includes("GEOMETRA"))

  useEffect(() => {
    dispatch(getProjectsByWorkAction(workId))
      .catch(() => setError("Errore nel caricamento degli elaborati."))
      .finally(() => setLoading(false))
  }, [workId, dispatch])

  useEffect(() => {
    if (!isAdmin) return
    dispatch(getUsersDirectoryAction({ size: 100 })).catch(() => {})
  }, [isAdmin, dispatch])

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!surveyorId || !file) {
      setError("Seleziona un geometra e allega un elaborato.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      await dispatch(createProjectAction(surveyorId, workId, file))
      setFile(null)
      setShowForm(false)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Creazione non riuscita.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const updateStatus = async (projectId, status) => {
    try {
      await dispatch(updateProjectStatusAction(projectId, status))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Aggiornamento non riuscito.",
      )
    }
  }

  const remove = async (projectId) => {
    try {
      await dispatch(deleteProjectAction(projectId))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Eliminazione non riuscita.",
      )
    }
  }

  return (
    <div className="bo-card">
      <div className="bo-card__head">
        <h3 className="h5 mb-0">Elaborati ({projects.length})</h3>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Annulla" : "+ Nuovo elaborato"}
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="d-grid gap-2 mb-3"
          style={{ maxWidth: 420 }}
        >
          {isAdmin ? (
            <div>
              <label className="form-label">Geometra</label>
              <select
                className="form-select"
                value={surveyorId}
                onChange={(e) => setSurveyorId(e.target.value)}
              >
                <option value="">Seleziona…</option>
                {surveyors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.surname}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="form-label">ID geometra</label>
              <input
                className="form-control"
                value={surveyorId}
                onChange={(e) => setSurveyorId(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="form-label d-block">
              File (PDF, immagine o modello .glb)
            </label>
            <label className="file-drop d-block">
              {file ? file.name : "Seleziona il file"}
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ justifySelf: "start" }}
          >
            {submitting ? "Invio…" : "Carica elaborato"}
          </button>
        </form>
      )}
      <ErrorBanner message={error} />
      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <p className="empty-note">Nessun elaborato.</p>
      ) : (
        <div className="bo-table-wrap">
          <table className="bo-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Geometra</th>
                <th>Stato</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-blueprint"
                      onClick={() => setPreviewUrl(p.projectUrl)}
                    >
                      Apri
                    </button>
                  </td>
                  <td>
                    {p.surveyor.name} {p.surveyor.surname}
                  </td>
                  <td>
                    <StatusBadge map={PROJECT_STATUS} status={p.status} />
                    {p.status === "REJECTED" && p.rejectionReason && (
                      <p className="text-steel small mb-0 mt-1">
                        {p.rejectionReason}
                      </p>
                    )}
                  </td>
                  <td>
                    <div className="bo-table-actions">
                      <StatusChanger
                        map={PROJECT_STATUS}
                        value={p.status}
                        onChange={(s) => updateStatus(p.id, s)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(p.id)}
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <FileViewerModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </div>
  )
}

const LavoroDettaglio = () => {
  const { workId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const work = useSelector((state) => state.works.current)
  const [error, setError] = useState("")
  const [statusBusy, setStatusBusy] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    dispatch(getWorkByIdAction(workId)).catch(() =>
      setError("Lavoro non trovato."),
    )
  }, [workId, dispatch])

  const updateWorkStatus = async (status) => {
    setStatusBusy(true)
    try {
      await dispatch(updateWorkStatusAction(workId, status))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Aggiornamento non riuscito.",
      )
    } finally {
      setStatusBusy(false)
    }
  }

  const deleteWork = async () => {
    try {
      await dispatch(deleteWorkAction(workId))
      navigate("/backoffice/lavori")
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Eliminazione non riuscita.",
      )
    }
  }

  if (error && !work) {
    return (
      <div className="bo-content">
        <ErrorBanner message={error} />
        <Link to="/backoffice/lavori" className="btn btn-outline-dark">
          Torna ai lavori
        </Link>
      </div>
    )
  }

  if (!work) {
    return (
      <div className="bo-content">
        <Loader label="Carico il lavoro…" />
      </div>
    )
  }

  return (
    <div>
      <PageTop
        smalltitle={`Rif. ${work.id.slice(0, 8).toUpperCase()} — ${WORK_TYPE[work.type]}`}
        title={work.description}
      />
      <div className="bo-content">
        <Link
          to="/backoffice/lavori"
          className="text-steel small d-inline-block mb-3"
        >
          ← Lavori
        </Link>
        <ErrorBanner message={error} />

        <div className="bo-card">
          <div className="bo-card__head">
            <div>
              <p className="text-steel small mb-1">
                Cliente: {work.client.name} {work.client.surname} (
                {work.client.email})
              </p>
              <StatusBadge map={WORK_STATUS} status={work.status} />
            </div>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <StatusChanger
                map={WORK_STATUS}
                value={work.status}
                onChange={updateWorkStatus}
                disabled={statusBusy}
              />
              {confirmingDelete ? (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={deleteWork}
                  >
                    Conferma
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Annulla
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Elimina lavoro
                </button>
              )}
            </div>
          </div>
        </div>

        <QuotesPanel workId={workId} />
        <InvoicesPanel workId={workId} />
        <ProjectsPanel workId={workId} />
      </div>
    </div>
  )
}

export default LavoroDettaglio
