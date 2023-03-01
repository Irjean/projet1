const form = document.forms["login-form"];

function signUp(e) {
    e.preventDefault();

    const name = form.elements["name"];
    const password = form.elements["password"];

    fetch(`http://greenvelvet.alwaysdata.net/bugTracker/api/login/${name.value}/${password.value}`)
    .then(res => res.json())
    .then(data => {
        if(data.result.status == "failure"){
            document.querySelector(".error-msg").innerHTML = data.result.message;
            return
        }
        sessionStorage.setItem("token", data.result.token);
        sessionStorage.setItem("user", data.result.id);

        window.location = "./pages/buglist.html";
    })
}

form.addEventListener("submit", signUp);