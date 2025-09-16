# Quickstart

Isomorphic package for React+Express projects

Implements simple GitHub auth based app.

## Installation
```bash
npm i @diplodoc/www-quickstart
```

## Usage

Attach routing to server
```js
import {router as quickstart} from '@diplodoc/www-quickstart'

express.use(quickstart);
```

Publish static to CDN
```bash
s3cmd sync ./node_modules/@diplodoc/quickstart s3:/some/static/root
```

## Development

### Requirements

- Node.js >= 18
- npm workspaces support
- HAProxy (auto-installed via [proxy/start](proxy/start) script)

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd www-quickstart
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp server/.env-template server/.env
   ```

   Edit `server/.env` and set required values:
   - `GITHUB_CLIENT_ID_DEV` - GitHub OAuth App Client ID for development
   - `GITHUB_CLIENT_SECRET_DEV` - GitHub OAuth App Client Secret for development
   - `COOKIE_SECRET` - Random string for cookie encryption
   - `CSRF_SECRET` - Random string for CSRF protection
   - Other cloud/S3 credentials as needed

3. **Start development servers:**
   ```bash
   npm run dev
   ```

   This starts:
   - Client dev server (webpack-dev-server) on port 3001
   - Server dev server (nodemon) on port 3000
   - Proxy server (HAProxy) on port 8080

4. **Access the application:**
   - Development: http://localhost:8080
   - Client only: http://localhost:3001
   - Server only: http://localhost:3000

### Project Structure

```
├── client/          # React frontend (TypeScript + Webpack)
├── server/          # Express backend (Node.js)
├── proxy/           # HAProxy configuration
├── deploy/          # Deployment configs
└── scripts/         # Utility scripts
```

### Available Scripts

- `npm run dev` - Start all development servers
- `npm run build:client` - Build client for production
- `npm start` - Start production server
- `npm run secrets` - Setup secrets (if configured)
