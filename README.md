# habit-tracker-api

REST API backend for a Smart Task & Habit Tracker mobile application (React Native / Expo). Designed for offline-first mobile clients with sync-safe mutations and timestamp-based conflict resolution.

**Swagger API Docs:** https://habit-tracker-api-hiis.onrender.com/api-docs

---

## Tech Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| Runtime        | Node.js                          |
| Framework      | Express.js                       |
| Language       | TypeScript                       |
| Database       | MongoDB / Mongoose               |
| Authentication | JWT                              |
| Email          | Nodemailer                       |
| Logging        | Winston                          |
| Validation     | express-validator                |
| Security       | Helmet, CORS, express-rate-limit |

---

## Architecture

Layered architecture: `Route -> Middleware -> Controller -> Service -> Repository -> Model`

- Controllers delegate to services and return a response
- Services own all business logic - auth flows, sync reconciliation, streak calculation
- Repositories abstract all Mongoose queries
- Models define schemas, indexes, and document-level hooks

---

## Key Architectural Decisions

- **Last-write-wins sync** - `PATCH` endpoints compare `clientUpdatedAt` from the request against the stored value. Stale writes are ignored and the current server state is returned, making retries safe.
- **Soft deletes** - Tasks and habits set `deletedAt` instead of being removed. Prevents deleted records from reappearing during offline sync replay.
- **Idempotent check-ins** - A duplicate same-day habit check-in returns `409 Conflict`, preventing streak inflation from replayed offline queues.
- **Fail-fast env validation** - All required environment variables are validated at startup. Missing vars throw before the server begins listening.
- **Retry-safe mutations** - All mutation responses return the full updated resource. Replaying a successful mutation returns the same response shape.

---

## Local Development

```bash
git clone <repo-url>
cd habit-tracker-api
npm install
cp .env.example .env   # fill in values
npm run dev
```

```bash
# Verify server is up
curl http://localhost:3000/health
```

| Script              | Description                         |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start with hot reload (ts-node-dev) |
| `npm run build`     | Compile TypeScript to `dist/`       |
| `npm start`         | Run compiled production build       |
| `npm run typecheck` | Type-check without emitting         |

---

## Environment Variables

| Variable         | Required | Default                    | Description                   |
| ---------------- | -------- | -------------------------- | ----------------------------- |
| `NODE_ENV`       | No       | `development`              | `development` or `production` |
| `PORT`           | No       | `3000`                     | Server port                   |
| `MONGODB_URI`    | Yes      | -                          | MongoDB connection string     |
| `JWT_SECRET`     | Yes      | -                          | Secret for signing JWTs       |
| `JWT_EXPIRES_IN` | No       | `7d`                       | Token expiry duration         |
| `SMTP_HOST`      | Yes      | -                          | SMTP server hostname          |
| `SMTP_PORT`      | No       | `587`                      | SMTP port                     |
| `SMTP_USER`      | Yes      | -                          | SMTP username                 |
| `SMTP_PASS`      | Yes      | -                          | SMTP password                 |
| `SMTP_FROM`      | No       | `noreply@habittracker.app` | Sender address                |
| `CLIENT_URL`     | No       | `http://localhost:8081`    | Frontend URL for email links  |

For local email testing, [Mailtrap](https://mailtrap.io) works without sending real emails.

---

## Sync Strategy

The mobile client queues mutations offline and replays them when connectivity is restored. The API handles this via:

- `clientUpdatedAt` - an ISO 8601 timestamp generated on the device at the time of the action, sent with every mutation.
- On `PATCH`, the server applies the write only if `clientUpdatedAt` is newer than the stored value. Otherwise it returns the current state unchanged.
- Soft deletes ensure deleted resources do not reappear during sync replay.
- Same-day habit check-ins are idempotent - replaying a queued check-in will not double the streak.

---

## Folder Structure

```
src/
├── app.ts                    Express app factory
├── server.ts                 Entry point, graceful shutdown
├── config/                   Env validation, database connection
├── constants/                HTTP status codes, app-wide constants
├── types/                    Shared interfaces, Express
├── lib/                      Logger, Nodemailer, Swagger spec
├── models/                   Mongoose schemas with indexes and hooks
├── repositories/             All database query logic
├── services/                 Business logic, sync reconciliation
├── controllers/              Request/response delegation
├── validators/               express-validator chains per route
├── middlewares/              Auth, validation, error, rate limiting
└── routes/                   Modular route registration under /api/v1
```

---

## Future Improvements

- Push notifications for habit reminders via FCM
- Refresh token rotation for longer sessions without re-login
- Delta sync endpoint returning only records modified since a given timestamp
- Background job to purge soft-deleted records past a configurable retention window
