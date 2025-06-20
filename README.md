
# E-Taka: E-Waste Management System

**E-Taka** is a modern, web-based platform designed to streamline e-waste management in Kenya by connecting consumers and recyclers, incentivizing proper disposal of electronic waste, and promoting environmental sustainability.

## Overview

With the growing challenge of electronic waste disposal, **E-Taka** offers an innovative digital solution by allowing:

* **Consumers** to submit e-waste disposal requests and earn rewards.
* **Recyclers** to view, pick up, and manage e-waste requests.
* **Administrators** to oversee system operations and generate reports.

## ⚙️ Features

### **Authentication**

* User registration & login (role-based: Consumer | Recycler | Admin)
* Secure password handling

### **Consumer Module**

* Submit e-waste collection requests
* Track request status in real-time
* View notifications
* Redeem reward points (KES 50 per point when request is marked *complete*)

### **Recycler Module**

* View and accept nearby e-waste requests
* Mark requests as completed
* View consumer details securely

### **Admin Module**

* Manage users and recyclers
* Oversee e-waste collection activities
* Generate system reports for sustainability metrics

###  **Multilingual Support**

* Available in **English** and **Swahili**

## Technologies Used
<<<<<<< Updated upstream

| Stack        | Tech                                             |
| ------------ | ------------------------------------------------ |
| **Backend**  | Laravel (PHP), MySQL                             |
| **Frontend** | HTML, CSS, JavaScript (AJAX Integration)         |
| **API**      | RESTful API with Laravel Controllers & Resources |
| **Database** | MySQL (XAMPP for local development)              |
| **Other**    | Auth Middleware for secured APIs             |

## Project Structure

```
E-Taka/
├── app/
├── database/
├── public/
├── resources/
│   ├── views/ (Blade templates)
│   └── js/ (AJAX & UI logic)
├── routes/ (api.php, web.php)


## Installation & Setup

### Requirements

* PHP 8+
* Composer
* MySQL / MariaDB (XAMPP recommended for local development)


### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/markgee-ui/etaka.git
   cd etaka
   ```

2. Install dependencies:

   ```bash
   composer install
   npm install && npm run dev # if using JS build tools
   ```

3. Create `.env` and configure your database:

   ```dotenv
   DB_DATABASE=etaka1(change according to your db name)
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. Generate app key & migrate database:

   ```bash
   php artisan key:generate
   php artisan migrate
   ```

5. Serve the application:

   ```bash
   php artisan serve
   ```

6. Access via: `http://localhost:8000`

## Reward System

* Every *completed* e-waste request earns the consumer **KES 50 per point**.
* Points are tracked in real-time on the **Rewards** dashboard.

##  Contribution

Want to contribute? Fork this repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

##  Contact

For inquiries, partnership, or support:

* **Email:** [ngugimark93@gmail.com](mailto:ngugimark93@gmail.com)
* **Developer:** \Ngugi Mark]

## 📄 License

This project is licensed under the MIT License.
=======

| Stack        | Tech                                             |
| ------------ | ------------------------------------------------ |
| **Backend**  | Laravel (PHP), MySQL                             |
| **Frontend** | HTML, CSS, JavaScript (AJAX Integration)         |
| **API**      | RESTful API with Laravel Controllers & Resources |
| **Database** | MySQL (XAMPP for local development)              |
| **Other**    | Auth Middleware for secured APIs             |

## Project Structure

```
E-Taka/
├── app/
├── database/
├── public/
├── resources/
│   ├── views/ (Blade templates)
│   └── js/ (AJAX & UI logic)
├── routes/ (api.php, web.php)


## Installation & Setup

### Requirements

* PHP 8+
* Composer
* MySQL / MariaDB (XAMPP recommended for local development)


### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/markgee-ui/etaka.git
   cd etaka
   ```

2. Install dependencies:

   ```bash
   composer install
   npm install && npm run dev # if using JS build tools
   ```

3. Create `.env` and configure your database:

   ```dotenv
   DB_DATABASE=etaka1(change according to your db name)
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. Generate app key & migrate database:

   ```bash
   php artisan key:generate
   php artisan migrate
   ```

5. Serve the application:

   ```bash
   php artisan serve
   ```

6. Access via: `http://localhost:8000`

## Reward System

* Every *completed* e-waste request earns the consumer **KES 50 per point**.
* Points are tracked in real-time on the **Rewards** dashboard.

##  Contribution

Want to contribute? Fork this repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

##  Contact

For inquiries, partnership, or support:

* **Email:** [ngugimark93@gmail.com](mailto:ngugimark93@gmail.com)
* **Developer:** Ngugi Mark

>>>>>>> Stashed changes



