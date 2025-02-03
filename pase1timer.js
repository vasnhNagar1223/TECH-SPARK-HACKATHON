function startPhase1Timer() {
  const phase1Date = new Date("Feb 12, 2025 00:00:00").getTime();

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
