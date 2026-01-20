document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".reviews-cards");
  if (!container) return;

  const cards = Array.from(container.querySelectorAll(".reviews-card"));
  const prevBtn = document.querySelector(".pre-arrow");
  const nextBtn = document.querySelector(".next-arrow");

  let currentIndex = 0;

  function clamp(i) {
    return Math.max(0, Math.min(i, cards.length - 1));
  }
  
  let initialized = false;

  function showCard(i, smooth = true) {
    if (!initialized && smooth) return;

    i = clamp(i);
    const card = cards[i];
    if (!card) return;

    const cardLeft = card.offsetLeft;
    const scrollLeft =
      cardLeft - (container.clientWidth - card.clientWidth) / 2;

    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: smooth ? "smooth" : "auto",
    });

    currentIndex = i;
    updateButtons();
  }

  setTimeout(() => {
    initialized = true;
    showCard(0, false);
  }, 50);

  function updateButtons() {
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < cards.length - 1;

    if (prevBtn) {
      prevBtn.classList.toggle("active", hasPrev);
      prevBtn.classList.toggle("disabled", !hasPrev);
      prevBtn.style.opacity = hasPrev ? "1" : "0.4";
    }

    if (nextBtn) {
      nextBtn.classList.toggle("active", hasNext);
      nextBtn.classList.toggle("disabled", !hasNext);
      nextBtn.style.opacity = hasNext ? "1" : "0.4";
    }
  }

  prevBtn?.addEventListener("click", () => {
    showCard(currentIndex - 1);
  });

  nextBtn?.addEventListener("click", () => {
    showCard(currentIndex + 1);
  });

  // Re-center current card on resize
  window.addEventListener("resize", function () {
    showCard(currentIndex, false);
  });

  // Update current index while user scrolls (keeps buttons state in sync)
  let scrollTick;
  container.addEventListener(
    "scroll",
    function () {
      if (scrollTick) return;
      scrollTick = requestAnimationFrame(function () {
        let nearestIndex = 0;
        let nearestDistance = Infinity;
        const containerCenter =
          container.scrollLeft + container.clientWidth / 2;
        cards.forEach(function (c, idx) {
          const cCenter = c.offsetLeft + c.clientWidth / 2;
          const dist = Math.abs(cCenter - containerCenter);
          if (dist < nearestDistance) {
            nearestDistance = dist;
            nearestIndex = idx;
          }
        });
        currentIndex = nearestIndex;
        updateButtons();
        scrollTick = null;
      });
    },
    { passive: true },
  );
});
