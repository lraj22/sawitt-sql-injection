var socket = io("/", {
    query: {
        immune: true
    }
});
/* Save this code for later...
 * socket.emit("information", ["signedIn"], function (response) {
 *     if (response.signedIn) {
 *         response.result = [response.signedIn - 1];
 *         var login = document.getElementById("login");
 *         document.getElementById("signup").remove();
 *         login.innerText = "Go to Profile";
 *         login.href = "/profile/" + response.signedIn + "/";
 *         login.id = "profile";
 *     }
 * });
 */