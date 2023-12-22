var socket = io();
socket.on("clientTest", function (info, callback) {
    var message = document.createElement("p");
    message.innerHTML = info.message;
    document.body.appendChild(message);
    callback({ "receivedMessageSafely": true });
});
var button = document.getElementById("button");
button.onclick = function () {
    socket.emit("serverTest", "Default message!", function (response) {
        alert("The message worked: " + response);
    });
};