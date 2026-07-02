# MERN Authentication System

A full-stack authentication system built using the MERN stack. It provides secure user authentication with email verification, login, password reset, and JWT-based authorization.

## 🚀 Features

- User Registration
- User Login
- JWT Authentication
- Email Verification (OTP)
- Forgot Password
- Password Reset
- Protected Routes
- MongoDB Database
- Secure Password Hashing with bcrypt

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer

## 📁 Project Structure

```
Mern-Auth/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── .gitignore
```

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/mondalpoulomi-26/Mern-Auth-repo.git
```

### Install dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd server
npm install
```

### Create Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Run the project

Backend

```bash
cd server
npm run server
```

Frontend

```bash
cd client
npm run dev
```

## 📸 Screenshots

You can add screenshots of:
- Login Page
- Register Page
- Email Verification
- Forgot Password
- Reset Password

## 📌 Future Improvements

- Google Authentication
- GitHub Authentication
- User Profile
- Dark Mode
- Refresh Token Authentication

## 👩‍💻 Author

**Poulomi Mondal**

GitHub: https://github.com/mondalpoulomi-26

LinkedIn: *(Add your LinkedIn profile link here)*

---

⭐ If you found this project useful, please consider giving it a star.
