socket.once("signedInState", function (uid) {
	if (uid) {
		socket.emit("getPosts", uid, function (response) {
			if (response.err) location.href = "./profile/" + uid + "/";
			else {
				for (var i = 0; i < response.posts.length; i++) {
					createPost(response.posts[i], uid);
				}
			}
		});
	}
	else location.href = "./login.html";
});
function createPost(details, uid) {
	var post = document.createElement("div");
	var topsection = document.createElement("div");
	var poster = document.createElement("a");
	var postTime = document.createElement("div");
	var time = new Date(details.time);
	var content = document.createElement("div");
	var bottomsection = document.createElement("div");
	var like = document.createElement("button");
	var likes = document.createElement("span");
	var AMPM = time.getHours() % 12 == time.getHours() ? "AM" : "PM";
	var numoflikes = details.likes;
	var isLiked;
	post.className = "post";
	document.getElementById("postsection").appendChild(post);
	topsection.className = "topsection";
	post.appendChild(topsection);
	poster.className = "posterusername";
	poster.innerText = details.username;
	poster.href = "./profile/" + details.uid + "/";
	topsection.appendChild(poster);
	postTime.className = "posttime";
	postTime.innerText = (time.getMonth() + 1) + "/" + time.getDate() + "/" + time.getFullYear() + " " + (time.getHours() % 12).toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0") + ":" + time.getSeconds().toString().padStart(2, "0") + " " + AMPM;
	topsection.appendChild(postTime);
	content.className = "content";
	content.innerText = details.content;
	post.appendChild(content);
	bottomsection.className = "bottomsection";
	post.appendChild(bottomsection);
	like.className = "like";
	like.innerText = "Like";
	bottomsection.appendChild(like);
	likes.className = "likes";
	likes.innerText = numoflikes + " Like" + (numoflikes === 1 ? "" : "s");
	bottomsection.appendChild(likes);
	socket.emit("information", { "isLiked": [uid, details.postID] }, function (response) {
		if (response.err) console.error(err);
		else {
			isLiked = response.isFollowing;
			like.innerText = "Like" + (isLiked ? "d" : "");
		}
	});
	like.id = "follow";
	like.innerText = "Like" + (isLiked ? "d" : "");
	like.onclick = function () {
		socket.emit("like", [uid, details.postID], function (response) {
			if (response.success) {
				numoflikes = response.likes;
				isLiked = response.isLiked;
				like.innerText = "Like" + (isLiked ? "d" : "");
				likes.innerText = numoflikes + " Like" + (numoflikes === 1 ? "" : "s");
			}
		});
	};
}