var mongoose = require("mongoose");
const path = require("path");

// surveys = require("./../controllers/surveys.js");
// users = require("./../controllers/users.js");
players = require("./../controllers/players.js");


// Routes
// Root Request
module.exports = function(app){


    app.post("/setSession", function(req,res){
        console.log(`routes.js setSession ${req.body.player}`)
        req.session.player = req.body.player;
        res.json(req.session.player)
    })

    app.get("/checkSession", function(req,res){
        console.log("routes.js checkSession")
        res.json({player:req.session.player})
    })

    // app.get("/endSession", function(req,res){
    //     console.log("routes.js endSession")
    //     req.session.destroy();
    //     res.redirect("/")
    // })

    app.post("/createPlayer", function(req, res){
        console.log("routes.js createPlayer")
        players.create(req,res);
    })

    app.get("/findPlayer", function(req,res){
        console.log("routes.js findPlayer")
        console.log(`req.session.playerId = ${req.session.playerId}`)
        players.findPlayer(req,res)
    })

    // app.get("/allSurveys", function(req,res){
    //     console.log("routes.js allSurveys")
    //     surveys.all(req,res)
    // })

    // app.post("/oneSurvey", function(req,res){
    //     console.log("routes.js oneSurvey")
    //     surveys.one(req,res)
    // })

    // app.get("/delete/:pollId", function(req,res){
    //     console.log("routes.js delete")
    //     surveys.delete(req,res)
    //     res.redirect("/dashboard")
    // })

    //   app.post("/updateSurvey", function(req,res){
    //     console.log("routes.js updateSurvey")
    //     surveys.update(req,res)
    // })




    app.all("*", (req,res,next)=>{
        res.sendFile(path.resolve("./client/public/dist/index.html"))
    });
}

