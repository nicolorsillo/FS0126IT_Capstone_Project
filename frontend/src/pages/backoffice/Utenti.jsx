import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import PageTop from "../../components/PageTop"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import {
  getUsersPageAction,
  updateUserRoleAction,
  removeUserRoleAction,
} from "../../redux/actions/users"
import { ApiError } from "../../redux/actions/auth"

const ALL_ROLES = ["CLIENTE", "CANDIDATO", "USER", "HR", "ADMIN", "GEOMETRA"]

const RoleCell = ({ user }) => {
  const dispatch = useDispatch()
  const [adding, setAdding] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const assignable = ALL_ROLES.filter((r) => !user.roles.includes(r))

  const assign = async () => {
    if (!adding) return
    setBusy(true)
    setError("")
    try {
      await dispatch(updateUserRoleAction(user.email, adding))
      setAdding("")
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Operazione non riuscita.",
      )
    } finally {
      setBusy(false)
    }
  }

  const remove = async (role) => {
    setBusy(true)
    setError("")
    try {
      await dispatch(removeUserRoleAction(user.email, role))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Operazione non riuscita.",
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="d-flex flex-wrap gap-1 mb-2">
        {user.roles.map((role) => (
          <button
            key={role}
            type="button"
            className="status-badge status-badge--pending"
            disabled={busy}
            title="Rimuovi ruolo"
            onClick={() => remove(role)}
            style={{ cursor: "pointer", border: "1px solid var(--blueprint)" }}
          >
            {role} ×
          </button>
        ))}
      </div>
      {assignable.length > 0 && (
        <div className="d-flex gap-1 flex-wrap">
          <select
            className="form-select form-select-sm"
            value={adding}
            onChange={(e) => setAdding(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="">+ Assegna ruolo…</option>
            {assignable.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            disabled={!adding || busy}
            onClick={assign}
          >
            Assegna
          </button>
        </div>
      )}
      {error && <p className="form-text-error mb-0 mt-1">{error}</p>}
    </div>
  )
}

const Utenti = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.users.page)
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
      getUsersPageAction({ search: search || undefined, page, size: 12 }),
    )
      .catch(() => setError("Non riusciamo a caricare gli utenti."))
      .finally(() => setLoading(false))
  }, [dispatch, search, page])

  return (
    <div>
      <PageTop smalltitle="Amministrazione" title="Utenti" />
      <div className="bo-content">
        <div className="bo-filters">
          <input
            type="search"
            className="form-control"
            placeholder="Cerca per nome, cognome o email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {loading && <Loader label="Carico gli utenti…" />}
        <ErrorBanner message={error} />

        {!loading && !error && (
          <div className="bo-table-wrap">
            <table className="bo-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Ruoli</th>
                </tr>
              </thead>
              <tbody>
                {data?.content?.map((u) => (
                  <tr key={u.id}>
                    <td>
                      {u.name} {u.surname}
                    </td>
                    <td className="mono">{u.email}</td>
                    <td>
                      <RoleCell user={u} />
                    </td>
                  </tr>
                ))}
                {data?.content?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="empty-note">
                      Nessun utente trovato.
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

export default Utenti
