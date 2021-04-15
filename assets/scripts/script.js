const sideMenuBackground = document.querySelector(".menu-background");
const sideMenu = document.querySelector(".menu-choices");
const loginScreen = document.querySelector(".login-screen");
const chatContainer = document.querySelector(".chat");  
const chatInput = document.querySelector(".chat-input"); 
const contactsContainer = document.querySelector(".contacts-container");
let userName;
let userNameObject;

function showMenu(){
    sideMenuBackground.classList.toggle("none");
    sideMenu.classList.toggle("none");
}

function takeUserName(){
    loginScreen.classList.add("none");
    userName = document.querySelector(".login-input").value;
    userNameObject =  {name: userName};
    const sendUserName = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", userNameObject);

    sendUserName.then(startChat);
    sendUserName.catch(sendUserError);
    loadMessages();
    searchParticipants();
}

function startChat(){
    setInterval(keepUserStatus,5000);
    setInterval(loadMessages,3000);
    setInterval(searchParticipants,5000);
}

function searchParticipants(){
    const lookParticipants = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");

    contactsContainer.innerHTML = `
    <div class="contacts" onclick="select(this);">
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
        if(allMessages[i].type === "private_message"){
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
}

function sendMessage(){
    const messageText = chatInput.value;

    const message = { from: userName,to: "Todos",text: messageText, type: "message"};
    const messageSend = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", message);

    messageSend.catch(messageError);
}

function messageError(error){
    alert("Erro no envio de sua mensagem!");
    console.log(error);
}