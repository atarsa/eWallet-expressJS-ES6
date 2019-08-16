# eWallet expressJS/ES6 Server

## Installation

Download and install all requirements for the server with:

```
npm install
```

## Initialising a Database

MongoDB will be initialized locally on the server start (assuming MongoDB is installed). 

## Running the Server

Start the server with:

```
npm run devstart
```

This will start the server running on `127.0.0.1` port `3000`.



## Making requests

Requests to the server can be made to the endpoints specified in `index.js`. For details on the Model, check `Model/Wallet.js`.

For user authentication Jason Web Token is used. Following routes need `auth-token` key in request header:
- `api/items`
- `api/base`
<br>

### `api/user/register`
**POST/**
Creates a new User. Fields for the User should be included as the body of the POST request

Accepted body fields: username, password
```
POST http://127.0.0.1/api/user/register
{"username" : "Dave1",
 "password" : "securePassword"
}
```
`username` should have at least 5 characters, `password` should have at least 6 characters.
Server sends back a new user id. 

### `api/user/login`
**POST/**
Logs a user. Fields for the login should be included as the body of the POST request

Accepted body fields: username, password
```
POST http://127.0.0.1/api/user/register
{"username" : "Dave1",
 "password" : "securePassword"
}
```
Server sends back an authentication token (JWT).

### `api/items`
**GET /**
Returns a list of all items in the user's wallet.
```
GET http://127.0.0.1/api/items
```

**POST /**
Adds new item to user's wallet. Fields for the item should be included as the body of the POST request

Accepted body fields: id, currency, amount
```
POST http://127.0.0.1/api/items
{"id" : 1,
 "currency" : "USD",
 "amount": 100
}
```

**DELETE /:id**
Deletes the item with the specified `id`.

```
DELETE http://127.0.0.1/items/1
```

**PUT /:id**
Updates the item with the specified `id`. Field to be updated should be included as the body of the PUT request.

Accepted body fields: `amount`

```
PUT http://127.0.0.1/items/1
{"amount" : 200}
```

### `api/base`
**GET /**
Returns a base currency of user's wallet.
Defaults to `GBP` if not yet set.
```
GET http://127.0.0.1/api/base
```

**PUT /**
Updates base currency of user's wallet. Field for the base currency should be included as the body of the PUT request

Accepted body fields: id, currency, amount
```
PUT http://127.0.0.1/api/base
{"baseCurrency" : "EUR"}
```

### `api/rates/latest`
**GET /**
Gets latest currency exchange rates published by [European Central Bank](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html).
If requested with the parameter `symbols`, the returned object will include only specified currencies.

Required query parameter: `base`.
Accepted query parameter: `symbols`

```
GET http://localhost:3000/api/rates/latest?base=GBP
GET http://localhost:3000/api/rates/latest?base=GBP&symbols=USD,PLN
```

### `api/rates/exchange`
**POST /**
Exchange money. 

Required body fields: baseCurrency, exchangeCurrency, amount
```
POST http://127.0.0.1/api/rates/exchange
{
	"baseCurrency": "GBP",
	"exchangeCurrency": "PLN",
	"amount": 200
}
```
Server should reponse with exchange's rate, exchanged amount, exchange currency and base currency.


<br>

## Editing the server

The Node server uses the [Mongoose](https://mongoosejs.com/docs/guide.html) library for interacting with the MongoDB database.

It uses the [Express](https://expressjs.com/) framework for running the web server and routing queries.


