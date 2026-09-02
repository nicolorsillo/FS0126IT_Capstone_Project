import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import PageTop from "../../components/PageTop"
import StatusBadge from "../../components/StatusBadge"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import { getWorksPageAction } from "../../redux/actions/works"
import { WORK_STATUS, WORK_TYPE } from "../../redux/reducers/works"

const STATUSES = Object.keys(WORK_STATUS)

const Lavori = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.works.page)
  const [status, setStatus] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput)
      setPage(0)
    }, 350)
    return () => clearTimeout(id)
  }, [searchInput])

  useEffect(() => {
    dispatch(
      getWorksPageAction({
        status: status || undefined,
        search: search || undefined,
        page,
        size: 15,
      }),
    )
      .catch(() => setError("Non riusciamo a caricare i lavori."))
      .finally(() => setLoading(false))
  }, [status, search, page, dispatch])

  return (
    <div>
      <PageTop smalltitle="Cantieri" title="Lavori" />
      <div className="bo-content">
        <div className="bo-filters">
          <select
            className="form-select"
            value={status}
            onChange={(event) => {
              setLoading(true)
              setStatus(event.target.value)
              setPage(0)
            }}
          >
            <option value="">Tutti gli stati</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {WORK_STATUS[s].label}
              </option>
            ))}
          </select>
          <input
            type="search"
            className="form-control"
            placeholder="Cerca per descrizione o cliente…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {loading && <Loader label="Carico i lavori…" />}
        <ErrorBanner message={error} />

        {!loading && !error && (
          <div className="bo-table-wrap">
            <table className="bo-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descrizione</th>
                  <th>Cliente</th>
                  <th>Stato</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data?.content?.map((work) => (
                  <tr key={work.id}>
                    <td className="mono">{WORK_TYPE[work.type]}</td>
                    <td>{work.description}</td>
                    <td>
                      {work.client.name} {work.client.surname}
                    </td>
                    <td>
                      <StatusBadge map={WORK_STATUS} status={work.status} />
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/backoffice/lavori/${work.id}`}
                        className="btn btn-sm btn-outline-dark"
                      >
                        Apri
                      </Link>
                    </td>
                  </tr>
                ))}
                {data?.content?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-note">
                      Nessun lavoro trovato.
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
    </div>
  )
}

export default Lavori
