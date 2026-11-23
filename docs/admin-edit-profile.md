# Admin Edit Profile

## API purpose
Partially update the authenticated admin profile fields and refresh `modifiedOn`.

## HTTP method
`PATCH`

## Endpoint URL
`/api/admin/profile`

## Authentication requirements
JWT Bearer token required. Admin ID is taken from the JWT, never from the body.

## Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

## Request payload
All fields optional (partial update):
```json
{
  "name": "Makaan Admin",
  "email": "makaanadmin@gmail.com",
  "phone": "+92 21 111 000 111",
  "location": "Head Office, Karachi",
  "businessOpensAt": "09:00",
  "businessCloseAt": "18:00"
}
```

Notes:
- `businessOpensAt` / `businessCloseAt` must be `HH:mm` (24-hour strings).
- Unknown fields are rejected.

## Successful response example
```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0d",
  "email": "makaanadmin@gmail.com",
  "name": "Makaan Admin",
  "phone": "+92 21 111 000 111",
  "location": "Head Office, Karachi",
  "businessOpensAt": "09:00",
  "businessCloseAt": "18:00",
  "modifiedOn": "2026-11-23T12:30:00.000Z"
}
```

## Error responses
- `400` validation error
- `401` missing/invalid token
- `404` admin not found
- `409` email already in use

## Database and collection
- Database: `makaan_admin`
- Collection: `users`

## Frontend integration instructions
Wire Admin Profile form submit to this endpoint. Send only changed fields if desired. After success, replace local admin state with the response.
