import { Link } from "react-router"
import { Container, Row, Col } from "react-bootstrap"
import PageHeader from "../components/PageHeader"

const CHANNELS = [
  {
    label: "Email",
    value: "orsillocostruzioni@yahoo.com",
    href: "mailto:orsillocostruzioni@yahoo.com",
  },
  { label: "Telefono", value: "+39 333 3583 524", href: "tel:3333583524" },
  {
    label: "Sede",
    value: "Contrada Saude 1, 82020 Reino (BN)",
    href: "geo:41.1746,14.5010",
  },
  {
    label: "Orari ufficio",
    value: "Lun–Ven, 8:30–13:00 · 14:30–18:00",
    href: null,
  },
]

const Contatti = () => {
  return (
    <>
      <PageHeader
        smalltitle="Contatti"
        title="Contattaci ti risponderemo il prima possibile."
        paragraph="Per qualsiasi problema puoi inviarci una mail, chiamarci al nostro numero di telefono o trovarci nella nostra sede."
      />
      <section className="section section--rule-top">
        <Container className="oc-container">
          <Row className="g-5">
            <Col lg={5}>
              <p className="smalltitle">Contatti diretti</p>
              <div className="d-grid gap-4 mt-4">
                {CHANNELS.map((channel) => (
                  <div
                    key={channel.label}
                    style={{
                      borderBottom: "1px solid var(--line)",
                      paddingBottom: "1rem",
                    }}
                  >
                    <p
                      className="mb-1"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--steel)",
                      }}
                    >
                      {channel.label}
                    </p>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="h5 d-block text-blueprint"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <p className="h5 mb-0">{channel.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={7}>
              <div className="oc-card  h-100">
                <p className="smalltitle">Area clienti</p>
                <h2 className="h3 mb-3">
                  Richiedi un preventivo dal tuo profilo
                </h2>
                <p className="text-steel mb-4">
                  Accedi o crea un account cliente: potrai aprire una nuova
                  richiesta di lavoro (progettazione o costruzione) e consultare
                  i tuoi preventivi, elaborati e fatture man mano che il
                  cantiere avanza.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Link to="/registrati" className="btn btn-primary">
                    Crea account cliente
                  </Link>
                  <Link to="/accedi" className="btn btn-outline-dark">
                    Ho già un account
                  </Link>
                </div>
                <hr style={{ borderColor: "var(--line)" }} />
                <p className="text-steel small mb-0">
                  Cerchi lavoro con noi invece? Visita{" "}
                  <Link to="/lavora-con-noi">le posizioni aperte</Link>.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Contatti
