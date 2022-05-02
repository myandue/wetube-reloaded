import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg"

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async() => {
    //user의 브라우저에 가상의 컴퓨터를 만듦
    const ffmpeg = createFFmpeg({corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',log:true});
    await ffmpeg.load();

    //가상의 컴에 파일을 생성함(FileSystem 이용)
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

    //가상의 컴에서 파일을 input(-i)해주고 mp4로 변환해줌
    //"-r", "60" => 초당 60 프레임으로 인코딩 해주는 명령어
    await ffmpeg.run("-i", "recording.webm","-r","60", "output.mp4");
    await ffmpeg.run("-i","recording.webm","-ss","00:00:01","-frames:v","1","thumbnail.jpg");

    const mp4File = ffmpeg.FS("readFile","output.mp4");
    const thumbFile = ffmpeg.FS("readFile","thumbnail.jpg");

    //binary data를 사용하고 싶다면 buffer를 사용해야 함.
    //blob은 가상의 컴에서 사용하는 파일
    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
    const thumbBlob = new Blob([thumbFile.buffer], {type:"image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    const a = document.createElement("a");
    //link 지정
    a.href=mp4Url;
    //download property 추가 
    //=> 해당 링크 클릭 시 해당 링크로 이동하는 것이 아니라 download를 하게함
    a.download="MyRecording.mp4";
    document.body.appendChild(a);
    a.click();

    const thumbA = document.createElement("a");
    thumbA.href=thumbUrl;
    thumbA.download="MyThumbnail.jpg";
    document.body.appendChild(thumbA);
    thumbA.click();
}

const handleStop = () => {
        startBtn.innerText = "Download Recording";
        startBtn.removeEventListener("click", handleStop);
        startBtn.addEventListener("click", handleDownload);
        //recorder.stop하면 미리 설정해둔 ondataavailable 발동하는 것임
        recorder.stop();
}

const handleStart=()=>{
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream);
    //condataavailable은 녹화가 멈추면 발생하는 event
    recorder.ondataavailable = (event) => {
        //메모리상에 있는 파일(e.data)을 브라우저 내에서 공유 할 수 있는 형태인 URL로 생성해준 것
        videoFile = URL.createObjectURL(event.data);
        //미리보기 화면을 제거
        video.srcObject=null;
        //녹화한 비디오 url 파일을 넣어줌
        video.src=videoFile;
        video.loop=true;
        video.play();
    }
    recorder.start();
}

const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true,
    });
    video.srcObject = stream;
    video.play();
};

init();

startBtn.addEventListener("click", handleStart);