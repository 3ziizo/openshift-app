# Full-Stack OpenShift Application

A complete full-stack application with React frontend, Node.js backend, and PostgreSQL database, designed for deployment on OpenShift.

## Architecture
- **Frontend**: React application running on port 8080
- **Backend**: Node.js/Express REST API 
- **Database**: PostgreSQL with automatic schema creation
- **Deployment**: OpenShift with S2I builds

## Local Development

### Prerequisites
- Node.js 14+ and npm
- Docker (optional)
- OpenShift CLI (`oc`)

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## OpenShift Deployment

### Quick Deploy
```bash
# Deploy database
oc new-app postgresql-persistent \
  --param=POSTGRESQL_USER=appuser \
  --param=POSTGRESQL_PASSWORD=secure123 \
  --param=POSTGRESQL_DATABASE=appdb

# Deploy backend
oc new-app nodejs~https://github.com/YOUR_USERNAME/fullstack-openshift-app#main \
  --context-dir=backend --name=backend
oc expose service/backend

# Deploy frontend
oc new-app nodejs~https://github.com/YOUR_USERNAME/fullstack-openshift-app#main \
  --context-dir=frontend --name=frontend
oc expose service/frontend
```

### Template Deployment
```bash
oc create -f openshift/fullstack-template.yaml
oc new-app fullstack-app-template
```

## Environment Variables

### Backend (.env)
```
POSTGRESQL_SERVICE_HOST=localhost
POSTGRESQL_SERVICE_PORT=5432
POSTGRESQL_USER=appuser
POSTGRESQL_PASSWORD=secure123
POSTGRESQL_DATABASE=appdb
```

### Frontend (.env)
```
PORT=8080
REACT_APP_API_URL=http://localhost:8080/api
```
