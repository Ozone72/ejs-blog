//jshint esversion:6
// * MODULES *
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

// * GLOBAL VARIABLES *
const homeStartingContent =
  '"Love in the time of COVID" was all she said before she walked out of the door - and my life - forever.';
const contactContent = 'Noumenal Code LLC | info@noumenalcode.tech';
const aboutContent =
  'Noumenal Code is a full service web development consultancy';

// * APP INSTANCE *
const app = express();

// * MIDDLEWARE *
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// * CONNECTION *
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGO_URI, options)
  .then((res) => {
    console.log('Connected to EJS Blog Database - Initial Connection');
  })
  .catch((err) => handleError(err));

// * ERROR HANDLER *
const handleError = (err) => {
  console.log(`Intial connection error occurred: ${err}`);
};

// * SCHEMAS *
// Items schema and model
const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model('Post', postsSchema);

// * ROUTES *
// Root route
app.get('/', (req, res) => {
  Post.find({}, function (err, posts) {
    if (!err) {
      res.render('home', {
        homeContent: homeStartingContent,
        posts: posts,
      });
    }
  });
});

// About route
app.get('/about', (req, res) => {
  res.render('about', {
    aboutContent: aboutContent,
  });
});

// contact route
app.get('/contact', (req, res) => {
  res.render('contact', {
    contactContent: contactContent,
  });
});

// compose route
app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {
  const title = req.body.titleInput;
  const content = req.body.postInput;
  const post = new Post({
    title: title,
    content: content,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect('/');
    }
  });
});

// posts route
app.get('/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId, function (err, postId) {
    if (!err) {
      res.render('post', {
        title: postId.title,
        content: postId.content,
      });
    }
  });
});

// * SERVER *
let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

app.listen(port, function () {
  console.log('Server started on port ' + port);
});
