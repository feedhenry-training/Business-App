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
				if (res.status==="OK"){
					var data=JSON.parse(res.data);
					if (data.error){
						alert(data.error);
						return;
					}
					$("#requests").html("");
					for (var i=0;i<data.length;i++){
						var d=data[i];
						var create_date=d.created_at;
						var subject=d.subject;
						var desc=d.description;
						
						html="<div class='requests'>";
						html+="<h4>"+subject+"</h4>";
						html+="<p>"+desc+"</p>";
						html+="<div>"+create_date+"</div>";
						html+="</div>";
						$("#requests").append(html);
						
					}
				}else{
					alert("Error happened. Please try again.");
				}
			},function(){
				alert("Error happened. Please try again.");
			})
		}
	}
}