# 🏨 Middle East Booking

A full-stack hotel booking platform that allows users to search hotels, view available room categories, select specific physical rooms, and complete secure bookings.

The application is built using the MERN stack and implements backend-controlled booking logic with MongoDB transactions to prevent inconsistent bookings and partial database updates.

---

# 📌 Features
## User Authentication

- User registration and login functionality.
- JWT-based authentication.
- Protected booking routes using authentication middleware.
- Users can:
  - Create an account.
  - Login securely.
  - View personalized navigation state.
  - Logout from the application.

## Hotel Search & Navigation

Users can:
- Search hotels based on destination.
- Select check-in and check-out dates using react date range calendar.
- View available hotels.
- Navigate between:
  - Home page
  - Hotel listing page
  - Login/Register pages
  - Booking modal

The navigation bar dynamically changes based on authentication state:

### Guest User
Displays:
- Register button
- Login button

### Authenticated User
Displays:
- Welcome message
- Username
- Logout button

---

## 🛠 Tech Stack

| Category | Technologies |
| -------- | ------------ |
| **Frontend** | React.js, React Router DOM, Context API, Axios, React Date Range, Font Awesome, CSS |
| **Backend** | Node.js, Express.js, REST APIs |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication** | JWT (JSON Web Token), Protected Routes |
| **State Management** | React Context API |
| **HTTP Client** | Axios |
| **Development Tools** | Git, GitHub, npm |

---

## Techniques used for handling double booking conflicts:-                      
- Backend controller handles complete booking logic with conflict detection using room availability
- MongoDB Transactions used that follows ACID principles
- Rollback on failure                 
- Prevent partial updates       
- Prevents race conditions up to some extent
- Frontend does not update room availability

```
startTransaction()
↓
Generate dates
↓
findOne(...)
↓
Booking.create(...)
↓
commitTransaction()
```

If booking creation fails:
```
startTransaction()
↓
Reserve room
↓
Create booking
↓
ERROR
↓
abortTransaction()
↓
MongoDB removes room update
```

## Schema
```
Hotel
|
|
+---- Luxurious Rooms
|          |
|          +---- Room 101
|          +---- Room 102
|
|
+---- Standard Rooms
           |
           +---- Room 201
           +---- Room 202
```

![Screenshot 2024-08-18 194843](https://github.com/user-attachments/assets/59e75557-dc66-472c-8279-b0fc72b95962)


![Screenshot 2024-08-18 194913](https://github.com/user-attachments/assets/4040349a-17ed-4dd0-a2b3-dd92ecfb5dff)


![Screenshot 2024-08-18 195006](https://github.com/user-attachments/assets/46b3f9dc-9fdd-4910-9c7a-b392362981e2)
