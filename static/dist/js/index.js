let mediaRecorder;
let recordedBlobs;

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const recordingsList = document.getElementById('recordingsList');
const audPlayer = document.querySelector("#player");
const micElement = document.querySelector('.mic-icon')
const btnMic = document.querySelector('.btn-mic')

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

if(isMobileDevice()){
    audPlayer.classList.remove('hidden')
}

var audioRecorder = {
    /** Stores the recorded audio as Blob objects of audio data as the recording continues*/
    audioBlobs: [], /*of type Blob[]*/
    /** Stores the reference of the MediaRecorder instance that handles the MediaStream when recording starts*/
    mediaRecorder: null, /*of type MediaRecorder*/
    /** Stores the reference to the stream currently capturing the audio*/
    streamBeingCaptured: null, /*of type MediaStream*/
    /** Start recording the audio
      * @returns {Promise} - returns a promise that resolves if audio recording successfully started
      */
    start: function () {
            //Feature Detection
            if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
                //Feature is not supported in browser
                //return a custom error
                return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'));
            } else {
                //Feature is supported in browser
                 
                //create an audio stream
                return navigator.mediaDevices.getUserMedia({ audio: true }/*of type MediaStreamConstraints*/)
                    //returns a promise that resolves to the audio stream
                    .then(stream /*of type MediaStream*/ => {
                         
                        //save the reference of the stream to be able to stop it when necessary
                        audioRecorder.streamBeingCaptured = stream;
 
                        //create a media recorder instance by passing that stream into the MediaRecorder constructor
                        audioRecorder.mediaRecorder = new MediaRecorder(stream); /*the MediaRecorder interface of the MediaStream Recording
                        API provides functionality to easily record media*/
 
                        //clear previously saved audio Blobs, if any
                        audioRecorder.audioBlobs = [];
 
                        //add a dataavailable event listener in order to store the audio data Blobs when recording
                        audioRecorder.mediaRecorder.addEventListener("dataavailable", event => {
                            //store audio Blob object
                            audioRecorder.audioBlobs.push(event.data);
                        });
 
                        //start the recording by calling the start method on the media recorder
                        audioRecorder.mediaRecorder.start();
                });
 
            /* errors are not handled in the API because if its handled and the promise is chained, the .then after the catch will be executed*/
            }
    },
    /** Stop the started audio recording
     * @returns {Promise} - returns a promise that resolves to the audio as a blob file
     */
    stop: function () {
        //return a promise that would return the blob or URL of the recording
        return new Promise(resolve => {
            //save audio type to pass to set the Blob type
            let mimeType = audioRecorder.mediaRecorder.mimeType;
 
            //listen to the stop event in order to create & return a single Blob object
            audioRecorder.mediaRecorder.addEventListener("stop", () => {
                //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
                let audioBlob = new Blob(audioRecorder.audioBlobs, { type: mimeType });
 
                //resolve promise with the single audio blob representing the recorded audio
                resolve(audioBlob);
            });
 
            audioRecorder.cancel();
        });
    },
    /** Cancel audio recording*/
    cancel: function () {
        //stop the recording feature
        audioRecorder.mediaRecorder.stop();
 
        //stop all the tracks on the active stream in order to stop the stream
        audioRecorder.stopStream();
 
        //reset API properties for next recording
        audioRecorder.resetRecordingProperties();
    },
    /** Stop all the tracks on the active stream in order to stop the stream and remove
     * the red flashing dot showing in the tab
     */
    stopStream: function() {
        //stopping the capturing request by stopping all the tracks on the active stream
        audioRecorder.streamBeingCaptured.getTracks() //get all tracks from the stream
                .forEach(track /*of type MediaStreamTrack*/ => track.stop()); //stop each one
    },
    /** Reset all the recording properties including the media recorder and stream being captured*/
    resetRecordingProperties: function () {
        audioRecorder.mediaRecorder = null;
        audioRecorder.streamBeingCaptured = null;
 
        /*No need to remove event listeners attached to mediaRecorder as
        If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
        up by the garbage collector as well as any event handlers/listeners associated with it.
        getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events.*/
    }
}

function startRecording() {
    //start recording using the audio recording API
    audioRecorder.start()
        .then(() => { //on success
            console.log("Recording Audio...")    
        })    
        .catch(error => { //on error
            //No Browser Support Error
            if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {       
                console.log("To record audio, use browsers like Chrome and Firefox.");
            }
        });
}

function stopRecording() {
    //stop the recording using the audio recording API
    console.log("Stopping Audio Recording...")
    audioRecorder.stop()
        .then(audioAsblob => { //stopping makes promise resolves to the blob file of the recorded audio
            console.log("stopped with audio Blob:", audioAsblob);
        
            let formData = new FormData();
            formData.append('file', audioAsblob);
        
            fetch('/upload', {
              method: 'POST',
              body: formData
            })
            .then(res => res.blob())
            .then(blob => {
                url = URL.createObjectURL(blob);
                document.querySelector('#player').src = url
                // 데스크탑에서는 자동 재생이 되지만,
                // 모바일 환경은 프라이버시 문제 때문에 재생 버튼을 직접 눌러야 실행됩니다.
                document.querySelector('#player').play()
            })
           .catch(error => console.error(error));
        })
        .catch(error => {
            //Error handling structure
            switch (error.name) {
                case 'InvalidStateError': //error from the MediaRecorder.stop
                    console.log("An InvalidStateError has occured.");
                    break;
                default:
                    console.log("An error occured with the error name " + error.name);
            };
 
        });
}

/** Cancel the currently started audio recording */
function cancelAudioRecording() {
    console.log("Canceling audio...");
    //cancel the recording using the audio recording API
    audioRecorder.cancel();
 
    //Do something after audio recording is cancelled
}

btnMic.addEventListener('mousedown', function() {
    // console.log("mousedown")
    startRecording()
});

btnMic.addEventListener('mouseup', function() {
    // console.log("mouseup")
    stopRecording()
});


// For touch devices
btnMic.addEventListener('touchstart', function(e) {
    // Prevents mouse events from firing
    e.preventDefault(); 
    startRecording()
});

btnMic.addEventListener('touchend', function(e) {
    // Prevents mouse events from firing
    e.preventDefault(); 
    stopRecording()
});