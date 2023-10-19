/* 
    파일이름 : tts.js
    생성일 : 2023년 10월 19일 이아람이 만들었습니다.
    설명 : Google Text-to-Speech API

*/

import { speed, volume, voice } from './config.js'


// Google Text-to-Speech API를 사용하여 텍스트를 음성으로 변환하는 함수 
export function textToSpeech(text) {
    // API 키
    const apiKey = 'AIzaSyCT5ikIE-05ZiLhjAiDlRs4PgzQxsjXAgQ'; // 실제 API 키로 대체
    // 음성 출력을 위한 오디오 요소
    const audioOutput = new Audio();
    const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    // fetch API를 사용하여 Text-to-Speech API에 요청을 보냅니다.
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            input: { text },
            voice: { languageCode: 'ko-KR', name: voice },
            audioConfig: { audioEncoding: 'LINEAR16', speakingRate: speed, volumeGainDb: volume }
        }),
    })
    .then(response => response.json())
    .then(data => {
        // 오디오 URL을 생성하여 재생
        const audioUrl = `data:audio/wav;base64,${data.audioContent}`;
        audioOutput.src = audioUrl;
        audioOutput.play();
    })
    .catch(error => console.error('Error:', error));
} 