var immune = location.pathname.split(/\/+/)[1] == "stable";
var tokenName = (immune ? "" : "un") + "stableAccessToken"
var socket = io("/", {
	query: {
		"accessToken": localStorage.getItem(tokenName),
		"immune": immune
	}
});
var username = document.getElementById("username");
var password = document.getElementById("password");
var signinup = document.getElementById("continue");
var statusEl = document.getElementById("status");
var pagetype = location.href.split("/")[location.href.split("/").length - 1].split(".")[0] == "login" ? "logIn" : "signUp";
console.log(pagetype);
socket.once("signedInState", function (uid) {
	if (uid) {
		location.href = "./feed.html";
	}
	else
		console.log("Not signed in");
});
username.onkeyup = function (event) {
	if (event.key == "Enter") password.focus();
	else statusEl.innerHTML = statusEl.className = "";
}
password.onkeyup = function (event) {
	if (event.key == "Enter") signinup.click();
	else statusEl.innerHTML = statusEl.className = "";
}
signinup.onclick = function () {
	statusEl.className = "load";
	statusEl.innerHTML = "Loading...";
	var user = username.value;
	var pwd = password.value;
	socket.emit(pagetype, { username: user, password: pwd }, function (response) {
		if (response.token) {
			localStorage.setItem(tokenName, response.token);
			location.href = "./feed.html";
		}
		else {
			statusEl.innerHTML = "ERROR: " + response.error;
			statusEl.className = "fail";
		}
	});
}