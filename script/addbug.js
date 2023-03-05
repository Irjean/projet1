window.onload = () => {
    if(!sessionStorage.getItem("token")){
        window.location = "../index.html";
        return
    }
}

const form = document.querySelector("#new-bug-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    const uid = sessionStorage.getItem("user");

    const title = form.elements["title"];
    const desc = form.elements["desc"];

    const bodybug = {
        title: title.value,
        description: desc.value
    }

    fetch(`http://greenvelvet.alwaysdata.net/bugTracker/api/add/${token}/${uid}`, {
        method: "POST",
        body: JSON.stringify(bodybug),
        
    }).then(res => res.json())
    .then(data => {
        if(data.result.status == "done"){
            window.location = "./buglist.html";
        }
    })
})