import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import PageTop from "../../components/PageTop"
import StatusBadge from "../../components/StatusBadge"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import FileViewerModal from "../../components/FileViewerModal"
import {
  getApplicationsPageAction,
  updateApplicationStatusAction,
} from "../../redux/actions/applications"
import { ApiError } from "../../redux/actions/auth"
import { APPLICATION_STATUS } from "../../redux/reducers/applications"

const STATUSES = Object.keys(APPLICATION_STATUS)

const Candidature = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.applications.page)
  const [status, setStatus] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput)
      setPage(0)
    }, 350)
    return () => clearTimeout(id)
  }, [searchInput])

  useEffect(() => {
    dispatch(
      getApplicationsPageAction({
        status: status || undefined,
        search: search || undefined,
        page,
        size: 15,
      }),
    )
      .catch(() => setError("Non riusciamo a caricare le candidature."))
      .finally(() => setLoading(false))
  }, [status, search, page, dispatch])

  const updateStatus = async (applicationId, next) => {
    try {
      await dispatch(updateApplicationStatusAction(applicationId, next))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Aggiornamento non riuscito.",
      )
    }
  }

  return (
    <div>
      <PageTop smalltitle="Selezione del personale" title="Candidature" />
      <div className="bo-content">
        <div className="bo-filters">
          <select
            className="form-select"
            value={status}
            onChange={(e) => {
              setLoading(true)
              setStatus(e.target.value)
              setPage(0)
            }}
          >
            <option value="">Tutti gli stati</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {APPLICATION_STATUS[s].label}
              </option>
            ))}
          </select>
          <input
            type="search"
            className="form-control"
            placeholder="Cerca per candidato o offerta…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {loading && <Loader label="Carico le candidature…" />}
        <ErrorBanner message={error} />

        {!loading && !error && (
          <div className="bo-table-wrap">
            <table className="bo-table">
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Offerta</th>
                  <th>Candidatura del</th>
                  <th>CV</th>
                  <th>Stato</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data?.content?.map((application) => (
                  <tr key={application.id}>
                    <td>
                      {application.user.name} {application.user.surname}
                    </td>
                    <td>{application.jobOffer.title}</td>
                    <td className="mono">
                      {new Date(application.appliedAt).toLocaleDateString(
                        "it-IT",
                        { day: "2-digit", month: "short", year: "numeric" },
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
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={application.status}
                        onChange={(e) =>
                          updateStatus(application.id, e.target.value)
                        }
                        style={{ width: "auto" }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {APPLICATION_STATUS[s].label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {data?.content?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-note">
                      Nessuna candidatura trovata.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="bo-pagination">
            <button
              type="button"
              className="btn btn-sm btn-outline-dark"
              disabled={data.first}
              onClick={() => {
                setLoading(true)
                setPage((p) => p - 1)
              }}
            >
              Precedente
            </button>
            <span>
              Pagina {data.number + 1} di {data.totalPages}
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-dark"
              disabled={data.last}
              onClick={() => {
                setLoading(true)
                setPage((p) => p + 1)
              }}
            >
              Successiva
            </button>
          </div>
        )}
      </div>
      <FileViewerModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </div>
  )
}

export default Candidature
