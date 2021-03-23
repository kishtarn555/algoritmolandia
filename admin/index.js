const express = require('express');

const app = express();
let path = require('path');
let fs = require('fs');
app.set('views', path.join(__dirname, 'views'));
let handlebars = require('express-handlebars');
let bodyparser=require('body-parser');
app.set('view engine', 'hbs');



app.engine('hbs',
    handlebars({
        layoutsDir:'views',
        defaultLayout: 'layout',
        extname: '.hbs',
        helpers:{
            'clampstring': function (size, string) {
                if (string == undefined)return "N/A";
                if ((string.length > size))
                    return string.substring(0, size)+"...";
                else 
                    return string;
            },
            'JSONstringify': function (data) {
                return JSON.stringify(data);
            }
        }
    })
);

//BEGIN MONGO
global.MongoClient = require('mongodb').MongoClient;
global.MongoUri = fs.readFileSync('./mongodb_credentials.secret').toString();
MongoClient.connect(MongoUri).then( function(db) {    
    console.log ("Successfull conection to mongo");       
     
    //db.db('algoritmolandia').collection('categorias').update({url:'foo'},{'$push':{articles:'lolk'}}) 
   /* db.db('algoritmolandia').collection('categorias').findOne({url:'foo'})
    .then((data)=>{console.log(data)});*/
    console.log("Mongo") 
    db.close();        
}).catch((err)=>{console.log("Error connecting to mongo");console.log(err);});


//END MONGO

//BEGIN FIREBASE

global.FireBase = require("firebase-admin");

var serviceAccount = require("./firabase_credentials.secret.json");

global.FireBase.initializeApp({
  credential: global.FireBase.credential.cert(serviceAccount),
  databaseURL: "https://kcoderguide.firebaseio.com"
});


//END FIREBASE

  
app.use(express.static('public'));

let indexRouter = require('./routes/indexRoute');
let adminRouter = require('./routes/adminRouter');

app.use(express.urlencoded({extended:true}));
app.use(require('cookie-parser')());

app.use('/admin/', adminRouter);
app.use('/', indexRouter);



app.get("*",(req,res)=> {
    res.end("Erro 404: Pagina no encontrada");
});
app.listen(300, ()=>{


});
