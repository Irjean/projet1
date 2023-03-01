window.onload = () => {
    if(!sessionStorage.getItem("token")){
        window.location = "../index.html";
    }
}