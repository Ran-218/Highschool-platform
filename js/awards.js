import { db } from "./firebase.js";

import {
collection,
query,
orderBy,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const awardList =
document.getElementById("awardList");

const q = query(

collection(db,"ideas"),

orderBy("year","desc"),

orderBy("month","desc"),

orderBy("votes","desc")

);

onSnapshot(q,(snapshot)=>{

awardList.innerHTML="";

let groups={};

snapshot.forEach(doc=>{

const data=doc.data();

const key=`${data.year}年${data.month}月`;

if(!groups[key]){

groups[key]=[];

}

groups[key].push(data);

});

for(const month in groups){

const ideas=groups[month];

awardList.innerHTML+=`

<h2>${month}</h2>

`;

if(ideas[0]){

awardList.innerHTML+=`

<div class="idea-card">

<h3>🥇 大賞</h3>

<h4>${ideas[0].title}</h4>

<p>👍 ${ideas[0].votes}票</p>

<p>${ideas[0].problem}</p>

</div>

`;

}

if(ideas[1]){

awardList.innerHTML+=`

<div class="idea-card">

<h3>🥈 副賞</h3>

<h4>${ideas[1].title}</h4>

<p>👍 ${ideas[1].votes}票</p>

<p>${ideas[1].problem}</p>

</div>

`;

}

awardList.innerHTML+="<hr>";

}

});