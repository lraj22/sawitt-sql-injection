socket.once("signedInState", function (uid) {
	if (uid) {
		location.href = "./feed.html";
	}
	else
		console.log("Not signed in");
});