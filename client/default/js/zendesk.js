var zendesk = {
	newRequest : function(subject, description, email) {
		//validate
		if(subject && description && email) {
			if(subject == "" || description == "" || email == "") {
				alert("Please input fields completely.");
			}
			$fh.act({
				act : 'newRequest',
				secure : false,
				req : {
					subject:subject,
					des:description,
					email:email
				}
			}, function(res) {
				if (res.status==="OK"){
					alert("Request has been created!");
				}else{
					alert("Error happened. Please try again.");
				}
			},
				function(code,errorprops,params) {
					alert("Error happened. Please try again.");
			});
		}
	},
	listUserRequests:function(email){
		if (email && email != ""){
			$fh.act({
				act:"listUserRequests",
				secure:false,
				req:{
					email:email
				}
			},function(res){
				alert(JSON.stringify(res));
			},function(){
				alert("Error happened. Please try again.");
			})
		}
	}
}