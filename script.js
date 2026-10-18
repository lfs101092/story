var btn = document.getElementById('start-btn');
var fileInput = document.getElementById('file-input');
var illusion = document.getElementById('illusion');
var timerDiv = document.getElementById('timer');

btn.onclick = function() {
    fileInput.click();
};

fileInput.onchange = function(e) {
    var files = e.target.files;
    if (files.length < 2) {
        alert("Нужно выбрать ровно 2 картинки!");
        return;
    }

    // Скрываем кнопку
    btn.style.display = 'none';

    // Создаем ссылки на картинки в памяти браузера
    var url1 = URL.createObjectURL(files[0]);
    var url2 = URL.createObjectURL(files[1]);

    buildIllusion(url1, url2);
};

function buildIllusion(img1, img2) {
    illusion.innerHTML = ''; // Очищаем
    illusion.style.display = 'block';

    var numStripes = 40; // Количество полосок
    var stripeWidth = 100 / numStripes; // Ширина в процентах

    for (var i = 0; i < numStripes; i++) {
        var div = document.createElement('div');
        div.className = 'stripe';
        div.style.left = (i * stripeWidth) + '%';
        div.style.width = stripeWidth + '%';

        var img = document.createElement('img');
        
        // Четные полоски - картинка 1, нечетные - картинка 2
        if (i % 2 === 0) {
            img.src = img1;
        } else {
            img.src = img2;
        }

        // Сдвигаем картинку, чтобы она не плющилась внутри полоски, а выходила за края
        img.style.left = -(i * stripeWidth) + '%';

        div.appendChild(img);
        illusion.appendChild(div);
    }

    startCountdown();
}

function startCountdown() {
    var timeLeft = 10;
    timerDiv.style.display = 'block';
    timerDiv.innerText = timeLeft;

    var interval = setInterval(function() {
        timeLeft--;
        timerDiv.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(interval);
            timerDiv.style.display = 'none';
            illusion.style.display = 'none';
            
            // Возвращаем кнопку
            btn.style.display = 'block';
            btn.innerText = 'Ещё раз';
        }
    }, 1000);
}
