const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index', { title: 'Bake Stores' });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Sucessfully created ${store.name}. Care to leave a review!`); //success/error/warning/info
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  //query database for list of stores
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  //find store for given id
  const store = await Store.findOne({ _id: req.params.id });

  //check if they are owner
  //render out edit form so that user cn update the store
  res.render('editStore', { title: `Edit "${store.name}"`, store });
}

exports.updateStore = async (req, res) => {
  //find and update the store
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true
    }//return updated stoe
  ).exec();

  req.flash('success', `Successfully Updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store ⤵</a> `);
  res.redirect(`/stores/${store._id}/edit`);
  //redirect them to store and tell the user
  
}