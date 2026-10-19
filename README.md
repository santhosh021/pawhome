# PawHome - Pet Adoption (MERN)

Shelters list pets, adopters apply, admins approve shelters.

## What it demonstrates

| Requirement | Where |
|---|---|
| React functional components | `client/src/components`, `client/src/pages` |
| Routing | `client/src/App.jsx` (React Router, nested guarded routes) |
| Authentication | JWT login/register: `server/src/controllers/authController.js`, `middleware/auth.js`, `client/src/context/AuthContext.jsx` |
| Authorization (roles) | `middleware/authorizeRoles.js`, `client/src/components/ProtectedRoute.jsx` |
| Authorization (ownership) | `petController.js` (`loadOwnedPet`), `applicationController.js` (`setStatus`, `withdraw`) |
| Hooks | `useState`, `useEffect`, `useContext`, `useMemo`, `useCallback` across the client |
| Custom hooks | `client/src/hooks`: `useAuth`, `useFetch`, `useForm`, `useDebounce`, `useLocalStorage` |
| Express + Body Parser | `server/src/app.js` |
| Express Validator | `server/src/middleware/validators.js`, `validate.js` |
| bcrypt | password hashing in `authController.js` |
| jsonwebtoken | token signing / verifying |
| Mongoose + mongoose-unique-validator | `server/src/models` (unique email, one application per pet per adopter) |
| Multer (multipart/form-data) | `server/src/config/upload.js`, `PetForm.jsx` (pet photo) |

## Roles

- **Adopter**: browse pets, apply, see/withdraw own applications.
- **Shelter**: add/edit/delete own pets, approve/reject applications for own pets. Needs admin approval first.
- **Admin**: approve shelters, delete users, see stats. Created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` on first start.

## Run locally (without Docker)

1. Start MongoDB locally.
2. API: `cd server && cp .env.example .env && npm install && npm run dev`
3. Client: `cd client && npm install && npm run dev` (open http://localhost:5173)

## Run with Docker

```
cp .env.example .env
docker compose up -d --build
```
Open http://localhost:8080

## API summary

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/pets`, `GET /api/pets/:id` (public)
- `GET /api/pets/mine`, `POST /api/pets`, `PUT /api/pets/:id`, `DELETE /api/pets/:id` (shelter/admin; ownership checked)
- `POST /api/applications` (adopter), `GET /api/applications/mine` (adopter), `GET /api/applications/shelter` (shelter), `PATCH /api/applications/:id/status` (pet owner/admin), `DELETE /api/applications/:id` (adopter)
- `GET /api/admin/stats`, `GET /api/admin/users`, `PATCH /api/admin/users/:id/approve`, `DELETE /api/admin/users/:id` (admin)
