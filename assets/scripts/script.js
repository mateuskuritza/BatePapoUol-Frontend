const sideMenuBackground = document.querySelector(".menu-background");
const sideMenu = document.querySelector(".menu-choices");


function showMenu(){
    sideMenuBackground.classList.toggle("none");
    sideMenu.classList.toggle("none");
}