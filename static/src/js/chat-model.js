import {Message} from './message.js'

// 채팅 기록
export class ChatModel {
    constructor() {
        // 오고간 메세지 목록
        this.messages = [];
        // 제목 (기본값은 "새로운 채팅")
        this.title = "새로운 채팅";
        // 아이디 (랜덤 값으로 설정)
        this.id = crypto.randomUUID();
    }

    // 새로운 메세지를 추가하는 함수
    // i.e. 사용자가 "1+1은 뭐야?"
    // i.e. ChatGPT가 "2입니다"
    addMessage(role, content) {
        // 처음 추가된 메세지를 타이틀로 설정
        if(this.messages.length == 0 ) this.title = content;
        // 메세지 객체 생성 및 추가
        const message = new Message(role, content, new Date());
        this.messages.push(message);
        return message;
    }

    // 브라우저 저장소에 저장을 하기
    saveToLocalStorage() {
        const data = JSON.stringify(this);
        // 파이선의 딕셔너리와 유사. key - value 페어
        // setItem으로 데이터를 저장하고나면 브라우저를 껐다가 켜도 데이터가 유지됩니다.
        localStorage.setItem(this.id, data);
    }

    // 브라우저 저장소에서 불러오기
    loadFromLocalStorage(id) {
        const data = localStorage.getItem(id);
        const parsed = JSON.parse(data)
        if (data) {
            this.messages = parsed.messages.map(msg => {
                // Convert the stored date string back to a Date object
                return new Message(
                    msg.role, 
                    msg.content, 
                    msg.timestamp
                );
            });
            this.id = id;
            this.title = parsed.title;
        }
    }

    getMessages() {
        return this.messages;
    }
}
