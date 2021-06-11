let express = require("express");
let app = express();
let PORT = process.env.PORT || 3000
let session = require("express-session");
let path = require("path");
let messageArray = [];

class User {
    constructor(username) {
        this.username = username
        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
}

app.use(express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(
    session({
        secret: "Pan Mendela jest debeściak, i aplikacje też!",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "static"));
});

app.get("/message", function (req, res) {
    messageArray.push(res);
});

app.post("/newUser", function (req, res) {
    req.session.user = new User(req.body.username)
    res.sendStatus(200);
})

app.post("/newMessage", function (req, res) {
    if (req.body.message.toString().startsWith("/")) {
        if (req.body.message.toString.startsWith("/color")) {
            req.session.user.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
            res.sendStatus(200);
        }
        else if (req.body.message.toString().startsWith("/nick")) {
            req.session.user.username = req.body.message
                .toString()
                .substring(5, req.body.message.toString().length);
            res.sendStatus(200);
        }
    }
    else {
        for (let i = 0; i < messageArray.length; i++) {
            messageArray[i].json({
                content: req.body.message,
                time: new Date().toTimeString().split(" ")[0],
                author: req.session.user.username,
                color: req.session.user.color
            })
        }
        messageArray = [];
        res.sendStatus(200);
    }
   /*
   if(req.body.message.toString().startsWith("/")){
       if(req.body.message.toString().startsWith("/color")){
        req.session.user.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        res.sendStatus(200);
       }
       else if (req.body.message.toString().startsWith("/nick")) {
        req.session.user.username = req.body.message
            .toString()
            .substring(5, req.body.message.toString().length);
        res.sendStatus(200);
    }
   }*/
})

app.listen(PORT, function () {
    console.log("Serwer jest uruchomiony na porcie " + PORT);
})