//SOAP example
/**
 * Use this Web service to figure out your monthly mortgage payment.
 */

var mortgage = {
	SOAPUrl : "http://www.webservicex.net/mortgage.asmx",
	/**
	 * Calc mortgaeg based on user input.
	 * Tutorial: How to wrap SOAP message and unwrap SOAP response.
	 */
	getMortgage : function(years, interest,loanAmount,tax,insurance) {
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
		var opt={
			url : url,
			method : "POST",
			charset : 'UTF-8',
			contentType : 'text/xml',
			body:xmlContent,
			period : 3600
		 };
		return $fh.web(opt)
		
	}
}