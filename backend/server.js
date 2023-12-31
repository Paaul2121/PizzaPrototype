const express = require("express")
const app  = express()
const path = require("path")
const fileReaderAsync = require("./fileReader")
const fileWriterAsync = require("./fileWriter")
const pizzaPath = path.join(`${__dirname}/pizza.json`)
const userPath = path.join(`${__dirname}/userData.json`)
const userCommentsPath = path.join(`${__dirname}/userComments.json`)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3000

console.log(__dirname);

app.get("/", (req,res) =>{
    res.redirect(301,"/pizza/list")
})



app.get("/api/pizza",async (req,res) =>{
    let pizzaList = await fileReaderAsync(pizzaPath);
    res.send(JSON.parse(pizzaList).Pizza)
})

app.get("/api/allergen", async (req,res) =>{
    let pizzaList = await fileReaderAsync(pizzaPath);
    res.send(JSON.parse(pizzaList).Allergens)
})

app.get(["/pizza/list", "/pizza/list/:id", "/api/order"], async (req, res, next) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
  });

app.post("/pizza/list", async (req,res) => {
    let userList = await fileReaderAsync(userPath);
    let dataObj = JSON.parse(userList);
    dataObj.Orders.push(req.body);
    fileWriterAsync(userPath,JSON.stringify(dataObj, null, 4));
    res.send("DONE"); 
})

app.post("/pizza/list/comments", async (req,res) => {
    let userComments = await fileReaderAsync(userCommentsPath);
    let dataObj = JSON.parse(userComments);
    dataObj.Comments.push(req.body);
    console.log(dataObj.Comments);
    console.log(req.body);
    fileWriterAsync(userCommentsPath,JSON.stringify(dataObj, null, 4));
    res.send("DONE"); 
})

app.get("/pizza/orders", async (req,res) => {
    let userList = await fileReaderAsync(userPath);
    let dataObj = JSON.parse(userList);
    res.send(dataObj);
})


app.use(express.static(`${__dirname}/../frontend/public`));

app.listen( port, _ => console.log(`http://127.0.0.1:${port}`))
