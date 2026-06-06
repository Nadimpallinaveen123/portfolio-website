# Deployment Guide

Codex cannot create the live Vercel, Render, or Supabase projects without your account access and deployment authorization. This repository is configured so you can connect it to those services and deploy from GitHub.

This project is designed for free-tier hosting:

- Frontend: Vercel Free
- Backend: Render Free Web Service
- Database: Supabase Free PostgreSQL
- Source control: GitHub
- Domain: Vercel generated domain, for example `naveen-java-developer.vercel.app`

## 1. Create Supabase PostgreSQL

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `database/schema.sql`.
4. Copy the PostgreSQL connection string.

Use the connection string in this JDBC format for Spring Boot:

```text
jdbc:postgresql://<host>:5432/postgres?sslmode=require
```

## 2. Configure Gmail SMTP

1. Enable 2-Step Verification in your Google account.
2. Create an app password.
3. Use your Gmail address as `SPRING_MAIL_USERNAME`.
4. Use the app password as `SPRING_MAIL_PASSWORD`.

Do not use your normal Gmail password. Gmail SMTP requires an app password for this kind of backend login. Enter the app password without spaces.

## 3. Deploy Backend on Render

Create a Render Web Service from the GitHub repository.

Recommended settings:

```text
Root Directory: backend
Runtime: Docker
Health Check Path: /api/analytics/metrics
```

Environment variables:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://<supabase-host>:5432/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=<supabase-user>
SPRING_DATASOURCE_PASSWORD=<supabase-password>
JWT_SECRET=<64+ character random secret>
ADMIN_USERNAME=<admin username>
ADMIN_PASSWORD=<strong admin password>
SPRING_MAIL_USERNAME=<gmail address>
SPRING_MAIL_PASSWORD=<gmail app password>
OWNER_EMAIL=nadimpallinaveen2@gmail.com
ALLOWED_ORIGINS=https://naveen-java-developer.vercel.app
```

OTP troubleshooting on Render:

- `Email Service Unavailable`: `SPRING_MAIL_USERNAME` or `SPRING_MAIL_PASSWORD` is missing.
- `SMTP Authentication Failed`: Gmail rejected the username/password. Create a new Gmail app password and update `SPRING_MAIL_PASSWORD`.
- `Unable to Send OTP`: SMTP send failed after configuration was present. Check Render logs for the root cause line.
- `Email Service Unavailable. Gmail SMTP connection timed out.`: Render or the network could not reach Gmail SMTP.
- `Database unavailable`: PostgreSQL/Supabase is not reachable, so OTP cannot be stored before email sending.
- `Backend API not reachable`: Vercel `VITE_API_BASE_URL` is wrong or the Render service is sleeping/not deployed.
- `CORS` browser error: add the exact Vercel domain to `ALLOWED_ORIGINS`.

## 4. Deploy Frontend on Vercel

Create a Vercel project from the GitHub repository.

Recommended settings:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Environment variables:

```text
VITE_API_BASE_URL=https://<render-service>.onrender.com/api
VITE_LINKEDIN_URL=https://www.linkedin.com/in/<your-profile>
VITE_GITHUB_URL=https://github.com/<your-profile>
VITE_WHATSAPP_NUMBER=91<your-number>
VITE_GA_ID=<optional-google-analytics-id>
```

## 5. Resume PDF

Replace:

```text
backend/src/main/resources/resume/NaveenNadimpalli_JFS_updated_resume.pdf
```

with your real resume before deploying.

## 6. CI/CD

The GitHub Actions workflow at `.github/workflows/ci.yml` builds the frontend and runs backend tests on pull requests and pushes to `main`.

Vercel and Render can both auto-deploy when changes are pushed to GitHub.
