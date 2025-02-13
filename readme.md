# AI Code Reviewer

AI Code Reviewer is a web application that allows users to submit code and receive AI-generated reviews. The project is built using **React, Express, Node.js, MySQL, and Prisma ORM**. The AI reviews are powered by **Google Gemini Flash 2.0 API**.

## 🚀 Features

- **User Authentication** (Register/Login) using JWT & bcrypt
- **AI-Powered Code Review** using Google Gemini Flash 2.0 API
- **Code Editor** with syntax highlighting
- **View & Manage Past Reviews**
- **Secure API with Token-Based Authentication**
- **Professional UI using Tailwind CSS**

## 🛠️ Tech Stack

### Frontend:

- React.js
- Tailwind CSS
- React Router
- Axios
- Prism.js (for code highlighting)

### Backend:

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT (Authentication)
- Bcrypt.js (Password Hashing)

### AI Integration:

- Google Gemini Flash 2.0 API

## 📌 Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/abdul-wahab619/ai-code-reviewer.git
cd ai-code-reviewer
```

### 2️⃣ Backend Setup

#### Install dependencies:

```sh
cd backend
npm install
```

#### Set up `.env` file:

Create a `.env` file in the **backend** directory with the following variables:

```env
DATABASE_URL=mysql://root:password@localhost:3306/code-reviewer
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

#### Run Prisma Migrations:

```sh
npx prisma migrate dev --name init
```

#### Start the backend server:

```sh
npm start
```

Backend will run on `http://localhost:3000`.

### 3️⃣ Frontend Setup

#### Install dependencies:

```sh
cd frontend
npm install
```

#### Start the frontend server:

```sh
npm run dev
```

Frontend will run on `http://localhost:5173`.

## 📡 API Endpoints

### **Auth Routes**

| Method | Route          | Description          |
| ------ | -------------- | -------------------- |
| POST   | /auth/register | Register a new user  |
| POST   | /auth/login    | Login user & get JWT |

### **AI Review Routes**

| Method | Route                | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | /ai/get-review       | Submit code & get AI review |
| GET    | /ai/past-prompts     | Get past reviews            |
| DELETE | /ai/past-prompts/:id | Delete a past review        |
| PUT    | /ai/past-prompts/:id | Update a past review        |

## 📷 Screenshots

![AI Code Reviewer](/interface/AI-Code-Reviewer.png)

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
