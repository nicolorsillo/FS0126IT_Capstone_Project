import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import PageTop from "../../components/PageTop"
import StatusBadge from "../../components/StatusBadge"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import { getInvoicesPageAction } from "../../redux/actions/invoices"
import { INVOICE_STATUS } from "../../redux/reducers/invoices"

const STATUSES = Object.keys(INVOICE_STATUS)

const Fatture = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.invoices.page)
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
      getInvoicesPageAction({
        status: status || undefined,
        search: search || undefined,
        page,
        size: 15,
      }),
    )
      .catch(() => setError("Non riusciamo a caricare le fatture."))
      .finally(() => setLoading(false))
  }, [status, search, page, dispatch])

  return (
    <div>
      <PageTop smalltitle="Cantieri" title="Fatture" />
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
                {INVOICE_STATUS[s].label}
              </option>
            ))}
          </select>
          <input
            type="search"
            className="form-control"
            placeholder="Cerca per lavoro o cliente…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {loading && <Loader label="Carico le fatture…" />}
        <ErrorBanner message={error} />

        {!loading && !error && (
          <div className="bo-table-wrap">
            <table className="bo-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Importo</th>
                  <th>Stato</th>
                  <th>Lavoro</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data?.content?.map((i) => (
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
                    <td>{i.work.description}</td>
                    <td className="text-end">
                      <Link
                        to={`/backoffice/lavori/${i.work.id}`}
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
                      Nessuna fattura trovata.
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

export default Fatture
