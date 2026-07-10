const counters = document.querySelectorAll("[data-count]");

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const counter = entry.target;

const target = +counter.dataset.count;

let current = 0;

const speed = target/80;

const update=()=>{

current+=speed;

if(current<target){

counter.innerText=Math.ceil(current);

requestAnimationFrame(update);

}else{

counter.innerText=target+"+";

}

}

update();

}

})

});

counters.forEach(c=>observer.observe(c));
