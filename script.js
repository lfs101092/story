window.onload = function() {
    var h = document.getElementById('h');
    var startX = 0;
    var startY = 0;

    // Ловим касание экрана
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, false);

    // Ловим отпускание пальца
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;

        var endX = e.changedTouches[0].clientX;
        var endY = e.changedTouches[0].clientY;

        var diffX = endX - startX;
        var diffY = endY - startY;

        // Проверяем, что свайп был именно горизонтальным (минимум 50px)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            
            if (diffX > 0) {
                // Свайп вправо
                h.textContent = 'Выбрано: ВПРАВО';
                h.style.color = '#0f0';
                console.log('Игрок свайпнул вправо');
                // Тут будет переход на видео правой ветки
            } else {
                // Свайп влево
                h.textContent = 'Выбрано: ВЛЕВО';
                h.style.color = '#f00';
                console.log('Игрок свайпнул влево');
                // Тут будет переход на видео левой ветки
            }
            
            // Сброс, чтобы не срабатывало дважды
            startX = 0; 
            startY = 0;
        }
    }, false);
    
    // Для теста на компьютере (мышкой)
    document.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        startY = e.clientY;
    });
    
    document.addEventListener('mouseup', function(e) {
        if (!startX || !startY) return;
        var diffX = e.clientX - startX;
        var diffY = e.clientY - startY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) { h.textContent = 'Выбрано: ВПРАВО'; h.style.color = '#0f0'; }
            else { h.textContent = 'Выбрано: ВЛЕВО'; h.style.color = '#f00'; }
            startX = 0; startY = 0;
        }
    });
};
