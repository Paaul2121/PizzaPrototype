let root = document.getElementById("root");
let input = document.getElementById("input");
let selectButton = document.getElementById("openALG");
let bool = false;

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
  
let selector =  addEl("div", root, "id");
let counter = 0;
let  allOptions = async () => {
    if(counter % 2 === 0){
        let response = await fetch("/api/allergen");
        let dataObj = await response.json();
        console.log(dataObj);
        
        for(let allergen of dataObj){
          let optionInput = addEl("div", selector, "id", "optionInput");
          let input = addEl("input",optionInput,"type","checkbox","class","checkboxOption");
          let label = addEl("label",optionInput, "class", "allergenLabel");
          label.textContent = allergen.name[0].toUpperCase() + allergen.name.slice(1,allergen.name.length);
          counter++;
        }
    }
  }

  let select = async () => {
      if(bool === false){
        selector.id = "selector";
        bool = true;
        allOptions();
    } else {
        selector.id = "selectorClose";
        selector.innerHTML = "";
        bool = false;
    }
}

const loadEvent = () =>{
    

    selectButton.addEventListener('click', select);
    
}

window.addEventListener("load",loadEvent)