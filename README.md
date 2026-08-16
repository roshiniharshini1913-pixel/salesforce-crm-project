# ConnectCRM — Full-Stack Sales & Service Cloud

A full-stack CRM web application built with **React (JS/HTML/CSS)** on the
frontend and **Java (Spring Boot)** on the backend, backed by a relational
**database** (H2 by default, MySQL-ready). It models core Salesforce-style
objects — **Leads, Contacts, Opportunities, and Cases** — with a live
analytics dashboard, authentication, and full CRUD across every module.

This project was designed as a portfolio piece for a **Software Engineer
Intern** application at Salesforce: it deliberately mirrors Salesforce's own
domain model (Lead → Contact → Opportunity → Case) and demonstrates a
layered, production-style architecture (Controller → Service → Repository →
Entity) rather than a toy CRUD demo.

---

## ✨ Features

- **Dashboard** — live KPIs (total leads, pipeline value, won revenue) with
  interactive bar/pie charts (Recharts) grouped by stage, status, and priority.
- **Leads** — capture and qualify inbound prospects (status + source tracking).
- **Contacts** — a searchable directory of customer relationships.
- **Opportunities** — sales pipeline with stage tracking and deal value.
- **Cases** — customer support ticketing with priority and status.
- **Authentication** — login screen backed by a real `/api/auth/login`
  endpoint; passwords are BCrypt-hashed in the database.
- **Professional, responsive UI** — a custom "Lightning cloud" design system
  (sidebar nav, topbar, modals, toasts, badges, data tables) built in plain
  CSS — no UI framework dependency.
- **REST API** — clean, resource-based endpoints with validation and a global
  exception handler returning structured JSON errors.
- **Seed data** — the app boots with realistic demo records so the UI is
  populated immediately.

---

## 🧱 Tech Stack

| Layer      | Technology                                              |
|------------|-----------------------------------------------------------|
| Frontend   | React 18, React Router, Axios, Recharts, HTML5, CSS3, JS  |
| Backend    | Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security (BCrypt) |
| Database   | H2 (file-based, zero setup) — MySQL config included and ready to switch |
| Build tools| Maven (backend), Vite (frontend)                         |

---

## 📁 Project Structure

```
salesforce-crm-project/
├── backend/                          # Spring Boot REST API
│   ├── src/main/java/com/crm/
│   │   ├── config/                   # CORS, Security, DataSeeder
│   │   ├── controller/                # REST controllers
│   │   ├── dto/                      # Request/response DTOs
│   │   ├── entity/                   # JPA entities (Lead, Contact, Opportunity, CaseTicket, User)
│   │   ├── exception/                # Global exception handling
│   │   ├── repository/               # Spring Data JPA repositories
│   │   └── service/                  # Business logic layer
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                         # React (Vite) SPA
│   ├── src/
│   │   ├── api/                      # Axios client
│   │   ├── components/               # Reusable UI (DataTable, Modal, Badge, StatCard...)
│   │   ├── context/                  # Auth context
│   │   ├── pages/                    # Login, Dashboard, Leads, Contacts, Opportunities, Cases
│   │   ├── styles/                   # index.css (design system)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites (software to install)

| Software | Version | Check with | Notes |
|---|---|---|---|
| **JDK** | 21 or 25 | `java -version` | You already have JDK 25 — that's fine, see note below. |
| **Maven** | 3.9+ | `mvn -version` | Install via `winget install Apache.Maven` on Windows. |
| **Node.js** | 18+ (20 LTS recommended) | `node -v` | Includes npm automatically. |
| **npm** | 9+ | `npm -v` | Bundled with Node.js. |
| **VS Code** | latest | — | Install the *Extension Pack for Java* and *Spring Boot Extension Pack* for the smoothest experience. |

**A note on Java 25:** the backend's `pom.xml` targets **Java 21 bytecode**
(`<java.version>21</java.version>`), not 25, and Spring Boot is pinned to
`3.3.5`. This is intentional, not a downgrade for you — the JVM is
backward-compatible, so code compiled for Java 21 runs natively and correctly
on your installed Java 25 JDK/JRE. Spring Boot's own build plugins (annotation
processing, Hibernate bytecode enhancement, etc.) are only fully validated up
to Java 21/22 as of this writing, so compiling *straight to* "25" as the
release target risks obscure build-plugin errors that have nothing to do with
your code. Targeting 21 gets you a build that is both modern and guaranteed
to work on Java 25 — you don't need to install an older JDK side-by-side.

### 1. Unzip and open in VS Code

```bash
unzip salesforce-crm-project.zip
cd salesforce-crm-project
code .
```

`code .` opens the whole project (both `backend/` and `frontend/`) in one
VS Code window. If the `code` command isn't recognized, open VS Code, go to
**File → Open Folder**, and select the unzipped `salesforce-crm-project`
folder instead.

### 2. Run the backend (Spring Boot API)

Open a terminal in VS Code (`` Ctrl+` ``) and run:

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. On first run it automatically
creates the H2 database file under `backend/data/` and seeds it with demo
Leads, Contacts, Opportunities, and Cases.

- H2 console (optional, for inspecting the DB): http://localhost:8080/h2-console
  (JDBC URL: `jdbc:h2:file:./data/connectcrm`, user: `sa`, no password)

### 3. Run the frontend (React)

Open a **second terminal** in VS Code:

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** and proxies `/api/*` calls to
the backend on port 8080 (already configured in `vite.config.js`).

### 4. Log in

Open http://localhost:5173 and sign in with one of the seeded demo accounts:

| Username | Password  | Role   |
|----------|-----------|--------|
| `admin`  | `admin123`| ADMIN  |
| `rep`    | `rep123`  | SALES_REP |

---

## 🗄️ Switching to MySQL

By default the app uses an embedded H2 database (zero configuration). To use
MySQL instead:

1. Start a local MySQL server.
2. Open `backend/src/main/resources/application.properties`.
3. Comment out the **H2** block and uncomment the **MySQL** block, updating
   `spring.datasource.username` / `password` to match your MySQL setup.
4. Re-run `mvn spring-boot:run` — Hibernate will auto-create the schema and
   the `DataSeeder` will populate it on first launch.

---

## 🔌 API Reference (selected endpoints)

| Method | Endpoint                  | Description                  |
|--------|----------------------------|-------------------------------|
| POST   | `/api/auth/login`          | Authenticate and receive a session token |
| GET    | `/api/dashboard/stats`     | Aggregated KPIs for the dashboard |
| GET/POST | `/api/leads`              | List / create leads |
| GET/PUT/DELETE | `/api/leads/{id}`   | Read / update / delete a lead |
| GET/POST | `/api/contacts`           | List / create contacts |
| GET/POST | `/api/opportunities`      | List / create opportunities |
| GET/POST | `/api/cases`              | List / create cases |

All list/detail endpoints follow the same REST + JSON pattern.

---

## 🎯 Why this project fits a Salesforce SWE Internship application

- Demonstrates the exact **CRM domain model** (Lead, Contact, Opportunity,
  Case) that Salesforce's own platform is built around.
- Shows a clean **layered backend architecture** (Controller/Service/Repository)
  with validation, centralized error handling, and a real database — not
  just an in-memory array.
- Shows **React fundamentals** done well: routing, context for auth state,
  componentized reusable UI, controlled forms, and API integration via Axios.
- A **professional, original UI** (not a copy-pasted template) with a
  cohesive design system, responsive layout, empty/loading/error states,
  and interactive data visualizations.
- Includes seed data and clear run instructions so it can be evaluated in
  minutes, and a MySQL migration path showing awareness of production
  database concerns.

---

## 📄 License

This project is provided as a personal portfolio/learning artifact and is
free to use, modify, and extend.
