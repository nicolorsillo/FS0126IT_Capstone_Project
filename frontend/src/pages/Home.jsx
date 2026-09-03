import { useEffect } from "react"
import { Link } from "react-router"
import { Container, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { getJobOffersAction } from "../redux/actions/jobOffers"
import { WORK_TYPE } from "../redux/reducers/works"
import heroCantiere from "../assets/home/hero-cantiere.jpg"
import cardProgettazione from "../assets/home/card-progettazione.jpg"
import cardCostruzione from "../assets/home/card-costruzione.jpg"

const SERVICES = [
  {
    type: "PROJECTING",
    title: "Progettazione",
    image: cardProgettazione,
    description:
      "Rilievo, pratiche edilizie, direzione lavori e disegni esecutivi curati dai nostri geometri, dal primo schizzo al permesso a costruire.",
    points: [
      "Rilievo e sopralluogo",
      "Pratiche comunali e catastali",
      "Disegni esecutivi e computo metrico",
    ],
  },
  {
    type: "BUILDING",
    title: "Costruzione",
    image: cardCostruzione,
    description:
      "Squadre proprie e fornitori selezionati per la realizzazione del cantiere, con avanzamento tracciato fino al collaudo finale.",
    points: [
      "Nuove costruzioni e ristrutturazioni",
      "Direzione cantiere e sicurezza",
      "Collaudo e consegna chiavi in mano",
    ],
  },
]

const Home = () => {
  const dispatch = useDispatch()
  const jobOffers = useSelector((state) => state.jobOffers.list)
  const offers = jobOffers.filter((o) => o.status === "OPEN").slice(0, 3)

  useEffect(() => {
    dispatch(getJobOffersAction({ size: 20, orderBy: "createdAt" })).catch(
      () => {},
    )
  }, [dispatch])

  return (
    <>
      <section
        className="hero"
        style={{ "--hero-image": `url(${heroCantiere})` }}
      >
        <Container className="oc-container">
          <Row>
            <Col lg={7} xl={6}>
              <p className="smalltitle hero__smalltitle smalltitle--light">
                Impresa di progettazione &amp; costruzione
              </p>
              <h1 className="hero__title">
                Costruiamo quello che <em>disegnamo</em>.
              </h1>
              <p className="paragraph">
                Orsillo Costruzioni segue ogni opera dal rilievo al collaudo: un
                unico interlocutore per la progettazione, il cantiere e la
                burocrazia che sta in mezzo.
              </p>
              <div className="hero__actions">
                <Link to="/area-riservata" className="btn btn-primary btn-lg">
                  Richiedi un preventivo
                </Link>
              </div>
              <div className="hero__meta">
                <div>
                  <strong>Italia</strong>
                  Canteri in tutto il paese
                </div>
                <div>
                  <strong>ASACERT</strong>
                  Qualità certificata
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section section--paper">
        <Container className="oc-container">
          <Row className="mb-5">
            <Col lg={7}>
              <p className="smalltitle">Cosa facciamo</p>
              <h2 className="h1 mb-3">Due mestieri, un solo cantiere.</h2>
              <p className="paragraph">
                Per la nostra azienda ogni lavoro può nascere come incarico di{" "}
                <i>progettazione</i> o partire già come cantiere di{" "}
                <i>costruzione</i>.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {SERVICES.map((service, index) => (
              <Col md={6} key={service.type}>
                <div
                  className="service-card h-100"
                  style={{ backgroundImage: `url(${service.image})` }}
                >
                  <p className="smalltitle">
                    {String(index + 1).padStart(2, "0")} —{" "}
                    {WORK_TYPE[service.type]}
                  </p>
                  <h3 className="h2 mb-3">{service.title}</h3>
                  <p className="service-card__desc mb-4">
                    {service.description}
                  </p>
                  <ul className="list-unstyled d-grid gap-2 mb-0">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="d-flex align-items-start gap-2"
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            background: "var(--orange)",
                            marginTop: "0.55em",
                            flex: "none",
                          }}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {offers.length > 0 && (
        <section className="section section--rule-top">
          <Container className="oc-container">
            <Row className="align-items-end mb-5">
              <Col md={8}>
                <p className="smalltitle">Lavora con noi</p>
                <h2 className="h1 mb-0">Cerchiamo persone da cantiere.</h2>
              </Col>
              <Col md={4} className="text-md-end mt-3 mt-md-0">
                <Link to="/lavora-con-noi" className="btn btn-outline-dark">
                  Tutte le posizioni
                </Link>
              </Col>
            </Row>
            <Row className="g-4">
              {offers.map((offer) => (
                <Col md={4} key={offer.id}>
                  <Link
                    to={`/lavora-con-noi/${offer.id}`}
                    className="work-card h-100"
                  >
                    <p className="work-card__type mb-2">{offer.position}</p>
                    <h3 className="h5 mb-2">{offer.title}</h3>
                    <p className="text-steel small mb-0">
                      {offer.minSalary && offer.maxSalary
                        ? `${offer.minSalary.toLocaleString("it-IT")}–${offer.maxSalary.toLocaleString("it-IT")} €/anno`
                        : "RAL da definire"}
                    </p>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      <section className="cta-band">
        <Container className="oc-container cta-band__inner">
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <p className="smalltitle smalltitle--light">Iniziamo</p>
              <h2 className="h1 mb-0 text-white">
                Hai un progetto da realizzare?
              </h2>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Link to="/area-riservata" className="btn btn-primary btn-lg">
                Richiedi un preventivo
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Home
