# Fullstack Books e-commerce with ReactJS for frontend and ExpressJS, NodeJS for backend 

![Home page](https://res.cloudinary.com/dbiliw2ja/image/upload/v1689179294/homePage_td23gm.png)
![Books page](https://res.cloudinary.com/dbiliw2ja/image/upload/v1689179288/booksPage_w5b0tr.png)
![Cart page](https://res.cloudinary.com/dbiliw2ja/image/upload/v1689179288/cartPage_ck6eu2.png)
![Management page](https://res.cloudinary.com/dbiliw2ja/image/upload/v1689180307/statisticPage_rdflfm.png)
![Statistic page](https://res.cloudinary.com/dbiliw2ja/image/upload/v1689179423/statistic_wotv1v.png)
![Email verification](https://res.cloudinary.com/dbiliw2ja/image/upload/v1689179287/emailVerification_wdjkbd.png)

This project is a fullstack e-commerce website for selling books as a local seller, but focusing more on backend

Build with ReactJS, NodeJS, ExpressJS, MongoDB

Using libraries: 

+ Frontend: 
    - Redux, redux toolkit.
    - Axios.
    - ChartJS.
    - React-paginate, react-toastify, react-router-dom.
    
+ Backend: 
    - Bcrypt, JWT.
    - Nodemailer.
    - JOI, Mongoclient.

Features:

+ As a client:
    - Sign up/sign in using google mail as the website will send you an email to verify your email address
    - Redirect unauthorized users when accessing protected routes
    - Buy, add/remove products in your cart
    - Changing account's password, review old purchase history
    - Fully responsive design 
    - Will be notified on performing tasks such as add/remove products to/from cart, wrong user's info when sign in, filtering books
    - Advanced search algorithm by genre, combine with author's name, book's name, minimum price and maximum price
    - Account remembered so we won't need to repeatedly enter our email and password

+ As an administrator/owner
    - Can manage (add, remove or modify) products/books, genres, bills, accounts, privileges, warehouse, statistic based on account's privileges
    - Deep privileges system is a way to limit a certain type of managements which that account can do   
        - Lets say an account that has statistic privilege then that account can access and review only statistic tab but not any other tab
        - As another illustration,while your account has the ability to review/access genres tab but that doesn't mean it will grant you have the right to add, remove or alter any genres. Instead, you must have some specific privileges to carry out those operations
    - Fully responsive design
    - Advanced search algorithm based on the current displayed category/tab
    - Ban an account that has had delivery rejections too many times or is simply a ghost order

### Cloning the repository

```shell
git clone https://github.com/tuanloc288/books-ecommerce.git
```

### Install packages

```shell
cd backend
npm i
```

```shell
cd frontend
npm i react-scripts
```

### Setup backend .env file

```js
APP_PORT = 5000
APP_HOST = 'localhost'
JWT_ACCESS_TOKEN = 'ANYTHING'
JWT_REFRESH_TOKEN = 'ANYTHING'
MONGO_URI =
DATABASE_NAME = 
```

### Database Mongodb

- This is a personal project that has only been made public for resume review.
- So please get in touch with me if you need access to the database for whatever reasons you might have. 

### Start the app
**Run both b.e and f.e**

```shell
cd backend
npm start
```

```shell
cd frontend
npm start
```
