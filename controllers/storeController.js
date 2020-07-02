const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer= require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req,file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto){
      next(null,true);
    } else {
      next({message: 'That file type isn\'t allowed.'}, false);
    }
  }
}

exports.homePage = (req, res) => {
  res.render('index', { title: 'Bake Stores' });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async  (req, res, next) => {
  //check if there is no new file to resize
  if(!req.file){
    next();
    return;//skip to next middleware
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  //now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next(); 
}

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
  //set the location data to be a point

  req.body.location.type = 'Point';
  //find and update the store
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true
    }//return updated stoe
  ).exec();

  req.flash('success', `Successfully Updated <strong>${store.name}</strong>. <a href="/store/${store.slug}">View Store ⤵</a> `);
  res.redirect(`/stores/${store._id}/edit`);
  //redirect them to store and tell the user
  
}
exports.getStoreBySlug = async (req,res, next) => {
  const store = await Store.findOne({slug: req.params.slug});
  if(!store) return next();
  //redirect to pug page
  res.render('showStore', { title: store.name, store});
}