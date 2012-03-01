/**
 * main entry of cloud side
 */

var mortgage=require("./mortgage");
var stock=require("./stock");

var zendesk=require("./zendesk");


/**
 * Create a new Request ticket in Zendesk with requester
 */
function newRequest(param,callback) {
	zendesk.newRequest(param.subject, param.des, param.email,callback);
}

/**
 * Retrieve all request tickets
 */
function listUserRequests(param,callback) {
	zendesk.listUserRequests(param.email,callback);
}

/**
 * Calculate mortgage with user input
 */
function getMortgage(param,callback) {
	mortgage.getMortgage(param.years, param.interest, param.loanAmount, param.tax, param.insurance,callback);
}

/**
 * Get stock symbol and detailed information by company name
 */
function getStockInfo(param,callback) {
	stock.getStockInfo(param.name,callback);
}


exports.newRequest=newRequest;
exports.listUserRequests=listUserRequests;
exports.getMortgage=getMortgage;
exports.getStockInfo=getStockInfo;
