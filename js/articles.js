import {db} from "./firebase.js";

import {
collection,
addDoc,
getDocs,
doc,
updateDoc,
increment,
query,
orderBy,
serverTimestamp
}

from 
"https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";



//投稿

window.postArticle = async function(){

await addDoc(collection(db,"articles"),{

title:
document.getElementById("title").value,

author:
document.getElementById("author").value,

category:
document.getElementById("category").value,

language:
document.getElementById("language").value,

content:
document.getElementById("content").value,


likes:0,

createdAt:serverTimestamp()

});


alert("投稿しました");

location.reload();

}



//表示

async function loadArticles(){

const q=query(
collection(db,"articles"),
orderBy("createdAt","desc")
);


const snapshot=await getDocs(q);


let html="";


snapshot.forEach((doc)=>{

let a=doc.data();


html+=`

<h3>${a.title}</h3>

<p>
${a.category}
/
${a.language}
</p>


<p>
${a.content}
</p>


<button onclick="like('${doc.id}')">
👍 ${a.likes}
</button>


<div id="comment-${doc.id}">

</div>

<hr>

`;

});


document.getElementById("articles").innerHTML=html;

}



window.like=async function(id){

const ref=doc(db,"articles",id);


await updateDoc(ref,{

likes:increment(1)

});


location.reload();

}



loadArticles();