var mongoose = require("mongoose");
var Player = mongoose.model("Player");

 
 module.exports = {
 
    create: function(req, res){
        console.log(`controllers players.js`)
       
        var player = new Player({
            name: req.body.name,
            stats:req.body.stats
        });
        player.save().then((doc)=>{
            console.log(`saved a player ${doc._id}`)
            req.session.playerId = doc._id;
            res.json(player);
        }).catch((doc)=>{
            console.log("inside the .catch")
            console.log(doc)
            res.json(doc);
        })
    },
    
    findPlayer: function(req, res){
        console.log("controllers players.js");
        Player.findById(req.session.playerId, (err, result)=>{
            if(err){
                console.log(err);
                res.json(err);
            }
            else{
                console.log(`found player = ${result._id}, ${result.name}`);
                res.json(result);
            }
        })
    }
    // all: function(req, res){
    //     console.log("controllers surveys.js all")
    //     Survey.find({}).sort({createdAt:-1,updatedAt:"asc"}).exec(function(err, surveys){
    //         if(err){
    //             console.log("errors");
    //             res.json("false");
    //         }
    //         else{
    //             console.log(`returning all the players`)
    //             res.json(surveys);
    //         }
    //     })
    // },
    // one: function(req, res){
    //     console.log("controllers surveys.js one")
    //     console.log(req.body.pollId)
    //     Survey.findById(req.body.pollId, function(err, survey){
    //         if(err){
    //             console.log("controllers surveys.js errors")
    //             console.log(err)
    //         }
    //         else{
    //             console.log("probably found one")
    //             console.log(survey)
    //             res.json(survey)
    //         }
    //     })
    // },
    // delete: function(req, res){
    //     console.log("controllers surveys.js delete")
    //     Survey.findByIdAndRemove(req.params.pollId, function(err, success){
    //         if(err){
    //             console.log("controllers surveys.js delete errors")
    //             console.log(err)
    //         }
    //         else{
    //             console.log("controllers surveys.js delete successful")
    //         }
    //     })
    // },
    // update: function(req, res){
    //     console.log("controllers surveys.js update")
    //     console.log(`stuff we have to work with ${req.body.value}, ${req.body.pollId}, ${req.body.idx}`)
    //     let queryString = `options.${req.body.idx}.votes`;
    //     let newVotes = req.body.value;
    //     let query = {};
    //     query[queryString]=newVotes;
    //     Survey.findByIdAndUpdate(req.body.pollId, {"$set":query}, {new:true}, function(err, survey){
    //         if(err){
    //             console.log("errors:")
    //             console.log(err)
    //         }
    //         else{
    //             console.log("update succeeded")
    //             res.json(survey)
    //         }
    //     })
    // }

 }


