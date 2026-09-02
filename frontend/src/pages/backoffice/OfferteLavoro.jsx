import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import PageTop from "../../components/PageTop"
import StatusBadge from "../../components/StatusBadge"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import {
  getJobOffersPageAction,
  deleteJobOfferAction,
} from "../../redux/actions/jobOffers"
import { ApiError } from "../../redux/actions/auth"
import { JOB_OFFER_STATUS } from "../../redux/reducers/jobOffers"

const STATUSES = Object.keys(JOB_OFFER_STATUS)

const OfferteLavoro = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.jobOffers.page)
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
      getJobOffersPageAction({
        status: status || undefined,
        search: search || undefined,
        page,
        size: 15,
      }),
    )
      .catch(() => setError("Non riusciamo a caricare le offerte."))
      .finally(() => setLoading(false))
  }, [status, search, page, dispatch])

  const remove = async (jobOfferId) => {
    try {
      await dispatch(deleteJobOfferAction(jobOfferId))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Eliminazione non riuscita.",
      )
    }
  }

  return (
    <div>
      <PageTop
        smalltitle="Selezione del personale"
        title="Offerte di lavoro"
        actions={
          <Link
            to="/backoffice/offerte-lavoro/nuova"
            className="btn btn-primary btn-sm"
          >
            + Nuova offerta
          </Link>
        }
      />
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
                {JOB_OFFER_STATUS[s].label}
              </option>
            ))}
          </select>
          <input
            type="search"
            className="form-control"
            placeholder="Cerca per titolo, posizione, descrizione…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {loading && <Loader label="Carico le offerte…" />}
        <ErrorBanner message={error} />

        {!loading && !error && (
          <div className="bo-table-wrap">
            <table className="bo-table">
              <thead>
                <tr>
                  <th>Titolo</th>
                  <th>Posizione</th>
                  <th>Stato</th>
                  <th>Scadenza</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data?.content?.map((offer) => (
                  <tr key={offer.id}>
                    <td>{offer.title}</td>
                    <td className="mono">{offer.position}</td>
                    <td>
                      <StatusBadge
                        map={JOB_OFFER_STATUS}
                        status={offer.status}
                      />
                    </td>
                    <td className="mono">
                      {new Date(offer.expiresAt).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="bo-table-actions">
                        <Link
                          to={`/backoffice/offerte-lavoro/${offer.id}/candidature`}
                          className="btn btn-sm btn-outline-dark"
                        >
                          Candidature
                        </Link>
                        <Link
                          to={`/backoffice/offerte-lavoro/${offer.id}`}
                          className="btn btn-sm btn-outline-dark"
                        >
                          Modifica
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(offer.id)}
                        >
                          Elimina
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.content?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-note">
                      Nessuna offerta pubblicata.
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

export default OfferteLavoro
