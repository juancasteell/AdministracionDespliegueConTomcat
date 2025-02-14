let monsters = [];
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
    updateCarousel();
  })
  .catch((error) => {
    console.error("Error:", error);
    monsterList.innerHTML = `<p>Error cargando datos.</p>`;
  });

function createMonsterCard(monster) {
  const card = document.createElement("div");
  card.className = "monster-card";
  let elementsText = "None";
  if (monster.elements && monster.elements.length) {
    elementsText = monster.elements.join(", ");
  }

  let ailmentsText = "None";
  if (monster.ailments && monster.ailments.length) {
    ailmentsText = monster.ailments.join(", ");
  }

  let renderSrc = "/placeholder.svg";
  if (monster.render) {
    renderSrc = monster.render;
  }

  card.innerHTML = `
        <h3>${monster.name}</h3>
        <img src="${renderSrc}" alt="${monster.name}">
        <p><strong>Especie:</strong> ${monster.species || "Unknown"}</p>
        <p><strong>Elementos:</strong> ${elementsText}</p>
        <p><strong>Dolencias:</strong> ${ailmentsText}</p>
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
  monsters.forEach((monster) => {
    monsterList.appendChild(createMonsterCard(monster));
  });
}

function updateCarousel() {
  displayMonsters();
  updateCarouselPosition();
  updateButtonStates();
}

function updateCarouselPosition() {
  const cardWidth = monsterList.offsetWidth / monstersPerPage;
  monsterList.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

function updateButtonStates() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= monsters.length - monstersPerPage;
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < monsters.length - monstersPerPage) {
    currentIndex++;
    updateCarousel();
  }
});

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(searchTerm)
  );
  currentIndex = 0;
  displayFilteredMonsters(filteredMonsters);
});

function displayFilteredMonsters(filteredMonsters) {
  monsterList.innerHTML = "";
  filteredMonsters.forEach((monster) => {
    monsterList.appendChild(createMonsterCard(monster));
  });
  updateButtonStates();
}

// Update carousel on window resize
window.addEventListener("resize", updateCarouselPosition);
