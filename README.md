# CSE316 HW3

-   Name: Kyungbae Min
-   Student ID: 112986171

## Server

### Database

Deployed on MongoDB Atlas

-   On mongoose: `mongodb+srv://admin:admin@mycluster.lr4aw.mongodb.net/MyNote?retryWrites=true&w=majority`

-   On Compass: `mongodb://localhost:27017/MyNote`

## How to start

1. `yarn install` or `npm install` to install packages
2. `yarn start` or `npm start` to start your local server on 3000 port

## Structure

```
cse316-hw4
├── frontend/
│   ├── public/             # static files
│   │   ├── index.html      # html template
│   │   ├── manifest.json   # manifest info
│   │   └── robots.txt
│   │
│   ├── src/                # project root
│   │   ├── api/            # APIs
│   │   │   └── client.js
│   │   ├── assets/         # images
│   │   ├── components/     # layout containers
│   │   │   ├── auth/       # login & signup form
│   │   │   ├── main/       # main note editter
│   │   │   ├── modal/      # user info modal
│   │   │   └── sidebar/    # side note list
│   │   │
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.js
│   │   └── recoilStates.js # global states
│   │
│   ├── ...
│   └── package.json
│
└── server/
    ├── middleware/         # Server middlewares
    │   └── auth.js
    │
    ├── models/             # DB schemes
    │   ├── Note.js
    │   └── User.js
    │
    ├── routes/             # API routes
    │   ├── notes.js
    │   └── users.js
    │
    ├── utils/              # helper methods
    │   ├── helper.js
    │   └── validators.js
    │
    ├── app.js              # Express server w/ mongoose
    ├── server.js           # Server execute
    ├── populatedb.js       # Populating db
    │
    ├── ...
    └── package.json

```
