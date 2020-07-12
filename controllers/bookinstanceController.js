const { body, validationResult } = require ( 'express-validator/check' );
const { sanitizeBody } = require ('express-validator/filter');

var BookInstance = require('../models/bookinstance');

var Book = require('../models/book')

// Display list of all BookInstances
exports.bookinstance_list = (req, res, next) => {
  BookInstance.find()
  .populate('book')
  .exec(function (err, list_bookinstances) {
    if (err) { return next(err); }
    // Successful, so render
    res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances})
  });
};

// Display detail page for specific BookInstance
exports.bookinstance_detail = (req, res, next) => {
  
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec((err, bookinstance) => {
    if (err) { return next(err); }
    if (bookinstance == null) { // No results
      var err = new Error('Book copy not found');
      err.status = 404;
      return next(err);
    }
     // Successful so render.
  res.render('bookinstance_detail', { title: 'Copy: '+booinstance.book.title, bookinstance: bookinstance})
  });
} 
 

// Display BookInstance create form on GET
exports.bookinstance_create_get = (req, res, next) => {
  
  Book.find({}, 'title')
  .exec(function (err, books) {
    if (err) { return next(err); }

    // Successful, so render
    res.render('bookinstance_form', { title: 'Create_bookInstance', book_list: books})
  });
};

// Handle BookInstance create on POST
exports.bookinstance_create_post = [

  // Validate fields
  body('book', 'book must be speacified').trim().isLength({ min: 1 }),
  body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }),
  body('due_back', 'Invalid_date').optional({ checkFalse: true}).isISO8601(),


  // Sanitize fields
  sanitizeBody('book').escape(),
  sanitizeBody('imprint').escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),



  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data

    var bookinstance = new BookInstance(
      {
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        duw_back: req.body.due_back
      }
    )

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages
      Book.find({}, 'title')
      .exec(function (err, books) {
        if (err) {return next(err);}
      });
      return;
    }
    else {
      // Data from form is valid
      bookinstance.save(function(err) {
        if (err) {return next(err)}
        // Successful - redirect to new record.
        res.redirect(bookinstance.url)
      });
    }
  }

];

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance delete GET')
};

// Display BookInstance delete on POST
exports.bookinstance_delete_post = () => {
  res.send('NOT IMPLEMENTED: BookInstance delete POST')
}
// Display BookInstance update form on GET
exports.bookinstance_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET')
};


// Handle BookInstance update on POST
exports.bookinstance_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST')
}