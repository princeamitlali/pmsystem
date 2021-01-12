var express = require('express');
var router = express.Router();

var userModule = require('../modules/user')

var bcrypt = require('bcryptjs')

var jwt = require('jsonwebtoken')



var passcatModel = require('../modules/password_category')
var passdetmodel = require('../modules/add_password')


var getpasscat = passcatModel.find()
var getAllPass =passdetmodel.find() 
const {check,validationResult} = require('express-validator');
const { count } = require('../modules/user');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


/* GET home page. */

function checkLoginUser(req,res,next){
  var usertoken = localStorage.getItem('usertoken');
  try {
    var decoded = jwt.verify(usertoken, 'loginToken')
  }catch(err){
    res.redirect('/');
  }
  next()
}


function checkUsername(req,res,next){
  var uname=req.body.uname;
  var checkexitemail=userModule.findOne({username:uname});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'username Already Exit' });

 }
 next();
  });
}



function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Email Already Exit' });

 }
 next();
  });
}




router.get('/',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var perPage = 1
   var page = req.params.page || 1
  
    var query   = {};
    var options = {
      offset:   1, 
      limit:    perPage
  };
    
  passdetmodel.paginate(query,options ).then(function(result) {
        //if(err) throw err;
      //console.log(result)
      res.render('viewAllPassword', { title: 'PASSWORD MANAGMENT SYSTEM',
      loginUser:loginUser,
      records:result.docs,
      current:result.offset,
      pages:Math.ceil(result.total/result.limit) });
      })
  });
  
  router.get('/:page',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var perPage = 1
   var page = req.params.page || 1
    
    getAllPass.skip((perPage * page) - perPage).limit(perPage).exec(function(err,data){
      if(err) throw err;
      passdetmodel.estimatedDocumentCount({}).exec((err,count)=>{
      res.render('viewAllPassword', { title: 'PASSWORD MANAGMENT SYSTEM',
      loginUser:loginUser,
      records:data,
      current:page,
      pages:Math.ceil(count/perPage) });
      })})
  });

  module.exports = router;
  
  