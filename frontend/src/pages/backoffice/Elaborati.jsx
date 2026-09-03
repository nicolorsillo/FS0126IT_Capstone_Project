import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import PageTop from "../../components/PageTop"
import StatusBadge from "../../components/StatusBadge"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import FileViewerModal from "../../components/FileViewerModal"
import { getProjectsPageAction } from "../../redux/actions/projects"
import { PROJECT_STATUS } from "../../redux/reducers/projects"

const STATUSES = Object.keys(PROJECT_STATUS)

const Elaborati = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.projects.page)
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
      getProjectsPageAction({
        status: status || undefined,
        search: search || undefined,
        page,
        size: 15,
      }),
    )
      .catch(() => setError("Non riusciamo a caricare gli elaborati."))
      .finally(() => setLoading(false))
  }, [status, search, page, dispatch])

  return (
    <div>
      <PageTop smalltitle="Cantieri" title="Elaborati" />
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
                {PROJECT_STATUS[s].label}
              </option>
            ))}
          </select>
          <input
            type="search"
            className="form-control"
            placeholder="Cerca per lavoro, cliente o geometra…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {loading && <Loader label="Carico gli elaborati…" />}
        <ErrorBanner message={error} />

        {!loading && !error && (
          <div className="bo-table-wrap">
            <table className="bo-table">
              <thead>
                <tr>
                  <th>Geometra</th>
                  <th>Stato</th>
                  <th>Lavoro</th>
                  <th>Elaborato</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data?.content?.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.surveyor.name} {p.surveyor.surname}
                    </td>
                    <td>
                      <StatusBadge map={PROJECT_STATUS} status={p.status} />
                    </td>
                    <td>{p.work.description}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => setPreviewUrl(p.projectUrl)}
                      >
                        Apri
                      </button>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/backoffice/lavori/${p.work.id}`}
                        className="btn btn-sm btn-outline-dark"
                      >
                        Apri lavoro
                      </Link>
                    </td>
                  </tr>
                ))}
                {data?.content?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-note">
                      Nessun elaborato trovato.
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

export default Elaborati
