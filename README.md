# Business APIs Integration with Feedhenry Apps

## Introduction

Thousands of services on web are provided based on HTTP proxy such as SOAP, REST etc.

This tutorial will lead an app development process which contains following content:

* How to invoke external SOAP services, parse returned data and send data to device with Feedhenry Platform.
* How to invoke external REST services, parse data and sent data to device with Feedhenry Platform.
* How to Mash-up data from different services and send data to device.
* How to use Javascript library on cloud.

## Workbase Structure (v1 Branch)
<img src="https://github.com/keyang-feedhenry/Business/raw/master/docs/projectstructure.png"/>


## SOAP Service Integration (v2 Branch)

### Step 1 -- Prepare 
#### Web service choosing

Mortgage Calculator: Use this Web service to figure out your monthly mortgage payment

SOAP WSDL: http://www.webservicex.net/mortgage.asmx?wsdl

#### Project Workbase

* Create main.js in cloud folder --> main entries of Cloud services
* Create mortgage.js in cloud folder --> Implementation of mortgage on Cloud.
* Create mortgage.js in js folder on client --> Mortgage client-side service agent
* Create bind.js in js folder on client --> Events Bindings definition
* Add basic.css in css folder on client --> Some CSS definition
* Add util.js in js folder on client --> Some utilities

### Step 2 --- Implementation

Open mortgage.js in cloud folder with you favorite text editor and put following code inside:

      /**
       * Use this Web service to figure out your monthly mortgage payment.
       */
      var mortgage = {
        //SOAP API URL
      	SOAPUrl : "http://www.webservicex.net/mortgage.asmx",
      	/**
      	 * Calc mortgaeg based on user input.
      	 * Tutorial: How to wrap SOAP message and unwrap SOAP response.
      	 */
      	getMortgage : function(years, interest,loanAmount,tax,insurance) {
      		/**
      		 * Since SOAP calls are wrapped HTTP calls, in Javascript we have to wrap SOAP envelope manually or using a SOAP library in Javascript
      		 */
      		var xmlContent = '<?xml version="1.0" encoding="utf-8"?>' + 
      		'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' + 
      		' <soap:Body>' + 
      		'   <GetMortgagePayment xmlns="http://www.webserviceX.NET/">' + 
      		'   <Years>'+years+'</Years>' + 
      		'   <Interest>'+interest+'</Interest>' + 
      		'   <LoanAmount>'+loanAmount+'</LoanAmount>' + 
      		'   <AnnualTax>'+tax+'</AnnualTax>' + 
      		'   <AnnualInsurance>'+insurance+'</AnnualInsurance>' + 
      		'   </GetMortgagePayment>' + 
      		' </soap:Body>' + 
      		'</soap:Envelope>'
      		
      		
      		var url=this.SOAPUrl;
      		//Webcall paramters.
      		var opt={
      			url : url,
      			method : "POST",
      			charset : 'UTF-8',
      			contentType : 'text/xml',
      			body:xmlContent,
      			period : 3600
      		 };
      		 
      		 //Feedhenry Web Call
      		var res= $fh.web(opt);
      		
      		// getSOAPElement will return an xml object that exists in SOAP response
      		var xmlData=getSOAPElement("GetMortgagePaymentResult",res.body);
      		
      		// construct final returned JSON object.
      		var rtnObj={
      			MonthlyPrincipalAndInterest:xmlData.MonthlyPrincipalAndInterest.toString(),
      			MonthlyTax:xmlData.MonthlyTax.toString(),
      			MonthlyInsurance:xmlData.MonthlyInsurance.toString(),
      			TotalPayment:xmlData.TotalPayment.toString()
      		}
      		
      		
      		return rtnObj;
      		
      		
      	}
      };

Please read the comments carefully to understand each step.

Write client-side code and link those files. Check out v2 branch to explore to final version.




## REST Service Integration (v3 Branch)

### Step 1 -- Prepare
#### Web service choosing

Zendesk requests: Submit a new request or check requests that have been assigned to a user.

#### Project Workbase
* Create zendesk.js in cloud folder
* Create zendesk.js in js folder on client

### Step 2 --- Implementation
---------------------------------------
Open zendesk.js in cloud folder and put the following code inside: 

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
              newRequest:function(subject, content,userEmail){
                  //Initiate a request template using XML Object.
                  var requestBody=<ticket>
                        <subject></subject>
                        <description></description>
                        <requester-email></requester-email>
                   </ticket>
                   var apiRelUrl="/tickets.xml"; //Relative api url
                   // API absolute url
                   var apiAbsUrl=this.zenDeskUrl+apiRelUrl;
                   //
                   var auth=this.agentAuth;
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
                   var res=this.webcall(apiAbsUrl,auth,userOpt);
                   
                   //check status header returned
                   var status=this.getHeader(res,"Status");
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




## MASH UP - JSONP and SOAP (v4 Branch)

### Step 1 -- Prepare
#### Web service choosing
Yahoo Finance: Look up company stock symbol using company name.

Yahoo API: http://d.yimg.com/autoc.finance.yahoo.com/autoc?query={0}&callback=YAHOO.Finance.SymbolSuggest.ssCallback

WebServiceX: Retrieve company information based on stock symbol.

WebServiceX: http://www.webservicex.net/stockquote.asmx

#### Project Workbase
* Create stock.js in cloud folder
* Create stock.js in js folder on client

### Step 2 --- Implementation
---------------------------------------
Open stock.js in cloud folder and put the following code inside:

                              /**
             * Mash multiple business apis returned data.
             * Stock Symble lookup: Using YAHOO API. JSONP
             * Stock Info lookup: Using WebServiceX API . SOAP
             *
             */

            var stock = {
                  //YAHOO finance api for looking up stock symbol with a company name. It is a JSONP service.
                  yahooApi : "http://d.yimg.com/autoc.finance.yahoo.com/autoc?query={0}&callback=YAHOO.Finance.SymbolSuggest.ssCallback",
                  //WebServiceX API (Open API). It returns stock details with specific stock symbol.
                  webServiceXApi : "http://www.webservicex.net/stockquote.asmx",
                  /**
                   * The function will look for stock symbol based on "name" param, and return stock info from WebServiceX
                   *
                   * Return stock information.
                   */
                  getStockInfo : function(name) {
                        //Compose request url using user input.
                        var yahooApiUrl = this.yahooApi.replace("{0}", name);
                        /*
                         * Perform Webcall
                         * Raw response from YAHOO JSONP api which contains stock symbol as well as other information we do not want.
                         * 
                         */ 
                        var symbolRes = $fh.web({
                              url : yahooApiUrl,
                              method:"GET",
                              charset:"UTF-8",
                              period:3600
                        });

                        //Clear up YAHOO response and only keep the information "stock symbol" we need.
                        var stockSymbol = this.processSymbolRes(symbolRes);

                        // construct SOAP envelop. We could do this manually or just use a Javascript Library.
                        var soapEnvolope='<?xml version="1.0" encoding="utf-8"?>'
                                                      +'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
                                                      +  '<soap:Body>'
                                                      +    '<GetQuote xmlns="http://www.webserviceX.NET/">'
                                                      +      '<symbol>'+stockSymbol+'</symbol>'
                                                      +    '</GetQuote>'
                                                      +  '</soap:Body>'
                                                      +'</soap:Envelope>';

                        //Retrieve SOAP url
                        var stockInfoUrl=this.webServiceXApi;

                        //Prepare webcall parameters
                        var opt={
                              url:stockInfoUrl,
                              method:"POST",
                              charset:"UTF-8",
                              contentType:"text/xml",
                              body:soapEnvolope,
                              period:3600
                        }

                        //Perform webcall
                        var stockInfoSoapRes=$fh.web(opt);

                        //getSOAPElement will retrieve specific XML object within SOAP response
                        var xmlData=getSOAPElement("GetQuoteResult",stockInfoSoapRes.body)


                        //mash up the data and return to client.
                        return { 
                              stockSymbol:stockSymbol,
                              stockInfo:xmlData.toString()
                        };

                  },
                  /**
                   * Process Response from YAHOO stock symbol api.
                   * It will clear up the response and only return stock symbol as string.
                   */
                  processSymbolRes : function(res) {
                        var resBody=res.body;
                        var removedHeadRes=resBody.replace("YAHOO.Finance.SymbolSuggest.ssCallback(",""); //remove jsonp callback header
                        var removedTailRes=removedHeadRes.substr(0,removedHeadRes.length-1); //remove jsonp callback bracket
                        var resObj=$fh.parse(removedTailRes); //parse result to JSON object
                        return resObj.ResultSet.Result[0].symbol; //return the first matched stock symbol
                  }
            }