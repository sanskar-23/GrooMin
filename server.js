require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3300;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');


// Database Connection
mongoose.connect('mongodb://localhost:27017/GrooMin');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//session Store

// let mongoStore = new MongoDbStore({
//     mongooseConnection: db,
//     collection: 'sessions'
// })

// session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: 'mongodb://localhost:27017/GrooMin'
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

app.use(flash());

// Assets
app.use(express.static('public'));


// set Template Engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');


require('./routes/web.js')(app);


app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})