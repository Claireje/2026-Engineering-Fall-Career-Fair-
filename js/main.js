document.addEventListener("DOMContentLoaded", () => {
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQY2KBZyFcXi-2NzH4qrMux9GfhJcJosyRVx9cwWtvZ09bOUJIUbJ5aWBczFt0ZFfAr4_R0gv1LQmXe/pub?gid=1044588374&single=true&output=csv";

  const INITIAL_VISIBLE_COUNT = 3;

  let companies = [];
  let isExpanded = false;

  const companiesGrid = document.getElementById("companies-grid");
  const searchInput = document.getElementById("company-search");
  const timeFilter = document.getElementById("time-filter");
  const jobFilter = document.getElementById("job-type-filter");
  const companyCount = document.getElementById("company-count");
  const loadMoreBtn = document.getElementById("load-more-btn");
  const stickyWrapper = document.getElementById("sticky-btn-wrapper");

  function clean(value) {
    return value ? value.replace(/^"|"$/g, "").trim() : "";
  }

  function parseCSV(text) {
    const rows = text.trim().split("\n");

    return rows.slice(1).map(row => {
      const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];

      return {
        name: clean(values[0]),
        time: clean(values[1]),
        type: clean(values[2]),
        desc: clean(values[3]),
        logo: clean(values[4])
      };
    });
  }

  async function loadCompanies() {
    if (!companiesGrid) return;

    try {
      const response = await fetch(CSV_URL);
      const text = await response.text();

      companies = parseCSV(text);
      renderCompanies();
    } catch (error) {
      console.error("Error loading companies:", error);
    }
  }

  function renderCompanies() {
    companiesGrid.innerHTML = "";

    companies.forEach(company => {
      const cardHTML = `
        <article class="company-card">
          <div class="res-icon" style="background: #ffffff;">
            <img src="${company.logo.startsWith('http') ? company.logo : 'https://claireje.github.io/2026-Engineering-Fall-Career-Fair-/' + company.logo.replace(/^\//, '')}" alt="${company.name}">
          </div>

          <h3>${company.name}</h3>

          <p style="font-size: 11px; color: #a07800; font-weight: 600; letter-spacing: 0.05em; margin: 4px 0 8px;">
            ${company.time} • ${company.type}
          </p>

          <p>${company.desc}</p>
        </article>
      `;

      companiesGrid.insertAdjacentHTML("beforeend", cardHTML);
    });

    filterCompanies();
  }

  function filterCompanies() {
    if (!companiesGrid) return;

    const searchValue = searchInput?.value.toLowerCase().trim() || "";
    const timeValue =
      timeFilter?.value.replace("-", " ").toLowerCase().trim() || "";
    const jobValue = jobFilter?.value.toLowerCase().trim() || "";

    const cards = companiesGrid.querySelectorAll(".company-card");

    let matchedCount = 0;
    let visibleCount = 0;

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();

      const matchesSearch = !searchValue || text.includes(searchValue);
      const matchesTime = !timeValue || text.includes(timeValue);
      const matchesJob = !jobValue || text.includes(jobValue);

      const matchesFilters = matchesSearch && matchesTime && matchesJob;

      if (!matchesFilters) {
        card.style.display = "none";
        return;
      }

      matchedCount++;

      const shouldShow =
        isExpanded || matchedCount <= INITIAL_VISIBLE_COUNT;

      card.style.display = shouldShow ? "flex" : "none";

      if (shouldShow) {
        visibleCount++;
      }
    });

    if (companyCount) {
      companyCount.innerText = `Showing ${visibleCount} of ${companies.length} companies`;
    }

    updateLoadMoreButton(matchedCount);
  }

  function updateLoadMoreButton(matchedCount) {
    if (!loadMoreBtn) return;

    const shouldShowButton = matchedCount > INITIAL_VISIBLE_COUNT;

    loadMoreBtn.style.display = shouldShowButton ? "inline-flex" : "none";
    loadMoreBtn.innerText = isExpanded
      ? "Show Less"
      : "Load More Companies";

    if (stickyWrapper) {
      stickyWrapper.classList.toggle(
        "is-sticky",
        shouldShowButton && isExpanded
      );
    }
  }

  function resetFilters() {
    isExpanded = false;
    filterCompanies();
  }

  function highlightCurrentTimelineItem() {
    const today = new Date();
    const currentYear = today.getFullYear();

    const timelineDates = {
      "May 20th": new Date(currentYear, 4, 20),
      "August 1st": new Date(currentYear, 7, 1),
      "August 21st": new Date(currentYear, 7, 21),
      "August 25th": new Date(currentYear, 7, 25),
      "September 13th": new Date(currentYear, 8, 13),
      "September 14th": new Date(currentYear, 8, 14),
      "September 15–16th": new Date(currentYear, 8, 15)
    };

    let closestItem = null;
    let closestDiff = Infinity;

    document.querySelectorAll(".timeline-item").forEach(item => {
      item.classList.remove("current", "upcoming");

      const dateText = item.querySelector(".tl-date")?.innerText.trim();
      const eventDate = timelineDates[dateText];

      if (!eventDate) return;

      const diffDays = Math.ceil(
        (eventDate - today) / (1000 * 60 * 60 * 24)
      );

      if (diffDays >= 0 && diffDays < closestDiff) {
        closestDiff = diffDays;
        closestItem = item;
      }
    });

    closestItem?.classList.add("current");
  }

  loadMoreBtn?.addEventListener("click", () => {
    isExpanded = !isExpanded;
    filterCompanies();
  });

  searchInput?.addEventListener("input", resetFilters);
  timeFilter?.addEventListener("change", resetFilters);
  jobFilter?.addEventListener("change", resetFilters);

  loadHTML("nav-container", "nav.html");
  loadHTML("footer-container", "footer.html");
  loadCompanies();
  highlightCurrentTimelineItem();

  // ── MAPS LIGHTBOX ──
  const thumbs   = Array.from(document.querySelectorAll(".map-thumb"));
  const lightbox = document.getElementById("lightbox");
  const lbImg    = document.getElementById("lightbox-img");
  const lbLabel  = document.getElementById("lightbox-label");
  const lbClose  = document.getElementById("lightbox-close");
  const lbPrev   = document.getElementById("lightbox-prev");
  const lbNext   = document.getElementById("lightbox-next");

  if (lightbox && thumbs.length) {
    let current = 0;

    function openLightbox(index) {
      current = index;
      const thumb = thumbs[current];
      lbImg.src = thumb.dataset.src;
      lbLabel.textContent = thumb.dataset.label;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lbClose.focus();
      updateNavBtns();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      thumbs[current].focus();
    }

    function updateNavBtns() {
      lbPrev.disabled = current === 0;
      lbNext.disabled = current === thumbs.length - 1;
    }

    thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => openLightbox(i)));
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", () => { if (current > 0) openLightbox(current - 1); });
    lbNext.addEventListener("click", () => { if (current < thumbs.length - 1) openLightbox(current + 1); });
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape")     closeLightbox();
      if (e.key === "ArrowLeft")  { if (current > 0) openLightbox(current - 1); }
      if (e.key === "ArrowRight") { if (current < thumbs.length - 1) openLightbox(current + 1); }
    });
  }
});

async function loadHTML(containerId, filePath) {
  const container = document.getElementById(containerId);

  if (!container) return;

  try {
    const response = await fetch(filePath);
    container.innerHTML = await response.text();
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}
