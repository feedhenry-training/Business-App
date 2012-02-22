//SOAP example
/**
 * Use this Web service to figure out your monthly mortgage payment.
 */

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
	<soap:Body>
		<GetMortgagePaymentResponse xmlns="http://www.webserviceX.NET/">
			<GetMortgagePaymentResult>
				<MonthlyPrincipalAndInterest>85.014582525821226</MonthlyPrincipalAndInterest>
				<MonthlyTax>41.666666666666664</MonthlyTax>
				<MonthlyInsurance>41.666666666666664</MonthlyInsurance>
				<TotalPayment>168.34791585915454</TotalPayment>
			</GetMortgagePaymentResult>
		</GetMortgagePaymentResponse>
	</soap:Body>
</soap:Envelope>


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
		var res= $fh.web(opt);
		var xmlData=getSOAPElement("GetMortgagePaymentResult",res.body)
		var rtnObj={
			MonthlyPrincipalAndInterest:xmlData.MonthlyPrincipalAndInterest.toString(),
			MonthlyTax:xmlData.MonthlyTax.toString(),
			MonthlyInsurance:xmlData.MonthlyInsurance.toString(),
			TotalPayment:xmlData.TotalPayment.toString()
		}
		
		
		return rtnObj;
		
		
	}
}