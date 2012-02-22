/**
 * some utilities
 */

var lastView=null;
function changePage(pageId){
	// get next view through page id
	var nextView = $("#"+pageId);
	if(nextView.length === 0) {
		console.log("Could not find view with ID:" + viewId);
		return;
	}
	if(lastView != null) {
		//hide last view
		lastView.removeClass("active");
	}

	// display next view
	nextView.addClass("active");
	// view has been loaded
	lastView = nextView;
	
}
function loading(isLoading){
	if (isLoading){
		$(".loading").show();
	}else{
		$(".loading").hide();
	}
}
