const html = document.documentElement;
const btn = document.getElementById("themeToggle");
const sun = document.getElementById("sunIcon");
const moon = document.getElementById("moonIcon");

// initialize theme: prefer saved, else dark by default
let stored = localStorage.getItem("theme");
let prefer = stored ? stored : "dark";
setTheme(prefer);

function setTheme(mode) {
  if (mode === "dark") {
    html.classList.add("dark");
    moon.classList.remove("hidden");
    sun.classList.add("hidden");
  } else {
    html.classList.remove("dark");
    sun.classList.remove("hidden");
    moon.classList.add("hidden");
  }
  localStorage.setItem("theme", mode);
}

if (btn) {
  btn.addEventListener("click", () => {
    const next = html.classList.contains("dark") ? "light" : "dark";
    setTheme(next);
  });
}
