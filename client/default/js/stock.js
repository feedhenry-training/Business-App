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
				alert(JSON.stringify(res));
				// if (res.status==="OK"){
					// alert("Request has been created!");
				// }else{
					// alert("Error happened. Please try again.");
				// }
			},
				function(code,errorprops,params) {
					alert("Error happened. Please try again.");
			});
		}
	}
}
