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
		var profilebutton = document.createElement("a");
		profilebutton.className = "btnlink";
		profilebutton.innerText = "Go to Profile";
		profilebutton.id = "profbtn";
		document.getElementById("topnav").appendChild(profilebutton);
		profilebutton.href = "/" + (immune ? "" : "un") + "stable/profile/" + uid + "/";
	}
});