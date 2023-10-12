/*
    파일이름 : index.js
    생성일 : 2023년 10월 12일 이경근이 만들었습니다.
    설명 : index.html 파일의 로직을 지정하는 파일입니다.
*/
let state = '대기';
let chats = [];

const elemBtnMic = document.querySelector('.btn-mic');
const elemSldConfigRate = document.querySelector('#sld-config-rate');
const elemSldConfigVolume = document.querySelector('#sld-config-volume');
const elemChkConfigAutoplay = document.querySelector('#chk-config-autoplay');
const elemBtnMalVoice = document.querySelector('#btn-mal-voice');
const elemBtnFemVoice = document.querySelector('#btn-fem-voice');
const elemBtnSubmit = document.querySelector('#btn-submit');
const elemTxtInput = document.querySelector('#txt-input');
const elemChatMessages = document.querySelector('.chat-messages');

class Message {
    constructor(role, content, timestamp = new Date()) {
        this.role = role;
        this.content = content;
        this.timestamp = timestamp;
    }

    createListItem() {
        const li = document.createElement('li');
        if (this.role == "assistant" ) li.classList.add("message-assistant")
        else if( this.role == "system" ) li.classList.add("message-system")
        else if( this.role == "user" ) li.classList.add("message-user")
        const divContent = document.createElement('div');
        divContent.classList.add('content');
        divContent.textContent = this.content;
        li.appendChild(divContent);
        return li;
    }
}

class ChatModel {
    constructor() {
        this.messages = [];
        this.title = "chat";
    }

    addMessage(role, content) {
        const message = new Message(role, content);
        this.messages.push(message);
    }

    saveToLocalStorage(key) {
        const data = JSON.stringify(this.messages);
        localStorage.setItem(key, data);
    }

    loadFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        if (data) {
            this.messages = JSON.parse(data).map(msg => {
                // Convert the stored date string back to a Date object
                msg.timestamp = new Date(msg.timestamp);
                return new Message(msg.role, msg.content, msg.timestamp);
            });
        }
    }

    getMessages() {
        return this.messages;
    }
}

function createNavLink(chatModel) {
    // Create anchor element
    const anchor = document.createElement('a');
    anchor.href = '#';
    anchor.classList.add('nav__link');

    // Create ion-icon element
    const ionIcon = document.createElement('ion-icon');
    ionIcon.name = "chatbubbles-outline";
    ionIcon.classList.add('nav__icon');
    anchor.appendChild(ionIcon); // Attach ion-icon to anchor

    // Create span for chat name
    const span = document.createElement('span');
    span.classList.add('nav_name');
    span.textContent = chatModel.title;
    anchor.appendChild(span); // Attach span to anchor

    anchor.addEventListener('mousedown', event => {
        selectChat(chatModel)
    });

    return anchor;
}

function updateSidebar()
{
    for(let i = 0; i < chats.length; ++i )
    {
        let nl = createNavLink(chats[i])
        document.querySelector('.nav__list').appendChild(nl)
    }
}

function saveChats()
{
    chats[0].saveToLocalStorage(chats[0].id)
    chats[1].saveToLocalStorage(chats[1].id)
}

function loadChats()
{
    chats = [new ChatModel(), new ChatModel()]
    chats[0].loadFromLocalStorage(chats[0].id)
    chats[1].loadFromLocalStorage(chats[1].id)
}

function makeSampleChats()
{
    const sampleChat1 = new ChatModel();
    sampleChat1.id = 1;
    sampleChat1.title = "why is the sky blue?";
    sampleChat1.addMessage("user", "Why is the sky blue?");
    sampleChat1.addMessage("assistant", 
    "The sky appears blue because of the scattering of sunlight by Earth's atmosphere. " +
    "As sunlight enters the atmosphere, it encounters tiny molecules of gas and other " +
    "particles in the air.These particles scatter the light in all directions. " +
    "However, blue light is scattered more than other colors because it travels in smaller, " +
    "shorter waves. This is known as Rayleigh scattering.")

    const sampleChat2 = new ChatModel()
    sampleChat2.id = 2;
    sampleChat2.title = "가나다라마바사"
    sampleChat2.addMessage("user", "가나다라마바사");
    sampleChat2.addMessage("assistant", "아자차카타파하------------------------");
    sampleChat2.addMessage("user", "아야어여오요");
    sampleChat2.addMessage("assistant", "우유으이");
    sampleChat2.addMessage("user", "소프트웨어");
    sampleChat2.addMessage("assistant", "개발");

    chats[0] = sampleChat1;
    chats[1] = sampleChat2;
}

function selectChat(chatModel)
{
    elemChatMessages.textContent='';
    for(let i = 0; i < chatModel.messages.length; ++i )
    {
        const li = chatModel.messages[i].createListItem();
        elemChatMessages.appendChild(li);
    }
}

// 둘 중 하나만
// loadChats(); // 1. 실제 사용시
makeSampleChats(); // 2. 샘플로 테스트 할 때
updateSidebar();
selectChat(chats[0])

elemBtnMic.addEventListener('mousedown', function (event) {
    event.preventDefault(); // prevent default navigation behavior
    if (state == '대기') {
        state = '음성입력'
        // TODO : 마이크 버튼을 클릭했을 때 음성 입력을 받아들이는 상태(state)로 전환합니다.
    }
    else if (state == '음성입력') {
        // TODO : 마이크 버튼을 한 번 더 클릭하면 음성 입력을 그만 받아들이고 쿼리를 전송합니다.
        state = '대기'
    }
    console.log('앱 상태: ', state)
});

elemSldConfigRate.addEventListener('change', function (event) {
    console.log("속도 값 : ", this.value);

    // TODO : 비서의 응답 속도가 속도 설정에 따라 빠르거나 느려지도록 합니다.
});

elemSldConfigVolume.addEventListener('change', function (event) {
    console.log("볼륨 값 : ", this.value);

    // TODO : 비서의 응답 소리가 볼륨 설정에 따라 크고 작아지도록 합니다.
});

elemChkConfigAutoplay.addEventListener('change', function (event) {
    console.log("자동재생 : ", this.checked);
});

elemBtnMalVoice.addEventListener('mousedown', event => {
    event.preventDefault(); // prevent default navigation behavior
    console.log("남성 목소리");
})

elemBtnFemVoice.addEventListener('mousedown', event => {
    event.preventDefault(); // prevent default navigation behavior
    console.log("여성 목소리");
})

elemBtnSubmit.addEventListener('mousedown', event => {
    event.preventDefault(); // prevent def
    fetch("/query-text")
    .then(x=>x.json())
    .then(x=>{
        console.log(x.text)
    });
    console.log("쿼리 제출");
})

elemTxtInput.addEventListener('input', event => {
    console.log(event.target.value);
});

window.addEventListener("beforeunload", event => {
    saveChats();
});