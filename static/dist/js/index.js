/*
    파일이름 : index.js
    생성일 : 2023년 10월 12일 이경근이 만들었습니다.
    설명 : index.html 파일의 로직을 지정하는 파일입니다.
*/
let state = '대기'
const elemBtnMic = document.querySelector('.btn-mic')
const elemSldConfigRate = document.querySelector('#sld-config-rate')
const elemSldConfigVolume = document.querySelector('#sld-config-volume')
const elemChkConfigAutoplay = document.querySelector('#chk-config-autoplay')
const elemBtnMalVoice = document.querySelector('#btn-mal-voice')
const elemBtnFemVoice = document.querySelector('#btn-fem-voice')
const elemBtnSubmit = document.querySelector('#btn-submit')

elemBtnMic.addEventListener('mousedown', function(event) {
    event.preventDefault(); // prevent default navigation behavior
    if (state == '대기' )
    {
        state = '음성입력'
        // TODO : 마이크 버튼을 클릭했을 때 음성 입력을 받아들이는 상태(state)로 전환합니다.
    }
    else if (state == '음성입력')
    {
        // TODO : 마이크 버튼을 한 번 더 클릭하면 음성 입력을 그만 받아들이고 쿼리를 전송합니다.
        state = '대기'
    }
    console.log(state)
});

elemSldConfigRate.addEventListener('change', function(event) {
    console.log("속도 값 : ", this.value);

    // TODO : 비서의 응답 속도가 속도 설정에 따라 빠르거나 느려지도록 합니다.
});

elemSldConfigVolume.addEventListener('change', function(event) {
    console.log("볼륨 값 : ", this.value);

    // TODO : 비서의 응답 소리가 볼륨 설정에 따라 크고 작아지도록 합니다.
});

elemChkConfigAutoplay.addEventListener('change', function(event) {
    console.log("자동재생 : ", this.checked);
});

elemBtnMalVoice.addEventListener('mousedown', event => {
    event.preventDefault(); // prevent default navigation behavior
    console.log("남성 목소리")
})
elemBtnFemVoice.addEventListener('mousedown', event => {
    event.preventDefault(); // prevent default navigation behavior
    console.log("여성 목소리")
})
elemBtnSubmit.addEventListener('mousedown', event => {
    event.preventDefault(); // prevent default navigation behavior
    console.log("쿼리 제출")
})

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
