const express = require("express")
const app  = express()
const path = require("path")
const fileReaderAsync = require("./fileReader")
const fileWriterAsync = require("./fileWriter")
const pizzaPath = path.join(`${__dirname}/pizza.json`)

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

app.get(["/pizza/list", "/pizza/list/:id"], async (req, res, next) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
  });


app.use("/public", express.static(`${__dirname}/../frontend/public`));

app.listen( port, _ => console.log(`http://127.0.0.1:${port}`))
