document.addEventListener("DOMContentLoaded", function() {
    loginstate();
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


function initMapAddress() {
    let erroralert = document.getElementById("loginerror");
    let progress = document.getElementById("progress");
    let formData = new FormData();
    formData.append("f", "getAddressState");

    let geocoder;
    let iconBase = 'https://maps.google.com/mapfiles/kml/pal2/';
    let markers = [];
    let bounds = new google.maps.LatLngBounds();

    window.map = new google.maps.Map(document.getElementById("map"), {
        mapId: "cfc56cdb553d0b51",
        disableDefaultUI: true,
        clickableIcons: false
    });

    function getAddressData() {
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
            let t = JSON.parse(request);

            if (t == "done") {
                document.getElementById("map").style.display = "none";
                progress.classList.add("text-success");
                progress.innerHTML = "A rendelés kiszállítva, köszönjük a vásárlást!";

                setTimeout(() => {
                    window.location.assign("index.html");
                }, 3000);
            } else {
                if (t.futarpozlat == null && t.futarpozlng == null) {
                    //Csak az étterem és a kiszállítási cím megrajzolása, mivel még nem fogadta el egy futár sem a címet
                    progress.innerHTML = "A rendelést megkaptuk, az egyik futárunk hamarosan kiszállítja!";

                    mapClear(markers);
    
                    var address = t.cim;
                    geocoder = new google.maps.Geocoder();
                    geocoder.geocode(
                      { address: address },
                      function (results, status) {
                        if (status == "OK") {
                          var markerGuest = new google.maps.Marker({
                            position: results[0].geometry.location,
                            icon: iconBase + "icon8.png",
                            map: map,
                          });
    
                          markers.push(markerGuest);
                          bounds.extend(markerGuest.position);
                        } else {
                          alert(
                            `Geocode was not successful for the following reason: ${status}`);
                        }
                      });
    
                    let restPozLat = parseFloat(t.restpozlat);
                    let restPozLng = parseFloat(t.restpozlng);
                    let restPoz = { lat: restPozLat, lng: restPozLng };
                    var markerRest = new google.maps.Marker({
                        position: restPoz,
                        icon: iconBase + 'icon32.png',
                        map: map
                    });
                    
                    markers.push(markerRest);
                    bounds.extend(markerRest.position);
                    
                    //Térkép középre igazítása
                    map.fitBounds(bounds);
                    map.panToBounds(bounds);
                } else {
                    //Térkép megrajzolása miután már a futár elfogadta a címet és elérhetővé válik a pozíciója
                    progress.innerHTML = "Futárunk már úton van, hogy minél előbb az asztalodon legyen a friss étel!";

                    mapClear(markers);
    
                    let futarPozLat = parseFloat(t.futarpozlat);
                    let futarPozLng = parseFloat(t.futarpozlng);
                    let futarPoz = { lat: futarPozLat, lng: futarPozLng };
                    var futarMarker = new google.maps.Marker({
                        position: futarPoz,
                        icon: iconBase + 'icon39.png',
                        map: map
                    });
    
                    markers.push(futarMarker);
                    bounds.extend(futarMarker.position);
    
                    var address = t.cim;
                    geocoder = new google.maps.Geocoder();
                    geocoder.geocode(
                      { address: address },
                      function (results, status) {
                        if (status == "OK") {
                          var markerGuest = new google.maps.Marker({
                            position: results[0].geometry.location,
                            icon: iconBase + "icon8.png",
                            map: map,
                          });
    
                          markers.push(markerGuest);
                          bounds.extend(markerGuest.position);
                        } else {
                          alert(
                            `Geocode was not successful for the following reason: ${status}`);
                        }
                      });
    
                    let restPozLat = parseFloat(t.restpozlat);
                    let restPozLng = parseFloat(t.restpozlng);
                    let restPoz = { lat: restPozLat, lng: restPozLng };
                    var markerRest = new google.maps.Marker({
                        position: restPoz,
                        icon: iconBase + 'icon32.png',
                        map: map
                    });
                    
                    markers.push(markerRest);
                    bounds.extend(markerRest.position);
                    
                    //Térkép középre igazítása
                    map.fitBounds(bounds);
                    map.panToBounds(bounds);
                }
            }
        })
        .catch((error) => {
            erroralert.classList.add("show");
            erroralert.children[0].innerHTML = "";
            erroralert.children[0].innerHTML +=
              "Sikertelen adatlekérés. Hibakód: " +
              error.status +
              " " +
              error.statusText;
        });

        setTimeout(getAddressData, 5000);
    }

    getAddressData();
}
  
window.initMapAddress = initMapAddress;

function mapClear(markers) {
    for(let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  
    markers = [];
}