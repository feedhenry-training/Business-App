/**
 * main entry of cloud side
 */


/**
 * Create a new Request ticket in Zendesk with requester
 */
function newRequest(param){
	return zendesk.newRequest(param.subject,param.des,param.email);
}

/**
 * Retrieve all request tickets
 */
function listUserRequests(param){
	return zendesk.listUserRequests(param.email);
}

/**
 * Calculate mortgage with user input
 */
function getMortgage(param){
	return mortgage.getMortgage(param.years,param.interest,param.loanAmount,param.tax,param.insurance);
}

/**
 * Get stock symbol and detailed information by company name
 */
function getStockInfo(param){
	return stock.getStockInfo(param.name);
}
