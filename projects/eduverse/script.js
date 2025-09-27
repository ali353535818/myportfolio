// Loader
window.addEventListener("load", () => {
  document.getElementById("page-loader").style.display = "none";
});

// Mobile menu toggle
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navbar-links").classList.toggle("active");
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Courses Data
const courses = [
  { id: 1, title: "JavaScript Mastery", category: "Tech", price: 49, desc: "Learn JS from zero to hero", popular: true },
  { id: 2, title: "UI/UX Design Bootcamp", category: "Design", price: 59, desc: "Design user-friendly interfaces", popular: true },
  { id: 3, title: "Business Strategy 101", category: "Business", price: 39, desc: "Grow your business smartly", popular: false },
  { id: 4, title: "React.js Complete Guide", category: "Tech", price: 79, desc: "Build real-world apps with React", popular: true },
  { id: 5, title: "Photoshop Essentials", category: "Design", price: 29, desc: "Master photo editing basics", popular: false }
];

// DOM Elements
const grid = document.getElementById("grid");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const sortSelect = document.getElementById("sort-select");
const noResults = document.getElementById("no-results");

let enrolled = [];
let wishlist = [];

// Render Courses
function renderCourses() {
  grid.innerHTML = "";
  let filtered = courses.filter(c => 
    c.title.toLowerCase().includes(searchInput.value.toLowerCase()) &&
    (categorySelect.value === "all" || c.category === categorySelect.value)
  );

  if (sortSelect.value === "price-asc") filtered.sort((a,b) => a.price - b.price);
  if (sortSelect.value === "price-desc") filtered.sort((a,b) => b.price - a.price);

  if (filtered.length === 0) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
    filtered.forEach(c => {
      let div = document.createElement("div");
      div.className = "course-card";
      div.innerHTML = `
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <p><strong>Category:</strong> ${c.category}</p>
        <p><strong>Price:</strong> $${c.price}</p>
        <div class="actions">
          <button onclick="enroll(${c.id})" class="btn small">Enroll</button>
          <button onclick="addWishlist(${c.id})" class="btn outline small">♡ Wishlist</button>
        </div>
      `;
      grid.appendChild(div);
    });
  }
}

// Enroll
function enroll(id) {
  const course = courses.find(c => c.id === id);
  if (!enrolled.includes(course)) {
    enrolled.push(course);
    updateDashboard();
    alert(`Enrolled in ${course.title}`);
  }
}

// Wishlist
function addWishlist(id) {
  const course = courses.find(c => c.id === id);
  if (!wishlist.includes(course)) {
    wishlist.push(course);
    updateDashboard();
    alert(`${course.title} added to wishlist`);
  }
}

// Update Dashboard
function updateDashboard() {
  document.getElementById("enrolled-list").innerHTML = enrolled.map(c => `<li>${c.title}</li>`).join("");
  document.getElementById("wishlist").innerHTML = wishlist.map(c => `<li>${c.title}</li>`).join("");
}

// Dashboard drawer
document.getElementById("open-dashboard").onclick = () => document.getElementById("dashboard").classList.add("open");
document.getElementById("close-dashboard").onclick = () => document.getElementById("dashboard").classList.remove("open");

// Theme toggle
document.getElementById("theme-toggle").onclick = () => {
  document.body.classList.toggle("dark");
};

// Back to top
const backTop = document.getElementById("back-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) backTop.classList.add("show");
  else backTop.classList.remove("show");
});
backTop.onclick = () => window.scrollTo({top: 0, behavior: "smooth"});

// Filters
[searchInput, categorySelect, sortSelect].forEach(el => el.addEventListener("input", renderCourses));

// First render
renderCourses();

