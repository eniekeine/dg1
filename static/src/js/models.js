import {ChatModel} from './chat-model.js'

// ChatModel의 배열. 히스토리에 표시되는 채팅 목록. i.e. `why is the sky blue?, 가나다라마바사`
export const chats = [];
// current Chat. chats 안에 있는 것들 중에서 현재 사용자가 보고있는 ChatModel
export let currChat = null;
export let prevChat = null;
export const evtChatsUpdated = new Event('chatsUpdated', {
    chats : chats
});
export function selectChat(chatModel)
{
    // 현재 채팅이 무엇이었는 지 기록
    prevChat = currChat;
    // 현재 채팅을 주어진 chatModel로 설정
    currChat = chatModel;
    document.dispatchEvent(evtChatsUpdated);
}

export function makeSampleChats()
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
    sampleChat2.addMessage("assistant", "아자차카타파하");
    sampleChat2.addMessage("user", "아야어여오요");
    sampleChat2.addMessage("assistant", "우유으이");
    sampleChat2.addMessage("user", "소프트웨어");
    sampleChat2.addMessage("assistant", "개발");
    sampleChat2.addMessage("user", "소프트웨어");
    sampleChat2.addMessage("assistant", "개발자");
    sampleChat2.addMessage("user", "소프트웨어");
    sampleChat2.addMessage("assistant", "설계");
    sampleChat2.addMessage("user", "소프트웨어");
    sampleChat2.addMessage("assistant", "엔지니어링");
    
    const sampleChat3 = new ChatModel()
    sampleChat3.id = 3;
    sampleChat3.title = "1+1"
    sampleChat3.addMessage("user", "1+1은 뭐야?");
    sampleChat3.addMessage("assistant", "1+1은 2입니다.");

    chats[0] = sampleChat1;
    chats[1] = sampleChat2;
    chats[2] = sampleChat3;
}

export function addChat(chatModel)
{
    chats.push(chatModel);
}

export function saveChats()
{
    let ids = []
    for(let i = 0; i < chats.length; ++i )
    {
        ids.push(chats[i].id)
    }
    localStorage.setItem("ids", JSON.stringify(ids))
    for(let i = 0; i < chats.length; ++i )
    {
        chats[i].saveToLocalStorage(ids[i])
    }
}

export function loadChats()
{
    let ids = JSON.parse(localStorage.getItem("ids"));
    if (ids == null)
    {
        ids = []
    }
    for(let i = 0; i < ids.length; ++i )
    {
        const loadedChat = new ChatModel();
        loadedChat.loadFromLocalStorage(ids[i])
        addChat(loadedChat)
    }
}