document.addEventListener("DOMContentLoaded", function() {
    loginstate();
    checkActiveOrder();
    document.getElementById("cardnumber").addEventListener("input", validateCardNumber);
    document.getElementById("kartyatulaj").addEventListener("input", validateCardOwner);
    document.getElementById("biztkod").addEventListener("input", validateSecCode);
    document.getElementById("expirity").addEventListener("input", validateExpirity);
    document.getElementById("order").addEventListener("click", order);
    document.getElementById("addresses").addEventListener("change", addresses);
})

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

        let profileMenuProfile = document.createElement("li");
        let profileMenuProfileLink = document.createElement("a");
        profileMenuProfileLink.classList.add("dropdown-item");
        profileMenuProfileLink.href = "profile.html";
        profileMenuProfileLink.innerHTML = "Profil adatok";
        profileMenuOrders.appendChild(profileMenuProfileLink);
        profilDropdown.appendChild(profileMenuProfile);

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

function checkActiveOrder() {
    let formData = new FormData();
    formData.append("f", "checkActiveOrder");

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

        if (result != 1) {
            window.location.assign("index.html");
        } else {
            getOrderData();
        }
      })
      .catch((response) => {
        alert("Sikertelen rendelés állapot ellenőrzés, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
      });  
}

function getOrderData() {
    let formData = new FormData();
    formData.append("f", "getOrderData");

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

        setOrderData(result);
        getAddresses();
      })
    .catch((response) => {
        alert("Sikertelen rendelés adat lekérdezés, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
    });  
}

function setOrderData(result) {
    let nev = document.getElementById("nev");
    nev.innerHTML = result.nev;

    let etterem = document.getElementById("etterem");
    etterem.innerHTML = result.etterem;

    let tetelek = document.getElementById("tetelek");

    for (let i = 0; i < result.items.length; i++) {
        let li = document.createElement("li");
        li.classList.add("list-group-item");

        let tetel = document.createElement("div");
        tetel.classList.add("ms-2", "me-auto");
        
        let tetelNev = document.createElement("p");
        tetelNev.classList.add("mb-0");
        tetelNev.innerHTML = result.items[i].key;

        tetel.appendChild(tetelNev);

        let itemCount = document.createElement("span");
        itemCount.classList.add("badge", "bg-primary", "rounded-pill");
        itemCount.innerHTML = result.items[i].value;

        li.appendChild(tetel);
        li.appendChild(itemCount);

        tetelek.appendChild(li);
    }

    let sum = document.getElementById("sum");
    sum.innerHTML = `${result.priceSum} Ft`;
}

function getAddresses() {
    let formData = new FormData();
    formData.append("f", "getAddresses");

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
            setAddresses(result);
        }
      })
    .catch((response) => {
        alert("Sikertelen rendelés adat lekérdezés, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
    });  
}

function setAddresses(result) {
    let addresses = document.getElementById("addresses");

    for (let i = 0; i < result.length; i++) {
        let opt = document.createElement("option");
        
        opt.value = result[i].id;
        opt.innerHTML = `${result[i].varos} ${result[i].iranyitoszam}, ${result[i].utca} ${result[i].hazszam} ${result[i].kapucsengo != null ? "Kapucsengő: " + result[i].kapucsengo : ""} ${result[i].emelet != null ? "Emelet: " + result[i].emelet : ""} ${result[i].ajtó != null ? "Ajtó: " + result[i].ajtó : ""}`;

        addresses.appendChild(opt);
    }
}

function cardNumReg(num) {
    let pattern = /^[0-9]{4}[-][0-9]{4}[-][0-9]{4}[-][0-9]{4}$/g;

    return pattern.test(num);
}

function validateCardNumber() {
    if (cardNumReg(document.getElementById("cardnumber").value)) {
        document.getElementById("cardnumber").classList.remove("is-invalid");
        document.getElementById("cardnumber").classList.add("is-valid");
        return true;
    } else {
        document.getElementById("cardnumber").classList.remove("is-valid");
        document.getElementById("cardnumber").classList.add("is-invalid");
        return false;
    }
}

function ownerReg(name) {
    let pattern = /^[A-ZÁŰÉÚŐÓÜÖ]{1}[a-záűéúőóüö]+((\s|)[A-ZÁÉŰÚŐÓÜÖ]{1,}[a-záéűúőóüö]{1,}){0,2}$/g;

    return pattern.test(name);
}

function validateCardOwner() {
    if (ownerReg(document.getElementById("kartyatulaj").value)) {
        document.getElementById("kartyatulaj").classList.remove("is-invalid");
        document.getElementById("kartyatulaj").classList.add("is-valid");
        return true;
    } else {
        document.getElementById("kartyatulaj").classList.remove("is-valid");
        document.getElementById("kartyatulaj").classList.add("is-invalid");
        return false;
    }
}

function secCodeReg(num) {
    let pattern = /^[0-9]{3}$/g;
    return pattern.test(num);
}

function validateSecCode() {
    if (secCodeReg(document.getElementById("biztkod").value)) {
        document.getElementById("biztkod").classList.remove("is-invalid");
        document.getElementById("biztkod").classList.add("is-valid");
        return true;
    } else {
        document.getElementById("biztkod").classList.remove("is-valid");
        document.getElementById("biztkod").classList.add("is-invalid");
        return false;
    }
}

function expirityDateCheck(date) {
    let curDate = new Date();
    let curYear = curDate.getFullYear();
    let curMonth = curDate.getMonth() + 1;

    let expirityYear = parseInt("20" + date.split('/')[1]);
    let expirityMonth = parseInt(date.split('/')[0]);

    if (expirityYear < curYear || (expirityYear === curYear && expirityMonth < curMonth)) {
        return false;
    }

    if (expirityMonth < 1 || expirityMonth > 12) {
        return false;
    }

    return true;
}

function validateExpirity() {
    if (expirityDateCheck(document.getElementById("expirity").value)) {
        document.getElementById("expirity").classList.remove("is-invalid");
        document.getElementById("expirity").classList.add("is-valid");
        return true;
    } else {
        document.getElementById("expirity").classList.remove("is-valid");
        document.getElementById("expirity").classList.add("is-invalid");
        return false;
    }
}

function addresses() {
    let chooseAddress = document.getElementById("chooseaddress");

    if (document.getElementById("addresses").selectedIndex == 0) {
        chooseAddress.innerHTML = "Válassz egy szállítási címet, mielőtt leadnád a rendelést!";
        return false;
    } else {
        chooseAddress.innerHTML = "";
        return true;
    }
}

function order() {
    let tetelek = document.getElementById("tetelek");
    let allFieldsRequired = document.getElementById("allfieldsrequired");

    if (tetelek.children.length > 0) {
        if (addresses() && validateCardNumber() && validateCardOwner() && validateSecCode() && expirityDateCheck(document.getElementById("expirity").value)) {
            sendOrder();
        } else {
            let allFieldsRequired = document.getElementById("allfieldsrequired");
            allFieldsRequired.innerHTML = "Minden mező kitöltése kötelező!";
        }
    } else {
        allFieldsRequired.innerHTML = "Nem választottál ételt, menj vissza az étterem menüpontra és tegyél bele valamit a kosárba!";
    }
}

function sendOrder() {
    let formData = new FormData(document.getElementById("card"));
    formData.append("f", "placeOrder");
    formData.append("d", document.getElementById("addresses").value);

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
            let orderMessage = document.getElementById("allfieldsrequired");
            orderMessage.classList.remove("text-danger");
            orderMessage.classList.add("text-success");
            orderMessage.innerHTML = "Sikeres rendelés leadás!";

            trackOrder();
        }
      })
    .catch((response) => {
        alert("Sikertelen rendelés adat küldés, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
    });  
}

function trackOrder() {
    setTimeout(() => {
        window.location.assign("trackorder.html");
    }, 2000);
}