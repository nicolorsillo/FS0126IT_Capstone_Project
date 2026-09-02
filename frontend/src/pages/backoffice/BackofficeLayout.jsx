import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router"
import { Offcanvas } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { logoutAction } from "../../redux/actions/auth"

const NAV_GROUPS = [
  {
    label: "Cantieri",
    links: [
      {
        to: "/backoffice/lavori",
        label: "Lavori",
        roles: ["ADMIN", "GEOMETRA"],
      },
      {
        to: "/backoffice/preventivi",
        label: "Preventivi",
        roles: ["ADMIN", "GEOMETRA"],
      },
      {
        to: "/backoffice/fatture",
        label: "Fatture",
        roles: ["ADMIN", "GEOMETRA"],
      },
      {
        to: "/backoffice/elaborati",
        label: "Elaborati",
        roles: ["ADMIN", "GEOMETRA"],
      },
    ],
  },
  {
    label: "Selezione del personale",
    links: [
      {
        to: "/backoffice/offerte-lavoro",
        label: "Offerte di lavoro",
        roles: ["HR", "ADMIN"],
      },
      {
        to: "/backoffice/candidature",
        label: "Candidature",
        roles: ["HR", "ADMIN"],
      },
      {
        to: "/backoffice/slot-colloqui",
        label: "Slot colloqui",
        roles: ["HR", "ADMIN"],
      },
    ],
  },
  {
    label: "Amministrazione",
    links: [
      { to: "/backoffice/utenti", label: "Utenti", roles: ["ADMIN"] },
      { to: "/backoffice/ruoli", label: "Ruoli e permessi", roles: ["ADMIN"] },
    ],
  },
]

const BrandMark = () => {
  return (
    <NavLink to="/backoffice" className="bo-sidebar__brand">
      <span className="bo-sidebar__brand-mark" />
      <span className="bo-sidebar__brand-text">
        Orsillo
        <span>Backoffice</span>
      </span>
    </NavLink>
  )
}

const NavContent = ({ groups, user, onNavigate, onLogout }) => {
  return (
    <>
      {groups.map((group) => (
        <div className="bo-nav-group" key={group.label}>
          <p className="bo-nav-group__label">{group.label}</p>
          {group.links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={onNavigate}>
              {link.label}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="bo-sidebar__footer">
        <span>
          {user?.name} {user?.surname}
        </span>
        <NavLink to="/" onClick={onNavigate}>
          Vai al sito pubblico
        </NavLink>
        <button type="button" onClick={onLogout}>
          Esci
        </button>
      </div>
    </>
  )
}

const BackofficeLayout = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    links: group.links.filter((link) =>
      link.roles.some((role) => user?.roles?.includes(role)),
    ),
  })).filter((group) => group.links.length > 0)

  const handleLogout = () => {
    setDrawerOpen(false)
    dispatch(logoutAction())
    navigate("/")
  }

  return (
    <div className="bo-shell">
      <div className="bo-mobile-bar d-lg-none">
        <button
          type="button"
          className="bo-mobile-bar__toggle"
          aria-label="Apri il menu del backoffice"
          onClick={() => setDrawerOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <BrandMark />
      </div>

      <aside className="bo-sidebar d-none d-lg-flex">
        <BrandMark />
        <NavContent
          groups={visibleGroups}
          user={user}
          onLogout={handleLogout}
        />
      </aside>

      <Offcanvas
        show={drawerOpen}
        onHide={() => setDrawerOpen(false)}
        className="bo-offcanvas d-lg-none"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <BrandMark />
        </Offcanvas.Header>
        <Offcanvas.Body>
          <NavContent
            groups={visibleGroups}
            user={user}
            onNavigate={() => setDrawerOpen(false)}
            onLogout={handleLogout}
          />
        </Offcanvas.Body>
      </Offcanvas>

      <div className="bo-main">
        <Outlet />
      </div>
    </div>
  )
}

export default BackofficeLayout
