import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { Container, Row, Col } from "react-bootstrap"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import StatusBadge from "../../components/StatusBadge"
import { useDispatch, useSelector } from "react-redux"
import { getJobOfferByIdAction } from "../../redux/actions/jobOffers"
import {
  getMyApplicationsAction,
  createApplicationAction,
} from "../../redux/actions/applications"
import { APPLICATION_STATUS } from "../../redux/reducers/applications"
import { ApiError } from "../../redux/actions/auth"

const JobOfferDetail = () => {
  const { jobOfferId } = useParams()
  const { user } = useSelector((state) => state.auth)
  const offer = useSelector((state) => state.jobOffers.current)
  const dispatch = useDispatch()
  const [error, setError] = useState("")
  const [myApplication, setMyApplication] = useState(undefined)
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [applied, setApplied] = useState(false)

  const isCandidate = user?.roles?.includes("CANDIDATO")
  const isOpen = offer?.status === "OPEN"

  useEffect(() => {
    dispatch(getJobOfferByIdAction(jobOfferId)).catch(() =>
      setError("Questa posizione non è più disponibile."),
    )
  }, [jobOfferId, dispatch])

  useEffect(() => {
    if (!isCandidate) return
    dispatch(getMyApplicationsAction())
      .then((apps) =>
        setMyApplication(
          apps.find((a) => a.jobOffer.id === jobOfferId) ?? null,
        ),
      )
      .catch(() => setMyApplication(null))
  }, [isCandidate, jobOfferId, applied, dispatch])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      setSubmitError("Allega il tuo CV in PDF prima di inviare la candidatura.")
      return
    }
    setSubmitting(true)
    setSubmitError("")
    try {
      await dispatch(createApplicationAction(jobOfferId, file))
      setApplied(true)
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Invio non riuscito. Riprova.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (error) {
    return (
      <Container className="oc-container section">
        <ErrorBanner message={error} />
        <Link to="/lavora-con-noi" className="btn btn-outline-dark">
          Torna alle posizioni
        </Link>
      </Container>
    )
  }

  if (!offer) {
    return (
      <Container className="oc-container section">
        <Loader label="Carico la posizione…" />
      </Container>
    )
  }

  return (
    <section className="section">
      <Container className="oc-container">
        <Row className="g-5">
          <Col lg={7}>
            <p className="smalltitle">{offer.position}</p>
            <h1
              className="mb-3"
              style={{ fontSize: "clamp(2.1rem, 1.8rem + 1.6vw, 3rem)" }}
            >
              {offer.title}
            </h1>
            <p className="text-steel" style={{ whiteSpace: "pre-line" }}>
              {offer.description}
            </p>
          </Col>
          <Col lg={5}>
            <div className="oc-card ">
              <dl className="row mb-4 gy-2">
                <dt className="col-5 text-steel small">RAL</dt>
                <dd className="col-7 mb-0">
                  {offer.minSalary && offer.maxSalary
                    ? `${offer.minSalary.toLocaleString("it-IT")}–${offer.maxSalary.toLocaleString("it-IT")} €`
                    : "Da definire"}
                </dd>
                <dt className="col-5 text-steel small">Pubblicata</dt>
                <dd className="col-7 mb-0">
                  {new Date(offer.createdAt).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </dd>
                {offer.expiresAt && (
                  <>
                    <dt className="col-5 text-steel small">Scadenza</dt>
                    <dd className="col-7 mb-0">
                      {new Date(offer.expiresAt).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </dd>
                  </>
                )}
              </dl>

              {user && isCandidate && (applied || myApplication) && (
                <div>
                  <p className="text-steel small mb-2">
                    Hai già inviato una candidatura per questa posizione.
                  </p>
                  <StatusBadge
                    map={APPLICATION_STATUS}
                    status={myApplication?.status ?? "SUBMITTED"}
                  />
                </div>
              )}

              {!isOpen && !applied && !myApplication && (
                <p className="text-steel small mb-0">
                  Questa posizione non è più aperta alle candidature.
                </p>
              )}

              {isOpen && !user && (
                <div className="d-grid gap-3">
                  <p className="text-steel small mb-0">
                    Per candidarti serve un account candidato: raccoglie CV,
                    stato della candidatura e colloqui in un unico posto.
                  </p>
                  <Link
                    to="/registrati"
                    state={{ role: "CANDIDATO" }}
                    className="btn btn-primary"
                  >
                    Crea account e candidati
                  </Link>
                  <Link to="/accedi" className="btn btn-outline-dark">
                    Ho già un account
                  </Link>
                </div>
              )}

              {isOpen && user && !isCandidate && (
                <p className="text-steel small mb-0">
                  Il tuo account non è abilitato alle candidature. Contattaci se
                  pensi sia un errore.
                </p>
              )}

              {isOpen &&
                user &&
                isCandidate &&
                !applied &&
                myApplication === null && (
                  <form onSubmit={handleSubmit} className="d-grid gap-3">
                    <div>
                      <label
                        className="form-label d-block mb-2"
                        htmlFor="cv-upload"
                      >
                        Curriculum (PDF)
                      </label>
                      <label className="file-drop d-block" htmlFor="cv-upload">
                        {file ? file.name : "Seleziona o trascina il file"}
                        <input
                          id="cv-upload"
                          type="file"
                          accept="application/pdf"
                          onChange={(event) =>
                            setFile(event.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    </div>
                    <ErrorBanner message={submitError} />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? "Invio…" : "Invia candidatura"}
                    </button>
                  </form>
                )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default JobOfferDetail
