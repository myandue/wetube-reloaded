const video = document.querySelector("video");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const totalTime=document.getElementById("totalTime");
const currentTime=document.getElementById("currentTime");
const timeline=document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControl = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMouseMovement = null;
//볼륨 디폴트 설정
let volumeValue=0.5;
video.volume=volumeValue;

const handlePlayClick = (e) => {
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleMute = (e) => {
    if(video.muted){
        video.muted=false;
    }else{
        video.muted=true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted? 0 : volumeValue;
}

const handleVolumeChange = (event) => {
    const {target : {value}} = event;
    video.volume = value;
    if(video.muted){
        video.muted=false;
        muteBtn.innerText="Mute";
    }
    volumeValue = value;
    video.volume = volumeValue;
}

const formatTime = (seconds) => {
    const formatedTime = new Date(seconds*1000).toISOString().substring(14,19);
    return(formatedTime);
}

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(video.duration);
    timeline.max = Math.floor(video.duration);
}
const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(video.currentTime);
    timeline.value=Math.floor(video.currentTime);
}

const handleTimelineChange = (event) => {
    const {target:{value}} = event;
    video.currentTime=value;
}

const handleFullScreen = () => {
    const fullScreen = document.fullscreenElement;
    if(fullScreen){
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    }else{
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () => {
    videoControl.classList.remove("showing");
}

const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout=null;
    }
    //mouse가 움직이면 밑의 if문 실행
    //즉, controlsMouseMovement가 null이건 아니건 null이 되고
    //실행됐던 timeout을 clear(실행취소) 시킴.
    if(controlsMouseMovement){
        clearTimeout(controlsMouseMovement);
        controlsMouseMovement = null;
    }
    //control을 showing하고
    videoControl.classList.add("showing");
    //3초 뒤에 hideControls가 실행됨 
    //=3초간 handleMouseMove 함수가 실행되지 않는다면 hideControls상태일것이라는 의미
    controlsMouseMovement = setTimeout(hideControls,3000);
} //마우스가 움직이는동안 끊임없이 timeout을 생성&제거를 반복하는 행위임

const handleMouseLeave = () => {
    //timeout은 id를 갖고 있음. 그 값을 밑의 변수에 넣어주는 것임.
    controlsTimeout = setTimeout(hideControls, 1000);
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input",handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate",handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click",handleFullScreen);