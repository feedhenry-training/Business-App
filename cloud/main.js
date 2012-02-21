/**
 * main entry of cloud side
 */

function newRequest(param){
	return zendesk.newRequest(param.subject,param.des,param.email);
}
