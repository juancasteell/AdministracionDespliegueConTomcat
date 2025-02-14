let monsters = [];
let filteredMonsters = [];
const searchInput = document.getElementById("searchInput");
const monsterList = document.getElementById("monsterList");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
const monstersPerPage = 3;

// Fetch monster data
fetch("/assets/json/monsters.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    monsters = data;
    filteredMonsters = [...monsters];
    updateCarousel();
  })
  .catch((error) => {
    console.error("Error:", error);
    monsterList.innerHTML = `<p>Error cargando datos.</p>`;
  });

function createMonsterCard(monster) {
  const card = document.createElement("div");
  card.className = "monster-card";
  card.innerHTML = `
        <h3>${monster.name}</h3>
        <img src="${monster.render || "/placeholder.svg"}" alt="${
    monster.name
  }">
        <p><strong>Especie:</strong> ${monster.species || "Unknown"}</p>
        <p><strong>Elementos:</strong> ${
          monster.elements && monster.elements.length
            ? monster.elements.join(", ")
            : "None"
        }</p>
        <p><strong>Dolencias:</strong> ${
          monster.ailments && monster.ailments.length
            ? monster.ailments.join(", ")
            : "None"
        }</p>
    `;
  card.addEventListener("click", () => showPopup(monster));
  return card;
}

function showPopup(monster) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
    <div class="popup-content">
      <span class="close-btn">&times;</span>
      <img src="${monster.render || "/placeholder.svg"}" alt="${monster.name}">
      <h2>${monster.name}</h2>
    </div>
  `;
  document.body.appendChild(popup);

  const closeBtn = popup.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(popup);
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      document.body.removeChild(popup);
    }
  });
}

function displayMonsters() {
  monsterList.innerHTML = "";
  const startIndex = currentIndex;
  const endIndex = Math.min(
    startIndex + monstersPerPage,
    filteredMonsters.length
  );

  for (let i = startIndex; i < endIndex; i++) {
    monsterList.appendChild(createMonsterCard(filteredMonsters[i]));
  }
}

function updateCarousel() {
  displayMonsters();
  updateCarouselPosition();
  updateButtonStates();
}

function updateCarouselPosition() {
  const cardWidth = monsterList.offsetWidth / monstersPerPage;
  monsterList.style.transform = `translateX(0)`;
}

function updateButtonStates() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= filteredMonsters.length - monstersPerPage;
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex -= monstersPerPage;
    updateCarousel();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < filteredMonsters.length - monstersPerPage) {
    currentIndex += monstersPerPage;
    updateCarousel();
  }
});

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(searchTerm)
  );
  currentIndex = 0;
  updateCarousel();
});

// Update carousel on window resize
window.addEventListener("resize", updateCarousel);
