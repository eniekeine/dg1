from pydub import AudioSegment

#음성 데이터 로드
audio = AudioSegment.from_file("./input/001.wav")

#속도 조절

speed =1.5
adjusted_audio =audio.speedup(playback_speed=speed)

#조절된 음성데이터 저장

adjusted_audio.export('./output/001out.wav', format='wav')
