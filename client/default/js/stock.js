var stock={
	getStockInfo:function(name){
		if (name &&name!=""){
			loading(true);
			$fh.act({
				act : 'getStockInfo',
				secure : false,
				req : {
					name:name
				}
			}, function(res) {
				loading(false);
				if (res.stockInfo){
					var stockInfoXmlStr=res.stockInfo;
					var stockSymbol=res.stockSymbol;
					$("#stockSymbol").text("Stock:"+stockSymbol);
					$("#stockInfo").text(stockInfoXmlStr);
				}
			},
				function(code,errorprops,params) {
					loading(false);
					alert("Error happened. Please try again.");
			});
		}
	}
}