import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".video__comment__delete");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    const icon = document.createElement("i");
    const span = document.createElement("span");
    const span2 = document.createElement("span");

    newComment.className="video__comment";
    newComment.dataset.id=id;
    icon.className="fas fa-comment";
    span.innerText=` ${text}`;
    span2.innerText=" ❌";

    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);

    span2.addEventListener("click", handleDelete);
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text===""){
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        //headers : req에 대한 정보를 전달
        headers:{
            //server.js에 적어둔 express.json()에 의해 처리돼야함을 알려줌
            "Content-Type":"application/json",
        },
        body:JSON.stringify({text}),
    });
    if(response.status===201){
        textarea.value="";
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
    }
}

if(form){
    form.addEventListener("submit", handleSubmit);
}

const handleDelete = async() => {
    const videoId = videoContainer.dataset.id;
    const commentId = deleteBtn.dataset.id;
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method:"DELETE",
        headers:{
            //server.js에 적어둔 express.json()에 의해 처리돼야함을 알려줌
            "Content-Type":"application/json",
        },
        body:JSON.stringify({commentId}),
    });
    if(response.status===201){
        
    }
}

if(deleteBtn){
    console.log(deleteBtn);
    deleteBtn.addEventListener("click",(e)=>{console.log(e);});
    for (let i = 0; i < deleteBtn.length; i++) {
        const item = deleteBtn.item(i);
        const parentElement = item.parentElement;
        console.log(parentElement);
      }
}