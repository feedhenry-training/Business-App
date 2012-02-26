/**
 * main entry of cloud side
 */
//var zendesk=require("./zendesk");
var mortgage=require("./mortgage");
var stock=require("./stock");




/**
 * Create a new Request ticket in Zendesk with requester
 */
function newRequest(param,callback) {
	callback(undefined, zendesk.newRequest(param.subject, param.des, param.email));
}

/**
 * Retrieve all request tickets
 */
function listUserRequests(param,callback) {
	callback(undefined, zendesk.listUserRequests(param.email));
}

/**
 * Calculate mortgage with user input
 */
function getMortgage(param,callback) {
	callback(undefined, mortgage.getMortgage(param.years, param.interest, param.loanAmount, param.tax, param.insurance));
}

/**
 * Get stock symbol and detailed information by company name
 */
function getStockInfo(param,callback) {
	callback(undefined, stock.getStockInfo(param.name));
}


exports.newRequest=newRequest;
exports.listUserRequests=listUserRequests;
exports.getMortgage=getMortgage;
exports.getStockInfo=getStockInfo;

exports.beep = function(param,callback) {
	callback(undefined, {hello:"world"});
}