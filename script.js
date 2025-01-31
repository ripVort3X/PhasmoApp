// Evidence and Ghost Data
const evidenceTypes = [
  "EMF Level 5",
  "Spirit Box",
  "Freezing Temps",
  "Ghost Writing",
  "Fingerprints",
  "Ghost Orb",
  "DOTS Projector",
];

// Map JSON evidence names to your UI names
const evidenceNameMap = {
  "EMF 5": "EMF Level 5",
  "Freezing Temperatures": "Freezing Temps",
  "D.O.T.S Projector": "DOTS Projector",
};

let ghosts = [];
let selectedEvidence = [];
let currentPage = 1; // Initialize currentPage before filterGhosts is called
const ghostsPerPage = 5;

// Fetch ghost data from JSON
fetch("../ghosts.json")
  .then((response) => response.json())
  .then((data) => {
    ghosts = data.map((ghost) => ({
      ...ghost,
      evidence: ghost.evidences.map(
        (evidence) => evidenceNameMap[evidence] || evidence
      ),
    }));
    filterGhosts(); // Initial filter after loading
    displayGhosts(ghosts, currentPage); // Display with pagination
  })
  .catch((error) => console.error("Error loading ghost data:", error));

// evidence list is getting populated in evidence.html
// Toggle Evidence Selection
function toggleEvidence(evidence) {
  const index = selectedEvidence.indexOf(evidence);
  if (index === -1) {
    selectedEvidence.push(evidence);
  } else {
    selectedEvidence.splice(index, 1);
  }
  updateEvidenceUI();
  filterGhosts();
}

// Update UI for Evidence
function updateEvidenceUI() {
  document.querySelectorAll(".evidence-item").forEach((item) => {
    if (selectedEvidence.includes(item.innerText)) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });
}

// Filter Ghosts Based on Evidence
function filterGhosts() {
  const possibleGhosts = ghosts.filter((ghost) =>
    selectedEvidence.every((evidence) => ghost.evidence.includes(evidence))
  );
  displayGhosts(possibleGhosts, currentPage); // Update displayed ghosts
}

// Reset Button
document.getElementById("reset-button").addEventListener("click", () => {
  selectedEvidence = [];
  updateEvidenceUI();
  filterGhosts();
});

// Display Ghosts with Pagination
function displayGhosts(filteredGhosts = ghosts, page = 1) {
  const guideContent = document.getElementById("guide-content");
  const startIndex = (page - 1) * ghostsPerPage;
  const endIndex = startIndex + ghostsPerPage;
  const paginatedGhosts = filteredGhosts.slice(startIndex, endIndex);

  guideContent.innerHTML = paginatedGhosts.length
    ? paginatedGhosts
        .map(
          (ghost) => `
            <div class="ghost-card">
              <h3>${ghost.name}</h3>
              <p>${ghost.description}</p>
              <div class="ghost-evidence">
                Evidence: ${ghost.evidence.join(", ")}
              </div>
              <div class="ghost-ability">
                Ability: ${ghost.ability}
              </div>
              <div class="ghost-weakness">
                Weakness: ${ghost.weakness}
              </div>
            </div>
          `
        )
        .join("")
    : "<p class='warning'>No ghosts match the selected evidence. Try unselecting some evidence.</p>";

  updatePagination(filteredGhosts.length, page);
}

// Pagination
function updatePagination(totalGhosts, currentPage) {
  const totalPages = Math.ceil(totalGhosts / ghostsPerPage);
  const pagination = document.getElementById("pagination");

  pagination.innerHTML = `
    <button onclick="changePage(${currentPage - 1})" ${
    currentPage === 1 ? "disabled" : ""
  }>Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button onclick="changePage(${currentPage + 1})" ${
    currentPage === totalPages ? "disabled" : ""
  }>Next</button>
  `;
}

function changePage(page) {
  const filteredGhosts = ghosts.filter((ghost) =>
    selectedEvidence.every((evidence) => ghost.evidence.includes(evidence))
  );
  if (page < 1 || page > Math.ceil(filteredGhosts.length / ghostsPerPage))
    return;
  currentPage = page;
  displayGhosts(filteredGhosts, page);
}
