import { Container, Row, Col } from "react-bootstrap"

const PageHeader = ({ smalltitle, title, paragraph, children }) => {
  return (
    <section className="section section--tight section--paper">
      <Container className="oc-container">
        <Row>
          <Col lg={8}>
            <p className="smalltitle">{smalltitle}</p>
            <h1
              className="mb-3"
              style={{ fontSize: "clamp(2.2rem, 1.8rem + 2vw, 3.5rem)" }}
            >
              {title}
            </h1>
            {paragraph && <p className="paragraph mb-0">{paragraph}</p>}
          </Col>
        </Row>
        {children}
      </Container>
    </section>
  )
}

export default PageHeader
