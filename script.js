const music = document.getElementById('bgMusic');
const toggleBtn = document.getElementById('musicToggle');

// Initial state: music paused
let musicPlaying = false;
let isToggling = false; // fast double-click रोकने के लिए

// Start music on first user interaction (body click)
document.body.addEventListener('click', async () => {
  if (!musicPlaying && !isToggling) {
    isToggling = true;
    try {
      await music.play();
      musicPlaying = true;
      toggleBtn.textContent = '🔊';
    } catch (err) {
      if (err.name !== "AbortError") {
        console.log("Autoplay blocked:", err);
      }
    } finally {
      setTimeout(() => isToggling = false, 300); // debounce
    }
  }
}, { once: true });

// Toggle music manually
toggleBtn.addEventListener('click', async (e) => {
  e.stopPropagation();
  if (isToggling) return; // Ignore rapid clicks
  isToggling = true;

  try {
    if (music.paused) {
      await music.play();
      toggleBtn.textContent = '🔊';
      musicPlaying = true;
    } else {
      music.pause();
      toggleBtn.textContent = '🔈';
      musicPlaying = false;
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Play failed:", err);
    }
  } finally {
    setTimeout(() => isToggling = false, 300);
  }
});

// Show main content after animation
setTimeout(() => {
  const animText = document.getElementById('animateText');
  animText.style.display = 'none';

  const mainContent = document.getElementById('mainContent');
  mainContent.classList.remove('hidden');
  mainContent.style.opacity = 1;
}, 4500);
