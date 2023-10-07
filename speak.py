import pygame.mixer as mixer
from gtts import gTTS

def main():
    # 한국어
    comment_ko = "만나서 반갑습니다!"
    comment_to_voice_ko = gTTS(text=comment_ko, lang='ko')
    comment_to_voice_ko.save('sound_ko.mp3')

    # 영어
    comment_en = "Nice to meet you!"
    comment_to_voice_en = gTTS(text=comment_en, lang='en')
    comment_to_voice_en.save('sound_en.mp3')

    # 스페인어
    comment_es = "¡Encantado de conocerte!"
    comment_to_voice_es = gTTS(text=comment_es, lang='es')
    comment_to_voice_es.save('sound_es.mp3')

    mixer.init()  # Pygame 오디오 시스템 초기화

    # 한국어 음성 재생
    sound_ko = mixer.Sound('sound_ko.mp3')
    sound_ko.play()
    
    # 영어 음성 재생
    sound_en = mixer.Sound('sound_en.mp3')
    sound_en.play()

    # 스페인어 음성 재생
    sound_es = mixer.Sound('sound_es.mp3')
    sound_es.play()

if __name__ == "__main__":
    main()
