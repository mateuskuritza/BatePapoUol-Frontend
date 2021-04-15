const sideMenuBackground = document.querySelector(".menu-background");
const sideMenu = document.querySelector(".menu-choices");
const loginScreen = document.querySelector(".login-screen");
const chatContainer = document.querySelector(".chat");  
const chatInput = document.querySelector(".chat-input"); 
const contactsContainer = document.querySelector(".contacts-container");
const loginInput = document.querySelector(".login-input");
const loginButton = document.querySelector(".login-button");
const loginLoading = document.querySelector(".login-loading");
const privateInputTextConteiner = document.querySelector(".private-input");
const topBarUserName = document.querySelector(".top-bar span");
const allBody = document.querySelector("body");
const sunIcon = document.querySelector(".sunny-icon");
const moonIcon = document.querySelector(".moon-icon");

let userName;
let userNameObject;
let messageType;
let messageTo;

function showSideMenu(){
    toggleNone(sideMenuBackground);
    toggleNone(sideMenu);
}

function toggleNone(element){
    element.classList.toggle("none");
}

function takeUserName(){
    userName = document.querySelector(".login-input").value;
    userNameObject =  {name: userName};
    const sendUserName = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", userNameObject);
    toggleNone(loginInput);
    toggleNone(loginButton);
    toggleNone(loginLoading);
    sendUserName.then(startChat);
    sendUserName.catch(sendUserError);
    loadMessages();
    searchParticipants();
}

function startChat(){
    toggleNone(loginScreen);
    setInterval(keepUserStatus,5000);
    setInterval(loadMessages,3000);
    //setInterval(searchParticipants,10000);
    searchParticipants();
    inserirUserName();
}

function searchParticipants(){
    const lookParticipants = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");

    contactsContainer.innerHTML = `
    <div class="contacts selected" onclick="select(this);">
        <ion-icon name="people"></ion-icon>
        <p>Todos</p>
        <ion-icon class="check-mark" name="checkmark-outline"></ion-icon>
    </div>
    `
    lookParticipants.then(lookParticipantesSucess);
    lookParticipants.catch(lookParticipantsError);
}

function lookParticipantesSucess(response){
    const participants = response.data;

    for(let i = 0 ; i < participants.length ; i++){
        contactsContainer.innerHTML+=`
        <div class="contacts" onclick="select(this);">
            <ion-icon name="person-circle"></ion-icon>
            <p>${participants[i].name}</p>
            <ion-icon class="check-mark" name="checkmark-outline"></ion-icon>
        </div>
        `
    }
}

function lookParticipantsError(){
    alert("Erro ao procurar os usuários online! Por favor, atualize a página");
}

function keepUserStatus(){
    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", userNameObject);
}

function sendUserError(){
    window.location.reload();
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
    takeType();
}

function takeTo(){
    messageTo = document.querySelector(".contacts.selected p").innerText;
}

function takeType(){
    messageType = document.querySelector(".visibility.selected p").innerText;
    if(messageType === "Reservadamente"){
        messageType = "private_message";
    }
    if(messageType === "Público"){
        messageType = "message";
    }

    if(messageType === "private_message"){
        privateChatText()
    }else{
        privateInputTextConteiner.classList.add("none");
    }
}

function privateChatText(){
    takeTo();
    privateInputTextConteiner.innerText = `Enviando para ${messageTo} (reservadamente)`;
    privateInputTextConteiner.classList.remove("none");
}

function loadMessages(){
    const serverMessages = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");

    serverMessages.then(loadMessagesSucess);
    serverMessages.catch(loadMessagesError);
}

function loadMessagesError(){
    alert("Falha ao carregar o chat, por favor atualize a página!");
}

function loadMessagesSucess(element){
    const allMessages = element.data;
    chatContainer.innerHTML="";

    for(let i = 0; i < allMessages.length; i++){
        if(allMessages[i].type === "message"){
            chatContainer.innerHTML+=`
            <div class="chat-message">
                <span class="time-message"> ${allMessages[i].time} </span>
                <strong> ${allMessages[i].from} </strong>
                <span>para </span>
                <strong> ${allMessages[i].to}: </strong>
                <span> ${allMessages[i].text} </span>
            </div>
            `
        }
        if(allMessages[i].type === "status"){
            chatContainer.innerHTML+=`
            <div class="chat-message status-message">
                <span class="time-message"> ${allMessages[i].time} </span>
                <strong> ${allMessages[i].from} </strong>
                <span> ${allMessages[i].text} </span>
            </div>
            `
        }
        if(allMessages[i].type === "private_message" && (allMessages[i].to === userName || allMessages[i].from === userName || allMessages[i].to === "Todos")){
            chatContainer.innerHTML+=`
            <div class="chat-message private-message">
                <span class="time-message"> ${allMessages[i].time} </span>
                <strong> ${allMessages[i].from} </strong>
                <span>reservadamente para </span>
                <strong> ${allMessages[i].to}: </strong>
                <span> ${allMessages[i].text} </span>
            </div>
            `
        }
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage(){
    takeTo();
    takeType();

    const messageText = chatInput.value;
    chatInput.value = "";
    const message = { from: userName,to: messageTo,text: messageText, type: messageType};

    const messageSend = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", message);
    
    messageSend.then(loadMessages);
    messageSend.catch(messageError);
}

function messageError(error){
    alert("Erro no envio de sua mensagem!");
    window.location.reload();
    console.log(error);
}

loginInput.addEventListener('keydown', function(pressed){
        if(pressed.key === "Enter"){
            if(loginInput.value === null){
            }else{
                takeUserName();
            }
        }
    }
)

chatInput.addEventListener('keydown', function(pressed){
        if(pressed.key === "Enter"){
            if(chatInput.value === null){
            }else{
                sendMessage();
            }
        }
    }
)

document.addEventListener('keyup', function(pressed){
        if(sideMenu.classList.contains("none") === false && pressed.key === "Escape"){
        showSideMenu();
        }
    }
)

function inserirUserName(){
    topBarUserName.innerHTML = `Conectado como: <strong>${userName}</strong>`;
}

function toggleDarkTheme(){
    allBody.classList.toggle("dark-theme");
    toggleNone(moonIcon);
    toggleNone(sunIcon);
}