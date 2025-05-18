Blog Platform
A full-stack blog platform for creating, editing, and managing blogs with user authentication and profile photo uploads.
Tech Stack
Frontend

React (^18.2.0)
React Router (^6.11.0)
Redux Toolkit (^1.9.5)
Axios (^1.4.0)
React Hot Toast (^2.4.1)
React Icons (^4.8.0)
Tailwind CSS (^3.3.2)
Vite (^4.3.9)

Backend

Node.js (^18.x)
Express (^4.18.2)
MongoDB (^5.0)
Mongoose (^7.0.0)
JSON Web Token (^9.0.0)
Multer (^1.4.5)
Cloudinary (^1.37.0)
Bcrypt (^5.1.0)

Development Tools

Nodemon (^2.0.22)
ESLint (^8.38.0)
Prettier (^2.8.7)

Setup Instructions
Prerequisites

Node.js: Version 18.x or higher (Download)
MongoDB: Local instance or MongoDB Atlas (Setup)
Cloudinary Account: For image uploads (Sign Up)
Git: For cloning the repository (Download)

Clone the Repository
git clone https://github.com/your-username/blog-platform.git
cd blog-platform

Backend Setup

Navigate to the backend directory:cd backend


Install dependencies:npm install


Create a .env file in backend with:PORT=8000
MONGODB_URI=mongodb://localhost:27017/blog_platform
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret


Replace your_jwt_secret_key with a random string (e.g., generate with node -e "console.log(require('crypto').randomBytes(32).toString('hex'))").
Get Cloudinary credentials from your Cloudinary dashboard.



Frontend Setup

Navigate to the frontend directory:cd frontend


Install dependencies:npm install


Create a .env file in frontend with:VITE_API_BASE_URL=http://localhost:8000/api



Running the Application

Start MongoDB (if local):mongod


Start Backend:cd backend
npm start


Runs on http://localhost:8000.


Start Frontend:cd frontend
npm start


Runs on http://localhost:5173.


Open http://localhost:5173 in your browser.

