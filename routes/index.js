const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  const data={ name:'Saumya',age:26, cool:true};
  // res.send('Hey! It works!');
  // res.json(data);
  res.render('hello',{
    name:'sanket',
    dog:req.query.dog,
    title:'Bake It!'
  });
});

router.get('/reverse/:name',(req,res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
})
module.exports = router;
