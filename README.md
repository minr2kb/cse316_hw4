# CSE316 HW3

-   Name: Kyungbae Min
-   Student ID: 112986171

## Server

### Database

Deployed on MongoDB Atlas

-   On mongoose: `mongodb+srv://admin:admin@mycluster.lr4aw.mongodb.net/MyNote?retryWrites=true&w=majority`

-   On Compass: `mongodb://localhost:27017/MyNote`

### REST APIs

`/api/notes`

-   GET
-   POST `{name:String, email:String, location:String, img:String}`

`/api/notes/:id`

-   GET
-   PUT `{name:String, email:String, location:String}`
-   DELETE

`/api/users/`

-   GET
-   POST `{Text:String, lastUpdatedDate:String}`

`/api/users/:id`

-   GET
-   PUT `{Text:String, lastUpdatedDate:String}`
-   DELETE

## How to start

1. `yarn install` or `npm install` to install packages
2. `yarn start` or `npm start` to start your local server on 3000 port

## Structure

```
cse316-hw3
├── frontend/
│   ├── public/             # static files
│   │   ├── index.html      # html template
│   │   ├── manifest.json   # manifest info
│   │   └── robots.txt
│   │
│   ├── src/                # project root
│   │   ├── assets/         # images
│   │   ├── components/     # layout containers
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
    ├── models/             # DB schemes
    │   ├── Note.js
    │   └── User.js
    │
    ├── app.js              # Express server w/ mongoose
    ├── populatedb.js       # Populating db
    ├── ...
    └── package.json

```
