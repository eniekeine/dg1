/*
    파일이름 : index.js
    생성일 : 2023년 10월 12일 이경근이 만들었습니다.
    설명 : index.html 파일의 로직을 지정하는 파일입니다.
*/
console.log("hi")

function sayhi()
{
    // then, catch : Promise
    fetch('/sayhi')
        .then(x => {
            return x.json()
        })
        .then(x => {
            console.log(x)
            document.querySelector(".pout").textContent = x.text
        })
        .catch(error => {
            console.error(error)
        });
}
