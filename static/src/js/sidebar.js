/* EXPANDER MENU */
import {chats, currChat, selectChat, removeChat} from './models.js'
let navState = 'close';
const elemSidebar = document.querySelector('.sidebar');
const elemNavList = document.querySelector('.nav__list');
const toggle = document.getElementById('nav-toggle')
const navbar = document.getElementById('navbar')
const bodypadding = document.getElementById("body-pd")

// 채팅 목록에 변화가 있을 경우
document.addEventListener('chatsUpdated', e => {
    // 사이드바의 내용을 그에 맞춰 업데이트 할 것
    updateSidebar();
});

toggle.addEventListener('click', ()=>{
    if( navState == 'close' ) navState = 'open';
    else navState = 'close';
    elemSidebar.classList.toggle('expander');
    navbar.classList.toggle('expander');
    toggle.classList.toggle('expander');
    bodypadding.classList.toggle('body-pd');
})

// 사이드바에 채팅 목록 요소를 추가하는 함수
export function updateSidebar()
{
    elemNavList.textContent = ""
    for(let i = 0; i < chats.length; ++i )
    {
        let nl = createNavLink(chats[i]);
        elemNavList.appendChild(nl);
        nl.chatModel = chats[i];
    }
}

// 히스토리에 표시되는 채팅 목록 요소를 만드는 함수
export function createNavLink(chatModel) {
    const templateNavLink = document.querySelector('#template-nav-link').content;
    const clone = document.importNode(templateNavLink, true); // This creates a deep clone of the template content.
    const anchor = clone.querySelector('.nav__link');
    const elemBtnRemoveChat = clone.querySelector('.btn-remove-chat');
    const elemIconRemoveChat = elemBtnRemoveChat.querySelector('ion-icon');
    const elemBtnEditTitle = clone.querySelector('.btn-edit-title');
    const elemIconEditTitle = elemBtnEditTitle.querySelector('ion-icon')
    const span = anchor.querySelector('span');
    const elemTxtEditTitle = clone.querySelector('.txt-edit-title');
    span.textContent = chatModel.title;
    anchor.addEventListener('click', event => {
        console.log("anchor.click")
        selectChat(chatModel)
    });
    elemBtnRemoveChat.addEventListener('click', event =>{
        event.stopPropagation();
        console.log("elemBtnRemoveChat.click")
        if(elemIconRemoveChat.getAttribute('name') =='checkmark-outline')
        {
            const newTitle = elemTxtEditTitle.value.trim();
            if (newTitle === "" ) return;
            chatModel.title = elemTxtEditTitle.value;
            elemIconRemoveChat.setAttribute('name', 'trash-outline')
            elemBtnRemoveChat.setAttribute('title', '채팅 삭제')
            elemIconEditTitle.setAttribute('name', 'pencil-outline')
            elemBtnEditTitle.setAttribute('title', '제목 수정')
            elemTxtEditTitle.classList.add('hidden');
            updateSidebar();
        }
        else
        {
            elemBtnRemoveChat.querySelector('ion-icon')
            if( currChat == chatModel ) selectChat(null)
            removeChat(chatModel)
        }
    })
    elemBtnEditTitle.addEventListener('click', event => {
        event.stopPropagation();
        console.log("elemBtnEditTitle.click")
        if( elemIconEditTitle.getAttribute('name') == 'close-outline')
        {
            // cancel edit title
            elemIconRemoveChat.setAttribute('name', 'trash-outline')
            elemBtnRemoveChat.setAttribute('title', '채팅 삭제')
            elemIconEditTitle.setAttribute('name', 'pencil-outline')
            elemBtnEditTitle.setAttribute('title', '제목 수정')
            elemTxtEditTitle.classList.add('hidden');
        }
        else
        {
            // edit title
            elemIconRemoveChat.setAttribute('name', 'checkmark-outline')
            elemBtnRemoveChat.setAttribute('title', '확인')
            elemIconEditTitle.setAttribute('name', 'close-outline')
            elemBtnEditTitle.setAttribute('title', '취소')
            elemTxtEditTitle.classList.remove('hidden');
        }
    })
    elemTxtEditTitle.addEventListener('keyup', event => {
        if(event.key === "Escape") 
        {
            elemTxtEditTitle.classList.add('hidden')
        }
        else if (event.key === "Enter" )
        {
            const newTitle = elemTxtEditTitle.value.trim();
            if (newTitle === "" ) return;
            chatModel.title = elemTxtEditTitle.value;
            elemTxtEditTitle.classList.add('hidden');
            updateSidebar();
        }
    });
    if ( chatModel == currChat )
    {
        anchor.classList.add('active');
        elemBtnEditTitle.classList.remove('hidden');
        elemBtnRemoveChat.classList.remove('hidden');
    }
    return clone;
}
