document.addEventListener("DOMContentLoaded", function() {
    loginstate();
    document.getElementById("email").addEventListener("input", validateEmail);
    document.getElementById("pw").addEventListener("input", validatePw);
    document.getElementById("loginbtn").addEventListener("click", login);
})

let LoginState = false;

async function loginstate() {
    LoginState = await checkstatus();

    if (LoginState) {
        window.location.assign("index.html");
    }
}

function emailReg(email) {
    let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return pattern.test(email);
}

function validateEmail() {
    if (emailReg(document.getElementById("email").value)) {
        document.getElementById("email").classList.remove("is-invalid");
        document.getElementById("email").classList.add("is-valid");
        return true;
    } else {
        document.getElementById("email").classList.remove("is-valid");
        document.getElementById("email").classList.add("is-invalid");
        return false;
    }
}

function pwReg(pw) {
    let pattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/]{8,32}$/;
    return pattern.test(pw);
}

function validatePw() {
    if (pwReg(document.getElementById("pw").value)){
        document.getElementById("pw").classList.remove("is-invalid");
        document.getElementById("pw").classList.add("is-valid");
        return true;
    } else {
        document.getElementById("pw").classList.remove("is-valid");
        document.getElementById("pw").classList.add("is-invalid");
        return false;
    }
}

function login(){
    let loginMessage = document.getElementById("allfieldsrequired");

    if (validateEmail() && validatePw()){
        let formData = new FormData(document.getElementById("login"));
        formData.append("f", "login");   

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
            if(request == 1) {
                window.location.assign("index.html");
            } else if(request == 0) {
                loginMessage.innerHTML = "Sikertelen bejelentkezés, hibás email cím vagy jelszó!";
                loginMessage.style.display = "block";
            }
        })
        .catch(response => {
            loginMessage.innerHTML = "Sikertelen bejelentkezés, próbáld újra!<br>Hibakód: " + response.status + " " + response.statusText;
            loginMessage.style.display = "block";
        })

        document.getElementById("email").value = "";
        document.getElementById("email").classList.remove("is-valid");
        document.getElementById("email").classList.remove("is-invalid");

        document.getElementById("pw").value = "";
        document.getElementById("pw").classList.remove("is-valid");
        document.getElementById("pw").classList.remove("is-invalid");

        loginMessage.style.display = "none";
    } else {
        loginMessage.innerHTML = "Minden mező kitöltése kötelező!";
        loginMessage.style.display = "block";
    }
}