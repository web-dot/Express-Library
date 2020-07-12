let validator = require('express-validator');
var Genre = require('../models/genre');
const genre = require('../models/genre');

var Book = require('../models/book');
var async = require('async')
var mongoose = require('mongoose');


// Display list of all genre
exports.genrelist = (req, res) => {
  //res.send('NOT IMPLEMENTED: Genre list');
  Genre.find()
  .populate('genre')
  .sort([['name', 'ascending']])
  .exec(function (err, list_genres) {
    if (err) { return nest (err); }
    res.render('genre_list', { title: 'Genre_list', genre_list: list_genres }) 
  })
};

// Display detail page for a specific genre
exports.genre_detail = (req, res) => {
  var id = mongoose.Types.ObjectId(req.params.id);
  async.parallel({
    genre: (callback) => {
      Genre.findById(req.params.id)
      .exec(callback)
    },
    genre_books: (callback) => {
      Book.find({ 'genre': req.params.id})
      .exec(callback);
    }
  }, (err, results) => {
    if (err) {return next (err);}
    if (results.genre == null) { //No results.
    var err = new Error('Genre not found');
    err.status = 404;
    return next(err);
    }
    // Successful, so render
    res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
  });
};

// Display genre create form on GET
exports.genre_create_get = (req, res) => {
  res.render('genre_form', {title: 'Create Genre'})
};

// Handle genre create on POST
exports.genre_create_post =  [
   
  // Validate that the name field is not empty.
  validator.body('name', 'Genre name required').trim().isLength({ min: 1 }),
  
  // Sanitize (escape) the name field.
  validator.sanitizeBody('name').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre(
      { name: req.body.name }
    );


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ 'name': req.body.name })
        .exec( function(err, found_genre) {
           if (err) { return next(err); }

           if (found_genre) {
             // Genre exists, redirect to its detail page.
             res.redirect(found_genre.url);
           }
           else {

             genre.save(function (err) {
               if (err) { return next(err); }
               // Genre saved. Redirect to genre detail page.
               res.redirect(genre.url);
             });

           }

         });
    }
  }
];

// Handle genre delete  form on GET
exports.genre_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle genre delete on POST
exports.genre_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Handle genre update form on GET
exports.genre_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle update on POST
exports.genre_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
