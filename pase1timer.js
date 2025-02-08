function startPhase1Timer() {
  const phase1Date = new Date("Feb 15, 2025 00:00:00").getTime();

  const countdown = setInterval(function () {
    const now = new Date().getTime();
    const distance = phase1Date - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("timer1").innerHTML =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    if (distance < 0) {
      clearInterval(countdown);
      document.getElementById("timer1").innerHTML = "EXPIRED";
    }
  }, 1000);
}

startPhase1Timer();

// Create mouse follower element
const follower = document.createElement("div");
follower.style.cssText = `
  position: fixed;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  pointer-events: none;
  mix-blend-mode: difference;
  transition: transform 0.15s ease-out;
  z-index: 9999;
`;
document.body.appendChild(follower);

// Mouse movement handler
document.addEventListener("mousemove", (e) => {
  // Update follower position with transform for better performance
  follower.style.transform = `translate(${e.clientX - 20}px, ${
    e.clientY - 20
  }px)`;
});

// Handle mouse enter/leave on clickable elements
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    follower.style.transform += " scale(1.5)";
  });

  el.addEventListener("mouseleave", () => {
    follower.style.transform = follower.style.transform.replace(
      " scale(1.5)",
      ""
    );
  });
});

const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
