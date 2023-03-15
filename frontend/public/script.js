let root = document.getElementById("root");
let input = document.getElementById("input");
let selectButton = document.getElementById("openALG");
let bigImage = document.getElementById("bigImage");
let cardButton = document.getElementById("cartHandle");
let bool = false;
let allCheckBox;
let allergenSelected = [];
let selectedPizza = true;
let carousel = document.querySelector(".carousel");
let menuButton = document.getElementById("menu");
let wrapper = document.querySelector(".wrapper");
let wrapperHandler = document.querySelector(".wrapperHandler");
let loginHandle = document.getElementById("loginHandle")
let bigPizza;
let dataObjpizzas;
let submitCart = false;
let pizzaBigImgHolder,pizzaDetailsHolder,pizzaDetails,pizzaDetailName,pizzaDescription,pizzaIngredients,pizzaPrice,price,addToCart,add,amount,substract;

const addEl = (
  type,
  parent,
  atr1,
  atr1Name,
  atr2,
  atr2Name,
  atr3,
  atr3Name,
  atr4,
  atr4Name
) => {
  let el = document.createElement(type);
  if (atr1 != undefined) el.setAttribute(atr1, atr1Name);
  if (atr2 != undefined) el.setAttribute(atr2, atr2Name);
  if (atr3 != undefined) el.setAttribute(atr3, atr3Name);
  if (atr4 != undefined) el.setAttribute(atr4, atr4Name);
  if (parent != undefined) parent.appendChild(el);
  return el;
};

let userInfo = () => {
  let divTransparent = addEl("div", root, "id", "divTransparent");
  divTransparent.addEventListener('click', (event) => {
    divTransparent.style.visibility = "hidden";
  })
  divTransparent.style.visibility = "visible";
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
    submitCart = true;
    event.preventDefault();
    orderSchema.customer.name = document.getElementById("firstInput").value;
    orderSchema.customer.email = document.getElementById("secondInput").value;
    orderSchema.customer.address.city = document.getElementById("thirdInput").value;
    orderSchema.customer.address.street = document.getElementById("fourthInput").value;
    console.log(orderSchema)
    console.log("done");
  })
}

let orderSchema = {
  id: 1,
  pizzas: [
    {
      id: "",
      amount: "",
    },
  ],
  date: {
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
  },
  customer: {
    name: "",
    email: "",
    address: {
      city: "",
      street: "",
    },
  },
};

//! pizzza populate 2
let allPizzas = async (allergenSelected) => {
  let cutter = document.querySelector(".cutter");
  cutter.setAttribute("draggable", "false");
  let response = await fetch("/api/pizza");
   dataObjpizzas = await response.json();

  carousel.innerHTML = "";
  for (let pizza of dataObjpizzas) {
    if (
      pizza.allergens.reduce(
        (acc, cur) => (allergenSelected.includes(cur) ? false : acc),
        true
      )
    ) {
      let pizzaCard = addEl("div", carousel, "class", "pizzaCard");

      pizzaCard.addEventListener("click", () => {  
        cutter.style.visibility = "visible";
        wrapperHandler.style.visibility = "hidden";
        pizzaDetails.style.visibility = "visible";
        wrapper.style.visibility = "hidden";
        bigPizza.src = `${pizza.croppedImage}`;
        bigPizza.setAttribute("draggable", "false");
        console.log(pizzaDetailName, pizzaDescription)
        pizzaDetailName.textContent = `PIZZA ${pizza.name}`
        pizzaDescription.textContent =`DESCRIPTION : ${pizza.description}`;
        pizzaIngredients.textContent = `INGREDIENTS : ${pizza.ingredients}`;

        addToCart.classList.remove("hidden")
        substract.classList.remove("hidden")
        amount.classList.remove("hidden")
        amount.textContent = 0;
        add.classList.remove("hidden")
      })

      let pizzaNameHolder = addEl("div", pizzaCard, "class", "pizzaNameHolder");
      let pizzaName = addEl("p", pizzaNameHolder, "class", "pizzaName");
      pizzaName.textContent = pizza.name;
      let pizzaCardImg = addEl(
        "img",
        pizzaCard,
        "src",
        `${pizza.croppedImage}`,
        "draggable",
        "false",
        "alt",
        "img",
        "class",
        "pizzaCardImg"
      );
    }
  }
  events();
};

let selector = addEl("div", root, "id");
let counter = 1;
let firstRenderAllergens = true;
let allOptions = async () => {
  if (firstRenderAllergens) {
    let response = await fetch("/api/allergen");
    let dataObj = await response.json();
    console.log(dataObj);

    for (let allergen of dataObj) {
      let optionInput = addEl("div", selector, "id", "optionInput");
      let input = addEl(
        "input",
        optionInput,
        "type",
        "checkbox",
        "class",
        "checkboxOption",
        "id",
        `${counter}checkbox`
      );

      input.addEventListener("click", (e) => {
        if (input.checked) {
          allergenSelected.push(parseInt(e.target.id));
          console.log(allergenSelected);
        } else {
          allergenSelected.splice(allergenSelected.indexOf(allergen.name), 1);
          console.log(allergenSelected);
        }
        allPizzas(allergenSelected);
      });

      let label = addEl("label", optionInput, "class", "allergenLabel");
      label.textContent =
        allergen.name[0].toUpperCase() +
        allergen.name.slice(1, allergen.name.length);
      counter++;
    }

    firstRenderAllergens = false;
  } else {
    selector.style.visibility = "visible";
  }
};

let select = async () => {
  if (bool === false) {
    selector.id = "selector";
    bool = true;
    allOptions();
  } else {
    selector.id = "selectorClose";
    selector.style.visibility = "hiden";
    bool = false;
  }
};
let events = () => {
  const carousel = document.querySelector(".carousel"),
    firstImg = carousel.querySelectorAll("img")[0],
    arrowIcons = document.querySelectorAll(".wrapper i");

  const showHideIcons = () => {
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth; 
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display =
      carousel.scrollLeft == scrollWidth ? "none" : "block";
  };
  arrowIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      let firstImgWidth = firstImg.clientWidth + 14;
      carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
      setTimeout(() => showHideIcons(), 60);
    });
  });
};
let menuBTN = () => {
  
  menuButton.addEventListener("click", () => {
    wrapper.style.visibility = "visible";
    pizzaDetails.style.visibility = "hidden";
    wrapperHandler.style.visibility = "visible";;   
  })
}

let createDetailElemnts = (pizza) =>{
   pizzaDetailsHolder = addEl("div",root, "id", "pizzaDetailsHolder", "class", "center");
   pizzaDetails = addEl("div", pizzaDetailsHolder, "id", "pizzaDetails")
   pizzaDetailName = addEl("div",pizzaDetails, "id", "pizzaName", "class", "center")

  pizza == undefined? pizzaDetailName.innerText = "PLEASE SELECT A PIZZA FROM THE MENU" :  pizzaDetailName.innerText = `${pizza.name}`

   pizzaDescription = addEl("div",pizzaDetails, "id", "pizzaDescription")
   pizzaIngredients = addEl("div", pizzaDetails, "id", "pizzaIngredients")
   pizzaPrice = addEl("div", pizzaDetails, "id", "pizzaPrice")
   price = addEl("div", pizzaPrice, "id", "price")
   addToCart = addEl("button", pizzaPrice, "id", "addToCart", "class", "hidden")
  addToCart.innerText = "ADD TO CART"
  substract = addEl("button", pizzaPrice, "id", "substract", "class", "addSubstract hidden")
  substract.innerText ="-"
   amount = addEl("div", pizzaPrice, "id", "amount", "class", "center hidden")
  amount.innerText = "0"
   add = addEl("button", pizzaPrice, "id", "add", "class", "addSubstract hidden")
  add.innerText ="+"

}

let addSubstractEvent = () =>{
  add.addEventListener("click", () =>{
    amount.textContent = amount.textContent*1+1
    console.log(amount.textContent)
  })
  substract.addEventListener("click", () =>{
    if(amount.textContent > 0){
      amount.textContent = amount.textContent*1-1
    }
  })
}
let logoBTN = () => {
  let logo = document.querySelector("#logo")
  logo.style.cursor = "pointer";
  logo.style.draggable = "false";
  logo.addEventListener("click", () => {
    window.location.reload();
   })
}
const loadEvent = () => {
  let pizzaBigImgHolder = addEl("div", root , "id", "pizzaBigImgHolder")
  addEl("img",pizzaBigImgHolder, "src","/images/cutter.png", "class", "cutter" )
 bigPizza = addEl("img",pizzaBigImgHolder, "src" , ``, "class","bigPizzaImg");
  createDetailElemnts();
  addSubstractEvent();
  loginHandle.addEventListener('click', userInfo)

  allPizzas([]);
  menuBTN();
  logoBTN()
  selectButton.addEventListener("click", select);

 
};

window.addEventListener("load", loadEvent);
