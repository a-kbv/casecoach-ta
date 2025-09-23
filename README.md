# casecoach-ta
A full-stack application for managing web technologies with filtering, searching, and CRUD operations. Designed to display my abilities to CaseCoach team.

## Requirements

- Node.js (v16 or higher)
- npm

## Installation

### 1.Clone the repository

### 2.Install the dependencies


```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Run the application

**Terminal 1 - Backend:**

```bash
cd backend
npm run build
npm start
```

Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run build
ng serve
```

Frontend runs on `http://localhost:4200`

## Backend

- **Framework**: Node.js with Express
- **Data**: JSON file-based storage located in `backend/data.json`

### FuLL REST API Endpoints  (All CRUD operations are supported)

- `GET /api/technologies` - Get all technologies
- `GET /api/technologies/:id` - Get technology by id
- `POST /api/technologies` - Create new technology
- `PUT /api/technologies/:id` - Update technology
- `PATCH /api/technologies/:id` - Update technology
- `DELETE /api/technologies/:id` - Delete technology

## Frontend

- **Framework**: Angular 20

### Features

- Technology list with filtering, searching and sorting options
- Create/edit technology forms
- Responsive design
