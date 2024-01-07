var username = document.getElementById("username");
var password = document.getElementById("password");
var aboutme = document.getElementById("aboutme");
var signinup = document.getElementById("continue");
var statusEl = document.getElementById("status");
var pagetype = location.href.split("/")[location.href.split("/").length - 1].split(".")[0] == "login" ? "logIn" : "signUp";
socket.once("signedInState", function (uid) {
	if (uid) location.href = "./";
});
username.onkeyup = function (event) {
	if (event.key == "Enter") password.focus();
	else statusEl.innerHTML = statusEl.className = "";
}
password.onkeyup = function (event) {
	if (event.key == "Enter") {
		if (aboutme) aboutme.focus();
		else signinup.click();
	}
	else statusEl.innerHTML = statusEl.className = "";
}
signinup.onclick = function () {
	statusEl.className = "load";
	statusEl.innerHTML = "Loading...";
	var user = username.value;
	var pwd = password.value;
	var aboutmeval = false;
	if (aboutme) aboutmeval = aboutme.value;
	socket.emit(pagetype, { username: user, password: pwd, aboutme: aboutmeval }, function (response) {
		if (response.token) {
			localStorage.setItem(tokenName, response.token);
			location.href = "./";
		}
		else {
			statusEl.innerHTML = "ERROR: " + response.error;
			statusEl.className = "fail";
		}
	});
};