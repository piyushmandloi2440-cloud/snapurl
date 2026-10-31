# SnapURL - MERN Stack URL Shortener Web Application

A full-stack URL Shortener web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). This project provides fast URL shortening with unique 6–8 character short codes, instant HTTP 302 redirection, real-time click tracking, collision-free code generation, and a responsive UI.

---

## 🚀 Features

- **URL Shortening**: Generates unique, compact alphanumeric short codes (6–8 chars) using cryptographic random bytes.
- **Strict Validation**: Validates all incoming URLs (requires valid `http://` or `https://` protocol).
- **Collision-Free Architecture**: Automatically checks MongoDB to avoid code duplicates.
- **Instant Redirection**: Fast HTTP 302 redirects from `http://localhost:5000/:shortCode` to the target destination.
- **Click Analytics & Tracking**: Automatically increments click count on every redirect.
- **Stats Endpoint & Modal**: Detailed link analytics (`GET /api/stats/:shortCode`) showing total clicks, target destination, and creation timestamp.
- **Link Management Dashboard**: Interactive table of shortened links with search/filter, quick copy button, test redirect, and deletion options.
- **QR Code Support**: Instant QR code generation for scanning and opening shortened links on mobile devices.
- **Modern, Responsive UI**: Dark-mode glassmorphic theme with animated feedback, loading spinners, and mobile layout support.

---

## 🛠️ Technology Stack

### Backend
- **Node.js** & **Express.js**: RESTful API server following MVC architecture.
- **MongoDB** & **Mongoose**: Database and ODM for schema modeling and indexing.
- **dotenv**: Environment variable management.
- **cors**: Cross-Origin Resource Sharing.
- **nodemon**: Development auto-reloading.

### Frontend
- **React.js (React 19)**: Component-based UI.
- **Vite**: Ultra-fast build tool and development server.
- **Modern CSS**: Custom responsive design system with CSS variables, animations, and gradients.
- **JetBrains Mono & Plus Jakarta Sans**: Typography.

---

## 📂 Project Structure

```text
url_shortner/
│
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection handler
│   ├── models/
│   │   └── Url.js                # Mongoose schema (originalUrl, shortCode, clicks, createdAt)
│   ├── controllers/
│   │   └── urlController.js      # Business logic (shorten, redirect, stats, list, delete)
│   ├── routes/
│   │   └── urlRoutes.js          # Express route definitions
│   ├── .env                      # Local environment configuration
│   ├── .env.example              # Example environment template
│   ├── server.js                 # Express server entry point
│   └── package.json              # Server dependencies and scripts
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── UrlForm.jsx       # URL input form with validation and quick samples
│   │   │   ├── UrlResult.jsx     # Result display card with copy & QR code
│   │   │   ├── UrlHistory.jsx    # Table of shortened URLs with search and actions
│   │   │   ├── StatsModal.jsx    # Link analytics and stats modal dialog
│   │   │   └── Footer.jsx        # Footer component
│   │   ├── App.jsx               # Main React application component
│   │   ├── App.css               # Complete stylesheet & responsive styles
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html                # HTML template with fonts and favicon
│   ├── vite.config.js            # Vite configuration and API proxy
│   └── package.json              # Client dependencies and build scripts
│
└── README.md                     # Project documentation
```

---

## ⚙️ Environment Configuration

In the `server` directory, create or check your `.env` file (copied from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/url_shortener
BASE_URL=http://localhost:5000
```

> **Note on MongoDB**:
> - If running MongoDB locally, use: `mongodb://127.0.0.1:27017/url_shortener`
> - If using MongoDB Atlas (cloud), replace `MONGO_URI` with your connection string:  
>   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/url_shortener?retryWrites=true&w=majority`

---

## 🏃 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher installed)
- **MongoDB** (local service or MongoDB Atlas cluster)

---

### 2. Run the Backend Server

Open a terminal window and navigate to the `server` directory:

```bash
cd server
npm run dev
```

*Or run with standard Node:*
```bash
npm start
```

You should see:
```text
🚀 Server running on port 5000
📡 Base URL: http://localhost:5000
✅ MongoDB Connected successfully: 127.0.0.1
```

---

### 3. Run the Frontend Client

Open a **separate terminal window** and navigate to the `client` directory:

```bash
cd client
npm run dev
```

The frontend will start at:
```text
http://localhost:5173
```

Open `http://localhost:5173` in your web browser.

---

## 📡 API Endpoints

### 1. Generate a Short URL
- **Method**: `POST`
- **Endpoint**: `/api/shorten`
- **Request Body**:
  ```json
  {
    "originalUrl": "https://example.com/very/long/article/path"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Short URL generated successfully!",
    "data": {
      "_id": "6723223...",
      "originalUrl": "https://example.com/very/long/article/path",
      "shortCode": "k9xL2a",
      "shortUrl": "http://localhost:5000/k9xL2a",
      "clicks": 0,
      "createdAt": "2026-10-31T08:00:00.000Z"
    }
  }
  ```

---

### 2. Redirect to Original URL
- **Method**: `GET`
- **Endpoint**: `/:shortCode` (e.g. `http://localhost:5000/k9xL2a`)
- **Behavior**: Increments the `clicks` counter in MongoDB and redirects with HTTP 302 to `originalUrl`. If the short code does not exist, returns a 404 response.

---

### 3. Get URL Analytics / Stats
- **Method**: `GET`
- **Endpoint**: `/api/stats/:shortCode` (e.g. `http://localhost:5000/api/stats/k9xL2a`)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "_id": "6723223...",
      "originalUrl": "https://example.com/very/long/article/path",
      "shortCode": "k9xL2a",
      "shortUrl": "http://localhost:5000/k9xL2a",
      "clicks": 14,
      "createdAt": "2026-10-31T08:00:00.000Z"
    }
  }
  ```

---

### 4. Get All Shortened URLs
- **Method**: `GET`
- **Endpoint**: `/api/urls`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "count": 5,
    "data": [ ... ]
  }
  ```

---

### 5. Delete a Shortened URL
- **Method**: `DELETE`
- **Endpoint**: `/api/urls/:id`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Shortened URL deleted successfully."
  }
  ```

---

## 🧪 Testing Checklist

1. **Shorten a valid URL**:
   - Paste `https://github.com` into the input and click **Shorten URL**.
   - Verify that the short URL appears with a copy button and QR code.
2. **Test Copy Button**:
   - Click **Copy**; verify the feedback changes to **Copied!** and the URL is copied to the clipboard.
3. **Test Redirection & Click Tracking**:
   - Click the short link or open it in a new browser tab.
   - Verify that it redirects to `https://github.com`.
   - Refresh the page or click **Refresh** on the dashboard; verify the click count increments to 1.
4. **Test URL Validation**:
   - Try submitting `invalid-url-string` or an empty input.
   - Verify that a clear validation error is displayed without crashing.
5. **Test 404 Handling**:
   - Visit `http://localhost:5000/nonExistentCode123`.
   - Verify the custom 404 page is displayed.
