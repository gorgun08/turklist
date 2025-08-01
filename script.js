document.addEventListener('DOMContentLoaded', () => {
    let counter = document.querySelector('h1');
    let count = 1;

    if (!counter) return;

    const interval = setInterval(() => {
        counter.innerText = count;
        count++;

        if (count > 3) {
            clearInterval(interval);
            setTimeout(() => {
                location.replace('https://trlist.fly.dev/');
            }, 1000);
        }
    }, 500);
});
