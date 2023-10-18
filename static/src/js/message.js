// 각각의 메세지
export class Message {
    constructor(role, content, timestamp = new Date()) {
        // i.e. user / assistant / system?
        this.role = role;
        // i.e. 가나다라마바사
        this.content = content;
        // i.e. 메세지 객체가 만들어진 시간
        this.timestamp = timestamp;
    }

    // elemChatMessages에다가 추가할 <li> 요소를 메세지로부터 생성하는 함수
    createListItem() {
        // li 요소 만들기
        const li = document.createElement('li');
        // 역할role에 따라 클래스 이름 추가
        if (this.role == "assistant" ) li.classList.add("message-assistant")
        else if( this.role == "system" ) li.classList.add("message-system")
        else if( this.role == "user" ) li.classList.add("message-user")
        // div 요소 만들기
        const divContent = document.createElement('div');
        divContent.classList.add('content');
        divContent.textContent = this.content;
        // li 요소를 div 요소의 부모로 설정
        li.appendChild(divContent);
        // 메세지 메뉴
        if( this.role == "assistant" )
        {
            const templateMessageMenu = document.querySelector('#template-message-menu').content;
            const clone = document.importNode(templateMessageMenu, true); // This creates a deep clone of the template content.
            const elemBtnPlay = clone.querySelector(".btn-play");
            const elemBtnCopy = clone.querySelector(".btn-copy");
            elemBtnPlay.addEventListener('mousedown', (event) => {
                console.log("btn-play")
                console.log(this.content)
            })
            elemBtnCopy.addEventListener('mousedown', (event) => {
                console.log("btn-copy")
                navigator.clipboard.writeText(this.content);
                alert("'" + this.content + "' 가 클립보드에 복사되었습니다.");
            })
            li.appendChild(clone);
            this.elemBtnPlay = elemBtnPlay;
            this.elemBtnCopy = elemBtnCopy;
        }
        this.li = li;
        this.divContent = divContent;
        return li;
    }

    updateView() {
        // console.log(this.li);
        // console.log(this.divContent);
        // console.log(this.elemBtnPlay);
        // console.log(this.elemBtnCopy);
        if( this.divContent )
        {
            this.divContent.textContent = this.content;
        }
    }
}
