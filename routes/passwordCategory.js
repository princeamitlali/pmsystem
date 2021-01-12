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
      if (err) throw err
    res.render('pass_cat', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser , records:data});
  })
  });
  

  router.get('/delete/:id',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var passcat_id = req.params.id
    var passcatdel = passcatModel.findByIdAndDelete(passcat_id)
    passcatdel.exec(function(err,data){
      if (err) throw err
  res.redirect('/passwordCategory')})
  })
  
  router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var passcat_id = req.params.id
    var getpasscat = passcatModel.findById(passcat_id)
    getpasscat.exec(function(err,data){
      if (err) throw err
      res.render('edit_pass_cat', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser ,errors:'',success:'', records:data,id:passcat_id});
    })
  })
  
  router.post('/edit/',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var passcat_id = req.body.id
    var passcat= req.body.passwordCategory
    var update_passcat = passcatModel.findByIdAndUpdate(passcat_id,{password_category:passcat})
    update_passcat.exec(function(err,data){
      if (err) throw err
  res.redirect('/passwordCategory')  })
  })
  

  module.exports = router;
  
  