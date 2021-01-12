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
    getpasscat.exec(function(err,data){
      if(err) throw err;
      console.log(data)
    res.render('addNewPassword', { title: 'Password Management System',loginUser: loginUser,records: data, success:''});
  
    })
  });
  
  router.post('/',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var pascat = req.body.pass_cat;
    var pasdet = req.body.pass_details
    var pronam = req.body.project_name
    var password_details = new passdetmodel({
      password_category:pascat,
      project_name:pronam,
      password_details:pasdet
  
    })
    password_details.save(function(err,doc){
      getpasscat.exec(function(err,data){
        if(err) throw err;
      res.render('addNewPassword', { title: 'Password Management System',loginUser: loginUser,records: data, success:'password details inserted succesfully'});
    
    })
  
    })
  });
  
  
  
  module.exports = router;
  
  