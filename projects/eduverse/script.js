// ================== PAGE LOADER ==================
window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  loader.style.display = "none";
});

// ================== THEME TOGGLE ==================
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
});

// ================== BACK TO TOP ==================
const backTop = document.getElementById("back-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backTop.style.display = "block";
  } else {
    backTop.style.display = "none";
  }
});
backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ================== FOOTER YEAR ==================
document.getElementById("year").textContent = new Date().getFullYear();

// ================== COURSE DATA ==================
const courses = [
  { title: "React Frontend", desc: "Build modern UIs", category: "Tech", price: 99, popularity: 5, duration: "20h" },
  { title: "UI/UX Design", desc: "Design beautiful apps", category: "Design", price: 59, popularity: 4, duration: "15h" },
  { title: "Business Strategy", desc: "Plan and execute", category: "Business", price: 120, popularity: 3, duration: "12h" },
  { title: "JavaScript Mastery", desc: "Deep dive into JS", category: "Tech", price: 80, popularity: 5, duration: "25h" },
  { title: "Graphic Design", desc: "Master Photoshop & Illustrator", category: "Design", price: 70, popularity: 4, duration: "18h" }
];

const grid = document.getElementById("grid");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const sortSelect = document.getElementById("sort-select");
const noResults = document.getElementById("no-results");

// ================== RENDER COURSES ==================
function renderCourses() {
  grid.innerHTML = "";
  let filtered = courses.filter(c => 
    c.title.toLowerCase().includes(searchInput.value.toLowerCase()) &&
    (categorySelect.value === "all" || c.category === categorySelect.value)
  );

  if (sortSelect.value === "price-asc") filtered.sort((a,b)=>a.price-b.price);
  if (sortSelect.value === "price-desc") filtered.sort((a,b)=>b.price-a.price);
  if (sortSelect.value === "pop") filtered.sort((a,b)=>b.popularity-a.popularity);

  if (filtered.length === 0) {
    noResults.style.display = "block";
    return;
  } else {
    noResults.style.display = "none";
  }

  filtered.forEach(course => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.desc}</p>
      <div class="meta">
        <span class="chip">${course.duration}</span>
        <span class="chip">${course.category}</span>
        <span class="chip">$${course.price}</span>
      </div>
      <div class="actions">
        <button class="btn small enroll-btn">Enroll</button>
        <button class="btn small outline wishlist-btn">Wishlist</button>
      </div>
    `;
    grid.appendChild(card);
  });

  attachCourseEvents();
}
renderCourses();

// ================== FILTER EVENTS ==================
searchInput.addEventListener("input", renderCourses);
categorySelect.addEventListener("change", renderCourses);
sortSelect.addEventListener("change", renderCourses);

// ================== DASHBOARD ==================
const openDash = document.getElementById("open-dashboard");
const closeDash = document.getElementById("close-dashboard");
const dashboard = document.getElementById("dashboard");
const enrolledList = document.getElementById("enrolled-list");
const wishlist = document.getElementById("wishlist");

openDash.addEventListener("click", () => dashboard.classList.add("open"));
closeDash.addEventListener("click", () => dashboard.classList.remove("open"));

// ================== ENROLL MODAL ==================
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalConfirm = document.getElementById("modal-confirm");
const modalCancel = document.getElementById("modal-cancel");
const modalClose = document.getElementById("modal-close");

let currentCourse = null;
function attachCourseEvents() {
  document.querySelectorAll(".enroll-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      currentCourse = e.target.closest(".card").querySelector("h3").textContent;
      modalTitle.textContent = "Confirm Enrollment";
      modalBody.textContent = `Do you want to enroll in "${currentCourse}"?`;
      modal.classList.add("active");
    });
  });

  document.querySelectorAll(".wishlist-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const courseName = e.target.closest(".card").querySelector("h3").textContent;
      const li = document.createElement("li");
      li.textContent = courseName;
      wishlist.appendChild(li);
    });
  });
}
modalConfirm.addEventListener("click", () => {
  const li = document.createElement("li");
  li.textContent = currentCourse;
  enrolledList.appendChild(li);
  modal.classList.remove("active");
});
[modalCancel, modalClose].forEach(el =>
  el.addEventListener("click", () => modal.classList.remove("active"))
);
