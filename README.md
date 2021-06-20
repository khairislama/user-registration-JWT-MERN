# user-registration-JWT-MERN

In this project, I implement all the needings to have a login, register, userDropdown and logout with all the needing features (forgot password, facebook API,...)

![exec test](https://i.ibb.co/fFd1q7S/screencapture-localhost-3000-register-2021-06-20-23-15-13.png)

## Installation

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
