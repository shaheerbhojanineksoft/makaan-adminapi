# Admin Get Profile

## API purpose
Return the authenticated admin's profile.

## HTTP method
`GET`

## Endpoint URL
`/api/admin/profile`

## Authentication requirements
JWT Bearer token required.

## Headers
```http
Authorization: Bearer <accessToken>
```

## Request payload
None.

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
  "modifiedOn": "2026-11-23T12:00:00.000Z"
}
```

## Error responses
- `401` missing/invalid token

## Database and collection
- Database: `makaan_admin`
- Collection: `users`

## Frontend integration instructions
Use after login to hydrate the Admin Profile screen. Attach the JWT from login.
