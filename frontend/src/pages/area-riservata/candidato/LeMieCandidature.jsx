import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import {
  getMyApplicationsAction,
  deleteApplicationAction,
} from "../../../redux/actions/applications"
import { ApiError } from "../../../redux/actions/auth"
import { APPLICATION_STATUS } from "../../../redux/reducers/applications"
import StatusBadge from "../../../components/StatusBadge"
import Loader from "../../../components/Loader"
import EmptyState from "../../../components/EmptyState"
import ErrorBanner from "../../../components/ErrorBanner"
import FileViewerModal from "../../../components/FileViewerModal"

const LeMieCandidature = () => {
  const dispatch = useDispatch()
  const applications = useSelector((state) => state.applications.mine)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [withdrawing, setWithdrawing] = useState("")
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    dispatch(getMyApplicationsAction())
      .catch(() => setError("Non riusciamo a caricare le tue candidature."))
      .finally(() => setLoading(false))
  }, [dispatch])

  const withdraw = async (applicationId) => {
    setWithdrawing(applicationId)
    try {
      await dispatch(deleteApplicationAction(applicationId))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Operazione non riuscita.",
      )
    } finally {
      setWithdrawing("")
    }
  }

  return (
    <div>
      <p className="smalltitle">Candidature</p>
      <h2 className="h3 mb-4">Le posizioni a cui ti sei candidato</h2>

      {loading && <Loader label="Carico le tue candidature…" />}
      <ErrorBanner message={error} />

      {!loading && !error && applications.length === 0 && (
        <EmptyState
          title="Nessuna candidatura inviata"
          description="Sfoglia le posizioni aperte e candidati: le troverai qui."
          action={
            <Link to="/lavora-con-noi" className="btn btn-primary">
              Vedi le posizioni aperte
            </Link>
          }
        />
      )}

      {applications.map((application) => (
        <div className="record-panel" key={application.id}>
          <div className="record-panel__head">
            <h3>{application.jobOffer.title}</h3>
            <StatusBadge map={APPLICATION_STATUS} status={application.status} />
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
            <div className="d-flex gap-3 align-items-center">
              <span className="record-row__date">
                Candidatura del{" "}
                {new Date(application.appliedAt).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <button
                type="button"
                className="btn btn-link p-0 text-blueprint small"
                onClick={() => setPreviewUrl(application.cvUrl)}
              >
                Vedi CV inviato
              </button>
            </div>
            {application.status !== "DECLINED" &&
              application.status !== "CLOSED" && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  disabled={withdrawing === application.id}
                  onClick={() => withdraw(application.id)}
                >
                  {withdrawing === application.id
                    ? "Ritiro…"
                    : "Ritira candidatura"}
                </button>
              )}
          </div>
          {application.status === "INTERVIEWING" && (
            <p className="text-steel small mt-3 mb-0">
              Sei in fase di colloquio:{" "}
              <Link to="/area-riservata/colloqui">prenota uno slot</Link> se non
              l'hai ancora fatto.
            </p>
          )}
        </div>
      ))}
      <FileViewerModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </div>
  )
}

export default LeMieCandidature
