var express = require('express');
var router = express.Router();
const User = require('../model/database');
const multer = require('multer');
const fs = require("fs");
const { off } = require('process');


//img upload
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/images')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
})

var upload = multer({
  storage: storage,
}).single('image');

// Add new user
router.post('/add', upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    mail: req.body.email,
    image: req.file.filename,
  });
  user.save((err) => {
    if(err){
      res.json({message: err.message, type: 'danger'})
    } else {
      req.session.message = {
        type: 'success',
        message: 'User added successfully'
      };
      res.redirect("/");
    }
  })
})

router.get('/', function(req, res, next) {
  User.find().exec((err, users) => {
    if(err){
      req.json({message: err.message});
    } else {
      res.render('index', {title: 'Home Page', users: users})
    }
  })
});

router.get('/add', function(req, res) {
  res.render('add_users');
});

router.get('/edit/:id', (req,res) => {
  let id = req.params.id
  User.findById(id, (err, user) => {
    if(err){
      res.redirect('/');
    } else {
      if(user == null){
        res.redirect('/')
      } else {
        console.log(user)
        res.render('edit_users', {title: "Edit User", user: user })
      }
    }
  })
});

// Update user route
router.post('/update/:id', upload, (req, res) => {
  let id= req.params.id;
  let new_image = '';

  if(req.file){
    new_image = req.file.filename;
    try{
      fs.unlinkSync('/images/'+ req.body.old_image)
    } catch (err){
      console.log(err)
     }
    } else {
      new_image= req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
      name: req.body.name,
      mail: req.body.email,
      image: new_image
    }, (err, result) => {
      if(err){
        res.json({ message: err.message, type: 'danger'});
      } else {
        req.session.message = {
          type: 'success',
          message: 'User updated successfully'
        };
        res.redirect('/')
      }
    })
})

// Delete user
router.get('/delete/:id', (req, res) => {
  let id= req.params.id;
  User.findByIdAndRemove(id, (er, result) => {
    if(result.image != ''){
      try{
        fs.unlinkSync('/images/'+ result.image);
      } catch(er){
        console.log(er)
      }
    }

    if(er){
      res.json({message: er.message});
    } else {
      res.session.message= {
        type: 'info',
        message: 'User deleted successfully'
      };
      res.redirect('/');
    }

    
  })
})

module.exports = router;
