window.onload = async () => {
    const token = sessionStorage.getItem("token");
    const uid = sessionStorage.getItem("user");
    let userList = [];


    if(!sessionStorage.getItem("token")){
        window.location = "../index.html";
        return
    }

    await fetch(`http://greenvelvet.alwaysdata.net/bugTracker/api/users/${token}`)
    .then(res => res.json())
    .then(data => userList = data.result.user);


    await fetch(`http://greenvelvet.alwaysdata.net/bugTracker/api/list/${token}/0`)
    .then(res => res.json())
    .then(data => showBugs(data, userList))
    .then(() => addEventListeners())

    document.querySelector("#user-bugs").addEventListener("click", () => {
        fetch(`http://greenvelvet.alwaysdata.net/bugTracker/api/list/${token}/${uid}`)
        .then(res => res.json())
        .then(data => showBugs(data, userList))
        .then(() => addEventListeners())
    })

    document.querySelector("#all-bugs").addEventListener("click", () => {
        fetch(`http://greenvelvet.alwaysdata.net/bugTracker/api/list/${token}/0`)
        .then(res => res.json())
        .then(data => showBugs(data, userList))
        .then(() => addEventListeners())
    })
}

function showBugs(data, userList){
    document.querySelector(".buglist-body").innerHTML = "";
    data.result.bug.forEach((i) => {
        let date = new Date(i.timestamp * 1000);
        let months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
        
        document.querySelector(".buglist-body").innerHTML += `
                <tr class="bug" id="id${i.id}">
                    <td class="bug-desc">
                        <h3>${i.title}</h3>
                        <p>${i.description}</p>
                    </td>
                    <td class="bug-date">
                        ${`${date.getUTCDate()} ${months[date.getMonth()]} ${date.getFullYear()}`}
                    </td>
                    <td class="bug-name">
                        ${userList[i.user_id]}
                    </td>
                    <td class="bug-state">
                        <select name="state" onchange="(e) => {changeState(${i.id}, e.value)}">
                            ${selectOption(i.state)}
                        </select>
                    </td>
                    <td class="bug-del">
                        <button class="del-button">
                            <img src="../images/trash.png" alt="button">
                        </button>
                    </td>
                </tr>
        `
    })
}

function addEventListeners(){
    document.querySelectorAll(".bug").forEach((i) => {
        document.querySelector(`#${i.id}`).addEventListener("click", (e) => {
            if(e.target.classList[0] == "del-button" || e.target.parentElement.classList[0] == "del-button"){
                sessionStorage.setItem("delId", i.id.replace(/[^0-9]+/g, ""));
                document.querySelector(".popup-container").classList.add("show");
            }
        })

        document.querySelector(`#${i.id} select`).addEventListener("change", (e) => {
            changeState(i.id.replace(/[A-Za-z]+/g, ""), e.target.value);
        })
    })
}

const disconnectBtn = document.querySelector(".disconnect-btn");

disconnectBtn.addEventListener("click", disconnect);

function disconnect() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location = "../index.html";
}

function selectOption(value) {
    switch(value){
        case "0":
            return '<option value="0" selected>To do</option><option value="1">Doing</option><option value="2">Done</option>'
        case "1":
            return '<option value="0">To do</option><option value="1" selected>Doing</option><option value="2">Done</option>'
        case "2":
            return '<option value="0">To do</option><option value="1">Doing</option><option value="2" selected>Done</option>'
        default:
            return '<option value="0">To do</option><option value="1">Doing</option><option value="2">Done</option>'
        }
}

function changeState(bugId, value) {
    let token = sessionStorage.getItem("token");

    fetch(`http://greenvelvet.alwaysdata.net/bugTracker/api/state/${token}/${bugId}/${value}`)
    .then(res => res.json())
    .then(data => data)
}

function deleteBug(){
    let id = sessionStorage.getItem("delId");
    let token = sessionStorage.getItem('token');
    fetch(`http://greenvelvet.alwaysdata.net/bugTracker/api/delete/${token}/${id}`)
    .then(res => res.json())
    .then(data => data);
    document.querySelector(`#id${id}`).remove();
    document.querySelector(".popup-container").classList.remove("show");

}



document.querySelector(".no-btn").addEventListener("click", () => {
    sessionStorage.removeItem("delId");
    document.querySelector(".popup-container").classList.remove("show");
})

document.querySelector(".yes-btn").addEventListener("click", deleteBug);