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
const passport = require('passport');


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

// Password config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

// Assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())


// Global MiddleWare

app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})

// set Template Engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');


require('./routes/web.js')(app);


const server = app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})


// Socket connection

const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('join', (orderId) => {
        console.log(orderId)
        socket.join(orderId);
    })
});