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
    
      res.render('addNewCategory', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser,errors:'',success:'' });
  
  
  });
  
  router.post('/',checkLoginUser, [check('passwordCategory','enter password category name').isLength({min:1})],function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      //console.log(errors.mapped())
      res.render('addNewCategory', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser,errors:errors.mapped(),success:'' });
  
    }else{
      var passcatname = req.body.passwordCategory
      var passcatDetails = new passcatModel({
        password_category:passcatname
      })
  
      passcatDetails.save(function(err,doc){
        if(err) throw err
        res.render('addNewCategory', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser,errors:'',success:'Password category inserted succesfully' });
  
      })
  }
  });
  
  module.exports = router;
  
  