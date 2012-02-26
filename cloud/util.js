var libxmljs=require("libxmljs");


/**
 * Retrieve doc object.
 */
function getSOAPElement(eleTag, SOAPRes) {
	var doc=libxmljs.parseXmlString(SOAPRes);
	return doc;
	var ele=doc.get("//"+eleTag);
	return ele.doc();
}

exports.getSOAPElement=getSOAPElement;
