let root = document.getElementById("root");
let secondRoot = document.getElementById("secondRoot");
let thirdRoot = document.getElementById("thirdRoot");
let input = document.getElementById("input");
let selectButton = document.getElementById("openALG");
let bigImage = document.getElementById("bigImage");
let cartButton = document.getElementById("cartHandle");
let cartNumber = document.getElementById("cartNumber")
let bool = false;
let allCheckBox;
let allergenSelected = [];
let selectedPizza = true;
let carousel = document.querySelector(".carousel");
let menuButton = document.getElementById("menu");
let wrapper = document.querySelector(".wrapper");
let wrapperHandler = document.querySelector(".wrapperHandler");
let loginHandle = document.getElementById("loginHandle");
let eventLogin = 0;
let bigPizza;
let dataObjpizzas;
let submitted = false;
let allreadySubmited = false;
let pizzaBigImgHolder, pizzaDetailsHolder, pizzaDetails, pizzaDetailName, pizzaDescription, pizzaIngredients, pizzaPrice, price, addToCart, add, amount, substract, contactDiv, divTransparentContact;
let currentDate = new Date();
let cartVisibilityContor = 0;
let cartBackground, cartList, backFromCart, checkoutHolder, totalPrice, checkoutBtn, cartAlert;
let contactButton = document.getElementById("contact");
let contactForm = document.getElementById("contactForm");

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

let createDetailElemnts = (pizza) => {
  pizzaDetailsHolder = addEl("div", root, "id", "pizzaDetailsHolder", "class", "center");
  pizzaDetails = addEl("div", pizzaDetailsHolder, "id", "pizzaDetails")
  pizzaDetailName = addEl("div", pizzaDetails, "id", "pizzaName", "class", "center")

  pizza == undefined ? pizzaDetailName.innerText = "PLEASE SELECT A PIZZA FROM THE MENU" : pizzaDetailName.innerText = `${pizza.name}`

  pizzaDescription = addEl("div", pizzaDetails, "id", "pizzaDescription")
  pizzaIngredients = addEl("div", pizzaDetails, "id", "pizzaIngredients")
  pizzaPrice = addEl("div", pizzaDetails, "id", "pizzaPrice")

  addToCart = addEl("button", pizzaPrice, "id", "addToCart", "class", "hidden", "class", "headerButton");
  addToCart.style.height = "70px";
  addToCart.innerText = "ADD TO CART"
  addToCart.addEventListener("click", addToCartButton)

  price = addEl("div", pizzaPrice, "id", "price")

  substract = addEl("button", pizzaPrice, "id", "substract", "class", "addSubstract hidden")
  substract.innerText = "-"

  amount = addEl("div", pizzaPrice, "id", "amount", "class", "center hidden")
  amount.innerText = "0"

  add = addEl("button", pizzaPrice, "id", "add", "class", "addSubstract hidden")
  add.innerText = "+"
}

let listItemCounter = 0;
let addToCartButton = () => {
  if (amount.innerText != 0) {
    let cartListItem = addEl("div", cartList, "class", "cartListItem")
    let productName = addEl("p", cartListItem, "class", "productName")
    let productCuantity = addEl("p", cartListItem, "class", "productCuantity")

    cartListItem.insertAdjacentHTML("beforeend", `<i  id="${listItemCounter}trash" class="fa fa-trash-o" style="font-size:24px"></i>`)
    document.getElementById(`${listItemCounter}trash`).addEventListener("click", (e) => {
      e.target.parentElement.remove();
      cartNumber.innerText = cartNumber.innerText * 1 - 1
      totalPrice.innerText = `Total : ${[...cartList.querySelectorAll(".cartListItem")].reduce((acc, cur) => acc + cur.id * 1, 0)} lei`
    })

    productCuantity.innerText = `${amount.innerText}  x  ${parseInt(price.id)} lei`
    cartListItem.id = (amount.innerText * 1) * (parseInt(price.id) * 1)



    cartNumber.innerText = cartNumber.innerText * 1 + 1

    productName.innerText = `${pizzaDetailName.innerText}`;
    listItemCounter++;
  }
}

//////

let addSubstractEvent = () => {
  add.addEventListener("click", () => {
    amount.textContent = amount.textContent * 1 + 1
  })
  substract.addEventListener("click", () => {
    if (amount.textContent > 0) {
      amount.textContent = amount.textContent * 1 - 1
    }
  })
}

////////

let createCart = () => {
  cartBackground = addEl("div", root, "id", "cartBackground")
  cartList = addEl("div", cartBackground, "id", "cartList")

  let cartAlertHolder = addEl("div", cartBackground, "id", "cartAlertHolder", "class", "center")
  cartAlert = addEl("p", cartAlertHolder, "id", "cartAlert",);
  cartAlert.innerText = "NEED TO SING IN FIRST";

  checkoutHolder = addEl("div", cartBackground, "id", "checkoutHolder")

  totalPrice = addEl("p", checkoutHolder, "id", "totalPrice");
  totalPrice.innerText = "Total : 0 lei "

  checkoutBtn = addEl("button", checkoutHolder, "id", "checkoutBtn", "class", "headerButton center")
  checkoutBtn.innerText = "CHECKOUT"
  checkoutBtn.addEventListener("click", checkoutBtnEvt);


  backFromCart = addEl("button", cartBackground, "id", "backFromCart", "class", "headerButton")
  backFromCart.innerText = "Back"
  backFromCart.addEventListener("click", backFromCartEvt)
}

let checkoutBtnEvt = () => {
  if (submitted) {
    console.log([...cartList.querySelectorAll(".cartListItem")]);
    [...cartList.querySelectorAll(".cartListItem")].map(order => orderSchema.pizzas.push({ id: `${order.querySelector(".productName").innerText}`, amount: `${parseInt(order.querySelector(".productCuantity").innerText)}` }))
    console.log([...cartList.querySelectorAll(".cartListItem")].sort())
    console.log(orderSchema)

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

    location.reload();

  } else {
    console.log("need to sing in")
    cartAlert.style.visibility = "visible"
    setInterval(() => cartAlert.style.visibility = "hidden", 4000)

  }
}

let backFromCartEvt = (e) => {
  cartBackground.style.visibility = "hidden"
  cartVisibilityContor++
}

//////////

let userInfo = () => {

  if (allreadySubmited == false) {
    if (eventLogin === 0) {
      eventLogin++
      let divTransparentLogin = document.getElementById("divTransparentLogin");
      let backButton = document.getElementById("backSubmit2");
      divTransparentLogin.style.visibility = "visible";
      backButton.addEventListener('click', (event) => {
        divTransparentLogin.style.visibility = "hidden";
      })

      let submit = document.getElementById("submitLogin")
      submit.addEventListener('click', (event) => {
        event.preventDefault();
        if (ifInputsFilled()) {
          submitted = true;
          allreadySubmited = true

          //user info
          orderSchema.customer.name = document.getElementById("firstInput").value;
          orderSchema.customer.email = document.getElementById("secondInput").value;
          orderSchema.customer.address.city = document.getElementById("thirdInput").value;
          orderSchema.customer.address.street = document.getElementById("fourthInput").value;

          //date info
          orderSchema.date.year = currentDate.getFullYear()
          orderSchema.date.month = currentDate.getMonth() + 1
          orderSchema.date.day = currentDate.getDate();
          orderSchema.date.minute = currentDate.getMinutes();
          orderSchema.date.hour = currentDate.getHours();

          console.log(orderSchema)
          console.log("done");
          eventLogin++;
          divTransparentLogin.style.visibility = "hidden";
        }
      })
    } else {
      divTransparentLogin.style.visibility = "visible";
      console.log("visible");
    }
  }
}

let ifInputsFilled = () => {
  if (document.getElementById("firstInput").value != "" &&
    document.getElementById("secondInput").value != "" &&
    document.getElementById("thirdInput").value != "" &&
    document.getElementById("fourthInput").value != "") {
    console.log("true")
    return true;
  }
  console.log("false")
  document.getElementById("alert").textContent = "YOU MUST COMPLETE ALL THE FIELDS BEFORE SUBMITING"
  document.getElementById("alert").style.visibility = "visible"
  setInterval(() => document.getElementById("alert").style.visibility = "hidden", 5000)
  return false;
}

////////////

let showCart = () => {
  if (cartVisibilityContor % 2 == 0) {
    if (cartNumber.innerText == 0) {
      let divTransparentSadPizza = addEl("div", root, "class", "divTransparent");
      let cartTransparentDiv = addEl("div", divTransparentSadPizza, "class", "cartTransparentDiv");
      divTransparentSadPizza.addEventListener('click', (event) => {
        divTransparentSadPizza.style.visibility = "hidden";
        cartTransparentDiv.style.visibility = "hidden";
      })
      divTransparentSadPizza.style.visibility = "visible";
      cartTransparentDiv.style.visibility = "visible";
      cartTransparentDiv.insertAdjacentHTML("afterbegin", `<div class="sadPizzaHeader"></div>`)
      cartTransparentDiv.insertAdjacentHTML("beforeend",
        `<img class="sadImg" src="https://www.jerryspizza.ro/_next/static/media/sad_pizza.3aa9f33f.svg" bottom="200px" />`)
      cartTransparentDiv.insertAdjacentHTML("beforeend", `<p class="sadPizzaP1">Nu se afla niciun produs in cos.</p>`)
      cartTransparentDiv.insertAdjacentHTML("beforeend", `<p class="sadPizzaP2">Adauga un produs in <strong>Cosul de cumparaturi</strong> si plaseaza comanda.</p>`)
      cartVisibilityContor++
    } else {
      cartBackground.style.visibility = "visible"
      totalPrice.innerText = `Total : ${[...cartList.querySelectorAll(".cartListItem")].reduce((acc, cur) => acc + cur.id * 1, 0)} lei`
    }
  } else {
    cartBackground.style.visibility = "hidden";
  }
  cartVisibilityContor++
}

////////////

let contactInfo = () => {
  divTransparentContact = document.getElementById("divTransparentContact")
  divTransparentContact.style.visibility = "visible";
  let backButton = document.getElementById("backSubmit");
  let contactForm = document.getElementById("contactForm");
  let contactSubmit = document.getElementById("contactSubmit");
  contactSubmit.addEventListener("click", (event) => {

    userCommentSchema.FirstName = document.getElementById("input1").value;
    userCommentSchema.LastName = document.getElementById("input2").value;
    userCommentSchema.Email = document.getElementById("input3").value;
    userCommentSchema.Subject = document.getElementById("input4").value;
    userCommentSchema.Message = document.getElementById("input5").value;

    fetch("/pizza/list/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userCommentSchema)
    }).then(response => response.json())
      .then(response => {
        console.log(response);
      })

    location.reload();
  })

  contactDiv = document.getElementById("contactInfo");
  contactDiv.innerText = "At Vito's, we want every customer to have a good experience. From the way your food tastes to the welcome you receive when you first come in the door, to the cleanliness of your table. We want you to be happy you chose to have a meal with us. We would love to hear from you so that we can continue to improve our product and service.\n\n Note: Party room reservations may be made using our Reservations Form. Please do not use the General Comment form below to request room reservations\n\n\n"
  contactDiv.innerText += "GENERAL COMMENT FORM\n\n This form is intended for general comments. A response may take up to 3 days.\n\n For all orders, questions about orders, or party-room reservations please call the restaurant directly during normal business hours. Thank you"
  let contactFormButton = addEl("button", contactDiv, "id", "contactFormButton", "class", "headerButton");
  contactFormButton.innerText = "Click here to open the form";
  contactFormButton.addEventListener('click', (event) => {
    contactForm.style.visibility = "visible";
  })
  backButton.addEventListener("click", (event) => {
    contactForm.style.visibility = "hidden";
  })
}

/////////////

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
        pizzaDescription.textContent = `DESCRIPTION : ${pizza.description}`;
        pizzaIngredients.textContent = `INGREDIENTS : ${pizza.ingredients}`;
        price.textContent = `Price : ${pizza.price} Lei`
        price.id = `${pizza.price}price`

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

/////////////

let menuBTN = () => {

  menuButton.addEventListener("click", () => {
    wrapper.style.visibility = "visible";
    pizzaDetails.style.visibility = "hidden";
    wrapperHandler.style.visibility = "visible";
    contactDiv.style.visibility = "hidden";
    divTransparentContact.style.visibility = "hidden";
  })
}

/////////////

let logoBTN = () => {
  let logo = document.querySelector("#logo")
  logo.style.cursor = "pointer";
  logo.style.draggable = "false";
  logo.addEventListener("click", () => {
    window.location.reload();
  })
}

//////////////

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

/////////////

let userCommentSchema = {
  FirstName: "",
  LastName: "",
  Email: "",
  Subject: "",
  Message: ""
};

let orderSchema = {
  id: 1,
  pizzas: [],
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

const loadEvent = () => {
  let pizzaBigImgHolder = addEl("div", root, "id", "pizzaBigImgHolder")
  addEl("img", pizzaBigImgHolder, "src", "/images/cutter.png", "class", "cutter")
  bigPizza = addEl("img", pizzaBigImgHolder, "src", ``, "class", "bigPizzaImg");
  createDetailElemnts();
  addSubstractEvent();
  createCart();

  loginHandle.addEventListener('click', userInfo)
  cartButton.addEventListener('click', showCart)
  contactButton.addEventListener('click', contactInfo)

  allPizzas([]);
  menuBTN();
  logoBTN()
  selectButton.addEventListener("click", select);


};

window.addEventListener("load", loadEvent);
