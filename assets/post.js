var content = document.getElementById("content");
var post = document.getElementById("post");
var statusEl = document.getElementById("status");
var signedIn = false;
socket.once("signedInState", function (uid) {
	if (!uid) location.href = "./login.html";
	else signedIn = uid;
});
content.onkeyup = function (event) {
	if (event.key == "Enter" && event.ctrlKey) post.click();
	else statusEl.innerHTML = statusEl.className = "";
};
post.onclick = function () {
	statusEl.className = "load";
	statusEl.innerHTML = "Loading...";
	var text = content.value.trim();
	socket.emit("post", { "poster": signedIn, "content": text }, function (response) {
		if (response.success) location.href = "./";
		else {
			statusEl.innerHTML = "ERROR: " + response.error;
			statusEl.className = "fail";
		}
	});
};