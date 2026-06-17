
# Stock Reservation System (Full Stack)

A full-stack inventory reservation system built for a technical assessment.  
The system allows users to view products, reserve stock, handle expiration, and complete checkout while ensuring correct inventory management.

---

## Tech Stack

### Backend
- NestJS (TypeScript)
- PostgreSQL
- TypeORM
- Node.js
- Cron Jobs (reservation expiration)

### Frontend
- React (TypeScript)
- Axios
- React Router
- Basic UI (Dashboard Style)

---

## Features

### Product Management
- View available products
- Track stock in real-time

### Reservation System
- Reserve product with quantity
- Prevent overbooking using stock validation
- Automatic stock deduction on reservation

### Expiration System
- Reservations expire after a fixed time (e.g. 5 minutes)
- Expired reservations restore stock automatically (cron job)

### Checkout System
- Complete reservation
- Mark reservation as COMPLETED

### Multi-user Support
- Select user before making reservation
- Each reservation linked to a user

---

## Architecture Decisions

- Used **NestJS modules (Products, Users, Reservations)** for separation of concerns
- Used **TypeORM relations** for data integrity
- Implemented **cron job** to handle expired reservations
- Used **PostgreSQL** for relational consistency (foreign keys)
- Simple React frontend to focus on logic over UI complexity

---

## Assumptions

- No authentication system (users are pre-seeded / selected manually)
- Reservation timeout is fixed (5 minutes)
- Single stock field used for simplicity
- System assumes trusted frontend input

---

##  Trade-offs

- No JWT authentication (to focus on core logic)
- No Redis queue (used cron instead for simplicity)
- Basic UI instead of advanced design system
- No real-time WebSockets

---

## Improvements (If More Time)

- Add authentication (JWT + roles)
- Add Redis queue for reservation expiration
- Add WebSocket real-time stock updates
- Improve UI 

---

## System Flow

1. User selects a product
2. User selects quantity
3. System checks stock availability
4. Reservation created
5. Stock is reduced immediately
6. Reservation expires or is checked out
7. Stock is restored or finalized

---

## How to Run

```bash
### Backend

cd stock-backend
npm install
npm run start:dev

---
### Frontend

cd stock-frontend
npm install
npm run dev