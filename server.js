const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3300


// set Template Engine

app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// Assets
app.use(express.static('public'));

require('./routes/web.js')(app);


app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})