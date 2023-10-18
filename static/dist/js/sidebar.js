/* EXPANDER MENU */
let navState = 'close';
let nav
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

/* LINK ACTIVE */
const linkColor = document.querySelectorAll('.nav__link')
function colorLink() {
  linkColor.forEach(l=> l.classList.remove('active'))
  this.classList.add('active')
}
linkColor.forEach(l=> l.addEventListener('click', colorLink))

/* COLLAPSE MENU */
const linkCollapse = document.getElementsByClassName('collapse__link')
var i

for(i=0;i<linkCollapse.length;i++) {
  linkCollapse[i].addEventListener('click', function(){
      const collapseMenu = this.nextElementSibling
      collapseMenu.classList.toggle('showCollapse')

      const rotate = collapseMenu.previousElementSibling
      rotate.classList.toggle('rotate')
  });
}
