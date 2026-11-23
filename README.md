# makaan-adminapi

NestJS backend for Makaan admin-panel APIs.

## Stack
- NestJS + TypeScript
- MongoDB (Mongoose)
- JWT + Passport
- class-validator / class-transformer

## Setup
```bash
cp .env.example .env
npm install
npm run start:dev
```

Default port: `3001`  
Default admin (seeded on startup if missing): email `makaanadmin@gmail.com` / password `makaan@0028`

## Key endpoints
| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/login` | Public |
| PATCH | `/api/admin/profile` | JWT |

See `docs/` for full API documentation.
