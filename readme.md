# Inventory Stock Management

A full-stack inventory management system to manage product stocks, stock-in/out operations, and invoicing with transactional consistency.

## 🛠 Tech Stack

- **Frontend:** React.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript, Zod
- **Database:** MongoDB (with transaction support using replica set)
- **Deployment:** Vercel (frontend), Render (backend)

## ✨ Features

### 📦 Product Management

- Create products with fields: `productId`, `name`, `category`, `unit`, `initialStock`, and `price`
- Unique and required product ID support

### 🔁 Stock In/Out Operations

- **Stock-In:** Add stock with metadata (`source`, `remarks`)
- **Stock-Out:** Decrease stock with `reason` and `remarks`
- Maintain logs for all stock changes

### 🧾 Invoicing System

- Create Invoice (automatically decreases stock)
- Cancel Invoice (automatically restores stock)
- Prevent invoice creation if stock is insufficient
- Invoices include customer name, products, and quantity

### 🔒 MongoDB Transactions

- Ensures atomicity and consistency
- Invoice creation and stock update operations are performed inside MongoDB transactions
- Prevents stock inconsistencies even with concurrent requests

## ⚙️ MongoDB Replica Set Setup (Required for Transactions)

MongoDB transactions require a replica set even on a local machine or single-node server. Here's how to enable it:

1. Stop your MongoDB service:  
   `sudo systemctl stop mongosh`

2. Start MongoDB with replica set enabled:  
   `mongosh --replSet rs0 --bind_ip localhost`

3. Open a new terminal and run:  
   `mongosh`

4. Initialize the replica set:  
   `rs.initiate()`

Once initialized, your single-node replica set is ready for transactions.

## 🧪 Environment Setup

### Backend `.env` example:

```
PORT=your_backend_port
MONGO_URI=your_mongodb_url
CLIENT_URL=your_frontend_url
```

### Frontend `.env` example:

```
VITE_API_BASE_URL=your_backend_url
```

Replace URLs accordingly for production deployments.

## 🚀 Project Setup

### Backend:

```
cd server
npm install
npm run dev
```

### Frontend:

```
cd client
npm install
npm run dev
```

## 🌐 Deployment

- Frontend is deployed on Vercel
- Backend is deployed on Render

## 🔗 Useful Links

- Live App: [Inventory Management](https://inventory-management-phi-sandy-77.vercel.app/)
