var immune = !(location.pathname.split(/\/+/)[1] == "unstable");
var tokenName = (immune ? "" : "un") + "stableAccessToken";
var socket = io("/", {
	query: {
		"accessToken": localStorage.getItem(tokenName),
		"immune": immune
	}
});
socket.once("signedInState", function (uid) {
	if (uid) {
		var mutualpath = "/" + (immune ? "" : "un") + "stable/";
		function btnlink(id, innerText, href) {
			var element = document.createElement("a");
			element.className = "btnlink";
			element.innerText = innerText;
			element.id = id;
			document.getElementById("topnav").appendChild(element);
			element.href = mutualpath + href;
		}
		var pathSections = location.pathname.split("/");
		var filename = pathSections[pathSections.length - 1];
		var isProfile = pathSections.length == 5;
		if (isProfile) {
			btnlink("profbtn", "Go to Profile", "profile/" + uid + "/");
			btnlink("feedbtn", "Go to Feed", "");
			btnlink("postbtn", "Create a Post", "post.html");
		} else if (["", "post.html"].includes(filename)) btnlink("profbtn", "Go to Profile", "profile/" + uid + "/");
	}
});