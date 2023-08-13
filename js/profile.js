document.addEventListener("DOMContentLoaded", function() {
    loginstate();
    document.getElementById("pw").addEventListener("input", validatePw);
    document.getElementById("pw-again").addEventListener("input", validatePwAgain);
    document.getElementById("pwmodbtn").addEventListener("click", pwMod);
    document.getElementById("city").addEventListener("input", validateCity);
    document.getElementById("irsz").addEventListener("input", validateIrsz);
    document.getElementById("utca").addEventListener("input", validateUtcaNev);
    document.getElementById("kozterulet-tipus").addEventListener("input", validateKözteruletTipus);
    document.getElementById("hsz").addEventListener("input", validateHsz);
    document.getElementById("csengo").addEventListener("input", validateCsengoEmeletAjto);
    document.getElementById("emelet").addEventListener("input", validateCsengoEmeletAjto);
    document.getElementById("ajto").addEventListener("input", validateCsengoEmeletAjto);

    document.getElementById("newaddress").addEventListener("click", sendAddressData);
})

let LoginState = false;

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

        getProfileData();
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
        alert(
          "Sikertelen kijelentkezés, próbáld újra.\nHibakód: " +
            response.status +
            " " +
            response.statusText
        );
      });  
}

function getProfileData() {
    let formData = new FormData();
    formData.append("f", "getProfileData");
    let profileData = document.getElementsByClassName("profile-data");

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
            let i = 0;
            for (const key in result) {
                profileData[i].innerHTML = result[key];
                i++;
            }
        }
      })
      .catch((response) => {
        alert(
          "Sikertelen profil adat kérés, próbáld újra.\nHibakód: " +
            response.status +
            " " +
            response.statusText
        );
      });  
}

function pwReg(pw) {
  let pattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/]{8,32}$/;

  return pattern.test(pw);
}

function validatePw() {
  if (pwReg(document.getElementById("pw").value)) {
    document.getElementById("pw").classList.remove("is-invalid");
    document.getElementById("pw").classList.add("is-valid");
    return true;
  } else {
    document.getElementById("pw").classList.remove("is-valid");
    document.getElementById("pw").classList.add("is-invalid");
    return false;
  }
}

function validatePwAgain() {
  if (pwReg(document.getElementById("pw-again").value)) {
    document.getElementById("pw-again").classList.remove("is-invalid");
    document.getElementById("pw-again").classList.add("is-valid");
    return true;
  } else {
    document.getElementById("pw-again").classList.remove("is-valid");
    document.getElementById("pw-again").classList.add("is-invalid");
    return false;
  }
}

function pwMod() {
    let formData = new FormData(document.getElementById("pwmod"));
    formData.append("f", "pwMod");
    let pw = document.getElementById("pw");
    let pwAgain = document.getElementById("pw-again");
    let pwModMessage = document.getElementById("allfieldsrequired");

    if(validatePw() && validatePwAgain()) {
      if (pw.value == pwAgain.value) {
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
            if (request == 1) {
              pwModMessage.innerHTML =
                "Sikeres jelszó módosítás!";
              pwModMessage.classList.remove("text-danger");
              pwModMessage.classList.add("text-success");
              pwModMessage.style.display = "block";
              clearPwMod(pwModMessage);
            } else if (request == 0) {
              pwModMessage.innerHTML =
                "Sikertelen jelszó módosítás, próbáld újra!";
              pwModMessage.style.display = "block";
            }
          })
          .catch((response) => {
            pwModMessage.innerHTML =
              "Sikertelen jelszó módosítás, próbáld újra!<br>Hibakód: " +
              response.status +
              " " +
              response.statusText;
            pwModMessage.style.display = "block";
          });

      } else {
        pw.value = "";
        pwAgain.value = "";
        pwModMessage.innerHTML = "A jelszavak nem egyeznek!";
        pwModMessage.style.display = "block";
      }
    } else {
      pwModMessage.innerHTML = "Minden mező kitöltése kötelező!";
      pwModMessage.style.display = "block";
    }
}

function clearPwMod(pwModMessage) {
  setTimeout(() => {
    pwModMessage.classList.remove("text-success");
    pwModMessage.classList.add("text-danger");
    pwModMessage.style.display = "none";
    window.location.assign("profile.html");
  }, 2000);
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

function validateKözteruletTipus() {
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

function sendAddressData() {
  let formData = new FormData(document.getElementById("address"));
  formData.append("f", "insertAddress");
  let addressMessage = document.getElementById("allfieldsrequired");

  if (validateCity() &&validateIrsz() && validateUtcaNev() && validateKözteruletTipus() && validateHsz()) {
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
                addressMessage.innerHTML = "Sikertelen cím hozzáadás, érvénytelen cím!";
                addressMessage.style.display = "block";
            } else if(t == 1) {
                addressMessage.innerHTML = "Sikeres kiszállítási cím felvétel!";
                addressMessage.classList.remove("text-danger");
                addressMessage.classList.add("text-success");

                setTimeout(() => {
                  window.location.assign("profile.html");
                }, 2000);
            }
        }
    })
    .catch(response => {
        if (response.status === undefined) {
          addressMessage.innerHTML = "Érvénytelen cím, próbáld újra!";
          addressMessage.style.display = "block";
        } else {
          addressMessage.innerHTML = "Sikertelen cím hozzáadás, próbáld újra!<br>Hibakód: " + response.status + " " + response.statusText;
          addressMessage.style.display = "block";
        }
    })
  }
}