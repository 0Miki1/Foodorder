document.addEventListener("DOMContentLoaded", function() {
    loginstate();
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

        getOrders();
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


function getOrders() {
    let formData = new FormData();
    formData.append("f", "getOrders");

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
        let data = JSON.parse(request);

        if (data != 0) {
            let ul = document.getElementById("list");

            for(let i = 0; i < data.length; i++) {
                let li = document.createElement('li');
                li.classList.add("list-group-item");

                li.innerHTML = `${data[i].rest} - ${data[i].datum}`;
                ul.appendChild(li);
            }

           
        } else {
          window.location.assign("index.html");
        }
      })
      .catch((response) => {
        alert(
          "Sikertelen rendelési adatok lekérdezése, próbáld újra.\nHibakód: " +
            response.status +
            " " +
            response.statusText
        );
      }); 
}