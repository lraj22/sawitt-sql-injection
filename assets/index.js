var socket = io("/", {
	query: {
		accessToken: localStorage.getItem("accessToken"),
		immune: true
	}
});
socket.once("signedInState", function (uid) {
	if (uid)
		console.log(uid);
	else
		console.log("Not signed in");
});