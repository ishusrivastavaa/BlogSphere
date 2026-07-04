# BlogSphere 🌐

BlogSphere is a modern, full-stack, role-based blogging platform designed for seamless writing, content curation, and administration. It features a responsive React frontend powered by Vite and Tailwind CSS, coupled with a robust Express & Node.js backend utilizing MongoDB for data persistence.

---

## 🚀 Features

### **For Visitors / Readers**
- **Explore Articles**: Browse through a feed of published blogs.
- **Search & Filter**: Find blogs by title, tags, or categories.
- **Read Mode**: View clean and distraction-free blog details with banner images, tags, and formatting.

### **For Authors (Registered Users)**
- **User Authentication**: Secure Sign Up & Sign In with JWT and password encryption.
- **Personal Dashboard**: View authored blogs, stats, and easily manage existing posts.
- **Rich Creation & Editing**: Create blog posts with titles, categories, custom tags, and a cover image upload.
- **Interactive Profiles**: Update profile information, change passwords, and upload custom profile pictures.

### **For Administrators**
- **Admin Dashboard**: Comprehensive stats and administration control panels.
- **User Management**: Monitor users, block/unblock accounts to restrict access, and permanently delete users.
- **Content Moderation**: View all platform blogs and moderate by deleting any offensive or violating posts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Framer Motion, React Router DOM v7, Phosphor Icons, React Icons |
| **Backend** | Node.js, Express.js (v5), Multer (file upload processing) |
| **Database** | MongoDB, Mongoose (v9) |
| **Security & Auth** | JSON Web Tokens (JWT), BcryptJS (password hashing), Custom Auth/Admin Middlewares |

---

## 📂 Directory Structure

```text
BlogSphere/
├── Readme.md                    # Project-level documentation (this file)
└── blogSphere/
    ├── client/                  # Frontend Application
    │   ├── src/
    │   │   ├── components/      # Shared components (Navbar, Footer, BlogCard, Routes)
    │   │   ├── context/         # AuthContext provider for global auth state
    │   │   ├── pages/           # Page views (Home, Explore, Dashboard, Admin, Profile, etc.)
    │   │   ├── services/        # API service layer (fetch calls wrapper)
    │   │   ├── App.jsx          # Route configurations
    │   │   ├── main.jsx         # Application entry point
    │   │   └── index.css        # Tailwind styles and styling overrides
    │   ├── package.json         # Frontend configuration & dependencies
    │   └── vite.config.js       # Vite bundler options & API proxies
    │
    └── server/                  # Backend Application
        ├── config/              # MongoDB connection setups
        ├── controllers/         # Logic handlers for Admin, Auth, Blog, and Users
        ├── middleware/          # JWT verifying and Multer image uploading middlewares
        ├── models/              # Mongoose schemas (User, Blog)
        ├── routes/              # Express route declarations
        ├── server.js            # App bootstrap, route mounting, and server listener
        ├── uploads/             # Static file storage folder (profile pictures & banners)
        └── package.json         # Backend configurations, scripts, and dependencies
```

---

## 🔌 API Endpoints Reference

### **Authentication (`/api/auth`)**
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate and retrieve token.

### **Blog Management (`/api/blog`)**
- `GET /api/blog/all` - Retrieve all blog posts.
- `GET /api/blog/:id` - Fetch details of a single blog post.
- `POST /api/blog/create` - Create a new blog post *(auth required, supports image upload)*.
- `PUT /api/blog/update/:id` - Modify an existing blog post *(auth/author required, supports image upload)*.
- `DELETE /api/blog/delete/:id` - Remove a blog post *(auth/author required)*.

### **User Profiles (`/api/user`)**
- `GET /api/user/profile` - Fetch the authenticated user's profile info *(auth required)*.
- `PUT /api/user/update-profile` - Modify name, email, or profile photo *(auth required, supports image upload)*.
- `GET /api/user/my-blogs` - List all blogs authored by the logged-in user *(auth required)*.

### **Administration (`/api/admin`)**
- `GET /api/admin/users` - List all registered users *(admin required)*.
- `PUT /api/admin/toggle-block/:id` - Toggle the blocked state of a user *(admin required)*.
- `DELETE /api/admin/delete-user/:id` - Delete a user account permanently *(admin required)*.
- `GET /api/admin/blogs` - List all blogs across the platform *(admin required)*.
- `DELETE /api/admin/delete-blog/:id` - Force delete any blog post *(admin required)*.

---

## ⚙️ Setup & Installation

### **Prerequisites**
- **Node.js** (v18.x or above recommended)
- **MongoDB** (running instance locally or via MongoDB Atlas)

### **1. Configure Backend Server**
Navigate to the server directory:
```bash
cd blogSphere/server
```

Create a `.env` file inside `blogSphere/server/` and fill in the following parameters:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bloggingPlatform
JWT_SECRET=your_jwt_secret_key_here
```

Install dependencies and start the backend development server:
```bash
npm install
npm run dev
```
The server will boot on port `5000` (or the custom port specified in your `.env`).

### **2. Configure Frontend Client**
Open a new terminal and navigate to the client directory:
```bash
cd blogSphere/client
```

Install packages and run the frontend development server:
```bash
npm install
npm run dev
```
The Vite development server will start (typically on `http://localhost:5173`). Vite is configured to proxy all `/api` and `/uploads` requests automatically to the backend server running at `http://localhost:5000`.

---

## 📝 License
This project is open-source. Feel free to clone, modify, and build upon it!
