let root = document.getElementById("root");
let input = document.getElementById("input");
let selectButton = document.getElementById("openALG");
let bigImage = document.getElementById("bigImage");
let cardButton = document.getElementById("cartHandle");
let bool = false;
let allCheckBox;
let allergenSelected = [];
let selectedPizza = true;



const addEl = (
  type,
  parent,
  atr1,
  atr1Name,
  atr2,
  atr2Name,
    atr3,
    atr3Name
    ) => {
      let el = document.createElement(type);
      if (atr1 != undefined) el.setAttribute(atr1, atr1Name);
      if (atr2 != undefined) el.setAttribute(atr2, atr2Name);
      if (atr3 != undefined) el.setAttribute(atr3, atr3Name);
      if (parent != undefined) parent.appendChild(el);
      return el;
};

let userInfo = () => {
  let divTransparent = addEl("div", root, "id", "divTransparent");
   divTransparent.insertAdjacentHTML("beforeend", `
  <form class="form">
  <p>Login</p>
  <div class="group">
    <input required="true" class="main-input" id="firstInput" type="text">
    <span class="highlight-span"></span>
    <label class="lebal-email">Name</label>
  </div>
  <div class="container-1">
    <div class="group">
      <input required="true" class="main-input" id="secondInput" type="text">
      <span class="highlight-span"></span>
      <label class="lebal-email">Email</label>
    </div>
  </div>
  <div class="container-1">
    <div class="group">
      <input required="true" class="main-input" id="thirdInput" type="text">
      <span class="highlight-span"></span>
      <label class="lebal-email">City</label>
    </div>
  </div>
  <div class="container-1">
    <div class="group">
      <input required="true" class="main-input" id="fourthInput" type="text">
      <span class="highlight-span"></span>
      <label class="lebal-email">Street</label>
    </div>
  </div>
  <button class="submit" id="submit" type"submit">Submit</button>
</form>
  `)
  
  let submit = document.getElementById("submit")
  submit.addEventListener('click', (event) => {
    event.preventDefault();
    orderSchema.customer.name = document.getElementById("firstInput").value;
    orderSchema.customer.email = document.getElementById("secondInput").value;
    orderSchema.customer.address.city = document.getElementById("thirdInput").value;
    orderSchema.customer.address.street = document.getElementById("fourthInput").value;
    console.log(orderSchema)
    console.log("done");

    fetch("/pizza/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderSchema)
    }).then(response => response.json())
      .then(response => {
      console.log(response);
    })
  })
 
}

let orderSchema = {
    id: 1,
    pizzas: [
      {
        id: "",
        amount: ""
      }
    ],
    date: 
    {
     year: "", 
     month: "",
     day: "",
     hour: "",
     minute: ""
    },
    customer: 
    {
      name: "",
      email: "",
      address: 
      {
        city: "",
        street: ""
      }
    }
}
    
    
  let pizzaList = addEl("div", root, "id", "pizzaList");
  
  let allPizzas = async (allergenSelected) => {
    let response = await fetch("/api/pizza");
    let dataObj = await response.json();

    pizzaList.innerHTML="";
    let selectedButton = null;
    for(let pizza of dataObj){
      if(pizza.allergens.reduce((acc,cur) => allergenSelected.includes(cur)? false : acc, true)){
      let pizzaCard = addEl("div", pizzaList, "id", "pizzaCard");
      let pizzaButton = addEl("button", pizzaCard, "id", "pizzaButton");

      pizzaButton.addEventListener('click', () => {
        bigImage.style.visibility = "visible";
        if (selectedButton) {
          console.log(selectedButton);
          selectedButton.style.backgroundColor = 'black';
        }
        pizzaButton.style.backgroundColor = 'white';
        bigImage.src = pizza.croppedImage;
        selectedButton = pizzaButton; 
      })

      let pizzaCardImg = addEl("img",pizzaCard,"class", "pizzaCardImg", "src", `${pizza.image}`)
      let pizzaName = addEl("p", pizzaButton, "id", "pizzaName");
      let pizzaPrice = addEl("p", pizzaButton, "id", "pizzaPrice");
      pizzaName.innerText = pizza.name
      pizzaPrice.innerText = pizza.price + " LEI";
      }
    }   
    console.log(pizzaList.querySelectorAll("div").length/2)
  }
  
  let selector =  addEl("div", root, "id");
  let counter = 1;
  let firstRenderAllergens = true
  let  allOptions = async () => {
    if(firstRenderAllergens){
        let response = await fetch("/api/allergen");
        let dataObj = await response.json();
        console.log(dataObj);
        
        for(let allergen of dataObj){
          let optionInput = addEl("div", selector, "id", "optionInput");
          let input = addEl("input",optionInput,"type", "checkbox" ,"class" ,"checkboxOption", "id", `${counter}checkbox`);

          input.addEventListener("click", (e) =>{
             if(input.checked){
              allergenSelected.push(parseInt(e.target.id))
              console.log(allergenSelected)
             }else{
              allergenSelected.splice(allergenSelected.indexOf(allergen.name),1)
              console.log(allergenSelected)
            }
            allPizzas(allergenSelected)
          })

          let label = addEl("label",optionInput, "class", "allergenLabel");
          label.textContent = allergen.name[0].toUpperCase() + allergen.name.slice(1,allergen.name.length);
          counter++;
        }
  
        firstRenderAllergens = false
    }else{
      selector.style.visibility = "visible";
    }
  }

  let select = async () => {
      if(bool === false){
        selector.id = "selector";
        bool = true;
        allOptions();
    } else {
        selector.id = "selectorClose";
        selector.style.visibility = "hiden"
        bool = false;
    }
}

let submitData = () => {
    
}

const loadEvent = () =>{
    
    allPizzas([]);
    selectButton.addEventListener('click', select);
    cardButton.addEventListener('click', userInfo);
   
    
}

window.addEventListener("load",loadEvent)