# Inventory Management System

A full-stack **Inventory Management System** built using **React.js, Django REST Framework, and MySQL**. The application manages products, categories, suppliers, customers, purchases, and sales while automatically maintaining inventory stock levels.

This project is an upgraded version of an earlier Django-based Inventory Management System, redesigned with a separate React frontend and RESTful Django backend.

## Features

- JWT-based user authentication
- Protected frontend routes and backend APIs
- Category management
- Product management
- Supplier management
- Customer management
- Purchase transactions
- Sales transactions
- Automatic stock increase after purchases
- Automatic stock decrease after sales
- Insufficient-stock validation
- Configurable low-stock thresholds
- Low-stock product detection
- Inventory dashboard
- Inventory value calculation
- RESTful API architecture
- MySQL database integration

## Tech Stack

### Frontend

- React.js
- JavaScript
- Vite
- React Router
- Axios
- HTML5
- CSS3

### Backend

- Python
- Django
- Django REST Framework
- SimpleJWT
- django-cors-headers
- Django ORM

### Database

- MySQL

## Architecture

```text
React.js Frontend
        |
        | Axios / JSON
        | JWT Bearer Token
        v
Django REST Framework
        |
        | Business Logic
        v
    Django ORM
        |
        v
      MySQL
```

The frontend and backend are separated and communicate through REST APIs.

## Main Modules

### Authentication

The application uses JWT authentication with access and refresh tokens.

Users can:

- Register
- Login
- Access protected APIs
- Refresh expired access tokens
- Logout

Protected API requests include the JWT access token in the authorization header.

```text
Authorization: Bearer <access_token>
```

### Categories

Categories are used to organize products.

Supported operations:

- Create category
- View categories
- Update category
- Delete category

Categories referenced by products are protected from accidental deletion.

### Products

Products contain inventory information such as:

- Product name
- SKU
- Category
- Description
- Price
- Quantity
- Low-stock threshold

The API also determines whether a product is currently low in stock.

### Suppliers

Stores supplier information including:

- Supplier name
- Contact person
- Email
- Phone
- Address

Suppliers are connected to purchase transactions.

### Purchases

Purchases represent inventory received from suppliers.

Each purchase can contain multiple purchase items.

```text
Supplier
   |
Purchase
   |
   +---- Purchase Item
   |        |
   |        +---- Product
   |
   +---- Purchase Item
            |
            +---- Product
```

When a purchase is created:

```text
Current Stock + Purchased Quantity = Updated Stock
```

Stock updates are performed by the backend rather than the React frontend.

### Customers

Stores customer information including:

- Name
- Email
- Phone
- Address

Customers are associated with sales transactions.

### Sales

A sale can contain multiple products.

Before creating a sale, the backend validates whether sufficient inventory is available.

```text
Requested Quantity <= Available Quantity
```

If enough stock exists:

```text
Current Stock - Sold Quantity = Updated Stock
```

If insufficient stock exists, the API rejects the transaction.

### Dashboard

The React dashboard provides a live overview of the inventory.

It displays:

- Total products
- Total categories
- Total suppliers
- Total customers
- Total stock units
- Number of low-stock products
- Current inventory value
- Low-stock product details

Dashboard data is retrieved from the REST API.

## Inventory Workflow

```text
Supplier
   |
   v
Purchase
   |
   v
Purchase Items
   |
   v
Stock Increases
   |
   v
Product Inventory
   |
   v
Sale Items
   |
   v
Stock Decreases
   |
   v
Customer
```

## Database Relationships

The major relationships include:

```text
Category
   |
   | 1 : Many
   v
Product


Supplier
   |
   | 1 : Many
   v
Purchase
   |
   | 1 : Many
   v
PurchaseItem
   |
   | Many : 1
   v
Product


Customer
   |
   | 1 : Many
   v
Sale
   |
   | 1 : Many
   v
SaleItem
   |
   | Many : 1
   v
Product
```

## Transaction Safety

Purchase and sale creation uses Django database transactions with:

```python
transaction.atomic
```

This helps ensure that transaction creation and stock modification are
