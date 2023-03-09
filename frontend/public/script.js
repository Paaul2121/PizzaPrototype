let root = document.getElementById("root");
let input = document.getElementById("input");
let selectButton = document.getElementById("openALG");
let bool = false;
let allCheckBox;
let allergenSelected = [];


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
    
    
    let pizzaList = addEl("div", root, "id", "pizzaList");
  
  let allPizzas = async (allergenSelected) => {
    let response = await fetch("/api/pizza");
    let dataObj = await response.json();

    pizzaList.innerHTML="";
    console.log(pizzaList.querySelectorAll("div").length/2)

    for(let pizza of dataObj){
      if(pizza.allergens.reduce((acc,cur) => allergenSelected.includes(cur)? false : acc, true)){
      let pizzaCard = addEl("div", pizzaList, "id", "pizzaCard");
      let pizzaCardImg = addEl("img",pizzaCard,"class", "pizzaCardImg", "src", `${pizza.image}`)
      let number = addEl("div", pizzaCard)
      number.innerText = `${pizza.name}`
      number.style.color = "white"
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
          let input = addEl("input",optionInput,"type", "checkbox" ,"class" ,"checkboxOption", "id", `checkBox${counter}`);

          input.addEventListener("click", (e) =>{
             if(input.checked){
              allergenSelected.push(e.target.id.slice(e.target.id.length-1,e.target.id.length)*1)
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

const loadEvent = () =>{
    
    allPizzas([]);
    selectButton.addEventListener('click', select);
    

}

window.addEventListener("load",loadEvent)