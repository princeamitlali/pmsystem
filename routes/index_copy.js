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

router.get('/passwordCategory',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  getpasscat.exec(function(err,data){
    if (err) throw err
  res.render('pass_cat', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser , records:data});
})
});

router.get('/add-new-category',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  
    res.render('addNewCategory', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser,errors:'',success:'' });


});

router.post('/add-new-category',checkLoginUser, [check('passwordCategory','enter password category name').isLength({min:1})],function(req, res, next) {
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


router.get('/add-new-password',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  getpasscat.exec(function(err,data){
    if(err) throw err;
    console.log(data)
  res.render('addNewPassword', { title: 'Password Management System',loginUser: loginUser,records: data, success:''});

  })
});

router.post('/add-new-password',checkLoginUser, function(req, res, next) {
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



router.get('/dashboard',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  res.render('dashboard', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser,msg:'' });
});


router.get('/logout', function(req, res, next) {
  localStorage.removeItem('usertoken')
  localStorage.removeItem('loginUser')
res.redirect('/')
});

router.get('/passwordCategory/delete/:id',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var passcat_id = req.params.id
  var passcatdel = passcatModel.findByIdAndDelete(passcat_id)
  passcatdel.exec(function(err,data){
    if (err) throw err
res.redirect('/passwordCategory')})
})

router.get('/passwordCategory/edit/:id',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var passcat_id = req.params.id
  var getpasscat = passcatModel.findById(passcat_id)
  getpasscat.exec(function(err,data){
    if (err) throw err
    res.render('edit_pass_cat', { title: 'PASSWORD MANAGMENT SYSTEM',loginUser:loginUser ,errors:'',success:'', records:data,id:passcat_id});
  })
})

router.post('/passwordCategory/edit/',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var passcat_id = req.body.id
  var passcat= req.body.passwordCategory
  var update_passcat = passcatModel.findByIdAndUpdate(passcat_id,{password_category:passcat})
  update_passcat.exec(function(err,data){
    if (err) throw err
res.redirect('/passwordCategory')  })
})

router.get('/password-details',checkLoginUser, function(req, res, next) {
  res.redirect('/dashboard')  
});

router.get('/password-details/edit/:id',checkLoginUser, function(req, res, next) {
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

router.post('/password-details/edit/:id',checkLoginUser, function(req, res, next) {
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

router.get('/password-details/delete/:id',checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var id = req.params.id
  var passcatdel = passdetmodel.findByIdAndDelete(id)
  passcatdel.exec(function(err,data){
    if (err) throw err
res.redirect('/view-all-password')})
})

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
module.exports = router;
