const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
console.log(req.name);
  res.render('index',{title:'Bake Stores'});
};

exports.addStore = (req, res) => {
  res.render('editStore',{title:'Add Store'});
};

exports.createStore = async (req,res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success',`Sucessfully created ${store.name}. Care to leave a review!`); //success/error/warning/info
  res.redirect(`/store/${store.slug}`);
};