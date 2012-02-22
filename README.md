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


