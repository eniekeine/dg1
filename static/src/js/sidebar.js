/* EXPANDER MENU */
import {chats, currChat, selectChat, removeChat} from './models.js'
let navState = 'close';
const elemNavList = document.querySelector('.nav__list');
const toggle = document.getElementById('nav-toggle')
const navbar = document.getElementById('navbar')
const bodypadding = document.getElementById("body-pd")
const elemBtnNewChatText = document.querySelector(".btn-new-chat-text")

// 채팅 목록에 변화가 있을 경우
document.addEventListener('chatsUpdated', e => {
    // 사이드바의 내용을 그에 맞춰 업데이트 할 것
    updateSidebar();
});

toggle.addEventListener('click', ()=>{
    if( navState == 'close' ) navState = 'open';
    else navState = 'close';
    navbar.classList.toggle('expander');
    bodypadding.classList.toggle('body-pd');
    showButtons(navState == 'open')
})

function showButtons(show)
{
    let removeButtons = document.getElementsByClassName('btn-remove-chat')
    for( let i = 0; i < removeButtons.length; ++i )
    {
        if( show ) removeButtons[i].classList.remove('hidden')
        else removeButtons[i].classList.add('hidden')
    }
    let editButtons = document.getElementsByClassName('btn-edit-title')
    for( let i = 0; i < editButtons.length; ++i )
    {
        if( show ) editButtons[i].classList.remove('hidden')
        else editButtons[i].classList.add('hidden')
    }
    if( show ) elemBtnNewChatText.classList.remove('hidden')
    else elemBtnNewChatText.classList.add('hidden')
}

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
    showButtons(navState == 'open')
}

// 히스토리에 표시되는 채팅 목록 요소를 만드는 함수
export function createNavLink(chatModel) {
    const templateNavLink = document.querySelector('#template-nav-link').content;
    const clone = document.importNode(templateNavLink, true); // This creates a deep clone of the template content.
    const anchor = clone.querySelector('.nav__link');
    const elemBtnRemoveChat = clone.querySelector('.btn-remove-chat');
    const elemBtnEditTitle = clone.querySelector('.btn-edit-title');
    const span = anchor.querySelector('span');
    const elemTxtEditTitle = clone.querySelector('.txt-edit-title');
    span.textContent = chatModel.title;
    anchor.addEventListener('mousedown', event => {
        selectChat(chatModel)
    });
    elemBtnRemoveChat.addEventListener('mousedown', event =>{
        if( currChat == chatModel ) selectChat(null)
        removeChat(chatModel)
    })
    elemBtnEditTitle.addEventListener('mousedown', event => {
        console.log("edit")
        elemTxtEditTitle.classList.remove('hidden');
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
            elemTxtEditTitle.classList.add('hidden')
            updateSidebar();
        }
    });
    if ( chatModel == currChat ) anchor.classList.add('active');
    return clone;
}
