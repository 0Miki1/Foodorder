document.addEventListener("DOMContentLoaded", function() {
    loginstate();
    document.getElementById("email").addEventListener("input", validateEmail);
    document.getElementById("pw").addEventListener("input", validatePw);
    document.getElementById("pw-again").addEventListener("input", validatePwAgain);
    document.getElementById("vnev").addEventListener("input", validateVnev);
    document.getElementById("knev").addEventListener("input", validateKnev);
    document.getElementById("tel").addEventListener("input", validatePhone);
    document.getElementById("city").addEventListener("input", validateCity);
    document.getElementById("irsz").addEventListener("input", validateIrsz);
    document.getElementById("utca").addEventListener("input", validateUtcaNev);
    document.getElementById("kozterulet-tipus").addEventListener("input", validateKoztTip);
    document.getElementById("hsz").addEventListener("input", validateHsz);
    document.getElementById("csengo").addEventListener("input", validateCsengoEmeletAjto);
    document.getElementById("emelet").addEventListener("input", validateCsengoEmeletAjto);
    document.getElementById("ajto").addEventListener("input", validateCsengoEmeletAjto);

    document.getElementById("regbtn").addEventListener("click", registration);
})

let LoginState = false;

async function loginstate() {
    LoginState = await checkstatus();

    if (LoginState) {
        window.location.assign("index.html");
    }
}

function validateEmail() {
    let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let email = document.getElementById("email");

    if (pattern.test(email.value)) {
        email.classList.remove("is-invalid");
        email.classList.add("is-valid");
        return true;
    } else {
        email.classList.remove("is-valid");
        email.classList.add("is-invalid");
        return false;
    }
}

function validatePw() {
    let pattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/]{8,32}$/;
    let pw = document.getElementById("pw");

    if (pattern.test(pw.value)){
        pw.classList.remove("is-invalid");
        pw.classList.add("is-valid");
        return true;
    } else {
        pw.classList.remove("is-valid");
        pw.classList.add("is-invalid");
        return false;
    }
}

function validatePwAgain() {
    let pattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/]{8,32}$/;
    let pwAgain = document.getElementById("pw-again");

    if (pattern.test(pwAgain.value)){
        pwAgain.classList.remove("is-invalid");
        pwAgain.classList.add("is-valid");
        return true;
    } else {
        pwAgain.classList.remove("is-valid");
        pwAgain.classList.add("is-invalid");
        return false;
    }
}

function validateVnev() {
    let pattern = /^[A-ZÁÉŰÚŐÓÜÖ]{1,}[a-záéűúőóüö]{1,}((\s|-)[A-ZÁÉŰÚŐÓÜÖ]{1,}[a-záéűúőóüö]{1,}){0,2}?$/g;
    let vNev = document.getElementById("vnev");

    if (pattern.test(vNev.value)){
        vNev.classList.remove("is-invalid");
        vNev.classList.add("is-valid");
        return true;
    } else {
        vNev.classList.remove("is-valid");
        vNev.classList.add("is-invalid");
        return false;
    }
}

function validateKnev() {
    let pattern = /^[A-ZÁÉŰÚŐÓÜÖ]{1,}[a-záéűúőóüö]{1,}((\s)[A-ZÁÉŰÚŐÓÜÖ]{1,}[a-záéűúőóüö]{1,}){0,2}?$/g;
    let kNev = document.getElementById("knev");

    if (pattern.test(kNev.value)){
        kNev.classList.remove("is-invalid");
        kNev.classList.add("is-valid");
        return true;
    } else {
        kNev.classList.remove("is-valid");
        kNev.classList.add("is-invalid");
        return false;
    }
}

function validatePhone() {
    let pattern = /^(\+36|06)[ -]?(\d{1,2})?[ -]?(\d{3})[ -]?(\d{4})$/;
    let phone = document.getElementById("tel");

    if (pattern.test(phone.value)){
        phone.classList.remove("is-invalid");
        phone.classList.add("is-valid");
        return true;
    } else {
        phone.classList.remove("is-valid");
        phone.classList.add("is-invalid");
        return false;
    }
}

function validateCity() {
    let pattern = /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(?:[ -][A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*$/g;
    let city = document.getElementById("city");
    let cityLower = city.value.toLowerCase();

    if (pattern.test(city.value) && cityLower == "budapest") {
        city.classList.remove("is-invalid");
        city.classList.add("is-valid");
        return true;
    } else {
        city.classList.remove("is-valid");
        city.classList.add("is-invalid");
        return false;
    }
}

function validateIrsz() {
    let pattern = /^[0-9]{4}$/g;
    let irsz = document.getElementById("irsz");

    if (pattern.test(irsz.value)) {
        irsz.classList.remove("is-invalid");
        irsz.classList.add("is-valid");
        return true;
    } else {
        irsz.classList.remove("is-valid");
        irsz.classList.add("is-invalid");
        return false;
    }
}

function validateUtcaNev() {
    let pattern = /^[A-ZÁÉŰÚŐÓÜÖ]([A-ZÁÉŰÚŐÓÜÖ]|[a-záéűúőóüö]|[\d\s.'/-])(\s|\S){1,}$/g;
    let utca = document.getElementById("utca");

    if (pattern.test(utca.value)) {
        utca.classList.remove("is-invalid");
        utca.classList.add("is-valid");
        return true;
    } else {
        utca.classList.remove("is-valid");
        utca.classList.add("is-invalid");
        return false;
    }
}

function validateKoztTip() {
    let koztTip = document.getElementById("kozterulet-tipus");

    if (koztTip.selectedIndex !== 0) {
        koztTip.classList.remove("is-invalid");
        koztTip.classList.add("is-valid");
        return true;
    } else {
        koztTip.classList.remove("is-valid");
        koztTip.classList.add("is-invalid");
        return false;
    }
}

function validateHsz() {
    let pattern = /^([0-9]{1,4}|[0-9]{1,4}\/[A-Za-z]|[0-9]{1,4}\/[0-9]{1,4}|[0-9]{1,4}[A-Za-z])$/g;
    let hsz = document.getElementById("hsz");

    if (pattern.test(hsz.value)) {
        hsz.classList.remove("is-invalid");
        hsz.classList.add("is-valid");
        return true;
    } else {
        hsz.classList.remove("is-valid");
        hsz.classList.add("is-invalid");
        return false;
    }
}

function validateCsengoEmeletAjto() {
    let pattern = /^[0-9]{0,5}$/g;

    if (pattern.test(this.value)) {
        this.classList.remove("is-invalid");
        this.classList.add("is-valid");
        return true;
    } else {
        this.classList.remove("is-valid");
        this.classList.add("is-invalid");
        return false;
    }
}

function registration() {
    var regMessage = document.getElementById("allfieldsrequired");
    var pw = document.getElementById("pw");
    var pwAgain = document.getElementById("pw-again");

    if (validateEmail() && validatePw() && validatePwAgain() && validateVnev() && validateKnev() && validatePhone() && validateCity() &&validateIrsz() && validateUtcaNev() && validateKoztTip() && validateHsz()) {
        if (pw.value == pwAgain.value) {
            sendUserData(regMessage);
        } else {
            pw.value = "";
            pw.classList.remove("is-valid");
            pw.classList.add("is-invalid");
    
            pwAgain.value = "";
            pwAgain.classList.remove("is-valid");
            pwAgain.classList.add("is-invalid");
    
            regMessage.innerHTML = "A jelszavak nem egyeznek!";
            regMessage.style.display = "block";
        }
    } else {
        loginMessage.innerHTML = "Minden *-al jelölt mező kitöltése kötelező!";
        regMessage.style.display = "block";
    }
}

function sendUserData(regMessage) {
    let formData = new FormData(document.getElementById("registration"));
    formData.append("f", "registration");

    fetch("adat.php", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if(response.ok){
            return response.text();
        } 

        return Promise.reject(response);
    })
    .then(request => {
        let t = JSON.parse(request);

        if (t != 0) {
            if (t != "emailExists") {
                sendAddressData(regMessage);
            } else {
                regMessage.innerHTML = "Sikertelen regisztráció, az email cím már foglalt!";
                regMessage.style.display = "block";
                let email = document.getElementById("email");
                email.value = "";
            }
        }
    })
    .catch(response => {
        regMessage.innerHTML = "Sikertelen regisztráció, próbáld újra!<br>Hibakód: " + response.status + " " + response.statusText;
        regMessage.style.display = "block";
    })
}

function sendAddressData(regMessage) {
    let formData = new FormData(document.getElementById("address"));
    formData.append("f", "insertAddress");

    fetch("adat.php", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if(response.ok){
            return response.text();
        } 

        return Promise.reject(response);
    })
    .then(request => {
        let t = JSON.parse(request);

        if (t != 0) {
            if (t == "invalidAddress") {
                regMessage.innerHTML = "Sikertelen regisztráció, érvénytelen cím!";
                regMessage.style.display = "block";
            } else if(t == 1) {
                window.location.assign("index.html");
            }
        }
    })
    .catch(response => {
        regMessage.innerHTML = "Sikertelen regisztráció, próbáld újra!<br>Hibakód: " + response.status + " " + response.statusText;
        regMessage.style.display = "block";
    })
}