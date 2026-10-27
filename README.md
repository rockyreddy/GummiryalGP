# Gummiryal Gram Panchayat website

Angular (frontend) + Spring Boot / Java 17 (backend). Local-first; AWS-ready.

## Run locally
Prerequisites: Node 20+, Angular CLI (`npm i -g @angular/cli`), JDK 17+, Maven.

### 1. Backend (http://localhost:8080)
    cd backend
    mvn spring-boot:run
Uses a local H2 file database in `backend/data/` and seeds sample data.

### 2. Frontend (http://localhost:4200)
    ng new frontend --routing=false --style=css --ssr=false
    cd frontend
    rm -rf src/app src/main.ts src/index.html src/styles.css
    cp -r ../frontend-src/app src/app
    cp ../frontend-src/{main.ts,index.html,styles.css} src/
    cp ../frontend-src/proxy.conf.json .
    ng serve --proxy-config proxy.conf.json
(If the CLI asks about zoneless or SSR, answer No.)

## Admin login
Open `/admin` (link in the footer). First-run account: user `admin`, password `ChangeMe@123` (override with env vars `ADMIN_USERNAME` / `ADMIN_PASSWORD` before the first start, or use the Account tab). Admins can change complaint status, delete complaints, add/edit/delete notices (English + Telugu) and change their password.
If you ran the earlier version, delete `backend/data/` once, because the notice table changed.

## Languages
EN / తె toggle in the header (remembered in the browser). UI text lives in `frontend-src/app/i18n.ts`; static pages in `info-data.ts`; notices store both languages in the database. Citizen complaints stay in the language they were typed in.

## API
Public: GET /api/complaints, POST /api/complaints, GET /api/complaints/{ticket}, GET /api/notices, GET /api/stats (complaints omit name/phone).
Admin (HTTP Basic, ROLE_ADMIN): GET /api/admin/me, GET /api/admin/complaints, PUT /api/admin/complaints/{id}/status, DELETE /api/admin/complaints/{id}, POST/PUT/DELETE /api/admin/notices[/{id}], POST /api/admin/password.
Old list:
GET /api/complaints · POST /api/complaints · GET /api/complaints/{ticket} · GET /api/notices · GET /api/stats

## Deploying to AWS later
- Frontend: `ng build` -> upload `dist/frontend/browser` to S3 -> serve through CloudFront.
- Backend: `mvn package` -> run on Elastic Beanstalk or ECS/Fargate behind an ALB; CloudFront routes `/api/*` to it.
- Database: switch to RDS PostgreSQL (add the Postgres driver, set SPRING_DATASOURCE_URL/USERNAME/PASSWORD).
- Domain: buy in Route 53, create an ACM certificate (us-east-1 for CloudFront), point the domain at CloudFront.
- Set CORS_ORIGINS to your domain. Serve everything over HTTPS only (admin uses HTTP Basic), set a strong ADMIN_PASSWORD, and consider rate-limiting login and complaint submission (e.g. AWS WAF).
