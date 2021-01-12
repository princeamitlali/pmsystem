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



router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  if(loginUser){
    res.redirect('./dashboard')
  }
  else{
  res.render('index', { title: 'PASSWORD MANAGMENT SYSTEM',msg:'' });
  }
});

router.post('/', function(req, res, next) {
  var user = req.body.uname;
  var Pass = req.body.password;
  var getusername = userModule.findOne({username:user})
  getusername.exec((err,data)=>{
    if (err) throw err;
    var getUserid = data._id;
    var getPassword = data.password;
    if(bcrypt.compareSync(Pass,getPassword)){
      var token = jwt.sign({userId:getUserid},'loginToken');
      localStorage.setItem('usertoken',token);
      localStorage.setItem('loginUser',user);
      res.redirect('/dashboard');
    }else{
      res.render('index', { title: 'PASSWORD MANAGMENT SYSTEM',msg:'invalid login credentials' });

    }
   ;
  })


});

router.get('/signup', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  if(loginUser){
    res.redirect('./dashboard')
  }
  else{
  res.render('signup', { title: 'PASSWORD MANAGMENT SYSTEM',msg:'' });
  }
});

router.post('/signup',checkEmail,checkUsername, function(req, res, next) {
    var uname = req.body.uname;
    var Email = req.body.email;
    var Password = req.body.password;
    var cnfpass = req.body.confpassword;
    if (Password != cnfpass){
      res.render('signup', { title: 'PASSWORD MANAGMENT SYSTEM',msg:'password not matched' });
    }
    else{
      Password = bcrypt.hashSync(req.body.password,10)
      var usersDetail = new userModule({
        username:uname,
        email:Email,
        password:Password
      })
      usersDetail.save((err,data)=>{
        if(err) throw err
        res.render('signup', { title: 'PASSWORD MANAGMENT SYSTEM',msg:'user registered sucessfully' });
      })}

});




router.get('/logout', function(req, res, next) {
  localStorage.removeItem('usertoken')
  localStorage.removeItem('loginUser')
res.redirect('/')
});

/*
router.get('/view-all-password',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var perPage = 1
 var page = req.params.page || 1
  
  getAllPass.skip((perPage * page) - perPage).limit(perPage).exec(function(err,data){
    if(err) throw err;
    passdetmodel.countDocuments({}).exec((err,count)=>{
    res.render('viewAllPassword', { title: 'PASSWORD MANAGMENT SYSTEM',
    loginUser:loginUser,
    records:data,
    current:page,
    pages:Math.ceil(count/perPage) });
    })})
});

router.get('/view-all-password/:page',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var perPage = 1
 var page = req.params.page || 1
  
  getAllPass.skip((perPage * page) - perPage).limit(perPage).exec(function(err,data){
    if(err) throw err;
    passdetmodel.countDocuments({}).exec((err,count)=>{
    res.render('viewAllPassword', { title: 'PASSWORD MANAGMENT SYSTEM',
    loginUser:loginUser,
    records:data,
    current:page,
    pages:Math.ceil(count/perPage) });
    })})
});

*/


module.exports = router;
