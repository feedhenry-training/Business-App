//SOAP example
/**
 * Use this Web service to figure out your monthly mortgage payment.
 */
var request=require("request");
var mortgage = {
    //SOAP API URL
    SOAPUrl : "http://www.webservicex.net/mortgage.asmx",
    /**
     * Calc mortgaeg based on user input.
     * Tutorial: How to wrap SOAP message and unwrap SOAP response.
     */
    getMortgage : function(years, interest, loanAmount, tax, insurance, callback) {
        /**
         * Since SOAP calls are wrapped HTTP calls, in Javascript we have to wrap SOAP envelope manually or using a SOAP library in Javascript
         */
        var xmlContent = '<?xml version="1.0" encoding="utf-8"?>' + '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' + ' <soap:Body>' + '   <GetMortgagePayment xmlns="http://www.webserviceX.NET/">' + '   <Years>' + years + '</Years>' + '   <Interest>' + interest + '</Interest>' + '   <LoanAmount>' + loanAmount + '</LoanAmount>' + '   <AnnualTax>' + tax + '</AnnualTax>' + '   <AnnualInsurance>' + insurance + '</AnnualInsurance>' + '   </GetMortgagePayment>' + ' </soap:Body>' + '</soap:Envelope>'

        var url = mortgage.SOAPUrl;
        //Webcall paramters.
        var opt = {
            url : url,
            method : "POST",
            body : xmlContent,
            headers:{
                "Content-Type":"text/xml"
            }
        };

        //Feedhenry Web Call
        request(opt, function(err, res,body) {
            var xml2js = require("xml2js");
             (new xml2js.Parser()).parseString(body, function(err, jsres) {
                var mortgageRes=jsres['soap:Envelope']["soap:Body"][0].GetMortgagePaymentResponse[0].GetMortgagePaymentResult[0];
                callback(err, mortgageRes);
            });
            return;
        });
    }
};

exports.getMortgage = mortgage.getMortgage;
