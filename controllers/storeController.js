exports.myMiddleware = (req, res, next) => {
  req.name= 'Saums';
  // if(req.name =='Saums'){
  //   throw Error('That is a nice name!');
  // } to create error
  // res.cookie('name','Saumya is cool!',{maxAge:90000}); //To set cookies
  next();

}
exports.homePage = (req, res) => {
console.log(req.name);
  res.render('index');
}