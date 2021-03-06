window.onload = function () {
    if(window.innerWidth<1080){
        return
    }
    var div = document.createElement('div')
    div.style.background = 'url("../assets/img/background2.jpg") no-repeat';
    div.style.backgroundSize = 'cover';
    div.style.width = window.innerWidth+'px';
    div.style.height = window.innerHeight+'px';
    document.body.appendChild(div);

    var width, height, largeHeader, canvas, ctx, circles, target, animateHeader = true;
    // Main
    initHeader();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: 0, y: height};
        // largeHeader = document.getElementById('large-header');
        // largeHeader.style.height = height+'px';
        canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.bottom='0';
        canvas.style.left='0'
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        // create particles
        circles = [];
        for(var x = 0; x < width*0.5; x++) {
            var c = new Circle();
            circles.push(c);
        }
        animate();
        document.body.appendChild(canvas)
    }
    // Event handling
    function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }
    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        div.style.width = window.innerWidth+'px';
        div.style.height = window.innerHeight+'px';
        canvas.width = width;
        canvas.height = height;
    }
    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in circles) {
                circles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }
    function Circle() {
        var _this = this;
        // constructor
        (function() {
            _this.pos = {};
            init();
        })();

        function init() {
            _this.pos.x = Math.random()*width;
            _this.pos.y = height+Math.random()*100;
            _this.alpha = 0.1+Math.random()*0.3;
            _this.scale = 0.1+Math.random()*0.3;
            _this.velocity = Math.random();
        }

        this.draw = function() {
            if(_this.alpha <= 0) {
                init();
            }
            _this.pos.y -= _this.velocity;
            _this.alpha -= 0.0005;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.scale*12, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
            ctx.fill();
        };
    }


}