var libxmljs=require("libxmljs");
var xml2js=require("xml2js");

/**
 * Retrieve doc object.
 */
function getSOAPElement(eleTag, SOAPRes,callback) {
	try{
	var parser=new xml2js.Parser();
	return parser.parseString(SOAPRes,function(err,res){
		callback(err,res);
	});
	var doc=libxmljs.parseXmlString(SOAPRes);
	return {res:SOAPRes};
	var ele=doc.get("//"+eleTag);
	return ele.doc();
	}catch(e){
		return {err:e};
	}
}

exports.getSOAPElement=getSOAPElement;
