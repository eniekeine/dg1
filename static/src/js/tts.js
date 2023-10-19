import { speed } from './config.js'

// 목소리 유형을 설정하는 함수 ================================================================= 아람
export function setVoiceType(type) {
    // 남자 목소리를 선택한 경우
    if (type === 'male') {
        return 'ko-KR-Wavenet-C';
    }
    // 여자 목소리를 선택한 경우
    else if (type === 'female') {
        return 'ko-KR-Wavenet-B';
    }
    // 기본 목소리 값 남자
    return 'ko-KR-Wavenet-C';
}

// Google Text-to-Speech API를 사용하여 텍스트를 음성으로 변환하는 함수 ========================================= 아람
export function textToSpeech(text, type) {
    console.log("API에 전달되는 속도 값 : ", speed);
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
            voice: { languageCode: 'ko-KR', name: setVoiceType(type) },
            audioConfig: { audioEncoding: 'LINEAR16', speakingRate: speed }
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
} // ================================================================================================== 아람