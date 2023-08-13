document.addEventListener("DOMContentLoaded", function() {
    setRestData();
    loginstate();
    getRestaurantItems();
    document.getElementById("checkout").addEventListener("click", goToCheckOut);
})

let LoginState = false;
let itemsToOrder = [];
let osszAr = 0;

async function loginstate() {
    let profilDropdown = document.getElementById("profil-menu");
    LoginState = await checkstatus();

    if (LoginState) {
        let profileMenuOrders = document.createElement("li");
        let profileMenuOrdersLink = document.createElement("a");
        profileMenuOrdersLink.classList.add("dropdown-item");
        profileMenuOrdersLink.href = "orders.html";
        profileMenuOrdersLink.innerHTML = "Rendelések";
        profileMenuOrders.appendChild(profileMenuOrdersLink);
        profilDropdown.appendChild(profileMenuOrders);

        let dropdownDivider = document.createElement("hr");
        dropdownDivider.classList.add("dropdown-divider");
        profilDropdown.appendChild(dropdownDivider);

        let profileMenuLogout = document.createElement("li");
        let profileMenuLogoutBtn = document.createElement("button");
        profileMenuLogoutBtn.classList.add("dropdown-item", "btn");
        profileMenuLogoutBtn.type = "button";
        profileMenuLogoutBtn.innerHTML = "Kijelentkezés";
        profileMenuLogout.appendChild(profileMenuLogoutBtn);
        profilDropdown.appendChild(profileMenuLogout);

        profileMenuLogoutBtn.addEventListener("click", logout);
    } else {
        window.location.assign("index.html");
    }
}

function logout() {
    let formData = new FormData();
    formData.append("f", "logout");

    fetch("adat.php", {
        method: "POST",
        body: formData,
      })
      .then((response) => {
         if (response.ok) {
           return response.text();
         }
  
         return Promise.reject(response);
      })
      .then((request) => {
        let result = JSON.parse(request);

        if (result == 1) {
            window.location.assign("index.html");
        }
      })
      .catch((response) => {
        alert("Sikertelen kijelentkezés, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
      });  
}

function getRestaurantItems() {
    let formData = new FormData();
    formData.append("f", "getRestaurantItems");

    fetch("adat.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }

        return Promise.reject(response);
      })
      .then((request) => {
        let result = JSON.parse(request);

        if (result != 0) {
            viewRestaurantItems(result);
        }
      })
      .catch((response) => {
        if (response.statusText != undefined) {
          alert(
            "Sikertelen étterem kínálat lekérés, próbáld újra.\nHibakód: " +
              response.status +
              " " +
              response.statusText
          );
        }
      });  
}

function setRestData() {
    let headerImg = document.getElementById("rest-header-img");
    let restName = document.getElementById("rest-name");
    let formData = new FormData();
    formData.append("f", "getRest");

    fetch("adat.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }

        return Promise.reject(response);
      })
      .then((request) => {
        if (request != 0) {
            restName.innerHTML = request;
            headerImg.src = `imgs/${request}.avif`;
        } else {
          window.location.assign("index.html");
        }
      })
      .catch((response) => {
        alert(
          "Sikertelen étterem adat lekérés, próbáld újra.\nHibakód: " +
            response.status +
            " " +
            response.statusText
        );
      }); 
}

function viewRestaurantItems(result) {
    let items = document.getElementById("items");

    for (let i = 0; i < result.length; i++) {
        let col = document.createElement("div");
        col.classList.add("col", "mb-3");


        let card = document.createElement("div");
        card.classList.add("card", "h-100");


        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "etel");

        let namePrice = document.createElement("div");

        let name = document.createElement("h5");
        name.innerHTML = result[i].nev;

        let ar = document.createElement("p");
        ar.innerHTML = result[i].ar + " Ft";

        namePrice.appendChild(name);
        namePrice.appendChild(ar);

        let img = document.createElement("img");
        img.src = `imgs/etel/${result[i].nev}.avif`;
        img.classList.add("etel-img");
        img.alt = result[i].nev;

        let addToCart = document.createElement("button");
        addToCart.type = "button";
        addToCart.classList.add("btn", "btn-primary");
        addToCart.dataset.id = result[i].nev;
        addToCart.dataset.price = result[i].ar;
        
        let strong = document.createElement("strong");
        strong.innerHTML = "+";
        
        addToCart.appendChild(strong);

        cardBody.appendChild(namePrice);
        cardBody.appendChild(img);
        cardBody.appendChild(addToCart);

        card.appendChild(cardBody);

        col.appendChild(card);

        items.appendChild(col);

        addToCart.addEventListener("click", addItemToCart);
    }
}

function addItemToCart() {
    if (itemsToOrder.length > 0) {
        let i = itemsToOrder.findIndex(obj => obj['key'] == this.dataset.id);

        if (i != -1) {
            itemsToOrder[i].value++;
        } else {
            itemsToOrder.push({
                key: this.dataset.id,
                value: 1,
                price: this.dataset.price
            });
        }
    } else {
        itemsToOrder.push({
            key: this.dataset.id,
            value: 1,
            price: this.dataset.price
        });
    }

    let sum = document.getElementById("osszAr");
    osszAr += parseInt(this.dataset.price);
    sum.innerHTML = `Összesen: ${osszAr} Ft`;
    
    generateCart();
}

function generateCart() {
    let cart = document.getElementById("cart-items");

    cart.innerHTML = "";

    if (itemsToOrder.length > 0) {
        for (let i = 0; i < itemsToOrder.length; i++) {
            let li = document.createElement("li");
            li.classList.add("list-group-item");

            let liCaptionCont = document.createElement("div");
            liCaptionCont.classList.add("me-auto");

            let liCaption = document.createElement("div");
            liCaption.classList.add("fw-bold");
            liCaption.innerHTML = itemsToOrder[i].key;

            liCaptionCont.appendChild(liCaption);

            let decreaseButton = document.createElement("button");
            decreaseButton.type = "button";
            decreaseButton.classList.add(
              "btn",
              "btn-outline-primary",
              "decrease-item",
              "fw-bold"
            );
            decreaseButton.innerHTML = "-";
            decreaseButton.dataset.id = itemsToOrder[i].key;
            decreaseButton.dataset.price = itemsToOrder[i].price;

            let itemCount = document.createElement("span");
            itemCount.classList.add("badge", "bg-primary", "rounded-pill");
            itemCount.innerHTML = itemsToOrder[i].value;

            let increaseButton = document.createElement("button");
            increaseButton.type = "button";
            increaseButton.classList.add(
              "btn",
              "btn-outline-primary",
              "increase-item",
              "fw-bold"
            );
            increaseButton.innerHTML = "+";
            increaseButton.dataset.id = itemsToOrder[i].key;
            increaseButton.dataset.price = itemsToOrder[i].price;

            li.appendChild(liCaptionCont);
            li.appendChild(decreaseButton);
            li.appendChild(itemCount);
            li.appendChild(increaseButton);

            cart.appendChild(li);

            decreaseButton.addEventListener("click", decreaseItem);
            increaseButton.addEventListener("click", increaseItem);
        }
    } else {
        let emptyCart = document.createElement("div");
        emptyCart.classList.add("fw-bold");
        emptyCart.innerHTML = "A kosarad üres";

        cart.appendChild(emptyCart);

        let sum = document.getElementById("osszAr");
        sum.innerHTML = "";
        osszAr = 0;
    }
}

function decreaseItem() {
    let i = itemsToOrder.findIndex(obj => obj['key'] == this.dataset.id);
    let sum = document.getElementById("osszAr");
    
    if (itemsToOrder[i].value == 1) {
        itemsToOrder.splice(i, 1);
        osszAr -= parseInt(this.dataset.price);
        sum.innerHTML = `Összesen: ${osszAr} Ft`;
    } else {
        itemsToOrder[i].value -= 1;
        osszAr -= parseInt(this.dataset.price);
        sum.innerHTML = `Összesen: ${osszAr} Ft`;
    }

    generateCart();
}

function increaseItem() {
    let i = itemsToOrder.findIndex(obj => obj['key'] == this.dataset.id);
    itemsToOrder[i].value += 1;

    let sum = document.getElementById("osszAr");
    osszAr += parseInt(this.dataset.price);
    sum.innerHTML = `Összesen: ${osszAr} Ft`;

    generateCart();
}

function goToCheckOut() {
    if (itemsToOrder.length != 0) {
        checkOut();
    } else {
        noItems();
    }
}

function noItems() {
    let cart = document.getElementById("cart-items");
    cart.innerHTML = "";
    
    let message = document.createElement("h5");
    message.classList.add("mt-2", "text-danger");
    message.innerHTML = "Tegyél valamit a kosárba, hogy tudjál rendelni!";

    cart.appendChild(message);
}

function checkOut() {
    let formData = new FormData();
    formData.append("f", "itemsToOrder");
    formData.append("d", JSON.stringify(itemsToOrder));

    fetch("adat.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }

        return Promise.reject(response);
      })
      .then((request) => {
        let result = JSON.parse(request);

        console.log(result[0]);

        if (result == 1) {
          window.location.assign("checkout.html");
        } else if (result == 0) {
            alert("Sikertelen adatfeldolgozás, próbáld újra!");
        }
      })
      .catch((response) => {
        alert(
          "Sikertelen adatfeldolgozás, próbáld újra.\nHibakód: " +
            response.status +
            " " +
            response.statusText
        );
      });  
}