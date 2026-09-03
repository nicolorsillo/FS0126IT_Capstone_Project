import { Link, Outlet } from "react-router"
import { Container, Row, Col } from "react-bootstrap"
import NavBar from "./NavBar"

const PublicLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="oc-footer">
        <Container className="oc-container">
          <Row className="gy-4 gy-lg-0">
            <Col lg={4} className="pe-lg-5">
              <img
                src="/logo-big.svg"
                alt="Orsillo Costruzioni"
                className="oc-footer__logo mb-3"
              />
              <p className="text-white-50 mb-0" style={{ maxWidth: "32ch" }}>
                Progettazione e costruzione edile. Dal sopralluogo al collaudo,
                un solo interlocutore per l'intero cantiere.
              </p>
            </Col>
            <Col sm={4} lg={2}>
              <h6>Azienda</h6>
              <ul>
                <li>
                  <Link to="/chi-siamo">Chi siamo</Link>
                </li>
                <li>
                  <Link to="/servizi">Servizi</Link>
                </li>
                <li>
                  <Link to="/lavora-con-noi">Lavora con noi</Link>
                </li>
              </ul>
            </Col>
            <Col sm={4} lg={2}>
              <h6>Clienti</h6>
              <ul>
                <li>
                  <Link to="/accedi">Accedi</Link>
                </li>
                <li>
                  <Link to="/registrati">Crea account</Link>
                </li>
                <li>
                  <Link to="/area-riservata">Area riservata</Link>
                </li>
                <li>
                  <Link to="/contatti">Richiedi un preventivo</Link>
                </li>
              </ul>
            </Col>
            <Col sm={4} lg={4}>
              <h6>Contatti</h6>
              <ul className="mb-3">
                <li>
                  <a href="mailto:orsillocostruzioni@yahoo.com">
                    orsillocostruzioni@yahoo.com
                  </a>
                </li>
                <li className="text-white-50">
                  Contrada Saude 1, 82020 Reino (BN)
                </li>
              </ul>
              <h6>Certificazioni</h6>
              <img
                src="/certificazione-iso9001.jpg"
                alt="Azienda certificata ISO 9001:2015 — ASACERT, accreditamento ACCREDIA"
                className="oc-footer__cert"
              />
            </Col>
          </Row>
          <div className="oc-footer__bottom">
            <span>© {new Date().getFullYear()} Orsillo Costruzioni S.r.l.</span>
          </div>
        </Container>
      </footer>
    </div>
  )
}

export default PublicLayout
