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
				 alert(JSON.stringify(res))
			},
				function(code,errorprops,params) {
			});
		}
	}
}