const form = document.forms["signup-form"];

function signUp(e) {
    e.preventDefault();

    const name = form.elements["name"];
    const password = form.elements["password"];
    const confirmPassword = form.elements["confirm-password"];

    if(password.value !== confirmPassword.value){
        document.querySelector(".error-msg").innerHTML = "The passwords does not match."
        return
    }

    fetch(`http://greenvelvet.alwaysdata.net/bugTracker/api/signup/${name.value}/${password.value}`)
    .then(res => res.json())
    .then(data => {
        if(data.result.status == "failure"){
            document.querySelector(".error-msg").innerHTML = data.result.message;
            return
        }
        sessionStorage.setItem("token", data.result.token);
        sessionStorage.setItem("user", data.result.id);

        window.location = "./buglist.html";
    })
}

form.addEventListener("submit", signUp);