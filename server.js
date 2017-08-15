
require('./server/config/mongoose.js');
const PORT = 8000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require("express-session");
const routes_setter = require("./server/config/routes.js");
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
const io = require('socket.io').listen(server);

app.use(session({
    secret: "codingdojorocks",
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, '/client/public/dist')));

routes_setter(app);
