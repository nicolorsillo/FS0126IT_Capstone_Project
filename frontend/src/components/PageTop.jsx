const PageTop = ({ smalltitle, title, actions }) => {
  return (
    <div className="bo-topbar">
      <div>
        <p className="smalltitle mb-2">{smalltitle}</p>
        <h1 className="h3 mb-0">{title}</h1>
      </div>
      {actions && <div className="d-flex gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}

export default PageTop
