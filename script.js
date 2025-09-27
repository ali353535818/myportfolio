// Typing rotator (simple)
document.addEventListener("DOMContentLoaded", () => {
  // typing
  const el = document.querySelector(".typing");
  if (el) {
    const words = JSON.parse(el.getAttribute("data-words"));
    let w = 0, i = 0, deleting = false;
    const tick = () => {
      const word = words[w];
      if (!deleting) {
        el.textContent = word.slice(0, ++i);
        if (i === word.length) { deleting = true; setTimeout(tick, 900); return; }
      } else {
        el.textContent = word.slice(0, --i);
        if (i === 0) { deleting = false; w = (w+1) % words.length; }
      }
      setTimeout(tick, deleting ? 60 : 90);
    };
    tick();
  }

  // reveal on scroll
  const reveal = () => {
    document.querySelectorAll('.reveal').forEach(el=>{
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 80) el.classList.add('active');
    });
  };
  window.addEventListener('scroll', reveal);
  reveal();

  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // simple contact form behavior (mock)
  const form = document.getElementById('contact-form');
  const sendBtn = document.getElementById('send-btn');
  const clearBtn = document.getElementById('clear-btn');
  const formMsg = document.getElementById('form-msg');

  sendBtn.addEventListener('click', ()=>{
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if(!name||!email||!message){ formMsg.textContent = "Please fill all fields."; return; }
    formMsg.textContent = "Message sent! I'll reply soon. (This is demo mode.)";
    // Here you can integrate EmailJS or your backend
    form.reset();
  });
  clearBtn.addEventListener('click', ()=>{ form.reset(); formMsg.textContent = ""; });

  // Availability toggle
  const hireBtn = document.getElementById('toggle-hire');
  let available = true;
  hireBtn.addEventListener('click', ()=>{
    available = !available;
    hireBtn.textContent = available ? "I'm available" : "Currently not available";
    hireBtn.classList.toggle('btn-outline');
    // If not available, we highlight the "not hiring" block to encourage alternate actions
    document.getElementById('not-hiring-space').style.boxShadow = available ? 'none' : '0 10px 30px rgba(0,0,0,0.6)';
  });

  // 3D cube interactivity (mouse drag + hover)
  const cube = document.getElementById('cube');
  let dragging = false, lastX=0, lastY=0, rotX= -20, rotY= -20;
  const apply = ()=> cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  apply();
  document.querySelector('.cube-wrap').addEventListener('pointerdown', (e)=>{
    dragging = true; lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener('pointermove', (e)=>{
    if(!dragging) return;
    const dx = e.clientX - lastX; const dy = e.clientY - lastY;
    rotY += dx * 0.3; rotX -= dy * 0.3;
    rotX = Math.max(Math.min(rotX, 45), -45);
    apply(); lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener('pointerup', ()=> dragging = false);
  // gentle auto rotate when not interacting
  let autoAng = 0;
  setInterval(()=> {
    if (dragging) return;
    autoAng += 0.3;
    rotY = -20 + Math.sin(autoAng/20)*6;
    rotX = -20 + Math.cos(autoAng/30)*4;
    apply();
  }, 60);

  // Basic tilt effect on project cards for 3D feel
  document.querySelectorAll('.proj-card').forEach(card=>{
    card.addEventListener('pointermove', e=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotY = (px - 0.5) * 12; const rotX = (py - 0.5) * -8;
      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('pointerleave', ()=> card.style.transform = '');
  });

  // hamburger for mobile (simple)
  document.querySelector('.hamburger').addEventListener('click', ()=>{
    const nav = document.querySelector('.nav-links');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });
});
