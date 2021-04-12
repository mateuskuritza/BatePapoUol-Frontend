const sideMenuBackground = document.querySelector(".menu-background");
const sideMenu = document.querySelector(".menu-choices");
const loginScreen = document.querySelector(".login-screen");    
let userName;
function showMenu(){
    sideMenuBackground.classList.toggle("none");
    sideMenu.classList.toggle("none");
}

function TakeUserName(){
    loginScreen.classList.add("none");
    userName =  document.querySelector(".login-input").value;
}

