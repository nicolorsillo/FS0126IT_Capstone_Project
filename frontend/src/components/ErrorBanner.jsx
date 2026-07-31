const ErrorBanner = ({ message }) => {
  if (!message) return null
  return <div className="form-banner-error">{message}</div>
}

export default ErrorBanner
