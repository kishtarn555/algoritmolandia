const express = require('express');
const app = express();
let path = require('path');

app.set('views', path.join(__dirname, 'views'));
let handlebars = require('express-handlebars');
app.set('view engine', 'hbs');

app.engine('hbs', handlebars({layoutsDir:'views',defaultLayout: 'layout', extname: '.hbs'}));

//BEGIN MONGO
global.MongoClient = require('mongodb').MongoClient;
global.MongoUri = "mongodb+srv://website-access:7cE3cP2VJd3rbEim@clusteralgoritmolandia-tumrz.mongodb.net/websiteInfo?retryWrites=true";
MongoClient.connect(MongoUri).then( function(db) {    
    console.log ("Successfull conection to mongo");       
     
    //db.db('algoritmolandia').collection('categorias').update({url:'foo'},{'$push':{articles:'lolk'}}) 
   /* db.db('algoritmolandia').collection('categorias').findOne({url:'foo'})
    .then((data)=>{console.log(data)});*/
    console.log("Mongo") 
    db.close();        
}).catch((err)=>{console.log("Error connecting to mongo");console.log(err);});


//END MONGO


app.use(express.static('public'));

let indexRouter = require('./routes/indexRoute');

app.use('/', indexRouter);



app.get("*",(req,res)=> {
    res.end("Erro 404: Pagina no encontrada");
});
app.listen(80, ()=>{


});
