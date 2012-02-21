/**
 * bind.js
 * bind dom events to handler
 */

function bindEvents(){
	$("#submitZendesk").bind("click",function(){
		var subject=$("#subject").val();
		var description=$("#des").val();
		var email=$("#email").val();
		
		zendesk.newRequest(subject,description,email);
	});
	
	$("#getRequests").bind("click",function(){
		var email=$("#email").val();
		zendesk.listUserRequests(email);
	});
}


$(document).ready(bindEvents);
