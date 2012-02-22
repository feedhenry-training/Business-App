var zendesk = {
	newRequest : function(subject, description, email) {
		//validate
		if(subject && description && email) {
			if(subject == "" || description == "" || email == "") {
				alert("Please input fields completely.");
			}
			loading(true);
			$fh.act({
				act : 'newRequest',
				secure : false,
				req : {
					subject:subject,
					des:description,
					email:email
				}
			}, function(res) {
				loading(false);
				if (res.status==="OK"){
					alert("Request has been created!");
				}else{
					alert("Error happened. Please try again.");
				}
			},
				function(code,errorprops,params) {
					loading(false);
					alert("Error happened. Please try again.");
			});
		}
	},
	listUserRequests:function(email){
		if (email && email != ""){
			loading(true);
			$fh.act({
				act:"listUserRequests",
				secure:false,
				req:{
					email:email
				}
			},function(res){
				loading(false);
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
						var comments=d.comments;
						
						
						
						html="<div class='requests'>";
						html+="<h4>"+subject+"</h4>";
						for (var j=0;j<comments.length;j++){
							var c=comments[j];
							var val=c.value;
							var create_date=c['created_at'];
							html+="<p>"+val+"</p>";
							html+="<div>"+create_date+"</div>";
						}
						
						html+="</div>";
						$("#requests").append(html);
						
					}
				}else{
					alert("Error happened. Please try again.");
				}
			},function(){
				loading(false);
				alert("Error happened. Please try again.");
			})
		}
	}
}