import { Link } from "react-router"
import { Container } from "react-bootstrap"

const NotFound = () => {
  return (
    <section className="section text-center">
      <Container className="oc-container">
        <p className="smalltitle justify-content-center">Errore 404</p>
        <h1
          className="mb-3"
          style={{ fontSize: "clamp(3rem, 2.4rem + 3vw, 6rem)" }}
        >
          Fuori dal cantiere.
        </h1>
        <p className="paragraph mx-auto mb-4">
          Questa pagina non esiste, o l'abbiamo spostata durante gli ultimi
          lavori.
        </p>
        <Link to="/" className="btn btn-primary">
          Torna alla home
        </Link>
      </Container>
    </section>
  )
}

export default NotFound
