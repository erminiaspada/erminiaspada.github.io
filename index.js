(function(){
    const container = document.querySelector('.canva__draw-area');
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let isDrawing = false;
    let last = {x:0,y:0};
    let strokeColor = '#3D0093';
    let strokeSize = 2;

    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        ctx.setTransform(window.devicePixelRatio,0,0,window.devicePixelRatio,0,0);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0,0,canvas.width,canvas.height); // sfondo bianco
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function getPos(e){
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top)
        };
    }

    function startDraw(e){
        isDrawing = true;
        const p = getPos(e);
        last = p;
        drawDot(p.x,p.y);
    }

    function draw(e){
        if(!isDrawing) return;
        const p = getPos(e);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeSize;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(last.x,last.y);
        ctx.lineTo(p.x,p.y);
        ctx.stroke();
        last = p;
    }

    function endDraw()
    {
        isDrawing = false;
    }

    function drawDot(x,y){
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(x,y,strokeSize/2,0,Math.PI*2);
        ctx.fill();
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', endDraw);

    canvas.addEventListener('touchstart', (e)=>{ e.preventDefault(); startDraw(e.touches[0]); });
    canvas.addEventListener('touchmove', (e)=>{ e.preventDefault(); draw(e.touches[0]); });
    canvas.addEventListener('touchend', endDraw);

    window.downloadDrawing = function(){
        canvas.toBlob(blob=>{
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'disegno.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // 🚀 Invio con EmailJS
    window.sendDrawingByEmail = async function(){
        // estrai il base64
        const dataUrl = canvas.toDataURL('image/png');

        const payload = {
            service_id: "service_lkhvtq3",   // il tuo service ID
            template_id: "template_sjwab8k", // il tuo template ID
            user_id: "c913GWeyyPGiOyy9O",    // il tuo public key
            template_params: {
                title: "Disegno dal portfolio",
                username: "Erminia",
                message: dataUrl // immagine in base64
            }
        };

        try {
            const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if(res.ok){
                alert("Email inviata con successo 🎉");
            } else {
                const err = await res.text();
                console.error("Errore:", err);
                alert("Errore durante l'invio dell'email");
            }
        } catch(e){
            console.error("Exception:", e);
            alert("Eccezione durante l'invio");
        }
    }
})();