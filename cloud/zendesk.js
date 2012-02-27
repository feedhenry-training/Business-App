//REST exmaple
/**
 * Help desk software is used by support desk agents (also called operators) to monitor the user environment for issues ranging from technical problems to user preferences and satisfaction.
 * Businesses typically use help desk software to:
 * answer commonly asked questions with an FAQ or knowledge base
 * track issues through their life-cycle
 * streamline and record customer interactions, including phone calls & live chats
 * Help desk software reduces the need to rely upon email-only support, reducing the number of transactions and missed or lost messages.
 * 
 * For more information about Zendesk REST please visit: http://www.zendesk.com/support/api/rest-introduction
 * 
 */
var zendesk={
  zenDeskUrl : "https://fhbusiness.zendesk.com", // Zendesk URL. This URL will expire in 30 days. Developers could register 1 for free for 30 days trails.
  agentAuth:"keyang.xiang@gmail.com:password",  //agent that will create tickets for end-users. it is in username:password format. required by Zendesk API. Developers need to have 1 agent account to perform the operations.
  agentHeader:"X-On-Behalf-Of", // agent header is used by Zendesk to locate the end-users. required by Zendesk API
  /**
   * Create a new ticket with a email address
   * Tutorial: How to post a REST request with xml request body & How to parse and retrieve xml type response.
   */
  newRequest:function(subject, content,userEmail,callback){
  	//Initiate a request template using XML Object.
  	var requestBody="<ticket><subject></subject><description></description><requester-email></requester-email></ticket>";
  	var libxml=require("libxmljs");
  	var doc=libxml.parseXmlString(requestBody);
  	callback(undefined,doc);
  	return;
	 var apiRelUrl="/tickets.xml"; //Relative api url
	 // API absolute url
	 var apiAbsUrl=zendesk.zenDeskUrl+apiRelUrl;
	 //
	 var auth=zendesk.agentAuth;
	 //pass user input to request body
	 requestBody.subject=subject;
	 requestBody['requester-email']=userEmail;
	 requestBody.description=content;
	 
	 //prepare REST call
	 var userOpt={
	 	contentType:"application/xml", // contentype is  xml,  required by zendesk
	 	method:"POST", // use POST method. required by zendesk
	 	body:requestBody.toString() 
	 }
	 
	 //perform webcall
	 var res=zendesk.webcall(apiAbsUrl,auth,userOpt);
	 
	 //check status header returned
	 var status=zendesk.getHeader(res,"Status");
	 if ("201 Created"===status){
	 	return {"status":"OK"};
	 }else{
	 	return {"status":"error"};
	 }
	 
	 
  },
  /**
   * List all tickets that are created by a user specified by user email
   * Tutorial: How to parse JSON type response
   */
  listUserRequests:function(userEmail){
  	var requestBody=null;  // this request does not need request body.
  	
  	var apiRelUrl="/requests.json";
  	var apiAbsUrl=this.zenDeskUrl+apiRelUrl;
  	var auth=this.agentAuth;
  	
  	//Prepare REST call
  	var agentHeader=this.agentHeader;
  	var userOpt={
  		headers:[{
  			name:agentHeader, //!important, this header is required by Zendesk REST api to tell Zendesk that an agent is performing this action for an end-user. checkout:http://www.zendesk.com/support/api/rest-introduction
  			value:userEmail
  		}
  		]
  	};
  	
  	var res=this.webcall(apiAbsUrl,auth,userOpt);
  	
  	//check status header returned
  	 var status=this.getHeader(res,"Status");
	 if ("200 OK"==status){
	 	return {"status":"OK","data":res.body};
	 }else{
	 	return {"status":"error"};
	 }
  	
  },
  /**
   * Webcall wrapper
   * @param url: the REST absolute url
   * @param auth: user:password pair that will perform the REST request. It could be an agent or end-user. It is using basic HTTP authorisation
   * @param userOpt: other webcall options.
   */
  webcall : function(url, auth,userOpt) {
  	if(auth == null) {
		auth = "";
	 }
  	var encodedAuth=Base64.encode(auth);
	 
	 var opt={
		url : url,
		method : "GET",
		charset : 'UTF-8',
		contentType : 'text/json',
		headers : [{
		  name : "Authorization",
		  value : "Basic " + encodedAuth  //Zendesk uses HTTP Authorization header as authentication method.
		}],
		period : 3600
	 };
	 if (userOpt!=undefined){
		for (var key in userOpt){
			if (key==="headers"){
				opt['headers']=opt['headers'].concat(userOpt['headers']);
			}else{
				opt[key]=userOpt[key];
			}
		  
		}
	 }
	 // log(opt);
	 return $fh.web(opt);
  },
  getHeader:function(res,headerName){
  	var headers=res.headers;
  	for (var i=0;i<headers.length;i++){
		if (headerName === headers[i].name){
		  return headers[i].value;
		}
	 }
  }
};


exports.newRequest=zendesk.newRequest;
exports.listUserRequests=zendesk.listUserRequests;
