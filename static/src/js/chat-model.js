import {Message} from './message.js'

// 채팅 기록
export class ChatModel {
    constructor() {
        // 오고간 메세지 목록
        this.messages = [];
        // 제목
        this.title = "chat";
    }

    // 새로운 메세지를 추가하는 함수
    // i.e. 사용자가 "1+1은 뭐야?"
    // i.e. ChatGPT가 "2입니다"
    addMessage(role, content) {
        const message = new Message(role, content);
        this.messages.push(message);
    }

    // 브라우저 저장소에 저장을 하기
    saveToLocalStorage(key) {
        const data = JSON.stringify(this.messages);
        // 파이선의 딕셔너리와 유사. key - value 페어
        // setItem으로 데이터를 저장하고나면 브라우저를 껐다가 켜도 데이터가 유지됩니다.
        localStorage.setItem(key, data);
    }

    // 브라우저 저장소에서 불러오기
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
