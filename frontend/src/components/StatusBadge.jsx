const StatusBadge = ({ map, status }) => {
  const entry = map?.[status] ?? { label: status ?? "—", tone: "neutral" }
  return (
    <span className={`status-badge status-badge--${entry.tone}`}>
      {entry.label}
    </span>
  )
}

export default StatusBadge
