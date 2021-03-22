let utilMongo = require('../javascript/mongodb.js');
let utilFireBase = require('../javascript/firebase.js');

const express = require('express');
let handlebars = require('express-handlebars');
let fs= require('fs');

let bodyparser=require('body-parser');

var router = express.Router();


router.get('/login', function(req, res, next) {
    res.render('admin/login',{layout:false});
  });

router.get('/*', function(req, res, next) {
    console.log(req.cookies);
    res.send("NEED AUTH");
});

router.get('/articles', function(req, res, next) {
    utilMongo.getAllShortArticles()
    .then((data)=>{
        console.log(data)
        res.render('admin/articles',{articles:data })
    })
    .catch(
      ()=>  reject({message:"Error al conectarse con mongo",status:500})

    );
});
router.get('/editArticle/:article', function(req, res, next) {
    utilMongo.getAllShortArticles()
    .then((data)=>{
        console.log(data)
        res.render('admin/articles',{articles:data })
    })
    .catch(
      ()=>  reject({message:"Error al conectarse con mongo",status:500})

    );
});


router.get('/newArticle', function(req, res, next) {
    res.render("admin/newArticle", {layout:"admin/layout"})
});

router.post('/preview',function(req, res, next) {
    console.log(req.body);
    res.render('',{layout:'content-layout.hbs',title:req.body.title, content:req.body.content});
    
  }); 
  router.post('/sessionLogin',function(req, res, next) {
    
    const idToken = req.body.idToken.toString();
    const csrfToken = req.body.csrfToken.toString();
    if (csrfToken!='pueblo_paleta') {
        res.status(401).send("Unauthorized!");
        return;
    }
    const expiresIn = 24*60*60*1000; // 1 day
    FireBase
    .auth()
    .verifyIdToken(idToken)
    .then((decodedIdToken) => {
      // Only process if the user just signed in in the last 5 minutes.
      if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
        // Create session cookie and set it.
        return FireBase.auth().createSessionCookie(idToken, { expiresIn });
      }
      // A user that was not recently signed in is trying to set a session cookie.
      // To guard against ID token theft, require re-authentication.
      res.status(401).send('Recent sign in required!');
    });

    FireBase.auth().createSessionCookie(idToken, { expiresIn })
    .then(
        (sessionCookie)=>{
            const options = { maxAge: expiresIn, httpOnly: true, secure: true };
            res.cookie('session', sessionCookie, options);
            res.end(JSON.stringify({ status: 'success' }));
        },
        (error)=> {
            res.status(401).send('UNAUTHORIZED REQUEST!');
        }
    )
  }); 
module.exports = router;