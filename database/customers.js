const mongoose = require('mongoose')

const customersSchema = new mongoose.Schema({
	name : {type:String, required:true, minlength:3, maxlength:128},
	isGold : {type: Boolean, default:false},
	phone : {type:Number }
	
})	

const Customers = mongoose.model('Customers',customersSchema);

async function addCustomer({name,isGold,phone}){
	customer = new Customers ({
		name : name,
		isGold : isGold,
		phone : phone
	})
	result = await customer.save();
	return result
}

async function getAllCustomers(){
	const customers = await Customers.find().sort('name');
	return customers
}

async function getCustomerById(id){
	const customer = await Customers.findById(id)
	return customer
}

async function updateCustomer(id,{name,isGold,phone}){
	const customer = await Customers.findByIdAndUpdate(id,{$set:{
		name : name,
		isGold : isGold,
		phone : phone
	}},{new:true}) 
	return customer
}

async function deleteCustomer(id){
	const customer = await Customers.findByIdAndRemove(id)
	return customer
}

module.exports = {
	getAll : getAllCustomers,
	getOne : getCustomerById,
	post : addCustomer,
	update : updateCustomer,
	delete : deleteCustomer,
	Customers
}