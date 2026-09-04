# Orsillo Costruzioni — Capstone Project

Piattaforma web per Orsillo Costruzioni S.r.l., impresa edile con studio tecnico associato: sito pubblico aziendale, area riservata per clienti e candidati, e backoffice
gestionale per lo staff interno.

## Cosa fa

- **Sito pubblico**: presentazione dell'azienda, servizi, contatti, offerte di
  lavoro aperte e candidatura online.
- **Area riservata cliente**: un cliente vede le proprie opere (lavori) e, per
  ciascuna, i preventivi da accettare/rifiutare e i progetti da approvare o
  respingere a lavoro concluso.
- **Area riservata candidato**: gestione delle proprie candidature alle offerte
  di lavoro, prenotazione/cancellazione di uno slot colloquio una volta invitato.
- **Backoffice staff** (HR, Geometra, Admin): gestione completa di lavori,
  preventivi, fatture, progetti, offerte di lavoro, candidature, slot colloquio,
  utenti, ruoli e permessi.

## Stack tecnologico

**Backend** — `backend/`

- Java 25
- Spring Boot
- Spring Data JPA, Spring Security, Spring Validation
- PostgreSQL
- Cloudinary per l'upload dei file (CV, elaborati di progetto)

**Frontend** — `frontend/`

- Vite
- React
- React Bootstrap
- React Redux
- React Router
- Sass

## Ruoli e permessi

- **CLIENTE**, **CANDIDATO**: ruoli auto-registrabili, solo funzionalità
  self-service (le proprie opere/candidature).
- **HR**, **GEOMETRA**, **ADMIN**: ruoli staff, assegnabili solo da un
  amministratore — accesso al backoffice.

## Avvio in locale

### Backend

Richiede un'istanza PostgreSQL e un file `backend/env.properties` con le seguenti variabili:

```properties
PORT=3001
DB_URL=jdbc:postgresql://localhost:5432/<nome-db>
DB_USERNAME=...
DB_PASSWORD=...
JWT_SECRET=...
CLOUDINARY_NAME=...
CLOUDINARY_APIKEY=...
CLOUDINARY_SECRET=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Il frontend punta di default a `http://localhost:3001` come base URL delle API.
