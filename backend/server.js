const express = require("express")
const app  = express()
const path = require("path")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3000

console.log(__dirname);
app.get("/", (req,res) =>{
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`))    
})

app.get("/", (req,res) =>{
    res.send("Message")
})

app.listen( port, _ => console.log(`http://127.0.0.1:${port}`))
