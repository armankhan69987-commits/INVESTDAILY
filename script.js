const music = document.getElementById('bgMusic');
const toggleBtn = document.getElementById('musicToggle');

// Initial state: music paused
let musicPlaying = false;

// Start music on first user interaction
document.body.addEventListener('click', () => {
  if (!musicPlaying) {
    music.play().then(() => {
      musicPlaying = true;
      toggleBtn.textContent = '🔊';
    }).catch(err => {
      console.log("Autoplay blocked:", err);
    });
  }
});

// Toggle music manually
toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (music.paused) {
    music.play();
    toggleBtn.textContent = '🔊';
  } else {
    music.pause();
    toggleBtn.textContent = '🔈';
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
