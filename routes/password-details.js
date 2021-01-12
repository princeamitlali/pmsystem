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
    res.redirect('/dashboard')  
  });
  
  router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var id = req.params.id;
    var getpassdetails  = passdetmodel.findById({_id:id})
    
    getpassdetails.exec(function(err,data){
      console.log(data)
      if(err) throw err;
      getpasscat.exec(function(err,data1){
      res.render('edit_pass_det', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser,records:data1,record:data,success:'', });
    })
    })  
  });
  
  router.post('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var id = req.params.id;
    var passcatt = req.body.pass_cat;
    var projname = req.body.project_name;
    var passdet = req.body.pass_details;
    passdetmodel.findByIdAndUpdate(id,{password_category:passcatt,project_name:projname,pass_details:passdet},{useFindAndModify: false}).exec(function(err){
      if(err) throw err
    var getpassdetails  = passdetmodel.findById({_id:id})
    
    getpassdetails.exec(function(err,data){
      console.log(data)
      if(err) throw err;
      getpasscat.exec(function(err,data1){
      res.render('edit_pass_det', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser,records:data1,record:data,success:'password updated successfully', });
    })
       
  })
    })  
  });
  
  router.get('/delete/:id',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var id = req.params.id
    var passcatdel = passdetmodel.findByIdAndDelete(id)
    passcatdel.exec(function(err,data){
      if (err) throw err
  res.redirect('/view-all-password')})
  })
  
  module.exports = router;
  
  