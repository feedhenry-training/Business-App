var libxmljs=require("libxmljs");


/**
 * Retrieve doc object.
 */
function getSOAPElement(eleTag, SOAPRes) {
	try{
	var doc=libxmljs.parseXmlString(SOAPRes);
	return {res:doc};
	var ele=doc.get("//"+eleTag);
	return ele.doc();
	}catch(e){
		return {err:e};
	}
}

exports.getSOAPElement=getSOAPElement;
