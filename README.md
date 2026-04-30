# CreativeHub Wedding - Full Stack Setup

This project consists of:
- **Frontend**: Static HTML site (deploy to Cloudflare Pages)
- **Backend**: Node.js + Express + SQLite API (deploy to Railway/Render)

## Project Structure

```
/sites
├── idnex.htm          # Main wedding site
├── admin-api.html     # Admin panel (connects to API)
├── admin.html         # Old localStorage-based admin (backup)
└── wedding-backend/   # Node.js API server
    ├── server.js
    ├── package.json
    ├── db/
    │   └── database.js
    ├── routes/
    │   ├── auth.js
    │   ├── dates.js
    │   ├── photos.js
    │   └── contact.js
    └── middleware/
        └── auth.js
```

## Quick Start (Local Development)

### 1. Start the Backend

```bash
cd wedding-backend
cp env.example .env   # Create environment file
npm install           # Install dependencies
npm run dev           # Start with auto-reload (or npm start)
```

The API will run at `http://localhost:3000`

### 2. Open the Frontend

Open `idnex.htm` in your browser (or use Live Server in VS Code).

### 3. Access Admin Panel

Open `admin-api.html`, set the API URL to `http://localhost:3000`, and login:
- Username: `admin`
- Password: `admin123` (change in .env file)

## Deployment

### Backend → Railway (Recommended)

1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repo or use Railway CLI
3. Set environment variables:
   - `JWT_SECRET` - Random string (use `openssl rand -hex 32`)
   - `ADMIN_PASSWORD` - Your admin password
   - `FRONTEND_URL` - Your Cloudflare Pages URL
4. Railway will auto-detect Node.js and deploy

**Railway CLI:**
```bash
cd wedding-backend
railway login
railway init
railway up
```

### Backend → Render (Alternative)

1. Create account at [render.com](https://render.com)
2. New → Web Service → Connect repo
3. Settings:
   - Build: `npm install`
   - Start: `npm start`
4. Add environment variables in dashboard

### Frontend → Cloudflare Pages

1. Create account at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub repo or upload directly
3. Build settings:
   - Build command: (leave empty - static site)
   - Output directory: `/` (or where your HTML files are)

### Update Frontend API URL

After deploying the backend, update the API URL in `idnex.htm`:

```javascript
// Line ~5 in the script section
const API_URL = 'https://your-backend.railway.app';
```

Or set it dynamically in the admin panel.

## API Endpoints

### Public
- `GET /api/dates` - Get booked/available dates
- `GET /api/photos` - Get gallery photos
- `POST /api/contact` - Submit contact form
- `GET /api/health` - Health check

### Protected (requires JWT token)
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/change-password` - Change password
- `POST /api/dates` - Add/update date
- `DELETE /api/dates/:date` - Remove date
- `POST /api/photos/url` - Add photo by URL
- `POST /api/photos/upload` - Upload photo file
- `DELETE /api/photos/:id` - Delete photo
- `GET /api/contact` - Get all submissions
- `PUT /api/contact/:id/read` - Mark as read
- `DELETE /api/contact/:id` - Delete submission

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT signing key | (weak default) |
| `ADMIN_PASSWORD` | Initial admin password | admin123 |
| `FRONTEND_URL` | CORS allowed origin | * |

## Security Notes

1. **Change the default password** immediately
2. **Set a strong JWT_SECRET** in production
3. **Configure CORS** properly (set FRONTEND_URL)
4. Consider adding rate limiting for production
5. Use HTTPS in production (handled by Railway/Render)

## Backup

The SQLite database is stored at `wedding-backend/db/wedding.db`. 

For Railway/Render, consider using a persistent volume or external database (PostgreSQL) for production data that persists across deployments.
