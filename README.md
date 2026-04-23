# Aplikasi Kasir (inprogress transaksi belum tambahin dan belum di rapihin)

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
  -d '{"customer_name": "John Doe"}'
```

##### 1.2. Get All Customers
**Endpoint:** `GET /api/customers`

**Response:**
```json
{
  "customers": [
    {
      "id": "507f1f77bcf86cd799439011",
      "customer_name": "john doe",
      "payment_method": "cash"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/customers
```

##### 1.3. Get Customer by ID
**Endpoint:** `GET /api/customers/:id`

**Response:**
```json
{
  "Customers": {
    "_id": "507f1f77bcf86cd799439011",
    "customerName": "john doe",
    "paymentMethod": "cash"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/customers/507f1f77bcf86cd799439011
```

##### 1.4. Update Customer
**Endpoint:** `PUT /api/customers/:id`

**Request Body:**
```json
{
  "customer_name": "Jane Doe"
}
```

**Response:**
```json
{
  "message": "Successfully updated customer with id 507f1f77bcf86cd799439011"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/customers/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"customer_name": "Jane Doe"}'
```

##### 1.5. Delete Customer
**Endpoint:** `DELETE /api/customers/:id`

**Response:**
```json
{
  "message": "Successfully deleted customer with id 507f1f77bcf86cd799439011"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/customers/507f1f77bcf86cd799439011
```

---

#### 2. Products

##### 2.1. Add Product
**Endpoint:** `POST /api/product`

**Request Body:**
```json
{
  "product_name": "Mie Goreng",
  "product_price": 15000
}
```

**Response:**
```json
{
  "message": "Successfully added new Products"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/product \
  -H "Content-Type: application/json" \
  -d '{"product_name": "Mie Goreng", "product_price": 15000}'
```

##### 2.2. Get Product by ID
**Endpoint:** `GET /api/product/:id`

**Response:**
```json
{
  "Products": {
    "_id": "507f1f77bcf86cd799439012",
    "productName": "Mie Goreng",
    "productPrice": 15000,
    "productStock": 50
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/product/507f1f77bcf86cd799439012
```

##### 2.3. Update Product
**Endpoint:** `PUT /api/product/:id`

**Request Body:**
```json
{
  "productName": "Mie Goreng Premium",
  "productPrice": 18000
}
```

**Response:**
```json
{
  "message": "Successfully updated Products with id 507f1f77bcf86cd799439012"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/product/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -d '{"productName": "Mie Goreng Premium", "productPrice": 18000}'
```

##### 2.4. Update Product Stock
**Endpoint:** `PUT /api/product/:id/stock`

**Request Body:**
```json
{
  "productStock": 100
}
```

**Response:**
```json
{
  "message": "Successfully updated stock for product"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/product/507f1f77bcf86cd799439012/stock \
  -H "Content-Type: application/json" \
  -d '{"productStock": 100}'
```

##### 2.5. Delete Product
**Endpoint:** `DELETE /api/product/:id`

**Response:**
```json
{
  "message": "Successfully deleted Products with id 507f1f77bcf86cd799439012"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/product/507f1f77bcf86cd799439012
```

---

#### 3. Employees

##### 3.1. Add Employee
**Endpoint:** `POST /api/employees`

**Request Body:**
```json
{
  "employeeName": "Budi Santoso",
  "employeePassword": "password123"
}
```

**Response:**
```json
{
  "message": "Successfully added new employee: Budi Santoso"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"employeeName": "Budi Santoso", "employeePassword": "password123"}'
```

##### 3.2. Get All Employees
**Endpoint:** `GET /api/employees`

**Response:**
```json
{
  "message": "Successfully retrieved all employees",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "employeeName": "Budi Santoso",
      "employeePassword": "password123"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/employees
```

##### 3.3. Get Employee by ID
**Endpoint:** `GET /api/employees/:id`

**Response:**
```json
{
  "message": "Successfully retrieved employee with id 507f1f77bcf86cd799439013",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "employeeName": "Budi Santoso",
    "employeePassword": "password123"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/employees/507f1f77bcf86cd799439013
```

##### 3.4. Update Employee
**Endpoint:** `PUT /api/employees/:id`

**Request Body:**
```json
{
  "employeeName": "Budi Santoso Updated",
  "employeePassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Successfully updated employee with id 507f1f77bcf86cd799439013",
  "data": {}
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/employees/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -d '{"employeeName": "Budi Santoso Updated", "employeePassword": "newpassword123"}'
```

##### 3.5. Delete Employee
**Endpoint:** `DELETE /api/employees/:id`

**Response:**
```json
{
  "message": "Successfully deleted employee with id 507f1f77bcf86cd799439013"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/employees/507f1f77bcf86cd799439013
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
      "products": ["507f1f77bcf86cd799439012"],
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

##### 4.2. Add Discount
**Endpoint:** `POST /api/discounts`

**Request Body:**
```json
{
  "products": ["507f1f77bcf86cd799439012"],
  "discountAmount": 5000,
  "discountDuration": 86400
}
```

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
  -d '{"products": ["507f1f77bcf86cd799439012"], "discountAmount": 5000, "discountDuration": 86400}'
```

##### 4.3. Delete Discount
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
  "employeeId": "507f1f77bcf86cd799439013"
}
```

**Response:**
```json
{
  "message": "Shift started successfully",
  "employeeId": "507f1f77bcf86cd799439013",
  "shiftId": "507f1f77bcf86cd799439015",
  "startTime": "2026-04-22T10:30:00.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/shifts \
  -H "Content-Type: application/json" \
  -d '{"employeeId": "507f1f77bcf86cd799439013"}'
```

##### 5.2. End Shift
**Endpoint:** `PUT /api/shifts`

**Request Body:**
```json
{
  "employeeId": "507f1f77bcf86cd799439013"
}
```

**Response:**
```json
{
  "message": "Shift ended successfully",
  "shift": {
    "_id": "507f1f77bcf86cd799439015",
    "employeeId": "507f1f77bcf86cd799439013",
    "startTime": "2026-04-22T10:30:00.000Z",
    "endTime": "2026-04-22T18:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/shifts \
  -H "Content-Type: application/json" \
  -d '{"employeeId": "507f1f77bcf86cd799439013"}'
```

##### 5.3. Get All Shifts
**Endpoint:** `GET /api/shifts`

**Response:**
```json
{
  "Shifts": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "employeeId": "507f1f77bcf86cd799439013",
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

---
