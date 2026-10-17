# Expense Tracker

A full-stack web application to track income and expenses, view financial summaries, and visualize spending with charts. Each user has a private account protected by JWT authentication.


## ✨ Features

- **User authentication** - Register, log in, and log out with JWT
- **Protected routes** - Only logged-in users can view their data
- **Income and expense tracking** - Add, edit, and delete transactions
- **Dashboard** - Balance, total income, total expenses, and recent transactions
- **Filters** - Filter transactions by type, category, and date range
- **Reports** - Pie chart of expenses by category and bar chart of monthly income vs expenses
- **Data privacy** - Users can only access their own transactions
- **Consistent API responses and error messages**

## 🛠️ Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios, Recharts

**Backend:** Node.js, Express, MongoDB (Atlas), Mongoose, JSON Web Tokens, bcryptjs


## 📂 Project Structure

```
expense-tracker-3/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
└── server/
    └── src/
        ├── db/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── utils/
        ├── app.js
        └── index.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- A MongoDB database 

### 1. Clone the repository
```bash
git clone https://github.com/Swati-Vishwa/expense-tracker-web-application-3
cd expense-tracker-web-application-3
```

### 2. Set up the backend
```bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in your own values:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

Start the server:
```bash
npm run dev
```
The API runs at `http://localhost:3000`.

### 3. Set up the frontend
Open a second terminal:
```bash
cd client
npm install
```

Copy `.env.example` to `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

Start the app:
```bash
npm run dev
```
The app runs at `http://localhost:5173`.

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account | No |
| POST | `/api/auth/login` | Log in and receive a token | No |
| GET | `/api/auth/me` | Get the current user | Yes |

### Transactions
All transaction routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | List transactions (filters: `type`, `category`, `startDate`, `endDate`, `limit`) |
| POST | `/api/transactions` | Add a transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/transactions/summary` | Totals, category breakdown, and monthly data |

## 🔒 Security Notes

- Passwords are hashed with bcrypt and never returned by the API.
- Every transaction query is scoped to the logged-in user.
- Secrets are stored in `.env`, which is excluded from Git.

## 🔮 Possible Improvements

- Store the token in an httpOnly cookie instead of localStorage
- Budget limits and alerts
- Export reports as CSV or PDF
- Recurring transactions

## 📄 License

© 2026 Swati Vishwakarma. All rights reserved.
This repository is public for review and portfolio purposes.