/**
 * Mash multiple business apis returned data.
 * Stock Symble lookup: Using YAHOO API. JSONP
 * Stock Info lookup: Using WebServiceX API . SOAP
 *
 */
 var util = require("./util");
 var request=require("request");
 var xml2js=require("xml2js");
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
     getStockInfo : function(name, callback) {
        //Compose request url using user input.
        var yahooApiUrl = stock.yahooApi.replace("{0}", name);
        /*
         * Perform Webcall
         * Raw response from YAHOO JSONP api which contains stock symbol as well as other information we do not want.
         *
         */
        request(yahooApiUrl,function(err,response,body){
            //Clear up YAHOO response and only keep the information "stock symbol" we need.
            var stockSymbol = stock.processSymbolRes(body);
            var soapBody=stock.getSOAPBody(stockSymbol);
            var requestArgs={
                "url":stock.webServiceXApi,
                "method":"POST",
                "body":soapBody,
                "Content-type":"text/xml; charset=utf-8",
                "jar":false,
                "headers":{
                    "Content-Length":soapBody.length,
                    "Content-Type":"text/xml; charset=utf-8"
                }
            };
            request(requestArgs,function(err,res,body){
                if (err){
                    console.log(err);
                    callback(err,null);
                }else{
                    stock.parseStockSoapBody(body,function(err,parseRes){
                          var quoteRes=parseRes['soap:Envelope']["soap:Body"][0]["GetQuoteResponse"][0]["GetQuoteResult"][0];
                            //mash up the data and return to client.
                            var rtn= {
                                stockSymbol : stockSymbol,
                                stockInfo : quoteRes
                            }
                            callback(err,rtn);
                    });
                }
            });
    });
    },
    /**
     * Process Response from YAHOO stock symbol api.
     * It will clear up the response and only return stock symbol as string.
     */
     processSymbolRes:function(res) {
        var resBody = res;
        var removedHeadRes = resBody.replace("YAHOO.Finance.SymbolSuggest.ssCallback(", "");
        //remove jsonp callback header
        var removedTailRes = removedHeadRes.substr(0, removedHeadRes.length - 1);
        //remove jsonp callback bracket
        var resObj = JSON.parse(removedTailRes);
        //parse result to JSON object
        return resObj.ResultSet.Result[0].symbol;
        //return the first matched stock symbol
    },
    parseStockSoapBody:function(stockSoapRes,callback){
        var xmlParser=new xml2js.Parser();
        xmlParser.parseString(stockSoapRes,callback);
    },
    getSOAPBody:function(symbol){
        return '<?xml version="1.0" encoding="utf-8"?>'+
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'+
                  '<soap:Body>'+
                    '<GetQuote xmlns="http://www.webserviceX.NET/">'+
                      '<symbol>'+symbol+'</symbol>'+
                    '</GetQuote>'+
                  '</soap:Body>'+
                '</soap:Envelope>';
    }
}

exports.getStockInfo = stock.getStockInfo;
