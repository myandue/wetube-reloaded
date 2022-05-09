const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text===""){
        return;
    }
    fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        //headers : req에 대한 정보를 전달
        headers:{
            //server.js에 적어둔 express.json()에 의해 처리돼야함을 알려줌
            "Content-Type":"application/json",
        },
        body:JSON.stringify({text}),
    });
}

if(form){
    form.addEventListener("submit", handleSubmit);
}