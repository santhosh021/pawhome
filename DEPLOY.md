# Deploy PawHome with GitHub + Portainer

## What Docker does here (simple terms)
- An **image** is a packed copy of one program with everything it needs.
- A **container** is a running image.
- A **stack** (docker-compose.yml) starts several containers together. PawHome has 3:
  - `mongo`: the database
  - `server`: the Express API
  - `client`: nginx serving the React app and forwarding `/api` and `/uploads` to `server`
- A **volume** keeps data when containers are replaced: `mongo_data` (database) and `uploads_data` (pet photos).

## 1. Push to GitHub
```
cd pawhome
git init
git add .
git commit -m "PawHome MERN app"
git branch -M main
git remote add origin https://github.com/<your-username>/pawhome.git
git push -u origin main
```
`.env` is in `.gitignore`, so secrets are not pushed.

## 2. Create the stack in Portainer
1. Portainer > **Stacks** > **Add stack**
2. Name: `pawhome`
3. Build method: **Repository**
4. Repository URL: your GitHub URL (add authentication if the repo is private)
5. Repository reference: `refs/heads/main`
6. Compose path: `docker-compose.yml`
7. **Environment variables** (add each):

| Name | Example |
|---|---|
| `MONGO_PASSWORD` | letters and numbers only |
| `JWT_SECRET` | long random string (e.g. from `openssl rand -hex 32`) |
| `ADMIN_EMAIL` | your admin login email |
| `ADMIN_PASSWORD` | your admin password |
| `MONGO_USER` | optional, default `pawhome` |
| `EDGE_NETWORK` | name of the shared Docker network your Cloudflare tunnel uses (default `edge`) |

8. Click **Deploy the stack**. The first build takes a few minutes.
9. In Cloudflare: Networking > Tunnels > your tunnel > Routes > Add route > Published application
   - Hostname: `pawhome` + domain `imsanthosh.tech`
   - Service URL: `http://pawhome-web:80`
10. Open https://pawhome.imsanthosh.tech and log in with the admin email and password.

## 3. Update later
Push to GitHub, then in Portainer open the stack > **Pull and redeploy** (turn on "Re-pull image / re-build" if shown). Data in the volumes is kept.

## Troubleshooting
- **Stack fails: "Set MONGO_PASSWORD"**: a required variable is missing in step 7.
- **Network edge not found**: the external network name in Portainer > Networks differs; set `EDGE_NETWORK` to that name.
- **Cloudflare error 502**: the tunnel container is not on the same network as `pawhome-web`, or the Service URL is wrong.
- **API cannot connect to MongoDB**: check `MONGO_PASSWORD` has no special characters, then redeploy. If you changed the password after the first start, delete the `mongo_data` volume (this erases the database) or keep the old password.
- **Logs**: Portainer > Containers > `pawhome-server-1` > Logs.
- **Check the API**: `https://pawhome.imsanthosh.tech/api/health` should show `{"status":"ok"}`.

## Test flow after deploying
1. Register a shelter account > log in as admin > Admin page > approve it.
2. As shelter: add a pet with a photo.
3. Register an adopter in another browser > apply for the pet.
4. As shelter: approve the application; the pet becomes `adopted`.
