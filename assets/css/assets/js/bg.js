(function () {
  const c = document.getElementById('bg');
  if (!c) return;
  const ctx = c.getContext('2d');
  let w, h, points;

  function resize() {
    w = c.width = c.offsetWidth;
    h = c.height = c.offsetHeight;
    points = Array.from({ length: Math.max(60, Math.round((w*h)/30000)) }, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()*2-1)*0.25,
      vy: (Math.random()*2-1)*0.25
    }));
  }

  function step() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (const p of points) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2);
      ctx.fill();
    }
    for (let i=0;i<points.length;i++){
      for (let j=i+1;j<points.length;j++){
        const a = points[i], b = points[j];
        const dx = a.x-b.x, dy = a.y-b.y, d2 = dx*dx + dy*dy;
        if (d2 < 130*130) {
          const alpha = 1 - (Math.sqrt(d2)/130);
          ctx.strokeStyle = `rgba(140,190,255,${alpha*0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize(); step();
})();
