# Naveen Nadimpalli Portfolio & Resume Download Platform

Professional full-stack portfolio for a Java Full Stack Developer with recruiter verification, OTP-based resume download, admin dashboard, and deployment-ready configuration.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Query
- Backend: Java 21, Spring Boot 3, Spring Security, JWT, Spring Data JPA
- Database: PostgreSQL, Supabase-ready schema
- Email: Gmail SMTP
- Hosting: Vercel frontend, Render backend, Supabase PostgreSQL

## Project Structure

```text
.
+-- backend/                 Spring Boot API
+-- frontend/                React portfolio app
+-- database/                PostgreSQL scripts
+-- docker-compose.yml       Local full-stack run
+-- render.yaml              Render backend blueprint
+-- DEPLOYMENT.md            Vercel, Render, Supabase steps
+-- SECURITY.md              Production security checklist
+-- .github/workflows/ci.yml CI checks
```

## Local Development

### Backend

```bash
cd backend
cp .env.example .env
mvn spring-boot:run
```

Spring Boot does not automatically load `.env` files in every IDE/run mode. For local OTP testing, set these environment variables in the same terminal before starting the backend:

```powershell
$env:SPRING_MAIL_USERNAME="nadimpallinaveen2@gmail.com"
$env:SPRING_MAIL_PASSWORD="<your-16-character-gmail-app-password-without-spaces>"
$env:OWNER_EMAIL="nadimpallinaveen2@gmail.com"
mvn spring-boot:run
```

If you run from an IDE, add the same variables in the Run Configuration environment variables field.

You can also place these values in `backend/.env`; the backend imports that file for local development. Restart Spring Boot after editing `.env`.

```text
SPRING_MAIL_USERNAME=nadimpallinaveen2@gmail.com
SPRING_MAIL_PASSWORD=your16characterapppassword
OWNER_EMAIL=nadimpallinaveen2@gmail.com
```

For OTP to work locally, PostgreSQL must also be running and match `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Docker

```bash
docker compose up --build
```

## Default URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Swagger/OpenAPI: http://localhost:8080/swagger-ui.html

## Production Notes

Place your real resume PDF at `backend/src/main/resources/resume/NaveenNadimpalli_JFS_updated_resume.pdf` before deploying.

Never commit production secrets. Use Vercel, Render, and Supabase environment variables.

## Documentation

- Deployment: `DEPLOYMENT.md`
- Security: `SECURITY.md`
- Database: `database/schema.sql`

## Main API Endpoints

- `POST /api/otp/send`
- `POST /api/otp/verify`
- `POST /api/resume/request-otp` legacy-compatible route
- `POST /api/resume/verify-otp` legacy-compatible route
- `GET /api/resume/download`
- `POST /api/admin/login`
- `GET /api/admin/recruiters`
- `GET /api/admin/downloads`
- `GET /api/admin/stats`
- `GET /api/admin/export`
- `POST /api/contact`
- `POST /api/analytics/visit`
- `GET /api/analytics/metrics`
