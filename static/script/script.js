"strict mode"

function alertNick() {
    let nick = prompt("Wprowadź swój nick:")
    if (nick == null) {
        alertNick();
    }
    else {
        fetch("/newUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: nick,
            })
        });
        return;
    }
}

function createMessage(message) {
    let divContainer = document.createElement("div");
    for (let i = 0; i < 3; i++) {
        let readyMessage = document.createElement("span");
        switch (i) {
            case 0:
                readyMessage.innerText = `[${[message.time]}]`;
                break;
            case 1:
                readyMessage.innerText = `<@${[message.author]}>`;
                break;
            case 2:
                readyMessage.innerText = `${[message.content]}`;
                $(readyMessage).emoticonize();
            default:
                break;
        }
        divContainer.appendChild(readyMessage);
        console.log(readyMessage);
        console.log(divContainer);
    }
    document.getElementById("chatWindow").appendChild(divContainer);
}

function messageLongPooling() {
    fetch("/message")
        .then((response) => response.json())
        .then((data) => {
            createMessage(data);
            messageLongPooling();
        })
}

function sendMessage() {
    let newMessage = document.querySelector("input").value;
    if (newMessage == "/quit") {
        window.location.reload();
    }
    else if (newMessage.length == 0) {
        return;
    }
    fetch("/newMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: newMessage
        })
    });
    document.querySelector("input").value = ""
}

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector("button").addEventListener("click", sendMessage);
    window.addEventListener("keydown", (e) => {
        if (e.key == 13) {
            sendMessage();
        }
    });
    messageLongPooling();
})

alertNick();