import { Modal } from "react-bootstrap"

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg"]
const MODEL_EXTENSIONS = ["glb", "gltf"]

const getExtension = (url) => {
  const clean = url.split("?")[0].split("#")[0]
  const match = clean.match(/\.([a-zA-Z0-9]+)$/)
  return match ? match[1].toLowerCase() : ""
}

const FileViewerModal = ({ url, onClose }) => {
  if (!url) return null

  const ext = getExtension(url)
  const isPdf = ext === "pdf"
  const isImage = IMAGE_EXTENSIONS.includes(ext)
  const isModel = MODEL_EXTENSIONS.includes(ext)

  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title
          className="h6 mb-0"
          style={{
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {isPdf
            ? "Documento PDF"
            : isImage
              ? "Immagine"
              : isModel
                ? "Modello 3D"
                : "File"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        {isPdf && (
          <iframe
            title="Anteprima file"
            src={url}
            style={{ width: "100%", height: "75vh", border: "none" }}
          />
        )}
        {isImage && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "50vh", background: "var(--charcoal)" }}
          >
            <img
              src={url}
              alt="Anteprima"
              style={{ maxWidth: "100%", maxHeight: "75vh" }}
            />
          </div>
        )}
        {isModel && (
          <model-viewer
            src={url}
            camera-controls="true"
            auto-rotate="true"
            style={{
              width: "100%",
              height: "75vh",
              background: "var(--charcoal)",
            }}
          />
        )}
        {!isPdf && !isImage && !isModel && (
          <div className="p-4 text-center">
            <p className="text-steel mb-3">
              Impossibile visualizzare questo tipo di file direttamente nella
              pagina.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-dark"
            >
              Apri in una nuova scheda
            </a>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default FileViewerModal
