var immune = !(location.pathname.split(/\/+/)[1] == "unstable");
var tokenName = (immune ? "" : "un") + "stableAccessToken";
var socket = io("/", {
	query: {
		"accessToken": localStorage.getItem(tokenName),
		"immune": immune
	}
});