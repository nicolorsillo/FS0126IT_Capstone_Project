import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import PageTop from "../../components/PageTop"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import {
  getRolesAction,
  createRoleAction,
  updateRoleAction,
  deleteRoleAction,
} from "../../redux/actions/roles"
import { getPermissionsAction } from "../../redux/actions/permissions"
import { ApiError } from "../../redux/actions/auth"

const PermissionGrid = ({ allPermissions, selected, onToggle }) => {
  return (
    <div className="bo-perm-grid">
      {allPermissions.map((p) => (
        <label key={p.id}>
          <input
            type="checkbox"
            checked={selected.includes(p.name)}
            onChange={() => onToggle(p.name)}
          />
          {p.name}
        </label>
      ))}
    </div>
  )
}

const RoleCard = ({ role, allPermissions }) => {
  const dispatch = useDispatch()
  const [name, setName] = useState(role.name)
  const [permissions, setPermissions] = useState(role.permissions)
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const toggle = (permName) => {
    setPermissions((p) =>
      p.includes(permName) ? p.filter((x) => x !== permName) : [...p, permName],
    )
  }

  const save = async () => {
    setBusy(true)
    setError("")
    try {
      await dispatch(updateRoleAction(role.id, { name, permissions }))
      setEditing(false)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Salvataggio non riuscito.",
      )
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    setError("")
    try {
      await dispatch(deleteRoleAction(role.id))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Eliminazione non riuscita.",
      )
      setBusy(false)
    }
  }

  return (
    <div className="bo-card">
      <div className="bo-card__head">
        {editing ? (
          <input
            className="form-control"
            style={{ maxWidth: 240 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <h3 className="h5 mb-0">{role.name}</h3>
        )}
        <div className="d-flex gap-2 flex-wrap">
          {editing ? (
            <>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                disabled={busy}
                onClick={save}
              >
                Salva
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={() => {
                  setEditing(false)
                  setName(role.name)
                  setPermissions(role.permissions)
                }}
              >
                Annulla
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={() => setEditing(true)}
              >
                Modifica permessi
              </button>
              {confirmingDelete ? (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    disabled={busy}
                    onClick={remove}
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
                  Elimina
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <ErrorBanner message={error} />
      {editing ? (
        <PermissionGrid
          allPermissions={allPermissions}
          selected={permissions}
          onToggle={toggle}
        />
      ) : (
        <p className="text-steel small mb-0">
          {role.permissions.length === 0
            ? "Nessun permesso assegnato."
            : role.permissions.join(", ")}
        </p>
      )}
    </div>
  )
}

const Ruoli = () => {
  const dispatch = useDispatch()
  const roles = useSelector((state) => state.roles.list)
  const permissions = useSelector((state) => state.permissions.list)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [newRole, setNewRole] = useState({ name: "", permissions: [] })
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    Promise.all([dispatch(getRolesAction()), dispatch(getPermissionsAction())])
      .catch(() => setError("Non riusciamo a caricare ruoli e permessi."))
      .finally(() => setLoading(false))
  }, [dispatch])

  const toggleNewPermission = (permName) => {
    setNewRole((r) => ({
      ...r,
      permissions: r.permissions.includes(permName)
        ? r.permissions.filter((x) => x !== permName)
        : [...r.permissions, permName],
    }))
  }

  const createRole = async (event) => {
    event.preventDefault()
    setCreating(true)
    setError("")
    try {
      await dispatch(createRoleAction(newRole))
      setNewRole({ name: "", permissions: [] })
      setShowNew(false)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Creazione non riuscita.",
      )
    } finally {
      setCreating(false)
    }
  }

  const filteredRoles = roles.filter((role) => {
    if (!search) return true
    const needle = search.toLowerCase()
    return (
      role.name.toLowerCase().includes(needle) ||
      role.permissions.some((p) => p.toLowerCase().includes(needle))
    )
  })

  if (loading)
    return (
      <div className="bo-content">
        <Loader label="Carico ruoli e permessi…" />
      </div>
    )

  return (
    <div>
      <PageTop
        smalltitle="Amministrazione"
        title="Ruoli e permessi"
        actions={
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowNew((v) => !v)}
          >
            {showNew ? "Annulla" : "+ Nuovo ruolo"}
          </button>
        }
      />
      <div className="bo-content">
        <p className="text-steel small mb-4">
          Rinominare o svuotare un ruolo esistente (in particolare ADMIN, HR,
          GEOMETRA, CLIENTE, CANDIDATO) può togliere l'accesso a chi lo
          possiede: modificare con attenzione.
        </p>
        <ErrorBanner message={error} />

        <div className="bo-filters">
          <input
            type="search"
            className="form-control"
            placeholder="Cerca per nome ruolo o permesso…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {showNew && (
          <form onSubmit={createRole} className="bo-card">
            <div className="mb-3" style={{ maxWidth: 320 }}>
              <label className="form-label">Nome ruolo</label>
              <input
                className="form-control"
                required
                value={newRole.name}
                onChange={(e) =>
                  setNewRole((r) => ({ ...r, name: e.target.value }))
                }
              />
            </div>
            <PermissionGrid
              allPermissions={permissions}
              selected={newRole.permissions}
              onToggle={toggleNewPermission}
            />
            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={creating}
            >
              {creating ? "Creazione…" : "Crea ruolo"}
            </button>
          </form>
        )}

        {filteredRoles.map((role) => (
          <RoleCard key={role.id} role={role} allPermissions={permissions} />
        ))}
        {filteredRoles.length === 0 && (
          <p className="empty-note">Nessun ruolo corrisponde alla ricerca.</p>
        )}
      </div>
    </div>
  )
}

export default Ruoli
