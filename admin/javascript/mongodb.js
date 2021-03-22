 module.exports = {

    getArticleByUrl(url) {
        return new Promise(
            function (resolve, reject) {
                if (typeof url !== "string") {
                    reject({status:400,message:'Url is not string'});
                    return;
                }
                var database;
                MongoClient.connect(MongoUri)
                .then (
                    function(dtb) {
                        database=dtb;
                        database.db('websiteInfo').collection('articles').findOne({url:url})
                        .then((data)=>{
                            database.close();
                            if (!data) {
                                reject({status:404,message:"No existe el articulo por esa url"});
                                return;
                            }
                            resolve(data);
                     
                        })
                        .catch((err)=>{database.close(); reject({status:500, message:"Error buscando el elemento"})});
                    }
                )
                .catch(()=>reject({status:500, message:"Error al conectarse a mongo"}));
            });
    }

 }

// module.exports = {
//     /**
//      * Summary. Inserta un articulo, y todos los documentos necesarios.
//      * @param {JSON} data Json con la informacion del articulo ({content:"",title:"",url:"",categories:"",uid:"",shortDescription:""})
//      * 
//      */
//     insertArticle:function(data) {
//         return new Promise(
//             function (resolve, reject) {
//                 if (typeof data.content         ==='undefined' || data.content===""||
//                     typeof data.title           ==='undefined' || data.title===""  ||
//                     typeof data.url             ==='undefined' || data.url===""    ||
//                     typeof data.categories      ==='undefined' || 
//                     typeof data.uid             ==='undefined' || data.uid===""    ||
//                     typeof data.shortDescription==='undefined' || data.shortDescription==""
//                 ) {
//                     reject({message:'missing data',details:data,status:400});
//                     return;
//                 }
//                 if (!(/^[a-zA-Z\-0-9]+$/.test(data.url))) {
//                     reject({message:'invalid url',details:data.url,status:400})
//                     return;
//                 }
//                 data.categories=data.categories.toLowerCase();
//                 if (!(/^[a-z\-0-9\,]+$/.test(data.categories))) {
//                     reject({message:'invalid category field',details:data.categories,status:400})
//                     return;
//                 }             
               
//                 var success=true;
//                 var database;
//                  MongoClient.connect(MongoUri)
//                     .then (
//                         (datab)=>{
//                             database=datab;
//                             var article = {
//                                 title: data.title,
//                                 url:data.url,
//                                 shortDescription:data.shortArticle,
//                                 content:data.content,
//                                 date:new Date(),
//                                 categories:[]
//                             }
//                             var shortArticle = {
//                                 title:data.title,
//                                 url:data.url,
//                                 shortDescription:data.shortDescription,
//                                 date:new Date(),
//                                 noVistas:0
//                             }
//                             var contribution = {
//                                 uid:data.uid,
//                                 date:new Date(),
//                                 obj:"Creation of article",
//                                 details:data
//                             }
//                             database.db('algoritmolandia').collection('categorias').find({url:{$in:data.categories.split(',')}}).toArray()
//                             .then((categories)=>{

//                                 if (categories.length!==data.categories.split(',').length) {
//                                     reject({message:"Algunas categorias no existen",details:categories,status:400});   
//                                     //NO BORRAR, CONNECTION LEAK                                
//                                     database.close();
//                                     return;
                                    
//                                 }
//                                 for (var i =0; i< categories.length; i++) {
//                                     article.categories.push(categories[i].url);
//                                 }
//                                 return Promise.all([
                                        
//                                         database.db('algoritmolandia').collection ('articulos').insert(article),
//                                         database.db('algoritmolandia').collection('listaDeArticulos').insert(shortArticle),
//                                         database.db('algoritmolandia').collection('contribuciones').insert(contribution) 
//                                     ])
//                             }
//                             )                            
//                            .then ((mongodata)=> {                        
//                                var promises=[];
//                                var categories= data.categories.split(',');
//                                for (var i =0; i < categories.length; i++) {
//                                     promises.push(
//                                         database.db('algoritmolandia').collection ('categorias').update({url:categories[i]},{$push:{articles:data.url}})
//                                     )
//                                }
//                             return Promise.all(promises)
//                            })
//                            .then((mongdata)=>{
//                                resolve("Exito");
//                                //NO BORRAR, CONNECTION LEAK
//                                database.close();                               
//                            })
//                            .catch((err)=>{ 
//                                 success=false; 
//                                 if (err.code && err.code === 11000) {
//                                     reject({message:'Un articulo con esa url ya existe',details:data, status:400})
//                                 }else {
//                                     reject({message:"Error creando articulo", details:err});                
//                                 }                  
//                                 database.close();                                
//                             });
//                             })
//                             .catch((err)=>{ reject({message:"Error conectandose a mongo", details:err,status:500});  });
//                         }
//                     )
//             },
//             /**
//              * Summary. Regresa un arreglo con los documentos de todos los short articles.
//              */
//             getAllShortArticles:function() {
//                 return new Promise(function(resolve, reject){
//                     MongoClient.connect(MongoUri).
//                     then((database)=>{
//                         database.db('algoritmolandia').collection('listaDeArticulos').find({}).toArray()
//                         .then((res)=>{resolve(res); })
//                         .catch(()=> reject("Error al obtener articulos"));
                        

//                         database.close();
//                     })
//                     .catch(
//                       ()=>  reject({message:"Error al conectarse con mongo",status:500})

//                     );
//                 });

//             },
            
//             getAllPublicShortArticles:function() {
//                 return new Promise(function(resolve, reject){
//                     MongoClient.connect(MongoUri).
//                     then((database)=>{
//                         database.db('algoritmolandia').collection('listaDeArticulos').find({public:true }).toArray()
//                         .then((res)=>{resolve(res); })
//                         .catch(()=> reject("Error al obtener articulos"));
                        

//                         database.close();
//                     })
//                     .catch(
//                       ()=>  reject({message:"Error al conectarse con mongo",status:500})

//                     );
//                 });

//             },

//             getArticleByUrl:function(url) {
//                 return new Promise(
//                     function (resolve, reject) {
//                         if (typeof url !== "string") {
//                             reject({status:400,message:'Url is not string'});
//                             return;
//                         }
//                         var database;
//                         MongoClient.connect(MongoUri)
//                         .then (
//                             function(dtb) {
//                                 database=dtb;
//                                 database.db('algoritmolandia').collection('articulos').findOne({url:url})
//                                 .then((data)=>{
//                                     database.close();
//                                     if (!data) {
//                                         reject({status:404,message:"No existe el articulo por esa url"});
//                                         return;
//                                     }
//                                     resolve(data);
                                    
//                                 })
//                                 .catch((err)=>{database.close(); reject({status:500, message:"Error buscando el elemento"})});
//                             }
//                         )
//                         .catch(()=>reject({status:500, message:"Error al conectarse a mongo"}));
//                     });
//             },

//             deleteArticleByUrl:function(url, uid) {
//                 return new Promise(
//                     function(resolve,reject) {
//                         if (typeof url !== 'string' || typeof uid !=='string') {
//                             reject({status:400, message:"datos invalidos o faltantes"}); 
//                             return;
//                         } 

//                         var database;
//                         MongoClient.connect(MongoUri)
//                         .then (
//                             function(dtb) {
//                                 database=dtb; 

//                                 database.db('algoritmolandia').collection('articulos').findOne({url:url})
//                                 .then((bigArticle)=>{  
//                                     var promises=[]
//                                     console.log(bigArticle)
//                                         for (var i =0; i < bigArticle.categories.length; i++) {
//                                             promises.push(
//                                                 database.db('algoritmolandia').collection('categorias').update(
//                                                     {url:bigArticle.categories[i]},{'$pull':{articles:url}}
//                                                 )  
//                                             )
//                                         } 
//                                         promises.push(database.db('algoritmolandia').collection('articulos').deleteOne({url:url}))
//                                         promises.push(database.db('algoritmolandia').collection('listaDeArticulos').deleteOne({url:url}))
//                                     return Promise.all(
//                                      promises)
//                                 }
//                                 )
//                                 .then(
//                                     (data)=> {
//                                         resolve("Exito");
//                                         database.close();
                                        
//                                     }
//                                 )
//                                 .catch(
                                    
//                                     (err)=>{
//                                         database.close();
                                        
//                                         reject({status:500,message:"Error al borrar articulo"})
//                                     }
//                                 )
//                             }
//                         )
//                         .catch(()=>reject({status:500, message:"Error al conectarse a mongo 2"}));

//                     }

//                 )
//             }

//     }





// */