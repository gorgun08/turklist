let counter = document.querySelector('h1');
let count = 1;
setInterval(()=>{
    counter.innerText = count;
    count++
    
    if (count > 3) {
            clearInterval(interval);
            setTimeout(() => {
                location.replace('https://turklist.xyz');
            }, 5000);
        }
    
    
},500)
