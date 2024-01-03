var uid = profileinfo.uid;
var username = profileinfo.un;
var aboutme = profileinfo.aboutme;
var follows = profileinfo.follows;
var postDetails = profileinfo.postDetails;
socket.once("signedInState", function (signedIn) {
	if ((signedIn) && (signedIn != uid)) {
		allowFollow(signedIn);
	}
});
function allowFollow(signedIn) {
	var follow = document.createElement("button");
	var isFollowing;
	socket.emit("information", { "isFollowing": [signedIn, uid] }, function (response) {
		if (response.err) console.error(err);
		else {
			isFollowing = response.isFollowing;
			follow.innerText = (isFollowing ? "Unf" : "F") + "ollow this user";
		}
	});
	follow.id = "follow";
	follow.innerText = (isFollowing ? "Unf" : "F") + "ollow this user";
	document.getElementById("followsection").appendChild(follow);
	follow.onclick = function () {
		socket.emit("follow", [signedIn, uid], function (response) {
			if (response.success) {
				document.getElementById("follows").innerText = follows = response.follows;
				isFollowing = response.isFollowing;
				follow.innerText = (isFollowing ? "Unf" : "F") + "ollow this user";
				document.getElementById("theword").innerText = " Follower" + (follows === 1 ? "" : "s");
			}
		});
	}
}
var usernames = document.getElementsByClassName("username");
for (var i = 0; i < usernames.length; i++) {
	usernames[i].innerText = username;
}
if (aboutme) document.getElementById("aboutme").innerText = aboutme;
else document.getElementById("aboutme").innerHTML = "<i>This user does not have an about me</i>";
document.getElementById("follows").innerText = follows;
document.getElementById("theword").innerText = " Follower" + (follows === 1 ? "" : "s");
if (!postDetails) document.getElementById("post").innerHTML = "<i>This user does not have any posts</i>";
else {
	var post = document.getElementById("post");
	var topsection = document.createElement("div");
	topsection.className = "topsection";
	post.appendChild(topsection);
	var poster = document.createElement("div");
	poster.className = "posterusername";
	poster.innerText = username;
	topsection.appendChild(poster);
	var postTime = document.createElement("div");
	var time = new Date(postDetails.time);
	var AMPM = time.getHours() % 12 == time.getHours() ? "AM" : "PM";
	postTime.className = "posttime";
	postTime.innerText = (time.getMonth() + 1) + "/" + time.getDate() + "/" + time.getFullYear() + " " + (time.getHours() % 12).toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0") + ":" + time.getSeconds().toString().padStart(2, "0") + " " + AMPM;
	topsection.appendChild(postTime);
	var content = document.createElement("div");
	content.className = "content";
	content.innerText = postDetails.content;
	post.appendChild(content);
	var bottomsection = document.createElement("div");
	bottomsection.className = "bottomsection";
	post.appendChild(bottomsection);
	var like = document.createElement("button");
	like.className = "like";
	like.innerText = "Like";
	bottomsection.appendChild(like);
	var likes = document.createElement("span");
	likes.className = "likes";
	likes.innerText = postDetails.likes + " likes";
	bottomsection.appendChild(likes);
}