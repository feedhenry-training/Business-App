#Business APIs Integration with Feedhenry Apps (Node.js)

##Introduction
This is a duplication version of <a href="https://github.com/feedhenry/FH-Training-App-Business">Feedhenry Training App Business</a>. Please checkout it before reading this tutorial. 
The modification of this tutorial is that the example app runs on Node.js rather than Rhino. Not much code is changed.

##Outline

* Migrate from Rhino to Node.js
* Some Library replacement

### Migration

To migrate from Rhino to Node.js, following changes are made to Business Project:

* Exports your module. In node.js, you have to export Object/Value/Functions even they are public in the file scope out of the file 
while in Rhino all public functions/objects/variables defined in one file could be accessed in any files in cloud folder.
Besides, functions in main.js that are invoked by client need be exported as well in Node.js. For example:

		exports.newRequest=newRequest;
		exports.listUserRequests=listUserRequests;
		exports.getMortgage=getMortgage;
		exports.getStockInfo=getStockInfo;
		

* Require a module. In Rhino, all Javascript files are in same scope which means function A could invoke function B defined in another file.
 However, in Node.js, you have to require a file that you want to use. For example, in main.js, we have to add following code to use libraries defined.
 
		var mortgage=require("./mortgage");
		var stock=require("./stock");
		
		var zendesk=require("./zendesk");
		
* Non-blocking. Results in Node.js are passed through callback function. There is an extra parameter in any function in main.js -- callback:


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
		
The callback function needs two parameters: error and result. Once callback function is invoked, cloud will send back content to client.

* package.json. In the root of cloud folder, there is a file package.json which defines project information, dependencies etc.

		{
		  "name": "business-app",
		  "version": "0.1.0",
		  "dependencies" : { 
		    "libxmljs" : "*",
		    "xml2js":"*",
		    "request":"*"
		  }
		}

### Library Replacement
Some libraries used for Rhino need to be exchanged:

* Ex4 Xml parser: Used for parsing XML in Rhino. This should be replaced by XML libraries for Node.js such as "libxmljs" or "xml2js"
* Base64 Encoder: Used to convert content to Base64 encoded. In Node.js, just use Buffer object.

More libraries are supported in Node.js please check out NPM registerd modules.

