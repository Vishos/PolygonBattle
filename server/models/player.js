var mongoose = require("mongoose");

var playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    stats:{},
}, {timestamps:true});

var Player = mongoose.model("Player", playerSchema);


