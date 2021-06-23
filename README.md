# :rocket: user authentifications MERN stack with email verification, forgot password, hooks, fb/google/github/linkedIn logins (prod/dev).

In this project, I implement all the needings to have a login, register, userDropdown, logout and a secret page that you need to be logged in to access it with all the needing features (email verifications, forgot password, facebook login, google login, github login, linkenIn login) and all crypted via bcrypt
Here's an overview of the register page

![exec test](https://i.ibb.co/fFd1q7S/screencapture-localhost-3000-register-2021-06-20-23-15-13.png)

:warning: CSS styles, home page, secret page and navbar are not essential for this project, the major idea is to implement all the authentifications features.

## :computer: Boilerplate

MERN Stack with advanced authentication :

- Register form. :heavy_check_mark:

- Login form. :heavy_check_mark:

- Facebook login. :heavy_check_mark:

- Google login. :x:

- Github login. :x:

- LinkedIn login. :x:

- Email verification (uniqueString based) :heavy_check_mark: with resend/reset option :x:

- Forgot password feature. :heavy_check_mark:

- Modal for general conditions. :heavy_check_mark:

- Mongodb. :heavy_check_mark:

- Express. :heavy_check_mark:

- React based on Create React App. :heavy_check_mark:

- React Hooks. :heavy_check_mark:

- Nodejs. :heavy_check_mark:

## :lock: Security

This repository is code scanning from github for vulnerabilities. Do not use this code blindly, audit it first.

## :red_circle: Environment variables

- :ballot_box_with_check: the `APP_PORT`, 3001 is used for Nodejs in this project

- :ballot_box_with_check: the database url `DATABASE_URL` : mongodb://localhost:27017/your_db_name

- :ballot_box_with_check: a secret string for `JWT_SECRET` variable 

- :ballot_box_with_check: a gmail account in `MAIL_USERNAME` to handle the mail sending with OAuth2, 

- :ballot_box_with_check: your gmail password in `MAIL_PASSWORD` variable 

- :ballot_box_with_check: your OAuth2 client ID `OAUTH_CLIENTID`

- :ballot_box_with_check: your OAuth2 secret in `OAUTH_CLIENT_SECRET`

- :ballot_box_with_check: your refresh token in `OAUTH_REFRESH_TOKEN`

### to get your OAuth2 variables, create one in google console 

## :information_source: Installation

To install this project on your local host :

1. Go to your desktop and open up a terminal there (Ctrl+Alt+T) and type

```sh
git clone https://github.com/khairislama/user-registration-JWT-MERN
cd user-registration-JWT-MERN
```

then if you're using Visual Studio Code type

```sh
code .
```

to open the project. If you're using another development environment, just open the new folder created on you're desktop
enter you're database name where it says `enter_ure_db_name_here` :

![exec test](https://i.ibb.co/xH4q6Pb/image.png)

and a secret message in the auth.controller for the jwt secret to sign a token,
![exec test](https://i.ibb.co/hBhYf3z/image.png)

type on a terminal :

```sh
cd server
npm install
nodemon app.js
```

let the back-end server run and type on another teminal :

```sh
cd client
npm install
npm start
```

wait a few seconds and the server will run, enjoy!!
