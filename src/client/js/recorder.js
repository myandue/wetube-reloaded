import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg"

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

const files = {
    input:"recording.webm",
    output:"output.mp4",
    thumb:"thumbnail.jpg"
}

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    //link 지정
    a.href=fileUrl;
    //download property 추가 
    //=> 해당 링크 클릭 시 해당 링크로 이동하는 것이 아니라 download를 하게함
    a.download=fileName;
    document.body.appendChild(a);
    a.click();
}

let stream;
let recorder;
let videoFile;

const handleDownload = async() => {
    actionBtn.removeEventListener("click",handleDownload);
    actionBtn.innerText="Transcoding...";
    actionBtn.disabled=true;

    //user의 브라우저에 가상의 컴퓨터를 만듦
    const ffmpeg = createFFmpeg({corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',log:true});
    await ffmpeg.load();

    //가상의 컴에 파일을 생성함(FileSystem 이용)
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    //가상의 컴에서 파일을 input(-i)해주고 mp4로 변환해줌
    //"-r", "60" => 초당 60 프레임으로 인코딩 해주는 명령어
    await ffmpeg.run("-i", files.input,"-r","60", files.output);
    await ffmpeg.run("-i",files.input,"-ss","00:00:01","-frames:v","1",files.thumb);

    const mp4File = ffmpeg.FS("readFile",files.output);
    const thumbFile = ffmpeg.FS("readFile",files.thumb);

    //binary data를 사용하고 싶다면 buffer를 사용해야 함.
    //blob은 가상의 컴에서 사용하는 파일
    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
    const thumbBlob = new Blob([thumbFile.buffer], {type:"image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url,"MyRecording.mp4");
    downloadFile(thumbUrl,"MyThumbnail.jpg");

    //다 사용한 파일, 링크 제커(냅두면 브라우저가 무거워서 느려짐)
    ffmpeg.FS("unlink",files.input);
    ffmpeg.FS("unlink",files.output);
    ffmpeg.FS("unlink",files.thumb);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    //버튼 활성화
    init();
    actionBtn.disabled=false;
    actionBtn.innerText="Record Again";
    actionBtn.addEventListener("click",handleStart);
}

const handleStart=()=>{
    actionBtn.innerText = "Recording";
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart);
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
        actionBtn.innerText = "Download";
        actionBtn.disabled = false;
        actionBtn.addEventListener("click", handleDownload);
    }
    recorder.start();
    //3초만 녹화되도록 할거임 
    setTimeout(() => {
        recorder.stop();
    }, 3000);
}

const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio:false,
        video:{
            width:1024,
            height:576,
        },
    });
    video.srcObject = stream;
    video.play();
};

init();

actionBtn.addEventListener("click", handleStart);