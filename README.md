# 🛍️ Product Management App

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing products, including features like image upload, search, filter, pagination, and CRUD operations.

## ✨ Features

- Add, edit, and delete products
- Upload and preview product images (supports JPG, PNG, WEBP)
- Client-side and server-side validation
- Product search and filtering by category
- Paginated product listing
- Responsive and user-friendly UI
- Backend file upload using `multer`

---

## 🧰 Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- Redux Toolkit (for state management)
- Axios (API requests)
- Lucide Icons
- Toast notifications

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer (for image uploads)
- dotenv
- CORS & Cookie support

---

## 📦 Installation

### 1. Clone the repository

Backend
git clone https://github.com/Abinsaj/QuickStock-Backend.git

Frontend
git clone https://github.com/Abinsaj/QuickStock-Frontend.git

## Backend Setup
cd backend
npm install

# Create a .env file
PORT=5678
MONGODB_URI=your_mongo_connection_string
CLIENT_URL=http://localhost:5173

# Start the server
npm run dev


## Frontend Setup
cd ../frontend
npm install

# Create a .env file
VITE_BACKEND_URL=http://localhost:5000

# Start the dev server
npm run dev


## 📤 API Overview

Base URL: http://localhost:5000/api
* GET /products - List products (supports query params for search, filter, pagination)

* POST /products - Add new product (with image)

* PUT /products/:id - Update product

* DELETE /products/:id - Delete product

* GET /products/:id - Get product details

Images are uploaded as multipart/form-data using multer


## 📁 Folder Structure

/frontend
  /src
    /components        
    /pages            
    /redux            
    /services        
    /utils          
    /config           

/backend
  /src
    /controllers         
    /routes              
    /models              
    /middleware          
    /config                           
    /repository          
    /service     


## 🛡️ Validations
Frontend: Enforces max image size (3MB), file types (jpg/png/webp), required fields

Backend: Rejects invalid file types/sizes via multer, validates required fields        





