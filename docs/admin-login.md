# Admin Login

## API purpose
Authenticate an admin and return a JWT plus safe admin profile details.

## HTTP method
`POST`

## Endpoint URL
`/api/auth/login`

## Authentication requirements
None (public).

## Headers
```http
Content-Type: application/json
```

## Request payload
```json
{
  "email": "makaanadmin@gmail.com",
  "password": "makaan@0028"
}
```

## Successful response example
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h",
  "admin": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "email": "makaanadmin@gmail.com",
    "name": "Makaan Admin",
    "phone": "",
    "location": "",
    "businessOpensAt": "09:00",
    "businessCloseAt": "18:00",
    "modifiedOn": "2026-11-23T12:00:00.000Z"
  }
}
```

`password` and `createdOn` are excluded.

## Error responses
- `400` validation error (missing/invalid body)
- `401` invalid email or password

## Database and collection
- Database: `makaan_admin`
- Collection: `users`

## Frontend integration instructions
1. Call this endpoint from the admin panel login form.
2. Store `accessToken` (localStorage/sessionStorage).
3. Send `Authorization: Bearer <accessToken>` on protected admin routes.
4. Default seeded credentials (dev): email `makaanadmin@gmail.com`, password `makaan@0028`.
