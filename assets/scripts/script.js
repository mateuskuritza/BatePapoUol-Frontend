const sideMenuBackground = document.querySelector(".menu-background");
const sideMenu = document.querySelector(".menu-choices");
const loginScreen = document.querySelector(".login-screen");
const chatContainer = document.querySelector(".chat");  
const chatInput = document.querySelector(".chat-input"); 
const contactsContainer = document.querySelector(".contacts-container");
const loginInput = document.querySelector(".login-input");
const loginButton = document.querySelector(".login-button");
const loginLoading = document.querySelector(".login-loading");
const chatLoading = document.querySelector(".chat-loading");
const privateInputTextConteiner = document.querySelector(".private-input");
const topBarUserName = document.querySelector(".top-bar span");
const allBody = document.querySelector("body");
const sunIcon = document.querySelector(".sunny-icon");
const moonIcon = document.querySelector(".moon-icon");

let userName;
let userNameObject;
let messageType;
let messageTo;
let participants;

function showSideMenu(){
    toggleNone(sideMenuBackground);
    toggleNone(sideMenu);
}

function toggleNone(element){
    element.classList.toggle("none");
}

function takeUserName(){
    userName = loginInput.value;
    while(userName.length>=15){
        alert("Por favor, insira um nome de usuário válido! (Menos de 15 caracteres)")
        return
    }
    userNameObject =  {name: userName};
    const sendUserName = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", userNameObject);
    toggleNone(loginInput);
    toggleNone(loginButton);
    toggleNone(loginLoading);
    toggleNone(chatLoading);
    sendUserName.then(startChat);
    sendUserName.catch(sendUserError);
}

function sendUserError(){
    alert("Por favor, tente com um nome de usuário diferente, ou verifique sua conexão a internet.");
    window.location.reload();
}

function startChat(){
    toggleNone(loginScreen);
    inserirUserName();
    searchParticipants();
    setInterval(keepUserStatus,5000);
    setInterval(searchParticipants,10000);
    setInterval(loadMessages,3000);
}

function inserirUserName(){
    topBarUserName.innerHTML = `Conectado como: <strong>${userName}</strong>`;
}

function keepUserStatus(){
    const userStatus = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", userNameObject);
    userStatus.catch(userStatusError);
}

function userStatusError(){
    alert("Usuário desconectado!");
    window.location.reload();
}

function searchParticipants(){
    const lookParticipants = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    lookParticipants.then(lookParticipantesSucess);
    lookParticipants.catch(lookParticipantsError);
}

function lookParticipantesSucess(response){
    participants = response.data;

    contactsContainer.innerHTML = `
    <div class="contacts selected" onclick="select(this);">
        <ion-icon name="people"></ion-icon>
        <p>Todos</p>
        <ion-icon class="check-mark" name="checkmark-outline"></ion-icon>
    </div>
    `

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
    window.location.reload();
}

function loadMessages(){
    const serverMessages = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");

    serverMessages.then(loadMessagesSucess);
    serverMessages.catch(loadMessagesError);
}

function loadMessagesError(){
    alert("Falha ao carregar o chat!");
    window.location.reload();
}

function loadMessagesSucess(element){
    toggleNone(chatLoading);
    const allMessages = element.data;
    chatContainer.innerHTML="";

    for(let i = 0; i < allMessages.length; i++){
        if(allMessages[i].type === "message"){
            chatContainer.innerHTML+=`
            <div class="chat-message">
                <span class="time-message"> (${allMessages[i].time}) </span>
                <strong onclick="selectInChat(this)"> ${allMessages[i].from} </strong>
                <span>para </span>
                <strong onclick="selectInChat(this)"> ${allMessages[i].to}: </strong>
                <span> ${allMessages[i].text} </span>
            </div>
            `
        }
        if(allMessages[i].type === "status"){
            chatContainer.innerHTML+=`
            <div class="chat-message status-message">
                <span class="time-message"> (${allMessages[i].time}) </span>
                <strong onclick="selectInChat(this)"> ${allMessages[i].from} </strong>
                <span> ${allMessages[i].text} </span>
            </div>
            `
        }
        if(allMessages[i].type === "private_message" && (allMessages[i].to === userName || allMessages[i].from === userName || allMessages[i].to === "Todos")){
            chatContainer.innerHTML+=`
            <div class="chat-message private-message">
                <span class="time-message"> (${allMessages[i].time}) </span>
                <strong onclick="selectInChat(this)"> ${allMessages[i].from} </strong>
                <span>reservadamente para </span>
                <strong onclick="selectInChat(this)"> ${allMessages[i].to}: </strong>
                <span> ${allMessages[i].text} </span>
            </div>
            `
        }
    }
    const ultimaMensagem = document.querySelector('.chat .chat-message:last-of-type');
    ultimaMensagem.scrollIntoView();
}

function select(element){
    const container = "." + element.classList.value;
    const selectedContacts = document.querySelectorAll(container + ".selected");

    if(selectedContacts.length !== null){
        for(let i = 0; i<selectedContacts.length; i++){
            selectedContacts[i].classList.remove("selected");
        }
    }

    element.classList.add("selected");
    takeType();
}

function selectInChat(element){
    messageTo = element.innerText.replace(":","");
    
    const allParticipants = contactsContainer.querySelectorAll(".contacts p");
    for(let i = 0; i < allParticipants.length; i++){
        if(allParticipants[i].innerText === messageTo){
            select(allParticipants[i].parentNode);
        }
    }

    messageType = "private_message";
    select(document.querySelectorAll(".menu-choices .visibility")[1]);
    privateChatText();
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
        privateChatText();
    }else{
        privateInputTextConteiner.classList.add("none");
    }
}

function privateChatText(){
    takeTo();
    privateInputTextConteiner.innerText = `Enviando para ${messageTo} (reservadamente)`;
    privateInputTextConteiner.classList.remove("none");
}

function sendMessage(){
    takeTo();
    takeType();

    const messageText = chatInput.value;
    chatInput.value = "";
    const messageObject = { from: userName, to: messageTo, text: messageText, type: messageType};

    const messageSend = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", messageObject);
    
    messageSend.then(loadMessages);
    messageSend.catch(messageError);
}

function messageError(){
    alert("Erro no envio de sua mensagem!");
    window.location.reload();
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

// sim agora eu coloco tema escuro em tudo, pena que sou horrivel pra escolher as cores
function toggleDarkTheme(){
    allBody.classList.toggle("dark-theme");
    toggleNone(moonIcon);
    toggleNone(sunIcon);
}