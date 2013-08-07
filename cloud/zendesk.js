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

var zendesk = {
	zenDeskUrl : "https://fhtest2.zendesk.com", // Zendesk URL. This URL will expire in 30 days. Developers could register 1 for free for 30 days trails.
	agentAuth : "martin.murphy+zentest2@feedhenry.com/token:mls3TRzGFurS6NOvOE8dsLGpHD2paUrWzh4WQ5O9", //agent that will create tickets for end-users. it is in username:password format. required by Zendesk API. Developers need to have 1 agent account to perform the operations.
	agentHeader : "X-On-Behalf-Of", // agent header is used by Zendesk to locate the end-users. required by Zendesk API
	/**
	 * Create a new ticket with a email address
	 * Tutorial: How to post a REST request with xml request body & How to parse and retrieve xml type response.
	 */
	newRequest : function(subject, content, userEmail, callback) {
		//Initiate a request template using XML Object.
		var requestBody = "<ticket><subject>{0}</subject><description>{1}</description><requester-email>{2}</requester-email></ticket>";
		var apiRelUrl = "/tickets.xml";
		//Relative api url
		//Absolute api url
		var apiAbsUrl = zendesk.zenDeskUrl + apiRelUrl;
		var auth = zendesk.agentAuth;
		//pass user input to request body
		requestBody = requestBody.replace("{0}", subject);
		requestBody = requestBody.replace("{1}", content);
		requestBody = requestBody.replace("{2}", userEmail);

		//prepare REST call
		var userOpt = {
			method : "POST", // use POST method. required by zendesk
			body : requestBody,
			headers : {
				"Content-Type" : "application/xml", // contentype is  xml,  required by zendesk
				"charset" : "UTF-8"
			}
		}

		//perform webcall
		zendesk.webcall(apiAbsUrl, auth, userOpt, function(err, res) {
			//check status header returned
			if(201 === res.statusCode) {
				callback(undefined, {
					"status" : "OK",
					"res":res
				});
			} else {
				callback(undefined, {
					"status" : "error",
					"res":res
				});
			}

		});
	},
	/**
	 * List all tickets that are created by a user specified by user email
	 * Tutorial: How to parse JSON type response
	 */
	listUserRequests : function(userEmail,callback) {
		var requestBody = null;
		// this request does not need request body.

		var apiRelUrl = "/requests.json";
		var apiAbsUrl = zendesk.zenDeskUrl + apiRelUrl;
		var auth = zendesk.agentAuth;

		//Prepare REST call
		var agentHeader = zendesk.agentHeader;
		var userOpt = {headers:{}};
		userOpt.headers[agentHeader]=userEmail;//!important, this header is required by Zendesk REST api to tell Zendesk that an agent is performing this action for an end-user. checkout:http://www.zendesk.com/support/api/rest-introduction

		zendesk.webcall(apiAbsUrl, auth, userOpt,function(err,res){
			if (200==res.statusCode){
				callback(undefined,{
					"status":"OK",
					"data":res.data,
					"res":res
				});
			}else{
				callback(undefined,{
					"status" : "error",
					res:res
				});
			}
		});
	},
	/**
	 * Webcall wrapper
	 * @param url: the REST absolute url
	 * @param auth: user:password pair that will perform the REST request. It could be an agent or end-user. It is using basic HTTP authorisation
	 * @param userOpt: other webcall options.
	 */
	webcall : function(url, auth, userOpt, cb) {
		if(auth == null) {
			auth = "";
		}
		var opt = {
			uri : url,
			method : 'GET',
			headers : {}

		};
		
		//test
		//opt.uri="http://keyangxiang.com/info.php";
		//end--test
		if(userOpt != undefined) {
			for(var key in userOpt) {
				opt[key] = userOpt[key];

			}
		}
		var encodedAuth = (new Buffer(auth)).toString("base64");
		opt.headers["Authorization"] = "Basic " + encodedAuth;
		var request = require("request");
		// log(opt);
		request.cookie("");
		request(opt, function(err, response, body) {
			// just apply the results object to the data we send back.
			cb(null, {
				data : body,
				statusCode : response.statusCode,
				opt:opt
			});
		});
	}
};

exports.newRequest = zendesk.newRequest;
exports.listUserRequests = zendesk.listUserRequests;
