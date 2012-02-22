/**
 * Mash multiple business apis returned data.
 * Stock Symble lookup: Using YAHOO API. JSONP
 * Stock Info lookup: Using WebServiceX API . SOAP
 *
 */

var stock = {
	yahooApi : "http://d.yimg.com/autoc.finance.yahoo.com/autoc?query={0}&callback=YAHOO.Finance.SymbolSuggest.ssCallback",
	webServiceXApi : "http://www.webservicex.net/stockquote.asmx",
	/**
	 * The function will look for stock symbol based on "name" param, and return stock info from WebServiceX
	 *
	 * Return stock information.
	 */
	getStockInfo : function(name) {
		var yahooApiUrl = this.yahooApi.replace("{0}", name);
		var symbolRes = $fh.web({
			url : yahooApiUrl,
			method:"GET",
			charset:"UTF-8",
			period:3600
		});
		var stockSymbol = this.processSymbolRes(symbolRes);
		var soapEnvolope='<?xml version="1.0" encoding="utf-8"?>'
							+'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
							+  '<soap:Body>'
							+    '<GetQuote xmlns="http://www.webserviceX.NET/">'
							+      '<symbol>'+stockSymbol+'</symbol>'
							+    '</GetQuote>'
							+  '</soap:Body>'
							+'</soap:Envelope>';
		var stockInfoUrl=this.webServiceXApi;
		var opt={
			url:stockInfoUrl,
			method:"POST",
			charset:"UTF-8",
			contentType:"text/xml",
			body:soapEnvolope,
			period:3600
		}
		var stockInfoSoapRes=$fh.web(opt);
		var xmlData=getSOAPElement("GetQuoteResult",stockInfoSoapRes.body)
		return {stockInfo:xmlData.toString()};
		
	},
	processSymbolRes : function(res) {
		var resBody=res.body;
		var removedHeadRes=resBody.replace("YAHOO.Finance.SymbolSuggest.ssCallback(",""); //remove jsonp callback header
		var removedTailRes=removedHeadRes.substr(0,removedHeadRes.length-1); //remove jsonp callback bracket
		var resObj=$fh.parse(removedTailRes); //parse result to JSON object
		return resObj.ResultSet.Result[0].symbol; //return the first matched stock symbol
	}
}