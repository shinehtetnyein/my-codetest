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

  // Email join handling: validate and show a small success/error toast
  const emailContainers = document.querySelectorAll('.email-input');
  if (emailContainers.length) {
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showToast(message, isError = false) {
      const toast = document.createElement('div');
      toast.textContent = message;
      Object.assign(toast.style, {
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: isError ? '90px' : '40px',
        background: isError ? '#f44336' : '#4caf50',
        color: '#fff',
        padding: '12px 18px',
        borderRadius: '6px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 200ms, transform 200ms',
      });
      document.body.appendChild(toast);
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(-4px)';
      });
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        setTimeout(() => toast.remove(), 250);
      }, 3000);
    }

    emailContainers.forEach((containerEl) => {
      const input = containerEl.querySelector('.email');
      const btn = containerEl.querySelector('.join-btn');
      if (!input || !btn) return;

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const email = (input.value || '').trim();
        if (!email) {
          showToast('Please enter your email', true);
          input.focus();
          return;
        }
        if (!validateEmail(email)) {
          showToast('Please enter a valid email address', true);
          input.focus();
          return;
        }

        // Simulate success (replace with actual submit if needed)
        showToast('Thanks — you joined successfully!');
        input.value = '';
      });
    });
  }
});
