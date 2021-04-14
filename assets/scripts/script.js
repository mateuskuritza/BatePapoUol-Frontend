const sideMenuBackground = document.querySelector(".menu-background");
const sideMenu = document.querySelector(".menu-choices");
const loginScreen = document.querySelector(".login-screen");    
let userName;

function showMenu(){
    sideMenuBackground.classList.toggle("none");
    sideMenu.classList.toggle("none");
}

function takeUserName(){
    loginScreen.classList.add("none");
    userName =  {name: document.querySelector(".login-input").value};
    const sendUserName = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", userName);

    sendUserName.then(keepUser);
    sendUserName.catch(sendUserError);
}

function keepUser(userName){
    setInterval(function(){axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", userName);},5000);
}

function sendUserError(){
    loginScreen.classList.remove("none");
    alert("Por favor, tente com um nome de usuário diferente");
}

function select(element){
    const type = "." + element.classList.value;
    const selectedContacts = document.querySelectorAll(type + ".selected");

    if(selectedContacts.length !== null){
        for(let i = 0; i<selectedContacts.length; i++){
            selectedContacts[i].classList.remove("selected");
        }
    }

    element.classList.add("selected");
}