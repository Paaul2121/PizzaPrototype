const express = require("express")
const app  = express()
const path = require("path")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3000

app.get("/", (req,res) =>{
    res.redirect(301,"/pizza/list")
})

app.get(["/pizza/list", "/pizza/list/:id"], async (req, res, next) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
  });

app.get("/", (req,res) =>{
    res.send("Message")
})

app.use("/public", express.static(`${__dirname}/../frontend/public`));

app.listen( port, _ => console.log(`http://127.0.0.1:${port}`))
