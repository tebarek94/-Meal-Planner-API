# Meal Planner API

A complete meal planning system with user management, dietary tracking, and admin features.

## Features

- **User Management**
  - Registration & authentication
  - Profile details management
  - Role-based access control

- **Meal Planning**
  - Create personalized meal plans
  - Track dietary goals
  - Manage allergies/preferences

- **Admin Features**
  - View pending requests
  - Assign meal plans
  - Manage all user data

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT
- **Validation**: express-validator

## API Endpoints

### User Details Routes

| Method | Endpoint           | Description                     | Auth Required |
|--------|--------------------|---------------------------------|---------------|
| GET    | /user-details      | Get current user's details      | Yes           |
| POST   | /user-details      | Create user details             | Yes           |
| PUT    | /user-details      | Update user details             | Yes           |
| GET    | /user-details/:id  | Get specific user's details     | Admin         |
| DELETE | /user-details      | Delete user details             | Yes           |

### Admin Routes

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| GET    | /admin/pending-requests| Get users needing meal plans    |
| POST   | /admin/meal-plans      | Assign meal plan to user        |
| GET    | /admin/meal-plans      | Get all meal plans              |
| PUT    | /admin/meal-plans/:id  | Update specific meal plan       |
| DELETE | /admin/meal-plans/:id  | Delete meal plan                |

## Database Schema

```sql

use mealplanner;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. User details (health/dietary info)
CREATE TABLE user_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    age INT NOT NULL,
    weight_kg DECIMAL(5,2),
    height_cm INT,
    gender ENUM('male', 'female', 'other'),
    activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') NOT NULL,
    dietary_goal ENUM('weight_loss', 'weight_gain', 'maintenance', 'muscle_build') NOT NULL,
    allergies SET('nuts', 'dairy', 'gluten', 'seafood', 'eggs', 'soy', 'none') DEFAULT 'none',
    cuisine_pref SET('italian', 'indian', 'mediterranean', 'asian', 'american', 'vegan', 'keto') DEFAULT 'american',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Meal plans (assigned by admins)
CREATE TABLE meal_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    assigned_by INT NOT NULL,
    breakfast TEXT,
    lunch TEXT,
    dinner TEXT,
    snacks TEXT,
    notes TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE
);
