let utilMongo = require('../javascript/mongodb.js');
const express = require('express');

var router = express.Router();

  
router.get('/', function(req, res, next) {
    res.render('index', {title:'Algoritmolandia' });
  });
  

router.get('/articulos', function(req, res, next) {
res.render('articles', {title:'articles' });
});
router.get('/articulo/:code', function(req, res, next) {
    var urlCode=req.params.code;
    if (!(/^[a-zA-Z\-0-9]+$/.test(urlCode))) {
      res.render('invalidurl',{});
      return;
    }
    utilMongo.getArticleByUrl(urlCode)
    .then(
      (data)=> {
        res.render('', {layout:'content-layout',title:data.title,content:data.content});        
      }
    )
    .catch (
      (err) => {
        if (!err){res.render('',{layout:'content-layout',title:"Algo fue mal, error 500",content:":/"})}else
        if (err.status!==404){res.render('',{layout:'content-layout',title:"Algo fue mal, error 500",content:JSON.stringify(err)})}else
        res.render('',{layout:'content-layout',title:"No existe la pagina que buscaste", content:"Parece ser que lo que buscas no esta aquí."})
      }
    );
  });

  router.get('/getJson/:code', function(req, res, next) {
    var urlCode=req.params.code;
    var rjson = {
      'msg':'error',
      'url':urlCode,
      'content':{}
    }
    if (!(/^[a-zA-Z\-0-9]+$/.test(urlCode))) {
      rjson.msg='Error 404';
      rjson.url = urlCode;
      res.json(rjson);
      return;
    }
    utilMongo.getArticleByUrl(urlCode)
    .then(
      (data)=> {
        rjson.msg="Success";
        rjson.content=data;
        res.json(rjson);        
      }
    )
    .catch (
      (err) => {
        if (!err){
          rjson.msg="EROR 500";
          res.json(rjson);

        }else
        if (err.status!==404){
          rjson.msg="ERROR 500";
          rjson.content=err;
          res.json(rjson);
        }else {        
          rjson.msg="ERROR 404";
          rjson.content=err;
          res.json(rjson);
        }
      }
    );

  });

  
module.exports = router;
