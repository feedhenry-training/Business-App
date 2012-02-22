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
			url : yahooApiUrl
		});
		var stockSymbol = this.processSymbolRes(symbolRes);
		var soapEnvolope='<?xml version="1.0" encoding="utf-8"?>'+
							+'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
							+  '<soap:Body>'
							+    '<GetQuote xmlns="http://www.webserviceX.NET/">'
							+      '<symbol>string</symbol>'
							+    '</GetQuote>'
							+  '</soap:Body>'
							+'</soap:Envelope>';
		var stockInfoUrl=this.webServiceXApi;
		var opt={
			url:url,
			method:"POST",
			charset:"UTF-8",
			contentType:"text/xml",
			body:soapEnvolope,
			period:3600
		}
		var stockInfo=$fh.web(opt);
		return stockInfo;
		
	},
	processSymbolRes : function(res) {
		var removedHeadRes=res.replace("YAHOO.Finance.SymbolSuggest.ssCallback(",""); //remove jsonp callback header
		var removedTailRes=removedHeadRes.substr(0,removedHeadRes.length-1); //remove jsonp callback bracket
		var resObj=$fh.parse(removedTailRes); //parse result to JSON object
		return resObj.ResultSet.Result[0].symbol; //return the first matched stock symbol
	}
}