# Aplikasi Kasir (POS System)

## POS System (Aplikasi Kasir) API

### Base URL

Semua endpoint menggunakan prefix `/api`:

```
Base URL: http://localhost:5000/api
```

### Endpoints

#### 1. Customers

##### 1.1. Add Customer
**Endpoint:** `POST /api/customers`

**Request Body:**
```json
{
  "customer_id": "cust001",
  "customer_name": "John Doe"
}
```

**Response:**
```json
{
  "message": "Successfully added new customer. Customer added: john doe"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"customer_id": "cust001", "customer_name": "John Doe"}'
```

##### 1.2. Get All Customers
**Endpoint:** `GET /api/customers`

**Response:**
```json
{
  "customers": [
    {
      "customerId": "cust001",
      "customerName": "john doe",
      "paymentMethod": [
        {
          "provider": "OVO",
          "balance": 100000
        }
      ]
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/customers
```

##### 1.3. Get Customer by ID
**Endpoint:** `GET /api/customers/:customerId`

**Response:**
```json
{
  "Customers": {
    "customerId": "cust001",
    "customerName": "john doe",
    "paymentMethod": [
      {
        "provider": "OVO",
        "balance": 100000
      }
    ]
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/customers/cust001
```

##### 1.4. Update Customer
**Endpoint:** `PUT /api/customers/:customerId`

**Request Body:**
```json
{
  "customer_name": "Jane Doe"
}
```

**Response:**
```json
{
  "message": "Successfully updated customer with id cust001"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/customers/cust001 \
  -H "Content-Type: application/json" \
  -d '{"customer_name": "Jane Doe"}'
```

##### 1.5. Delete Customer
**Endpoint:** `DELETE /api/customers/:customerId`

**Response:**
```json
{
  "message": "Successfully deleted customer with id cust001"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/customers/cust001
```

##### 1.6. Add Payment Method
**Endpoint:** `PUT /api/customers/:customerId/payment`

**Request Body:**
```json
{
  "provider": "OVO"
}
```

**Allowed Providers:** `OVO`, `GOPAY`, `DANA`, `SHOPEEPAY`, `BRI`, `MANDIRI`, `BNI`

**Response:**
```json
{
  "message": "Payment method OVO added"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/customers/cust001/payment \
  -H "Content-Type: application/json" \
  -d '{"provider": "OVO"}'
```

##### 1.7. Delete Payment Method
**Endpoint:** `DELETE /api/customers/:customerId/payment`

**Request Body:**
```json
{
  "provider": "OVO"
}
```

**Response:**
```json
{
  "message": "Payment method OVO deleted"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/customers/cust001/payment \
  -H "Content-Type: application/json" \
  -d '{"provider": "OVO"}'
```

##### 1.8. Top Up Payment Method
**Endpoint:** `PUT /api/customers/:customerId/topup`

**Request Body:**
```json
{
  "provider": "OVO",
  "amount": 50000
}
```

**Response:**
```json
{
  "message": "Top up success",
  "balance": 150000
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/customers/cust001/topup \
  -H "Content-Type: application/json" \
  -d '{"provider": "OVO", "amount": 50000}'
```

##### 1.9. Get Customer Transactions
**Endpoint:** `GET /api/customers/:customerId/transactions`

**Response:**
```json
{
  "transactions": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "customerId": "cust001",
      "totalAmount": 50000,
      "paymentMethod": "OVO",
      "transactionDate": "2026-04-22T10:30:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/customers/cust001/transactions
```

---

#### 2. Products

##### 2.1. Add Product
**Endpoint:** `POST /api/products`

**Request Body:**
```json
{
  "product_id": "PROD001",
  "product_name": "Mie Goreng",
  "product_price": 15000
}
```

**Response:**
```json
{
  "message": "Successfully added new Products",
  "data": {
    "productId": "PROD001",
    "productName": "Mie Goreng",
    "productPrice": 15000,
    "productStock": 0
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"product_id": "PROD001", "product_name": "Mie Goreng", "product_price": 15000}'
```

##### 2.2. Get All Products
**Endpoint:** `GET /api/products`

**Response:**
```json
{
  "message": "Successfully retrieved all products",
  "data": [
    {
      "productId": "PROD001",
      "productName": "Mie Goreng",
      "productPrice": 15000,
      "productStock": 50
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/products
```

##### 2.3. Get Product by ID
**Endpoint:** `GET /api/products/:productId`

**Response:**
```json
{
  "Products": {
    "productId": "PROD001",
    "productName": "Mie Goreng",
    "productPrice": 15000,
    "productStock": 50
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/products/PROD001
```

##### 2.4. Update Product
**Endpoint:** `PUT /api/products/:productId`

**Request Body:**
```json
{
  "product_name": "Mie Goreng Premium",
  "product_price": 18000
}
```

**Response:**
```json
{
  "message": "Successfully updated Products with id PROD001"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/products/PROD001 \
  -H "Content-Type: application/json" \
  -d '{"product_name": "Mie Goreng Premium", "product_price": 18000}'
```

##### 2.5. Update Product Stock
**Endpoint:** `PUT /api/products/:productId/stock`

**Request Body:**
```json
{
  "product_stock": 25
}
```

**Note:** The stock value specified will be ADDED to the current stock (increment operation).

**Response:**
```json
{
  "message": "Successfully updated stock for Products with id PROD001"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/products/PROD001/stock \
  -H "Content-Type: application/json" \
  -d '{"product_stock": 25}'
```

##### 2.6. Delete Product
**Endpoint:** `DELETE /api/products/:productId`

**Response:**
```json
{
  "message": "Successfully deleted Products with id PROD001"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/products/PROD001
```

---

#### 3. Employees

##### 3.1. Add Employee
**Endpoint:** `POST /api/employees`

**Request Body:**
```json
{
  "employee_id": "emp001",
  "employee_name": "Budi Santoso",
  "employee_password": "password123"
}
```

**Note:** Password must be at least 8 characters long. Passwords are securely hashed.

**Response:**
```json
{
  "message": "Successfully added new employee: emp001"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"employee_id": "emp001", "employee_name": "Budi Santoso", "employee_password": "password123"}'
```

##### 3.2. Get All Employees
**Endpoint:** `GET /api/employees`

**Response:**
```json
{
  "employees": [
    {
      "employeeId": "emp001",
      "employeeName": "Budi Santoso",
      "employeePassword": "hashed_password"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/employees
```

##### 3.3. Get Employee by ID
**Endpoint:** `GET /api/employees/:employeeId`

**Response:**
```json
{
  "message": "Successfully retrieved employee with id emp001",
  "data": {
    "employeeId": "emp001",
    "employeeName": "Budi Santoso",
    "employeePassword": "hashed_password"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/employees/emp001
```

##### 3.4. Update Employee
**Endpoint:** `PUT /api/employees/:employeeId`

**Request Body:**
```json
{
  "employee_name": "Budi Santoso Updated"
}
```

**Response:**
```json
{
  "message": "Successfully updated employee with id emp001",
  "data": {}
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/employees/emp001 \
  -H "Content-Type: application/json" \
  -d '{"employee_name": "Budi Santoso Updated"}'
```

##### 3.5. Delete Employee
**Endpoint:** `DELETE /api/employees/:employeeId`

**Response:**
```json
{
  "message": "Successfully deleted employee with id emp001"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/employees/emp001
```

##### 3.6. Employee Login
**Endpoint:** `POST /api/employees/login`

**Request Body:**
```json
{
  "employee_id": "emp001",
  "employee_password": "password123"
}
```

**Response:**
```json
{
  "message": "Authorization successfully",
  "token": "jwt_token_here"
}
```

**Error Response:**
```json
{
  "message": "Authorization failed"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/employees/login \
  -H "Content-Type: application/json" \
  -d '{"employee_id": "emp001", "employee_password": "password123"}'
```

##### 3.7. Get Employee Transactions
**Endpoint:** `GET /api/employees/:employeeId/transaction`

**Response:**
```json
{
  "message": "Successfully retrieved transactions for employee emp001",
  "transactions": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "employeeId": "emp001",
      "customerId": "cust001",
      "totalAmount": 50000,
      "paymentMethod": "OVO",
      "transactionDate": "2026-04-22T10:30:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/employees/emp001/transaction
```

---

#### 4. Discounts

##### 4.1. Get All Discounts
**Endpoint:** `GET /api/discounts`

**Response:**
```json
{
  "discounts": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "products": "[\"PROD001\"]",
      "discountAmount": 5000,
      "discountStart": 1713360000,
      "discountDuration": 86400
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/discounts
```

**With Date Range:**
```bash
curl -X GET "http://localhost:5000/api/discounts?start=2026-04-01&end=2026-04-30"
```

##### 4.2. Get Discount by ID
**Endpoint:** `GET /api/discounts/:id`

**Response:**
```json
{
  "discounts": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "products": "[\"PROD001\"]",
      "discountAmount": 5000,
      "discountStart": 1713360000,
      "discountDuration": 86400
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/discounts/507f1f77bcf86cd799439014
```

##### 4.3. Add Discount
**Endpoint:** `POST /api/discounts`

**Request Body:**
```json
{
  "products": ["PROD001", "PROD002"],
  "discount_amount": 5000,
  "discount_duration": 86400
}
```

**Note:** `discount_duration` is in seconds. 86400 = 1 day

**Response:**
```json
{
  "message": "Successfully added new discount"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/discounts \
  -H "Content-Type: application/json" \
  -d '{"products": ["PROD001"], "discount_amount": 5000, "discount_duration": 86400}'
```

##### 4.4. Update Discount
**Endpoint:** `PATCH /api/discounts/:id`

**Request Body:**
```json
{
  "products": ["PROD001", "PROD002"],
  "discount_amount": 7500,
  "discount_duration": 172800
}
```

**Response:**
```json
{
  "message": "Successfully updated discount data"
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:5000/api/discounts/507f1f77bcf86cd799439014 \
  -H "Content-Type: application/json" \
  -d '{"products": ["PROD001", "PROD002"], "discount_amount": 7500, "discount_duration": 172800}'
```

##### 4.5. Delete Discount
**Endpoint:** `DELETE /api/discounts/:id`

**Response:**
```json
{
  "message": "Successfully deleted discount with id 507f1f77bcf86cd799439014"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/discounts/507f1f77bcf86cd799439014
```

---

#### 5. Shifts

##### 5.1. Start Shift
**Endpoint:** `POST /api/shifts`

**Request Body:**
```json
{
  "employee_id": "emp001"
}
```

**Response:**
```json
{
  "message": "Shift started successfully",
  "employeeId": "emp001",
  "shiftId": "507f1f77bcf86cd799439015",
  "startTime": "2026-04-22T10:30:00.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/shifts \
  -H "Content-Type: application/json" \
  -d '{"employee_id": "emp001"}'
```

##### 5.2. End Shift
**Endpoint:** `PUT /api/shifts`

**Request Body:**
```json
{
  "employee_id": "emp001"
}
```

**Response:**
```json
{
  "message": "Shift ended successfully",
  "shift": {
    "_id": "507f1f77bcf86cd799439015",
    "employeeId": "emp001",
    "startTime": "2026-04-22T10:30:00.000Z",
    "endTime": "2026-04-22T18:30:00.000Z"
  },
  "duration": "8 hours, 0 minutes"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/shifts \
  -H "Content-Type: application/json" \
  -d '{"employee_id": "emp001"}'
```

##### 5.3. Get All Shifts
**Endpoint:** `GET /api/shifts`

**Response:**
```json
{
  "Shifts": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "employeeId": "emp001",
      "startTime": "2026-04-22T10:30:00.000Z",
      "endTime": "2026-04-22T18:30:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/shifts
```

##### 5.4. Get Active Shifts
**Endpoint:** `GET /api/shifts/active`

**Response:**
```json
{
  "message": "Successfully retrieved active shifts",
  "activeShifts": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "employeeId": "emp001",
      "startTime": "2026-04-22T10:30:00.000Z",
      "endTime": null
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/shifts/active
```

##### 5.5. Get Shifts by Employee ID
**Endpoint:** `GET /api/shifts/:employeeId`

**Response:**
```json
{
  "Shifts": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "employeeId": "emp001",
      "startTime": "2026-04-22T10:30:00.000Z",
      "endTime": "2026-04-22T18:30:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/shifts/emp001
```

---

#### 6. Transactions

##### 6.1. Create Transaction
**Endpoint:** `POST /api/transactions`

**Request Body:**
```json
{
  "employee_id": "emp001",
  "customer_id": "cust001",
  "payment_method": "OVO",
  "purchase_list": [
    {
      "product_id": "PROD001",
      "quantity": 2
    },
    {
      "product_id": "PROD002",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "message": "Transaction added successfully",
  "transactionId": "507f1f77bcf86cd799439016",
  "subtotal": 50000,
  "discount": 5000,
  "adminFee": 1500,
  "totalAmount": 46500,
  "finalBalance": 53500
}
```

**Error Response Example (No Active Shift):**
```json
{
  "message": "Transaction denied: Employee with ID emp001 is not currently on duty. Please start a shift first."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "emp001",
    "customer_id": "cust001",
    "payment_method": "OVO",
    "purchase_list": [
      {
        "product_id": "PROD001",
        "quantity": 2
      }
    ]
  }'
```

##### 6.2. Get All Transactions
**Endpoint:** `GET /api/transactions`

**Response:**
```json
{
  "message": "Successfully retrieved all transactions",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "employeeId": "emp001",
      "customerId": "cust001",
      "itemList": [
        {
          "productId": "PROD001",
          "productName": "Mie Goreng",
          "quantity": 2,
          "price": 15000,
          "subtotal": 30000
        }
      ],
      "subtotal": 30000,
      "discountAmount": 0,
      "adminFees": 1500,
      "totalAmount": 31500,
      "paymentMethod": "OVO",
      "transactionDate": "2026-04-22T10:30:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/transactions
```

---