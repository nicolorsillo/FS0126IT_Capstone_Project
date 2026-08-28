import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Container, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { getJobOffersAction } from "../../redux/actions/jobOffers"
import PageHeader from "../../components/PageHeader"
import Loader from "../../components/Loader"
import EmptyState from "../../components/EmptyState"
import ErrorBanner from "../../components/ErrorBanner"

const salaryRange = (offer) => {
  if (!offer.minSalary && !offer.maxSalary) return "RAL da definire"
  if (offer.minSalary && offer.maxSalary) {
    return `${offer.minSalary.toLocaleString("it-IT")} – ${offer.maxSalary.toLocaleString("it-IT")} € RAL`
  }
  return `Da ${(offer.minSalary ?? offer.maxSalary).toLocaleString("it-IT")} € RAL`
}

const JobOffers = () => {
  const dispatch = useDispatch()
  const jobOffers = useSelector((state) => state.jobOffers.list)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    dispatch(getJobOffersAction({ size: 20, orderBy: "createdAt" }))
      .catch(() =>
        setError(
          "Non riusciamo a caricare le posizioni aperte in questo momento.",
        ),
      )
      .finally(() => setLoading(false))
  }, [dispatch])

  const offers = jobOffers.filter((o) => o.status === "OPEN")

  return (
    <>
      <PageHeader
        smalltitle="Lavora con noi"
        title="Candidature aperte per lo studio tecnico e per le squadre di cantiere"
        paragraph="Cerchiamo persone per ampliare i nostri team. Candidati e mandaci il tuo CV direttamente dal tuo profilo."
      />
      <section className="section section--rule-top">
        <Container className="oc-container">
          {loading && <Loader label="Carico le posizioni…" />}
          <ErrorBanner message={error} />
          {!loading && !error && offers.length === 0 && (
            <EmptyState
              title="Nessuna posizione aperta al momento"
              description="Torna a trovarci: pubblichiamo nuove ricerche non appena si apre un cantiere."
            />
          )}
          <Row className="g-4">
            {offers.map((offer) => (
              <Col md={6} key={offer.id}>
                <Link
                  to={`/lavora-con-noi/${offer.id}`}
                  className="work-card h-100"
                >
                  <div className="work-card__top">
                    <span className="work-card__type">{offer.position}</span>
                    {offer.expiresAt && (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.72rem",
                          color: "var(--steel-light)",
                        }}
                      >
                        Scade{" "}
                        {new Date(offer.expiresAt).toLocaleDateString("it-IT", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h3 className="h4 mb-2">{offer.title}</h3>
                  <p className="text-steel small mb-0">{salaryRange(offer)}</p>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  )
}

export default JobOffers
