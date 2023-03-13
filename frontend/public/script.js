let root = document.getElementById("root");
let input = document.getElementById("input");
let selectButton = document.getElementById("openALG");
let bigImage = document.getElementById("bigImage");
let bool = false;
let allCheckBox;
let allergenSelected = [];
let selectedPizza = true;
let carousel = document.querySelector(".carousel");
let menuButton = document.getElementById("menu");
let wrapper = document.querySelector(".wrapper");
let bigPizza;

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
  let response = await fetch("/api/pizza");
  let dataObj = await response.json();

  carousel.innerHTML = "";
  for (let pizza of dataObj) {
    if (
      pizza.allergens.reduce(
        (acc, cur) => (allergenSelected.includes(cur) ? false : acc),
        true
      )
    ) {
      let pizzaCard = addEl("div", carousel, "class", "pizzaCard");

      pizzaCard.addEventListener("click", () =>{                               ////////////////////
        wrapper.style.visibility = "hidden";
        bigPizza.src = `${pizza.croppedImage}`

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
    // showing and hiding prev/next icon according to carousel scroll left value
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display =
      carousel.scrollLeft == scrollWidth ? "none" : "block";
  };
  arrowIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      let firstImgWidth = firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
      // if clicked icon is left, reduce width value from the carousel scroll left else add to it
      carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
      setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
    });
  });
};
let menuBTN = () => {
  menuButton.addEventListener("click", () => {
    wrapper.style.visibility = "visible";
  })
}
let pizzaBigImgHolder,pizzaDetailsHolder,pizzaDetails,pizzaName,pizzaDescription,pizzaIngredients,pizzaPrice,price,addToCart,add,amount,substract;

let createDetailElemnts = (pizza) =>{
  let pizzaDetailsHolder = addEl("div",root, "id", "pizzaDetailsHolder", "class", "center");
  let pizzaDetails = addEl("div", pizzaDetailsHolder, "id", "pizzaDetails")
  let pizzaName = addEl("div",pizzaDetails, "id", "pizzaName", "class", "center")

  pizza == undefined? pizzaName.innerText = "PLEASE SELECT A PIZZA FROM THE MENU" :  pizzaName.innerText = `${pizza.name}`

  let pizzaDescription = addEl("div",pizzaDetails, "id", "pizzaDescription")
  let pizzaIngredients = addEl("div", pizzaDetails, "id", "pizzaIngredients")
  let pizzaPrice = addEl("div", pizzaDetails, "id", "pizzaPrice")
  let price = addEl("div", pizzaPrice, "id", "price")
  let addToCart = addEl("button", pizzaPrice, "id", "addToCart")
  addToCart.innerText = "ADD TO CART"
  let substract = addEl("button", pizzaPrice, "id", "substract", "class", "addSubstract")
  substract.innerText ="-"
  let amount = addEl("div", pizzaPrice, "id", "amount", "class", "center")
  amount.innerText = "0"
  let add = addEl("button", pizzaPrice, "id", "add", "class", "addSubstract")
  add.innerText ="+"
  pizzaDescription.innerText =" DESCRIPTION : Quattro Formaggi pizza is made from four types of cheese. Positano provides you with Quattro Formaggi rossa pizza, prepared according to the original Positano recipe, on crispy and puffy dough with tomato sauce, cheeses: Mozzarella, Gorgonzola, Parmesan, Emmental, Camembert; with walnuts and honey.";
  pizzaIngredients.innerText =  " INGREDIENTS : cheese sauce, parmesan cheese, cheddar cheese, brie cheese, mozzarella cheese"

}
const loadEvent = () => {

//pizza  image part
  
  let pizzaBigImgHolder = addEl("div", root , "id", "pizzaBigImgHolder")
  addEl("img",pizzaBigImgHolder, "src","/images/cutter.png", "class", "cutter" )
 bigPizza = addEl("img",pizzaBigImgHolder, "src" , ``, "class","bigPizzaImg");

 //pizza details part
  createDetailElemnts();

  
  allPizzas([]);
  menuBTN();
  // events()
  selectButton.addEventListener("click", select);

 
};

window.addEventListener("load", loadEvent);
