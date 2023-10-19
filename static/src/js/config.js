/* 
    파일이름 : config.js
    생성일 : 2023년 10월 19일 이아람이 만들었습니다.
    설명 : tts.js 파일에 import 할 부분 (speed, volume, voice) 

*/

// 음성 속도 조절
export let speed = 1.0;
export function setSpeed(newSpeed){
    speed = newSpeed;
}

// 음성 음량 조절
export let volume = 0.0;
export function setVolume(newVolume){
    volume = newVolume;
}

// 음성 성별 조절
export let voice = 'ko-KR-Wavenet-C';
export function setVoice(newVoice){
    voice = newVoice;
}