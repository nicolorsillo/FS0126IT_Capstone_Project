const EmptyState = ({ title, description, action }) => {
  return (
    <div className="text-center py-5">
      <p className="smalltitle justify-content-center">Nessun risultato</p>
      <h3 className="h4 mb-2">{title}</h3>
      {description && (
        <p className="text-steel mb-3 mx-auto" style={{ maxWidth: "42ch" }}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

export default EmptyState
