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
	b_name: {type: String, require: false},
	book_id: {type: String, required: false},
	date: {type: Date, required: false},
	state: {type: String, required: false}
}, { collection: 'transaction_data'});

var BookTransaction = mongoose.model('BookTransaction', transaction);


//get all books
router.get('/', (req, res, next)=>{
	Book.find(function(err, books){
			res.json(books);
		});
});


//save a new book
router.post('/insert', (req, res, next)=>{

	let book = new Book ({
		book_name: req.body.book_name,
		author: req.body.author,
		isbn: req.body.isbn,
		quantity: req.body.quantity,
		publish_date: req.body.publish_date,
		category: req.body.category,
		books_issued: 0
	});
	if(book.book_name && book.quantity > 0){
			book.save((err, book)=>{
					if(err)
					{
						res.json({msg: 'add book failed'});
					}
						else{
							res.json({msg: 'book added'})
						}

					})
			}
});


//update number of books
router.post('/update/:id',(req, res, next)=>{
	Book.findByIdAndUpdate(req.body._id, req.body, function(err, book){

		if(err){
			res.send(err);
		}
		res.json(book);
	})
});


//remove book
router.post('/delete/:id',(req, res, next)=>{
	books_issued = req.body.books_issued;
	if(books_issued == 0){
			Book.remove({_id: req.params.id}, function(err, result){
					if(err){
						res.json(err);
					}
					else{
						res.json(result);
					}
				});
			}
	});

//---------------------transactions-----------------------------//

router.get('/transactions', (req, res, next)=>{
	BookTransaction.find(function(err, tran){
			res.json(tran);
		});
});


//transaction issue
router.post('/issue/:id', function(req, res, next){
		var book_id = req.body._id;
		var book = req.body
		Book.findById(book_id, function(err, doc){

				if(doc.quantity > 0){
						doc.quantity--;
						doc.books_issued++;
						doc.book_id = book_id;
						doc.save();
				}
				else{
					return;
			  }
				var data = {
					b_name: doc.book_name,
					book_id: book_id,
					date: new Date(),
					state: 'issued'
				}
				var transaction = new BookTransaction(data);
				transaction.save();
	});
});


//transaction return
router.post('/return/:id', function(req, res, next){

			var trans_id = req.body._id;
			state = req.body.state;
						BookTransaction.findById(trans_id, function(err, doc){
							  if(doc.state === 'issued'){
											doc.date = new Date();
											doc.state = state;
											doc.save();
											var book_id = doc.book_id;
											Book.findById(book_id, function(err, doc){
													doc.quantity++;
													doc.books_issued--;
													doc.save();
											});
									}
					});
});

module.exports = router;
