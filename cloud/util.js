var libxmljs=require("libxmljs");


/**
 * Retrieve doc object.
 */
function getSOAPElement(eleTag, SOAPRes) {
	var doc=libxmljs.parseXmlString(SOAPRes);
	var ele=doc.get("//"+eleTag);
	return ele.doc();
}

exports.getSOAPElement=getSOAPElement;
exports.aa="hello";
