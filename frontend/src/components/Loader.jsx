const Loader = ({ label = "Caricamento…" }) => {
  return (
    <div className="d-flex align-items-center gap-2 text-steel py-5 justify-content-center">
      <span className="spinner-mark" aria-hidden="true" />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
        {label}
      </span>
    </div>
  )
}

export default Loader
