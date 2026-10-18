var v = document.getElementById('v');
var c = document.getElementById('c');
var x = c.getContext('2d', { willReadFrequently: true });
var dotTop = document.getElementById('dot-top');
var dotBottom = document.getElementById('dot-bottom');
var h = document.getElementById('h');

var step = 0; // 0 = верхняя точка, 1 = нижняя, 2 = готово
var cal = {};
var closedFrames = 0;
var lastBlinkTime = 0;
var ex = 0, ey = 0;

// Включаем камеру
navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
.then(function(stream) {
    v.srcObject = stream;
    v.onloadedmetadata = function() {
        // Показываем первую точку
        dotTop.style.display = 'block';
        h.textContent = 'Смотри на ВЕРХНЮЮ точку';
        loop();
    };
})
.catch(function(e) {
    h.textContent = 'Ошибка камеры: ' + e.message;
});

// Поиск зрачка (по тёмному пятну)
function findPupil() {
    if (v.videoWidth === 0) return null;
    x.drawImage(v, 0, 0, 160, 120);
    var d = x.getImageData(0, 0, 160, 120).data;
    var sx = 0, sy = 0, n = 0;

    for (var i = 0; i < d.length; i += 4) {
        var lum = d[i]*0.3 + d[i+1]*0.6 + d[i+2]*0.1;
        if (lum < 55) { // Порог темноты (зрачок)
            sx += (i/4) % 160;
            sy += Math.floor((i/4) / 160);
            n++;
        }
    }
    
    // Если пикселей слишком мало — глаз закрыт или не найден
    if (n < 15) return null; 
    
    ex = sx / n;
    ey = sy / n;
    return true;
}

// Главный цикл
function loop() {
    requestAnimationFrame(loop);
    if (step > 1) return; // Если откалибровано — стоп

    var p = findPupil();

    if (!p) {
        // Глаз закрыт
        closedFrames++;
    } else {
        // Глаз открыт
        if (closedFrames > 2) {
            // Было моргание
            var now = Date.now();
            if (now - lastBlinkTime < 600) {
                // Двойное моргание!
                fixPoint();
                lastBlinkTime = 0;
            } else {
                lastBlinkTime = now;
            }
        }
        closedFrames = 0;
    }
}

// Фиксация точки
function fixPoint() {
    if (step === 0) {
        cal.top = { x: ex, y: ey };
        dotTop.style.display = 'none';
        
        // Переход на нижнюю
        dotBottom.style.display = 'block';
        h.textContent = 'Смотри на НИЖНЮЮ точку';
        step = 1;
    } 
    else if (step === 1) {
        cal.bottom = { x: ex, y: ey };
        dotBottom.style.display = 'none';
        
        // Готово
        h.textContent = 'Готово! Калибровка завершена.';
        step = 2;
        
        // Сохраняем данные
        localStorage.setItem('eyeCalibration', JSON.stringify(cal));
        console.log('Сохранено:', cal);
    }
}
