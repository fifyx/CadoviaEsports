let matches = [];
let currentIndex = 0;

const dateDisplay = document.getElementById("dateDisplay");
const prevBtn = document.getElementById("prevDate");
const nextBtn = document.getElementById("nextDate");

document.addEventListener("DOMContentLoaded", () => {
  fetch("matches.json")
    .then(res => res.json())
    .then(data => {
      matches = data.reverse(); // najnowsze daty pierwsze
      updateMatch();
    });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateMatch();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < matches.length - 1) {
      currentIndex++;
      updateMatch();
    }
  });
});

function updateMatch() {
  const match = matches[currentIndex];
  dateDisplay.textContent = match.display;

  const playersDivs = document.querySelectorAll(".player");

  playersDivs.forEach((div, i) => {
    const player = match.players[i];

    // aktualizacja role, nickname i imię
    div.querySelector(".role").textContent = player.role || "";
    div.querySelector(".nickname").textContent = `"${player.nickname}"`;
    div.querySelector(".name").textContent = player.name;

    // aktualizacja statystyk
    const statsDiv = div.querySelector(".stats, .stats-row");
    statsDiv.innerHTML = "";

    let statsToShow = {};
    if (player.role === "NOOB") statsToShow = { RATING: player.stats.RATING };
    else if (player.role === "BEST PLAYER") statsToShow = {
      ADR: player.stats.ADR,
      RATING: player.stats.RATING,
      KILLS: player.stats.KILLS
    };
    else if (player.role === "AIM BEAST") statsToShow = {
      "HEADSHOT %": player.stats["HEADSHOT %"],
      KILLS: player.stats.KILLS
    };
    else statsToShow = player.stats;

    if (statsDiv.classList.contains("stats-row")) {
      for (const key in statsToShow) {
        const val = statsToShow[key];
        const statBlock = document.createElement("div");
        statBlock.innerHTML = `<p>${key}</p><span>${val}</span>`;
        statsDiv.appendChild(statBlock);
      }
    } else {
      for (const key in statsToShow) {
        const val = statsToShow[key];
        statsDiv.innerHTML += `<p>${key}</p><span>${val}</span>`;
      }
    }

    // zdjęcie dla każdego gracza
    const placeholder = div.querySelector(".image-placeholder");
    placeholder.innerHTML = ""; // usuń stare

    // nazwa pliku odpowiada dokładnie imieniu
    const fileName = player.name
      .replace(/ /g, "_")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const img = document.createElement("img");
    img.src = `assets/images/${fileName}.jpg`;
    img.alt = player.name;
    placeholder.appendChild(img);
  });
}