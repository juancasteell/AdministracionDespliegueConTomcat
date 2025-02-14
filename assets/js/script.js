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
  card.innerHTML = `
        <h3>${monster.name}</h3>
        <img src="${monster.render || "/placeholder.svg"}" alt="${
    monster.name
  }">
        <p><strong>Especie:</strong> ${monster.species}</p>
        <p><strong>Elementos:</strong> ${
          monster.elements.join(", ") || "None"
        }</p>
        <p><strong>Dolencias:</strong> ${
          monster.ailments.join(", ") || "None"
        }</p>
    `;
  return card;
}

function displayMonsters(startIndex, endIndex) {
  monsterList.innerHTML = "";
  for (let i = startIndex; i < endIndex && i < monsters.length; i++) {
    monsterList.appendChild(createMonsterCard(monsters[i]));
  }
}

function updateCarousel() {
  displayMonsters(currentIndex, currentIndex + monstersPerPage);
}

prevBtn.addEventListener("click", () => {
  currentIndex = Math.max(0, currentIndex - monstersPerPage);
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  currentIndex = Math.min(
    monsters.length - monstersPerPage,
    currentIndex + monstersPerPage
  );
  updateCarousel();
});

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(searchTerm)
  );
  monsterList.innerHTML = "";
  filteredMonsters.forEach((monster) => {
    monsterList.appendChild(createMonsterCard(monster));
  });
});
