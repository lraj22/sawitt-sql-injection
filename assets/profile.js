var uid = profileinfo.uid;
var username = profileinfo.un;
var aboutme = profileinfo.aboutme;
var follows = profileinfo.follows;
var postDetails = profileinfo.postDetails;
socket.once("signedInState", function (signedIn) {
	if ((signedIn) && (signedIn != uid)) {
		allowFollow(signedIn);
	} else if ((signedIn) && (signedIn == uid)) {
		profileSettings(signedIn);
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
	};
}
var usernames = document.getElementsByClassName("username");
for (var i = 0; i < usernames.length; i++) usernames[i].innerText = username;
if (aboutme) document.getElementById("aboutme").innerText = aboutme;
else document.getElementById("aboutme").innerHTML = "<i>This user does not have an about me</i>";
document.getElementById("follows").innerText = follows;
document.getElementById("theword").innerText = " Follower" + (follows === 1 ? "" : "s");
if (!postDetails) document.getElementById("post").innerHTML = "<i>This user does not have any posts</i>";
else {
	var post = document.getElementById("post");
	var topsection = document.createElement("div");
	var poster = document.createElement("div");
	var postTime = document.createElement("div");
	var time = new Date(postDetails.time);
	var content = document.createElement("div");
	var bottomsection = document.createElement("div");
	var like = document.createElement("button");
	var likes = document.createElement("span");
	topsection.className = "topsection";
	post.appendChild(topsection);
	poster.className = "posterusername";
	poster.innerText = username;
	topsection.appendChild(poster);
	var AMPM = time.getHours() % 12 == time.getHours() ? "AM" : "PM";
	postTime.className = "posttime";
	postTime.innerText = (time.getMonth() + 1) + "/" + time.getDate() + "/" + time.getFullYear() + " " + (time.getHours() % 12).toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0") + ":" + time.getSeconds().toString().padStart(2, "0") + " " + AMPM;
	topsection.appendChild(postTime);
	content.className = "content";
	content.innerText = postDetails.content;
	post.appendChild(content);
	bottomsection.className = "bottomsection";
	post.appendChild(bottomsection);
	like.className = "like";
	like.innerText = "Like";
	bottomsection.appendChild(like);
	likes.className = "likes";
	likes.innerText = postDetails.likes + " likes";
	bottomsection.appendChild(likes);
}
function profileSettings(signedIn) {
	document.getElementById("profbtn").remove();
	function delaccountpopup() {
		delaccount.onclick = () => false;
		var popupoverlay = document.createElement("div");
		popupoverlay.className = "popupoverlay";
		document.body.appendChild(popupoverlay);
		var popup = document.createElement("div");
		popup.className = "popup widget";
		document.body.appendChild(popup);
		var title = document.createElement("h1");
		title.className = "popuptitle";
		title.innerText = "Are You Sure?";
		popup.appendChild(title);
		var cancel = document.createElement("button");
		cancel.className = "cancel";
		cancel.innerText = "Never Mind";
		popup.appendChild(cancel);
		var deletesure = document.createElement("button");
		deletesure.className = "delaccount";
		deletesure.innerText = "Yes, I'm Sure";
		popup.appendChild(deletesure);
		cancel.onclick = function () {
			popupoverlay.remove();
			popup.remove();
			delaccount.onclick = delaccountpopup;
		};
		deletesure.onclick = function () {
			socket.emit("delaccount", signedIn, function (response) {
				if (response) {
					localStorage.removeItem(tokenName);
					location.href = "/" + (immune ? "" : "un") + "stable/login.html";
				}
			});
		};
	}
	var profopt = document.createElement("div");
	var signout = document.createElement("button");
	var delaccount = document.createElement("button");
	profopt.id = "profopt";
	document.getElementById("infowidget").appendChild(profopt);
	signout.id = "signout";
	signout.innerText = "Sign Out";
	profopt.appendChild(signout);
	delaccount.className = "delaccount";
	delaccount.innerText = "Delete My Account";
	profopt.appendChild(delaccount);
	signout.onclick = function () {
		localStorage.removeItem(tokenName);
		location.href = "/" + (immune ? "" : "un") + "stable/login.html";
	};
	delaccount.onclick = delaccountpopup;
}