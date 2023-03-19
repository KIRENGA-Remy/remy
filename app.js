

const express = require('express');
const { result } = require('lodash');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user');

// Register the EJS view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))

//Db=remy,Colection=users and it's Url
const dbUrl = 'mongodb://127.0.0.1:27017/remy'
mongoose.connect(dbUrl, {useUnifiedTopology:true, useNewUrlParser: true})
.then(() => {

    // Listen for requests on the server
    const server = app.listen(process.env.PORT || 3027, () => {
        console.log(`Server listening on port ${server.address().port}...`);
    });
 
})
.catch((err) => {
    console.log(err);
})
//Creating middlewares
app.use((req,res,next)=>{
    console.log('New request is made');
    console.log('host:', req.hostname);
    console.log('path:', req.path);
    console.log('method:', req.method);
    next();
})

// Render the home page with user data 
app.get('/home', (req,res) => {
    res.redirect('/user');
});

//Another middleware
app.use((req,res,next)=>{
    console.log('In the next middleware');
    next();
});

// Render the about page
app.get('/about', (req, res) => {
    res.render('about', {title: 'About Page'});
});

// Handle requests to create new blog posts
app.get('/create', (req, res) => {
    try {
        res.render('create', {title: 'Create Page'});
    } catch (err) {
        res.status(500).send('Error: could not render create page');
    }
});
// Linking to the LogIn Page
app.get('/logIn', (req,res)=>{
    res.render('logIn', {title:"LogIn Page"});
})

app.get('/details/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
      .then(user => {
        res.render('details', { title: 'Details Page', user: user });
      })
      .catch(err => {
        console.log(err);
        res.status(404).send('User not found');
      });
  });
  

app.use('/users',(req,res)=>{
    const thisUser = new User(req.body);
    thisUser.save()
    .then((result)=>{
        res.redirect('/about');
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.delete('/users/:id', (req,res)=>{
    const id = req.params.id;

    User.findByIdAndDelete(id)
    .then(result =>{
        res.json({redirect: '/about'});
    })
    .catch((err) =>{
        console.log(err);
    })
})


// Handle 404 errors
app.use((req, res) => {
    res.status(404).render('404', {title: '404 Page'});
});