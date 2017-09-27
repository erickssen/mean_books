var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');



var Schema = mongoose.Schema;

var bookDetails = new Schema({
	book_name: {type: String, required: false},
	author: {type: String, required: false},
	isbn: {type: String, required: false},
	quantity: {type: Number, required: false},
	publish_date: {type: Date, required: false},
	category: {type: String, required: false},
	books_issued: {type: Number, required: false},
}, { collection: 'books_data'});

var Book = mongoose.model('Book', bookDetails);




var transaction = new Schema({
	book_name: {type: String, require: false},
	book_id: {type: String, required: false},
	date: {type: Date, required: false},
	state: {type: String, required: false}
}, { collection: 'books_data'});

var BookTransaction = mongoose.model('BookTransaction', transaction);






//------------------------books------------------------//

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});



//get all books
router.get('/get-data', function(req, res, next){
	Book.find()
		.then(function(doc){
			res.render('index', { items: doc });
		});
});



//save a new book
router.post('/insert', function(req, res, next){
	var item = {
		book_name: req.body.book_name,
		author: req.body.author,
		isbn: req.body.isbn,
		quantity: req.body.quantity,
		publish_date: req.body.publish_date,
		category: req.body.category,
		books_issued: 0
	};
	var data = new Book(item);
	data.save();
	res.redirect('/')
});



//update number of books
router.post('/update', function(req, res, next){
	var id = req.body.id;

	Book.findById(id, function(err, doc){
		if(err){
			// res.send(err);
			console.log('error updating model, no entry found');
		}
		doc.quantity = req.body.quantity;
		doc.save();
	})
	res.redirect('/');
});



//remove book
router.post('/delete', function(req, res, next){
	var id = req.body.id;
	Book.findByIdAndRemove(id).exec();
	res.redirect('/');
});

	
//---------------------transactions-----------------------------//



//get all transactions
router.get('/transactions', function(req, res, next){
	BookTransaction.find()
		.then(function(doc){
			res.render('index', { issues: doc });
		});
});



//transaction issue
router.post('/issue', function(req, res, next){

	var book_id = req.body.id;

	Book.findById(book_id, function(err, doc){
		if(doc.quantity > 0){
			doc.quantity--;
			doc.books_issued++;
			doc.save();
		}
		else{
			console.log('error with find book at issue') 
		}
		var data = {
			book_name: doc.book_name,
			book_id: book_id,
			date: new Date(),
			state: 'issued'
		}
		var transaction = new BookTransaction(data);
		transaction.save();
		res.redirect('/'); 
	});
});



//transaction return
router.post('/return', function(req, res, next){

	var transaction_id = req.body.id;

	BookTransaction.findById(transaction_id, function(err, doc){ 

		doc.date = new Date();
		doc.state = 'returned';
		doc.save();
	
	var book_id = doc.book_id;
	Book.findById(book_id, function(err, doc){
		doc.quantity++;
		doc.books_issued--;
		doc.save();
		console.log('--------->', typeof(doc))
	});
	
});
	res.redirect('/'); 
});


















module.exports = router;







