// APEX Lab — shared page script (kept intentionally tiny)

// 1) Auto-update the copyright year in the footer
document.addEventListener("DOMContentLoaded", function () {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // 2) Start the gallery lightbox (only runs on pages that have one)
  if (window.GLightbox && document.querySelector(".glightbox")) {
    GLightbox({ selector: ".glightbox" });
  }

  // 2b) Carousel pause/play control (only runs on the homepage)
  var carouselEl = document.getElementById("heroCarousel");
  var pauseToggle = document.getElementById("carouselPauseToggle");
  if (carouselEl && pauseToggle && window.bootstrap) {
    var carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
    var pauseIcon = pauseToggle.querySelector(".icon-pause");
    var playIcon = pauseToggle.querySelector(".icon-play");

    // If the user's system prefers reduced motion, start paused rather
    // than auto-advancing and making them find the button first.
    var isPlaying = !(window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (!isPlaying) carousel.pause();

    var updateButton = function () {
      pauseToggle.setAttribute("aria-label", isPlaying ? "Pause carousel" : "Play carousel");
      pauseIcon.style.display = isPlaying ? "" : "none";
      playIcon.style.display = isPlaying ? "none" : "";
    };
    updateButton();

    pauseToggle.addEventListener("click", function () {
      if (isPlaying) {
        carousel.pause();
      } else {
        carousel.cycle();
      }
      isPlaying = !isPlaying;
      updateButton();
    });
  }

  // 3) Sidebar: highlight the link for the section currently on screen
  //    (runs on any page that has a .side-nav — People and Research)
  var sideNav = document.querySelector(".side-nav");
  if (sideNav) {
    var links = [];
    var sections = [];
    sideNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (target) { links.push(link); sections.push(target); }
    });

    var highlight = function () {
      var offset = 110; // roughly the sticky navbar height + breathing room
      var currentIndex = 0;
      sections.forEach(function (sec, i) {
        if (sec.getBoundingClientRect().top <= offset) currentIndex = i;
      });

      // Edge case: if we're at (or near) the bottom of the page, the last
      // section may be too short to ever reach the trigger line — select it.
      var nearBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 5;
      if (nearBottom) currentIndex = sections.length - 1;

      links.forEach(function (link, i) {
        var isCurrent = i === currentIndex;
        link.classList.toggle("active", isCurrent);
        // Also tell screen readers which section is current, not just sighted users
        if (isCurrent) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };

    document.addEventListener("scroll", highlight, { passive: true });
    highlight(); // set the right link on page load too
  }
});