document.addEventListener("DOMContentLoaded", function() {
    vaneAktivRendelese();
    loginstate();
    getRestaurants();
    getRestTypes();
    document.getElementById("restTypeDefault").addEventListener("click", getRestaurants);
    document.getElementById("keresesbtn").addEventListener("click", searchForRestaurants);
})

var LoginState = false;

async function loginstate() {
    let profilDropdown = document.getElementById("profil-menu");
    let searchLogin = document.getElementById("search-login");
    LoginState = await checkstatus();

    if (LoginState == true) {
        let profileMenuOrders = document.createElement("li");
        let profileMenuOrdersLink = document.createElement("a");
        profileMenuOrdersLink.classList.add("dropdown-item");
        profileMenuOrdersLink.href = "orders.html";
        profileMenuOrdersLink.innerHTML = "Rendelések";
        profileMenuOrders.appendChild(profileMenuOrdersLink);
        profilDropdown.appendChild(profileMenuOrders);

        let profileMenuDetails = document.createElement("li");
        let profileMenuDetailsLink = document.createElement("a");
        profileMenuDetailsLink.classList.add("dropdown-item");
        profileMenuDetailsLink.href = "profile.html";
        profileMenuDetailsLink.innerHTML = "Profil adatok";
        profileMenuDetails.appendChild(profileMenuDetailsLink);
        profilDropdown.appendChild(profileMenuDetails);

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
        let loginButton = document.createElement("a");
        loginButton.classList.add("btn", "btn-danger");
        loginButton.id = "loginbtn";
        loginButton.href = "login.html";
        loginButton.role = "button";
        loginButton.innerHTML = "Bejelentkezés";
        searchLogin.appendChild(loginButton);

        let profileMenuLogin = document.createElement("li");
        let profileMenuLoginLink = document.createElement("a");
        profileMenuLoginLink.classList.add("dropdown-item");
        profileMenuLoginLink.href = "login.html";
        profileMenuLoginLink.innerHTML = "Bejelentkezés";
        profileMenuLogin.appendChild(profileMenuLoginLink);
        profilDropdown.appendChild(profileMenuLogin);


        let profileMenuReg = document.createElement("li");
        let profileMenuRegLink = document.createElement("a");
        profileMenuRegLink.classList.add("dropdown-item");
        profileMenuRegLink.href = "registration.html";
        profileMenuRegLink.innerHTML = "Regisztráció";
        profileMenuReg.appendChild(profileMenuRegLink);
        profilDropdown.appendChild(profileMenuReg);
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

function getRestaurants() {
    let formData = new FormData();
    formData.append("f", "getRestaurants");

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
            showRestaurants(result);
        }
      })
      .catch((response) => {
        alert("Sikertelen étterem adat kérés, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
      });  
}

function showRestaurants(result) {
    let restaurants = document.getElementById("restaurants");
    restaurants.innerHTML = "";

    for (let i = 0; i < result.length; i++) {
        let col = document.createElement("div");
        col.classList.add("col", "mb-4");
        col.dataset.id = result[i].nev;
        
        col.addEventListener("click", jumpToRestaurant);
        
        let card = document.createElement("div");
        card.classList.add("card", "h-100", "etterem");

        let img = document.createElement("img");
        img.src = `imgs/${result[i].nev}.avif`;
        img.classList.add("card-img-top");
        img.alt = `${result[i].nev}`;
        card.appendChild(img);

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        let restName = document.createElement("h5");
        restName.classList.add("card-title");
        restName.innerHTML = result[i].nev;
        cardBody.appendChild(restName);
        card.appendChild(cardBody);

        col.appendChild(card);

        restaurants.appendChild(col);
    }
}

function getRestTypes() {
    let formData = new FormData();
    formData.append("f", "getRestaurantTypes");

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
            showFilters(result);
        }
      })
      .catch((response) => {
        alert("Sikertelen étterem adat kérés, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
      });  
}

function showFilters(result) {
    let filter = document.getElementById("filter");

    for (let i = 0; i < result.length; i++) {
        let formCheck = document.createElement("div");
        formCheck.classList.add("form-check");

        let rb = document.createElement("input");
        rb.classList.add("form-check-input");
        rb.type = "radio";
        rb.name = "restType";
        rb.id = `${result[i].tipus}`;
        rb.dataset.id = result[i].tipus;
        formCheck.appendChild(rb);

        let label = document.createElement("label");
        label.classList.add("form-check-label");
        label.htmlFor = `${result[i].tipus}`;
        label.innerHTML = result[i].tipus;
        label.dataset.id = result[i].tipus;
        formCheck.appendChild(label);

        filter.appendChild(formCheck);

        rb.addEventListener("click", filterRestaurants);
    }
}

function jumpToRestaurant() {
    let formData = new FormData();
    formData.append("f", "setRestaurantData");
    formData.append("d", this.dataset.id);

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
          window.location.assign("restaurant.html");
      }
    })
    .catch((response) => {
      alert("Jelentkezz be, vagy regisztrálj, ha meg akarod nézni az éttermek kínálatát.");
    });  
}

function filterRestaurants() {
    let formData = new FormData();
    formData.append("f", "getRestaurants");
    formData.append("d", this.dataset.id);

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
            showRestaurants(result);
        }
    })
    .catch((response) => {
      alert("Sikertelen étterem adat kérés, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
    });  
}

function searchForRestaurants() {
    let formData = new FormData(document.getElementById("kereses"));
    formData.append("f", "search");
    let restaurants = document.getElementById("restaurants");

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

        if (result !== 0) {
            if (result.length > 0) {
                showRestaurants(result);
            } else {
                let div = document.createElement("div");
                div.classList.add("col", "w-100");
                let noresults = document.createElement("h4");
                noresults.classList.add("text-danger");
                noresults.innerHTML = "Nincs a keresésnek megfelelő találat";

                div.appendChild(noresults);

                restaurants.innerHTML = "";
                restaurants.appendChild(div);

                let searchBar = document.getElementById("searchbar");
                searchBar.value = "";
            }
        }
    })
    .catch((response) => {
      alert("Sikertelen étterem adat kérés, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
    });  
}

function vaneAktivRendelese() {
    let formData = new FormData();
    formData.append("f", "vaneAktivRendelese");

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
            alert("Van egy folyamatban lévő rendelésed, amíg az nem teljesül addig nem tudsz újra rendelni!");
            window.location.assign("trackorder.html");
        }
    })
    .catch((response) => {
      alert("Sikertelen aktív rendelés adat lekérés.\nHibakód: " + response.status + " " + response.statusText);
    });  
}