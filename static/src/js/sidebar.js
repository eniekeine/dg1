/* EXPANDER MENU */
import {chats, currChat, selectChat} from './models.js'
let navState = 'close';
const elemNavList = document.querySelector('.nav__list');

// 채팅 목록에 변화가 있을 경우
document.addEventListener('chatsUpdated', e => {
    // 사이드바의 내용을 그에 맞춰 업데이트 할 것
    updateSidebar();
});

const showMenu = (toggleId, navbarId, bodyId) => {
  const toggle = document.getElementById(toggleId),
  navbar = document.getElementById(navbarId),
  bodypadding = document.getElementById(bodyId)

  if( toggle && navbar ) {
      toggle.addEventListener('click', ()=>{
          if( navState == 'close' ) navState = 'open';
          else navState = 'close';
          navbar.classList.toggle('expander');
          bodypadding.classList.toggle('body-pd');
          let removeButtons = document.getElementsByClassName('btn-remove-chat')
          for( let i = 0; i < removeButtons.length; ++i )
          {
            if( navState == 'close' ) removeButtons[i].classList.add('hidden')
            else removeButtons[i].classList.remove('hidden')
          }
          let editButtons = document.getElementsByClassName('btn-edit-title')
          for( let i = 0; i < editButtons.length; ++i )
          {
            if( navState == 'close' ) editButtons[i].classList.add('hidden')
            else editButtons[i].classList.remove('hidden')
          }
      })
  }
}

showMenu('nav-toggle', 'navbar', 'body-pd')

// 사이드바에 채팅 목록 요소를 추가하는 함수
export function updateSidebar()
{
    elemNavList.textContent = ""
    for(let i = 0; i < chats.length; ++i )
    {
        let nl = createNavLink(chats[i])
        elemNavList.appendChild(nl)
    }
}

// 히스토리에 표시되는 채팅 목록 요소를 만드는 함수
export function createNavLink(chatModel) {
    const templateNavLink = document.querySelector('#template-nav-link').content;
    const clone = document.importNode(templateNavLink, true); // This creates a deep clone of the template content.
    const anchor = clone.querySelector('.nav__link');
    const elemBtnRemoveChat = clone.querySelector('.btn-remove-chat');
    const elemBtnEditTitle = clone.querySelector('.btn-edit-title');
    const span = anchor.querySelector('span');
    span.textContent = chatModel.title;
    anchor.addEventListener('mousedown', event => {
        selectChat(chatModel)
    });
    elemBtnRemoveChat.addEventListener('mousedown', event =>{
        console.log("remove")
        let index = chats.indexOf(chatModel);
        chats.splice(index, 1)
        updateSidebar();
    })
    elemBtnEditTitle.addEventListener('mousedown', event => {
        console.log("edit")
    })
    if ( chatModel == currChat )
        anchor.classList.add('active');
    return clone;
}
