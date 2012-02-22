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
 * 
 */
function listUserRequests(param){
	return zendesk.listUserRequests(param.email);
}
