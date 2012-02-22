var stock={
	getStockInfo:function(name){
		if (name &&name!=""){
			$fh.act({
				act : 'getStockInfo',
				secure : false,
				req : {
					name:name
				}
			}, function(res) {
				if (res.stockInfo){
					var stockInfoXmlStr=res.stockInfo;
					$("#stockInfo").html(stockInfoXmlStr);
				}
			},
				function(code,errorprops,params) {
					alert("Error happened. Please try again.");
			});
		}
	}
}
