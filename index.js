// Check if user has visited before
// Show loader animation on every page load
setTimeout(() => {
  let loader = document.getElementById("loader");
  loader.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
  loader.style.transform = "translateX(+100vw)"; // Changed to move left to right
  loader.style.opacity = "0"; // Fade out
  loader.style.borderRadius = "999px";

  setTimeout(() => {
    loader.style.display = "none";
  }, 800);
}, 4000);

const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
