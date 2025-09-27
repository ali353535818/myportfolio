// Basic interactive behaviors for TravelHub template
document.addEventListener('DOMContentLoaded', () => {
  // Reveal on scroll
  const reveal = () => document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('active');
  });
  window.addEventListener('scroll', reveal);
  reveal();

  // Toggle advanced filters
  const openFilters = document.getElementById('open-filters');
  const adv = document.getElementById('advanced-filters');
  openFilters && openFilters.addEventListener('click', ()=> {
    adv.style.display = adv.style.display === 'block' ? 'none' : 'block';
  });

  // Category chips filter
  const chips = document.querySelectorAll('.chip');
  let activeCategory = 'all';
  chips.forEach(c=>{
    c.addEventListener('click', ()=>{
      chips.forEach(x=>x.classList.remove('active'));
      c.classList.add('active');
      activeCategory = c.dataset.cat;
      applyFilters();
    });
  });

  // Price range
  const priceRange = document.getElementById('price-range');
  const priceVal = document.getElementById('price-val');
  priceRange && priceRange.addEventListener('input', () => {
    priceVal.textContent = `$200 - $${priceRange.value}`;
    applyFilters();
  });

  // Sorting
  const sortSelect = document.getElementById('sort-select');
  sortSelect && sortSelect.addEventListener('change', ()=> applyFilters());

  // Search input (from hero)
  const searchInput = document.getElementById('search-dest');

  // Filter function (category + price + sort + text search)
  function applyFilters(){
    const cards = Array.from(document.querySelectorAll('#cards .card'));
    const maxPrice = Number(priceRange?.value || 5000);
    const q = (searchInput?.value || '').toLowerCase().trim();

    const filtered = cards.filter(card => {
      const cat = card.dataset.cat || 'all';
      const price = Number(card.dataset.price || 0);

      // Category check
      if(activeCategory !== 'all' && cat !== activeCategory) return false;

      // Price check
      if(price > maxPrice) return false;

      // Text search (destination name)
      if(q){
        const nameEl = card.querySelector('h3');
        const name = nameEl ? nameEl.textContent.toLowerCase() : '';
        if(!name.includes(q)) return false;
      }

      return true;
    });

    // Sorting - keep numeric compare
    const sort = sortSelect?.value || 'pop';
    if(sort === 'price-asc') filtered.sort((a,b)=> Number(a.dataset.price) - Number(b.dataset.price));
    if(sort === 'price-desc') filtered.sort((a,b)=> Number(b.dataset.price) - Number(a.dataset.price));

    // Update DOM: empty and append filtered in order
    const grid = document.getElementById('cards');
    if(!grid) return;
    grid.innerHTML = '';
    filtered.forEach(c => grid.appendChild(c));

    // Update counts
    document.getElementById('visible-count').textContent = filtered.length;
    document.getElementById('total-count').textContent = cards.length;
    document.getElementById('result-count').textContent = filtered.length;
  }

  // Initial counts
  const initialCards = document.querySelectorAll('#cards .card').length;
  document.getElementById('total-count').textContent = initialCards;
  document.getElementById('visible-count').textContent = initialCards;
  document.getElementById('result-count').textContent = initialCards;

  // Bind search form submit to unified filter (prevents page reload)
  const searchForm = document.getElementById('search-form');
  searchForm && searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    applyFilters();
  });

  // Booking form behavior & summary
  const bookingForm = document.getElementById('booking-form');
  bookingForm && bookingForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('b-name').value.trim();
    const email = document.getElementById('b-email').value.trim();
    const dest = document.getElementById('b-dest').value;
    const date = document.getElementById('b-date').value;
    const guests = document.getElementById('b-guests').value || 1;
    if(!name || !email || !dest || !date){ document.getElementById('booking-msg').textContent = 'Please fill required fields.'; return; }
    // Simple "mock" booking response
    const summary = document.getElementById('summary-content');
    summary.innerHTML = `
      <h4>${dest}</h4>
      <p><strong>Traveler:</strong> ${name}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Guests:</strong> ${guests}</p>
      <p class="muted">Price estimate: <strong>$${estimatePrice(dest)}</strong></p>
      <p class="muted">A confirmation email will be sent to <strong>${email}</strong> (demo mode).</p>
    `;
    document.getElementById('booking-msg').textContent = 'Booking confirmed (demo). Check the summary.';
    bookingForm.reset();
  });

  // Clear booking
  document.getElementById('clear-book')?.addEventListener('click', ()=>{
    bookingForm.reset();
    document.getElementById('booking-msg').textContent = '';
    document.getElementById('summary-content').innerHTML = '<p class="muted">No selection yet — fill the form.</p>';
  });

  // Estimate (very simple)
  function estimatePrice(dest){
    const map = { 'Maldives':899, 'Paris':1099, 'Dubai':999, 'Swiss Alps':699, 'Bali':799, 'Istanbul':499 };
    return map[dest] || Math.floor(Math.random()*900)+300;
  }

  // Testimonials slider
  const tTrack = document.getElementById('t-track');
  const items = tTrack ? tTrack.querySelectorAll('.t-item').length : 0;
  let tIndex = 0;
  const updateT = ()=> { if(tTrack) tTrack.style.transform = `translateX(-${tIndex * 100}%)`; };
  if(document.getElementById('next')) {
    document.getElementById('next').addEventListener('click', ()=>{ tIndex = (tIndex+1) % items; updateT(); });
  }
  if(document.getElementById('prev')) {
    document.getElementById('prev').addEventListener('click', ()=>{ tIndex = (tIndex-1+items) % items; updateT(); });
  }
  // auto rotate (only if there are items)
  if(items > 0) setInterval(()=>{ tIndex = (tIndex+1) % items; updateT(); }, 6000);

  // Newsletter mock
  document.getElementById('newsletter-form')?.addEventListener('submit', e=>{
    e.preventDefault();
    const em = document.getElementById('nl-email').value.trim();
    if(!em){ document.getElementById('nl-msg').textContent = 'Enter a valid email.'; return; }
    document.getElementById('nl-msg').textContent = 'Subscribed! (demo)';
    e.target.reset();
  });

  // Small card tilt effect for 3D feel
  document.querySelectorAll('.card, .dest-card').forEach(el=>{
    el.addEventListener('pointermove', e=>{
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotY = (px - 0.5) * 10; const rotX = (py - 0.5) * -6;
      el.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    el.addEventListener('pointerleave', ()=> el.style.transform = '');
  });

  // set year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // run initial filter to ensure UI is consistent
  applyFilters();
});
