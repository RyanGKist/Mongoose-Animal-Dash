//Server Configs
var express = require('express');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/animalDashDB');
var AnimalSchema = new mongoose.Schema({
    animal_name: {type: String, required: true, maxlength:30},
    creator_name: {type: String, required: true, maxlength:20},
}, {timestamps : true})
mongoose.model('Animal',AnimalSchema);
var Animal = mongoose.model('Animal');

var path = require('path');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static')));


app.set('views', (path.join(__dirname, './views')));
app.set('view engine', 'ejs');


//Server Routes 
//Home Page + Displaying of all Birds in DB
app.get('/', function (req,res){
    Animal.find({}, function(err,animals){
        if(err){
            console.log(err);
            res.render('home');
        } else {
            res.render('home', {bird: animals});
        }
    })
});
//Create new Bird Page
app.get('/bird/new', function(req,res){
    res.render('create');
})
//Post data from Created Bird Page
app.post('/bird', function(req,res){
    var new_bird = new Animal()
    new_bird.animal_name = req.body.bird_name
    new_bird.creator_name= req.body.creator_name
    new_bird.save(function(err){
        if(err){
            console.log(err);
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    })
})
//View Specific Birds Page
app.get('/bird/:birdname', function(req,res){
    console.log(req.params.birdname);
    Animal.find({animal_name:req.params.birdname}, function(err,result){
        if(err){
            console.log(err);
            res.redirect('/')
        }else{
            res.render('bird',{result});
        }
    })
})
//Edit Specific Bird
app.get('/edit/:birdname',function(req,res){
    Animal.find({animal_name:req.params.birdname}, function(err,result){
        if(err){
            console.log(err);
            res.redirect('/')
        }else{
            res.render('edit',{result});
        }
    })
})
//Update database with Edits
app.post('/bird/edit/:birdname', function(req,res){
   Animal.update({animal_name:req.params.birdname},{animal_name:req.body.animal_rename}, function(err){
        if (err){
            console.log(err);
            res.redirect('/');
        }else{
            console.log('success');
            res.redirect('/');
        }
    })
   })
//Delete Specific Bird
app.get('/delete/:birdname', function(req,res){
    Animal.remove({animal_name:req.params.birdname}, function(err){
        if(err){
            console.log(err);
            res.redirect('/');
        }else {
            console.log('Successfully Deleted');
            res.redirect('/');
        }
    })
})



app.listen(8000,function(){
    console.log('Animal Dash listening on port 8000!');
})