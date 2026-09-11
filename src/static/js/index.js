let app = (function () {
    let canvas = document.getElementById('gameCanvas');
    let ctx = canvas.getContext('2d');
   
    drawRectangle(50, 50, 10, 10, 'black');

    function drawRectangle(x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
})();

app;