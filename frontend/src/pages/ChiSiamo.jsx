import { Container, Row, Col } from "react-bootstrap"
import PageHeader from "../components/PageHeader"

const VALUES = [
  {
    title: "Un solo referente",
    description: "Lo stesso studio segue rilievo, pratiche e cantiere.",
  },
  {
    title: "Tutto tracciato",
    description:
      "Preventivi, elaborati e fatture restano consultabili nell’area riservata, dalla prima richiesta alla consegna.",
  },
  {
    title: "Squadre proprie",
    description: "I nostri team ti garantiranno un lavoro a regola d'arte",
  },
]

const HISTORY = [
  {
    year: "2001",
    text: "Nasce come studio tecnico di progettazione e pratiche edilizie a Reino, in provincia di Benevento.",
  },
  {
    year: "2006",
    text: "Apre il ramo costruzioni: le prime squadre lavorano a piccole costruzioni e ristrutturazioni.",
  },
  {
    year: "2012",
    text: "L'azienda investe nel suo futuro ampliando il suo parco mezzi e realizza le sue prime opere di grandi dimensioni, come palazzi e capannoni industriali",
  },
  {
    year: "Oggi",
    text: "500+ opere consegnate tra progettazione e costruzione in tutta italia.",
  },
]

const ChiSiamo = () => {
  return (
    <>
      <PageHeader
        smalltitle="Chi siamo"
        title="Da studio tecnico a impresa di cantiere."
        paragraph="Orsillo Costruzioni nasce come studio di progettazione e cresce fino a portare in casa anche l'esecuzione dei lavori."
      />

      <section className="section section--rule-top">
        <Container className="oc-container">
          <Row className="g-5">
            <Col lg={6}>
              <p className="smalltitle">Il metodo</p>
              <h2 className="h1 mb-3">
                Perché teniamo progetto e cantiere insieme.
              </h2>
              <p className="text-steel mb-3">
                Quando chi disegna un intervento è anche chi lo costruisce, le
                varianti si discutono una volta sola e le responsabilità non si
                perdono tra un ufficio e l'altro. È il motivo per cui ogni da
                noi ogni lavoro nasce come un'unica pratica seguita dallo stesso
                team dall'inizio alla fine.
              </p>
              <p className="text-steel mb-0">
                Il cliente deve solo raccontarci quali sono le sue idee, al
                resto pensiamo a tutto noi.
              </p>
            </Col>
            <Col lg={6}>
              <div className="d-grid gap-4">
                {VALUES.map((value) => (
                  <div key={value.title} className="oc-card">
                    <h3 className="h5 mb-2">{value.title}</h3>
                    <p className="text-steel small mb-0">{value.description}</p>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section section--dark section--rule-top">
        <Container className="oc-container">
          <Row className="mb-5">
            <Col lg={7}>
              <p className="smalltitle smalltitle--light">Percorso</p>
              <h2 className="h1 mb-0 text-white">
                Un quarto di secolo di cantieri.
              </h2>
            </Col>
          </Row>
          <Row className="g-4">
            {HISTORY.map((item) => (
              <Col sm={6} lg={3} key={item.year}>
                <div
                  style={{
                    borderTop: "2px solid var(--orange)",
                    paddingTop: "1rem",
                  }}
                >
                  <p
                    className="h3 text-white mb-2"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}
                  >
                    {item.year}
                  </p>
                  <p className="text-steel small mb-0">{item.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  )
}

export default ChiSiamo
