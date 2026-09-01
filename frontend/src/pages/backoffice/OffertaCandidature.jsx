import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import PageTop from "../../components/PageTop"
import StatusBadge from "../../components/StatusBadge"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import FileViewerModal from "../../components/FileViewerModal"
import { getApplicationsByJobOfferAction } from "../../redux/actions/applications"
import { APPLICATION_STATUS } from "../../redux/reducers/applications"

const OffertaCandidature = () => {
  const { jobOfferId } = useParams()
  const dispatch = useDispatch()
  const applications = useSelector((state) => state.applications.byJobOffer)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    dispatch(getApplicationsByJobOfferAction(jobOfferId))
      .catch(() => setError("Non riusciamo a caricare le candidature."))
      .finally(() => setLoading(false))
  }, [jobOfferId, dispatch])

  return (
    <div>
      <PageTop
        smalltitle="Selezione del personale"
        title={applications[0]?.jobOffer?.title ?? "Candidature per l'offerta"}
      />
      <div className="bo-content">
        <Link
          to="/backoffice/offerte-lavoro"
          className="text-steel small d-inline-block mb-3"
        >
          ← Offerte di lavoro
        </Link>

        {loading && <Loader label="Carico le candidature…" />}
        <ErrorBanner message={error} />

        {!loading && !error && (
          <div className="bo-table-wrap">
            <table className="bo-table">
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Email</th>
                  <th>Candidatura del</th>
                  <th>CV</th>
                  <th>Stato</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      {application.user.name} {application.user.surname}
                    </td>
                    <td className="mono">{application.user.email}</td>
                    <td className="mono">
                      {new Date(application.appliedAt).toLocaleDateString(
                        "it-IT",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-blueprint"
                        onClick={() => setPreviewUrl(application.cvUrl)}
                      >
                        Apri CV
                      </button>
                    </td>
                    <td>
                      <StatusBadge
                        map={APPLICATION_STATUS}
                        status={application.status}
                      />
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-note">
                      Nessuna candidatura per questa offerta.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <FileViewerModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </div>
  )
}

export default OffertaCandidature
