let utilMongo = require('../javascript/mongodb.js');

const express = require('express');
let handlebars = require('express-handlebars');
let fs= require('fs');

let bodyparser=require('body-parser');

var router = express.Router();

router.get('/inner/getUserInfo',  function(req, res, next) {
    const sessionCookie = req.cookies.session || '';
    FireBase
    .auth()
    .verifySessionCookie(sessionCookie,true).then((decodedClaims)=>{
        let ans ={
            email:'',
            name:'',
            public_name:''
        }
        utilMongo.getUserData(decodedClaims.uid.toString()).then(data=>{
            ans.email=data.email;
            ans.name=data.name;
            ans.public_name=data.public_name;
            res.send(JSON.stringify(ans));
        }).catch(err=> {
            res.status(err.status).send(err);
        });
    }).catch(error => {
        res.status(401).send(JSON.stringify( {'status':'error'} ));
    });
});

router.get('/login', function(req, res, next) {
    res.render('admin/login',{layout:false});
  });

router.get('/*', function(req, res, next) {
    let succ = false;
    const sessionCookie = req.cookies.session || '';
    FireBase
    .auth()
    .verifySessionCookie(sessionCookie,true).then((decodedClaims)=>{
        next();
    }).catch(error => {
        res.redirect('login');
    });

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
  router.post('/sessionLogout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/admin/login');
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
  router.get('/*', function(req, res, next) {
    res.send("ERROR 404");

});
module.exports = router;