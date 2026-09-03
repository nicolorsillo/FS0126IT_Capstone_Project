import { Link } from "react-router"
import { Container, Row, Col } from "react-bootstrap"
import PageHeader from "../components/PageHeader"

const STEPS = [
  {
    title: "Sopralluogo",
    description:
      "Un tecnico rileva l’area o l’immobile e raccoglie i vincoli di partenza, senza costi.",
  },
  {
    title: "Preventivo",
    description:
      "Riceverai un preventivo, consultabile e approvabile dall’area riservata.",
  },
  {
    title: "Progettazione",
    description:
      "Il geometra incaricato prepara il progetto; Potrai consultarlo dal tuo profilo.",
  },
  {
    title: "Cantiere",
    description:
      "Squadre e fornitori entrano in campo: da qui penseremo a tutto noi.",
  },
  {
    title: "Collaudo e consegna",
    description: "Verifica finale e chiusura pratiche. Il lavoro è concluso.",
  },
]

const Servizi = () => {
  return (
    <>
      <PageHeader
        smalltitle="Servizi"
        title="Progettazione e costruzione, sotto lo stesso tetto."
        paragraph="Seguiamo l'opera per intero: chi disegna un progetto in studio è la stessa impresa che poi lo tira su in cantiere."
      />

      <section className="section section--rule-top">
        <Container className="oc-container">
          <Row className="g-5">
            <Col lg={6}>
              <p className="smalltitle">Progettazione</p>
              <h2 className="h1 mb-3">Dal rilievo al permesso a costruire.</h2>
              <p className="text-steel mb-4">
                I nostri geometri seguono rilievo, pratiche catastali e
                comunali, calcoli e disegni esecutivi. Ogni tua idea verrà
                trasformato in un disegno pronto per essere realizzato.
              </p>
              <ul className="list-unstyled d-grid gap-2">
                {[
                  "Rilievo strumentale e fotografico",
                  "Pratiche edilizie e catastali",
                  "Direzione lavori",
                  "Computo metrico estimativo",
                ].map((item) => (
                  <li key={item} className="d-flex gap-2 align-items-start">
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        background: "var(--blueprint)",
                        marginTop: "0.55em",
                        flex: "none",
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Col>
            <Col lg={6}>
              <p className="smalltitle">Costruzione</p>
              <h2 className="h1 mb-3">Dal primo scavo al collaudo.</h2>
              <p className="text-steel mb-4">
                Squadre proprie e fornitori selezionati realizzano l'opera a
                regola d'arte. Le tue idee prendono forma e diventano realtà.
              </p>
              <ul className="list-unstyled d-grid gap-2">
                {[
                  "Nuove costruzioni e ampliamenti",
                  "Ristrutturazioni e recuperi",
                  "Sicurezza e direzione cantiere",
                  "Collaudo e consegna chiavi in mano",
                ].map((item) => (
                  <li key={item} className="d-flex gap-2 align-items-start">
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        background: "var(--orange)",
                        marginTop: "0.55em",
                        flex: "none",
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section section--dark section--rule-top">
        <Container className="oc-container">
          <Row className="mb-5">
            <Col lg={7}>
              <p className="smalltitle smalltitle--light">Come funziona</p>
              <h2 className="h1 mb-0 text-white">
                Cinque fasi, un profilo cliente per seguirle.
              </h2>
            </Col>
          </Row>
          <Row className="g-4">
            {STEPS.map((step, index) => (
              <Col md={6} lg key={step.title}>
                <div
                  style={{
                    borderTop: "2px solid var(--orange)",
                    paddingTop: "1rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--steel-light)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="h5 text-white">{step.title}</h3>
                  <p className="text-steel small mb-0">{step.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section section--paper section--rule-top text-center">
        <Container className="oc-container">
          <p className="smalltitle justify-content-center">Pronti a partire</p>
          <h2 className="h1 mb-4">Richiedi un sopralluogo gratuito.</h2>
          <Link to="/area-riservata" className="btn btn-primary btn-lg">
            Richiedi un preventivo
          </Link>
        </Container>
      </section>
    </>
  )
}

export default Servizi
