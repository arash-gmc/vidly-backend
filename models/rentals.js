const mongoose = require('mongoose')
const Fawn = require('fawn')
const DateDiff = require('date-diff')
const {Movies} = require('./movies')
const {Customers} = require('./customers')

Fawn.init(mongoose)

const rentalsSchema = new mongoose.Schema({
	
	customers : {
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true
			},
			isGold: {
				type: Boolean,
				default: false,
			},
			phone : {
				type: Number,
				required: true
			}
		}),
		required : true
	},
	
	movies : {
		type : new mongoose.Schema({
			title:{
				type: String,
				required: true
			},
			dailyRentalRate:{
				type: Number,
				required: true
			},	
		}),
		required: true
	},
	
	dateOut : {
		type: Date,
		default: Date.now() 
	},
	dateReturn : Date,
	rentalFee : {
		type: Number,
		min: 0
	}	
})

rentalsSchema.statics.lookup = function(customerId,movieId){
	return this.findOne({
		'customers._id' : customerId,
		'movies._id' : movieId
	})
}

rentalsSchema.methods.return = async function(){
	this.dateReturn = Date.now()
	this.rentalFee = 
		Math.ceil((this.dateReturn-this.dateOut)/(1000*3600*24))
		*this.movies.dailyRentalRate ;
	await this.save()
}

const Rentals = mongoose.model('Rentals',rentalsSchema);

async function getAllRentals(){
	const rentals = await Rentals.find().sort('-dateOut');
	return rentals
}

async function getRentalById(id){
	const rental = await Rentals.findById(id)
	
	return rental
}

async function addRental(body,res){
	const {customerId,movieId} = body
	const customer = await Customers.findById(customerId)
	if (!customer) return res.status(404).send('Customer Not Found')

	const movie = await Movies.findById(movieId)
	if (!movie) return res.status(404).send('The movie not found')
	
	if (movie.numberInStock ==0) return ('the movie is out of stock') 
	
	rental = new Rentals ({
		customers : {
			_id : customer._id,
			name : customer.name,
			isGold : customer.isGold,
			phone : customer.phone
		},
		movies : {
			_id : movie._id,
			title: movie.title,
			dailyRentalRate : movie.dailyRentalRate
		},

	})
	try {
		new Fawn.Task()
			.save('rentals',rental)
			.update('movies',{_id:movie._id},{$inc : {numberInStock : -1}})
			.run()
		return rental
	} catch(e) {
		console.error('Error: ',e)
		return res.status(500).send('somthing failed...')
	}
	
}



async function deleteRental(id){
	const rental = await Rentals.findByIdAndRemove(id)
	return rental
}

module.exports = {
	getAll : getAllRentals,
	getOne : getRentalById,
	post : addRental,
	delete : deleteRental,
	Rentals
}

