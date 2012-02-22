mortgage={
	getMortgage : function(years, interest,loanAmount,tax,insurance) {
		if (years && interest && loanAmount && tax && insurance){
			if (years=="" || interest=="" || loanAmount == "" || tax =="" || insurance == ""){
				alert("Please fill the fields.");
				return;
			}
			loading(true);
			$fh.act({
				act : 'getMortgage',
				secure : false,
				req : {
					years:years,
					interest:interest,
					loanAmount:loanAmount,
					tax:tax,
					insurance:insurance
				}
			}, function(res) {
				loading(false);
				alert(JSON.stringify(res));
				// if (res.status==="OK"){
					// alert("Request has been created!");
				// }else{
					// alert("Error happened. Please try again.");
				// }
			},
				function(code,errorprops,params) {
					loading(false);
					alert("Error happened. Please try again.");
			});
		}
	}
}
