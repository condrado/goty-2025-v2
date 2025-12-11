// Elimina un item de bingo del usuario
function deleteBingoItem(data, voterInitials, itemIndex) {
  if (!data[voterInitials]) return;
  data[voterInitials].splice(itemIndex, 1);
}
// Devuelve true si el item de bingo ya está seleccionado por el usuario
function isItemSelected(data, voterInitials, itemId) {
  const items = data[voterInitials] || [];
  return items.some((item) => item.id === itemId);
}
// Devuelve el número de items completados de bingo para un usuario
function getBingoCount(data, voterInitials) {
  const items = data[voterInitials] || [];
  return items.filter((item) => item.completed).length;
}
// Cargar datos de bingo del localStorage
function loadBingoData() {
  try {
    const raw = localStorage.getItem("tga2025_bingo");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Error cargando datos de bingo", e);
    return {};
  }
}
// --- HOME: Selector de usuario ---
function renderHomeMain() {
  mainEl.innerHTML = "";
  // Ocultar el buscador de categorías en la home y mostrar .header-actions solo en la home
  const headerSearch = document.getElementById("headerSearch");
  if (headerSearch) headerSearch.style.display = "none";
  const headerActions = document.querySelector(".header-actions");
  if (headerActions) headerActions.style.display = "flex";
  const title = document.createElement("h2");
  title.className = "page-title";
  title.innerHTML =
    '<i data-lucide="users" class="lucide-icon"></i> Participantes';
  mainEl.appendChild(title);

  // Asegurar que el usuario fijo "Resultado final" existe
  if (!STATE.voters.some((v) => v.initials === "FIN")) {
    STATE.voters.unshift({ name: "Resultado final", initials: "FIN" });
    saveState(STATE);
  }

  const grid = document.createElement("div");
  grid.className = "user-grid";
  const selectedInitials = localStorage.getItem("tga2025_selectedUser");
  STATE.voters.forEach((voter, idx) => {
    const card = document.createElement("div");
    card.className = "voter-item user-card";
    card.innerHTML = `<div class=\"voter-info\"><strong>${voter.name}</strong><span>${voter.initials}</span></div>`;
    if (voter.initials === selectedInitials) {
      card.classList.add("active");
    }
    // Selección de usuario
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-user-btn")) return;
      localStorage.setItem("tga2025_selectedUser", voter.initials);
      renderNav(); // Actualiza el menú de navegación al cambiar de usuario
      updateFooter();
      renderHomeMain();
    });
    // Botón de borrar usuario (oculto para FIN)
    if (voter.initials !== "FIN") {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-user-btn";
      deleteBtn.title = "Eliminar participante";
      deleteBtn.innerHTML = '<i data-lucide="x" class="lucide-icon-sm"></i>';
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (
          !confirm(`¿Eliminar participante ${voter.name} (${voter.initials})?`)
        )
          return;
        STATE.voters.splice(idx, 1);
        if (selectedInitials === voter.initials) {
          localStorage.removeItem("tga2025_selectedUser");
        }
        saveState(STATE);
        renderHomeMain();
        updateFooter();
      });
      card.appendChild(deleteBtn);
    }
    grid.appendChild(card);
  });
  mainEl.appendChild(grid);
  // Calcular altura dinámica para .user-grid igual que en bingo
  setTimeout(() => {
    const gridEl = document.querySelector(".user-grid");
    if (gridEl) {
      const header = document.querySelector("header");
      const pageTitle = document.querySelector(".page-title");
      const footer = document.querySelector(".selection-footer");
      const content = document.querySelector(".content");
      const body = document.body;
      const headerHeight = header ? header.offsetHeight : 0;
      const headerMarginBottom = header
        ? parseInt(getComputedStyle(header).marginBottom)
        : 0;
      const pageTitleHeight = pageTitle ? pageTitle.offsetHeight : 0;
      const pageTitleMarginBottom = pageTitle
        ? parseInt(getComputedStyle(pageTitle).marginBottom)
        : 0;
      const footerHeight = footer ? footer.offsetHeight : 0;
      const contentPaddingTop = content
        ? parseInt(getComputedStyle(content).paddingTop)
        : 0;
      const contentPaddingBottom = content
        ? parseInt(getComputedStyle(content).paddingBottom)
        : 0;
      const bodyPaddingTop = parseInt(getComputedStyle(body).paddingTop);
      const bodyPaddingBottom = parseInt(getComputedStyle(body).paddingBottom);
      let suma = 0;
      function logSuma(label, valor) {
        suma += valor;
      }
      logSuma("header", headerHeight);
      logSuma("header margin-bottom", headerMarginBottom);
      logSuma("page-title", pageTitleHeight);
      logSuma("page-title margin-bottom", pageTitleMarginBottom);
      logSuma("footer", footerHeight);
      logSuma("content padding-top", contentPaddingTop);
      logSuma("content padding-bottom", contentPaddingBottom);
      logSuma("body padding-top", bodyPaddingTop);
      logSuma("body padding-bottom", bodyPaddingBottom);
      const vh = window.innerHeight;
      const heightToApply = vh - suma;
      gridEl.style.height = heightToApply + "px";
      setTimeout(() => {}, 0);
    }
  }, 0);
  // Actualizar barra de puntos tras renderizar nominees
  updateFooter();

  // Lógica para añadir nuevo participante
  const newInput = document.getElementById("newParticipantInput");
  const addBtn = document.getElementById("addParticipantBtn");
  if (newInput && addBtn) {
    addBtn.onclick = () => {
      const name = newInput.value.trim();
      if (!name) {
        alert("Introduce el nombre del participante");
        return;
      }
      // Generar siglas automáticas (3 primeras letras mayúsculas, sin espacios)
      let initials = name.replace(/\s+/g, "").substring(0, 3).toUpperCase();
      if (initials.length < 3) {
        alert("El nombre debe tener al menos 3 letras para generar siglas");
        return;
      }
      // Verificar si ya existe
      if (STATE.voters.some((v) => v.initials === initials)) {
        alert("Ya existe un participante con esas siglas");
        return;
      }
      STATE.voters.push({ name, initials });
      saveState(STATE);
      newInput.value = "";
      renderHomeMain();
      updateFooter();
    };
  }

  if (typeof lucide !== "undefined") lucide.createIcons();
}

// --- Adaptar nominaciones para usuario activo ---
function getActiveUserInitials() {
  return localStorage.getItem("tga2025_selectedUser");
}

// Ejemplo de cómo guardar una nominación por usuario
function saveNomination(categoryId, nomineeId) {
  const initials = getActiveUserInitials();
  if (!initials) return;
  if (!STATE.nominations) STATE.nominations = {};
  if (!STATE.nominations[initials]) STATE.nominations[initials] = {};
  STATE.nominations[initials][categoryId] = nomineeId;
  saveState(STATE);

  // Actualizar FOOTER_STATE para reflejar la selección
  if (nomineeId) {
    // Buscar el nombre del juego seleccionado
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    let nomineeTitle = null;
    if (cat) {
      const game = cat.games.find((g) => g.id === nomineeId);
      nomineeTitle = game ? game.name : guessNameFromId(nomineeId);
    }
    FOOTER_STATE.nomineeTitle = nomineeTitle;
    FOOTER_STATE.categoryId = categoryId;
  } else {
    FOOTER_STATE.nomineeTitle = null;
    FOOTER_STATE.categoryId = null;
  }
  updateFooter();
}

// Ejemplo de cómo obtener la nominación del usuario activo
function getNomination(categoryId) {
  const initials = getActiveUserInitials();
  if (!initials || !STATE.nominations || !STATE.nominations[initials])
    return null;
  return STATE.nominations[initials][categoryId] || null;
}

// Hook en el router para mostrar la home principal y siempre renderizar el menú lateral
const originalRoute = route;
window.route = function () {
  const hash = location.hash || "#/";
  let activeId = "";
  // Lógica de visibilidad global para .category-search-container y .header-actions
  const headerSearch = document.getElementById("headerSearch");
  const headerActions = document.querySelector(".header-actions");
  if (hash === "#/" || hash === "") {
    activeId = "participantes";
    if (headerSearch) headerSearch.style.display = "none";
    if (headerActions) headerActions.style.display = "flex";
    // Ocultar botones de navegación de categorías en home
    const categoryNav = document.querySelector(".category-nav");
    if (categoryNav) categoryNav.style.display = "none";
    renderNav(activeId);
    renderHomeMain();
  } else {
    if (headerSearch) headerSearch.style.display = "block";
    if (headerActions) headerActions.style.display = "none";
    // Ajustar ancho del buscador en #/categorias, #/ranking y #/bingo
    if (headerSearch) {
      if (
        hash === "#/categorias" ||
        hash.startsWith("#/ranking") ||
        hash.startsWith("#/bingo")
      ) {
        headerSearch.style.width = "100%";
      } else {
        headerSearch.style.width = "";
      }
    }
    const categoryNav = document.querySelector(".category-nav");
    // Mostrar/ocultar category-nav solo en nominaciones
    if (/^#\/category\//.test(hash)) {
      if (categoryNav) categoryNav.style.display = "flex";
    } else {
      if (categoryNav) categoryNav.style.display = "none";
    }
    if (hash === "#/categorias") {
      activeId = "categorias";
      renderNav(activeId);
      if (typeof renderHome === "function") renderHome();
    } else if (/^#\/category\//.test(hash)) {
      activeId = "categorias";
      renderNav(activeId);
      const match = hash.match(/^#\/category\/([^\/]+)/);
      if (match && typeof renderCategory === "function")
        renderCategory(match[1]);
    } else if (hash.startsWith("#/ranking")) {
      activeId = "ranking";
      renderNav(activeId);
      if (typeof renderRanking === "function") renderRanking();
    } else if (hash.startsWith("#/bingo")) {
      activeId = "bingo";
      renderNav(activeId);
      if (typeof renderBingo === "function") renderBingo();
    } else {
      originalRoute();
    }
  }
};

// sessionStorage keys
const STORAGE_KEYS = {
  predictions: "tga2025_predictions", // formato: { categoryId: { voterName: gameId } }
  winners: "tga2025_winners", // formato: { categoryId: gameId }
  voters: "tga2025_voters", // formato: [{ name: string, initials: string }]
  sortOrder: "tga2025_sortOrder", // formato: 'event' | 'alphabetical'
  theme: "tga2025_theme", // formato: 'dark' | 'light'
  bingo: "tga2025_bingo", // formato: { voterInitials: [{ id, text, completed }] }
  nominations: "tga2025_nominations", // NUEVO: nominaciones por usuario
};

// Estado del footer (debe ir antes de cualquier uso)
let FOOTER_STATE = {
  voterName: null,
  nomineeTitle: null,
  categoryId: null,
};
// carga/guarda
function ajustarAlturaGrid(selector) {
  const gridEl = document.querySelector(selector);
  const header = document.querySelector("header");
  const categoryHeader = document.querySelector(".category-header");
  const footer = document.querySelector(".selection-footer");
  const content = document.querySelector(".content");
  const body = document.body;
  const headerHeight = header ? header.offsetHeight : 0;
  const categoryHeaderHeight = categoryHeader ? categoryHeader.offsetHeight : 0;
  const categoryHeaderMarginBottom = categoryHeader
    ? parseInt(getComputedStyle(categoryHeader).marginBottom)
    : 0;
  const footerHeight = footer ? footer.offsetHeight : 0;
  const contentPaddingTop = content
    ? parseInt(getComputedStyle(content).paddingTop)
    : 0;
  const contentPaddingBottom = content
    ? parseInt(getComputedStyle(content).paddingBottom)
    : 0;
  const bodyPaddingTop = parseInt(getComputedStyle(body).paddingTop);
  const bodyPaddingBottom = parseInt(getComputedStyle(body).paddingBottom);
  const headerMarginBottom = header
    ? parseInt(getComputedStyle(header).marginBottom)
    : 0;
  let extraHeight = 0;
  let selectorHeight = 0,
    customHeight = 0,
    pageTitleHeight = 0,
    pageTitleMarginBottom = 0,
    columnHeaderHeight = 0;
  if (selector === ".bingo-items-list") {
    const selectorContainer = document.querySelector(
      ".bingo-selector-container"
    );
    const customContainer = document.querySelector(".bingo-custom-container");
    const pageTitle = document.querySelector(".page-title");
    const columnHeader = document.querySelector(".bingo-column-header");
    selectorHeight = selectorContainer ? selectorContainer.offsetHeight : 0;
    customHeight = customContainer ? customContainer.offsetHeight : 0;
    pageTitleHeight = pageTitle ? pageTitle.offsetHeight : 0;
    pageTitleMarginBottom = pageTitle
      ? parseInt(getComputedStyle(pageTitle).marginBottom)
      : 0;
    columnHeaderHeight = columnHeader ? columnHeader.offsetHeight : 0;
    extraHeight += selectorHeight;
    extraHeight += customHeight;
    extraHeight += pageTitleHeight + pageTitleMarginBottom;
    extraHeight += columnHeaderHeight;
  }
  // Debug: mostrar SIEMPRE los valores de todos los elementos usados para .bingo-items-list

  if (selector === ".bingo-items-list") {
    let suma = 0;
    // Incluir el gap de .bingo-column (8px * 2)
    const bingoColumnGap = 8 * 2;
    // Incluir el padding de .bingo-column (top + bottom)
    let bingoColumnPadding = 0;
    if (selector === ".bingo-items-list") {
      const bingoColumn = document.querySelector(".bingo-column");
      if (bingoColumn) {
        const style = getComputedStyle(bingoColumn);
        bingoColumnPadding =
          parseInt(style.paddingTop) + parseInt(style.paddingBottom);
      }
    }
  }
  const vh = window.innerHeight;
  // Sumar el gap de .bingo-column (8px*2) solo para .bingo-items-list
  const bingoColumnGap = selector === ".bingo-items-list" ? 8 * 2 : 0;
  const bingoColumnPadding = (() => {
    if (selector === ".bingo-items-list") {
      const bingoColumn = document.querySelector(".bingo-column");
      if (bingoColumn) {
        const style = getComputedStyle(bingoColumn);
        return parseInt(style.paddingTop) + parseInt(style.paddingBottom);
      }
    }
    return 0;
  })();
  const footerContentGap = selector === ".bingo-items-list" ? 8 : 0;
  const totalToSubtract =
    headerHeight +
    headerMarginBottom +
    categoryHeaderHeight +
    categoryHeaderMarginBottom +
    footerHeight +
    contentPaddingTop +
    contentPaddingBottom +
    bodyPaddingTop +
    bodyPaddingBottom +
    extraHeight +
    bingoColumnGap +
    bingoColumnPadding +
    footerContentGap;
  if (gridEl) {
    const heightToApply = vh - totalToSubtract;
    gridEl.style.height = heightToApply + "px";
    if (selector === ".bingo-items-list") {
      // Log para comparar valor calculado y valor real aplicado
      // Forzar reflow y loguear el offsetHeight real tras aplicar el height
      setTimeout(() => {}, 0);
    }
  }
}

requestAnimationFrame(() => ajustarAlturaGrid(".nominees-grid"));
window.addEventListener("resize", () => ajustarAlturaGrid(".nominees-grid"));

function updateFooter() {
  // Barra de puntos de usuarios en el footer (siempre visible)
  let pointsBar = document.getElementById("footerPointsBar");
  if (!pointsBar) {
    pointsBar = document.createElement("div");
    pointsBar.id = "footerPointsBar";
    const selectionContent = document.querySelector(".selection-content");
    if (selectionContent && selectionContent.parentElement) {
      selectionContent.parentElement.insertBefore(
        pointsBar,
        selectionContent.nextSibling
      );
    }
  }
  // Mostrar aciertos de bingo en la página de bingo, puntos de nominaciones en el resto
  pointsBar.innerHTML = "";
  if (location.hash.startsWith("#/bingo")) {
    const bingoData = loadBingoData();
    const sortedVoters = STATE.voters
      .filter((v) => v.initials !== "FIN")
      .sort(
        (a, b) =>
          getBingoCount(bingoData, b.initials) -
          getBingoCount(bingoData, a.initials)
      );
    sortedVoters.forEach((voter) => {
      const item = document.createElement("div");
      item.className = "footer-points-item";
      const initials = document.createElement("span");
      initials.textContent = voter.initials;
      const pts = document.createElement("span");
      const userItems = bingoData[voter.initials] || [];
      const aciertos = userItems.filter((item) => item.completed).length;
      const totalMarcados = userItems.length;
      pts.textContent = `${aciertos}/${totalMarcados}`;
      item.appendChild(initials);
      item.appendChild(pts);
      pointsBar.appendChild(item);
    });
  } else {
    const scores = typeof computeScores === "function" ? computeScores() : {};
    const sortedVoters = STATE.voters
      .filter((v) => v.initials !== "FIN")
      .sort((a, b) => (scores[b.initials] || 0) - (scores[a.initials] || 0));
    sortedVoters.forEach((voter) => {
      const item = document.createElement("div");
      item.className = "footer-points-item";
      const initials = document.createElement("span");
      initials.textContent = voter.initials;
      const pts = document.createElement("span");
      pts.textContent = (scores[voter.initials] || 0) + " pts";
      item.appendChild(initials);
      item.appendChild(pts);
      pointsBar.appendChild(item);
    });
  }
  const voterEl = document.getElementById("footerVoter");
  const nomineeEl = document.getElementById("footerNominee");
  const separatorEl = document.querySelector(".footer-separator");
  // Mostrar el usuario seleccionado en el footer
  const selectedInitials = localStorage.getItem("tga2025_selectedUser");
  let userName = "Usuario";
  if (selectedInitials) {
    const user = STATE.voters.find((v) => v.initials === selectedInitials);
    if (user) userName = user.name;
  } else if (STATE.voters.length > 0) {
    userName = STATE.voters[0].name;
  }
  voterEl.textContent = userName;
  // Mostrar el título del juego seleccionado para la categoría activa
  // (No usar FOOTER_STATE.nomineeTitle, solo calcularlo dinámicamente)
  // Obtener la categoría activa
  const hash = location.hash || "";
  let catId = null;
  if (hash.startsWith("#/category/")) {
    catId = hash.split("/")[2];
  } else if (FOOTER_STATE.categoryId) {
    catId = FOOTER_STATE.categoryId;
  }

  // Obtener el id del juego seleccionado para este usuario y categoría
  let nomineeTitle = "";
  if (
    selectedInitials &&
    catId &&
    STATE.nominations &&
    STATE.nominations[selectedInitials]
  ) {
    const nomineeId = STATE.nominations[selectedInitials][catId];
    if (nomineeId) {
      // Buscar el nombre del juego en CATEGORIES
      for (const cat of CATEGORIES) {
        if (cat.id === catId) {
          const game = cat.games.find((g) => g.id === nomineeId);
          nomineeTitle = game ? game.name : nomineeId;
          break;
        }
      }
    }
  }
  if (nomineeTitle) {
    nomineeEl.textContent = nomineeTitle;
    separatorEl.style.display = "inline";
  } else {
    nomineeEl.textContent = "";
    separatorEl.style.display = "none";
  }
}

// Obtener nombre formateado del votante
function getVoterName(initials) {
  const customVoter = STATE.voters.find((v) => v.initials === initials);
  if (customVoter) {
    return `${customVoter.name} (${customVoter.initials})`;
  }
  return initials;
}

// Obtener categorías ordenadas según preferencia
function getSortedCategories() {
  let categories = [...CATEGORIES];
  if (STATE.sortOrder === "alphabetical") {
    categories.sort((a, b) => a.title.localeCompare(b.title));
  }
  return categories;
}

// helpers
function makeImgUrl(gameId, name) {
  // placeholder: generamos una mini 'carátula' con texto usando via.placeholder
  const text = encodeURIComponent(name || gameId);
  return `https://via.placeholder.com/400x400.png?text=${text}`;
}

// RENDER
const navEl = document.getElementById("nav");
const mainEl = document.getElementById("main");
const rankingContent = document.getElementById("rankingContent");
const rankingSidebar = document.getElementById("rankingSidebar");

function updateRankingSidebar() {
  const currentHash = location.hash || "#/";

  // Solo mostrar el sidebar en la página de ranking
  if (!currentHash.startsWith("#/ranking")) {
    rankingSidebar.style.display = "none";
    return;
  }

  rankingSidebar.style.display = "block";
  const scores = computeScores();
  rankingContent.innerHTML = "";

  if (getVoters().length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.style.textAlign = "center";
    emptyMessage.style.color = "var(--muted)";
    emptyMessage.style.fontSize = "13px";
    emptyMessage.style.padding = "16px 8px";
    emptyMessage.innerHTML =
      'Aún no hay participantes.<br>Haz clic en <i data-lucide="user-plus" style="width:14px;height:14px;display:inline-block;vertical-align:middle"></i> para añadir.';
    rankingContent.appendChild(emptyMessage);
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
    return;
  }

  // Ranking por puntos de predicciones
  Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, pts]) => {
      const item = document.createElement("div");
      item.className = "rank-item";
      const customVoter = STATE.voters.find((v) => v.initials === name);
      const displayName = customVoter ? customVoter.name : name;
      item.innerHTML = `<div><strong>${displayName}</strong></div><div class="rank-points">${pts} pts</div>`;
      rankingContent.appendChild(item);
    });
}

function renderNav(activeId) {
  navEl.innerHTML = "";

  // Contenedor de enlaces fijos
  const fixedLinks = document.createElement("div");
  fixedLinks.className = "nav-fixed";

  // Participantes (Home principal)
  const participantes = document.createElement("a");
  participantes.href = "#/";
  participantes.className =
    activeId === "participantes" ? "active nav-link-row" : "nav-link-row";
  participantes.innerHTML =
    '<i data-lucide="users" class="lucide-icon"></i> Participantes';
  fixedLinks.appendChild(participantes);

  // Categorías
  const home = document.createElement("a");
  home.href = "#/categorias";
  home.className =
    activeId === "categorias" ? "active nav-link-row" : "nav-link-row";
  home.innerHTML =
    '<i data-lucide="trophy" class="lucide-icon"></i> Categorías';
  fixedLinks.appendChild(home);

  // Bingo
  const bingo = document.createElement("a");
  bingo.href = "#/bingo";
  bingo.className =
    activeId === "bingo" ? "active nav-link-row" : "nav-link-row";
  bingo.innerHTML = '<i data-lucide="grid-3x3" class="lucide-icon"></i> Bingo';
  fixedLinks.appendChild(bingo);

  navEl.appendChild(fixedLinks);

  // Contenedor scrollable de categorías
  const scrollableCategories = document.createElement("div");
  scrollableCategories.className = "nav-scrollable";

  const userInitials = getActiveUserInitials();
  getSortedCategories().forEach((cat) => {
    const a = document.createElement("a");
    a.href = "#/category/" + cat.id;
    a.className = "nav-link-row";
    // Verificar si la categoría tiene ganador
    const hasWinner = STATE.winners[cat.id];
    if (hasWinner) {
      const iconSpan = document.createElement("span");
      iconSpan.className = "nav-winner-icon";
      iconSpan.textContent = "✓";
      a.appendChild(iconSpan);
      a.classList.add("has-winner");
    }
    // Añadir .has-winner si el usuario activo tiene nominación en esta categoría
    const userHasNomination =
      userInitials &&
      STATE.nominations &&
      STATE.nominations[userInitials] &&
      STATE.nominations[userInitials][cat.id];
    if (userHasNomination) {
      a.classList.add("has-winner");
    }
    const textSpan = document.createElement("span");
    textSpan.className = "nav-text-column";
    const titleEn = document.createElement("span");
    titleEn.className = "nav-title-en";
    titleEn.textContent = cat.title;
    const titleEs = document.createElement("span");
    titleEs.className = "nav-title-es";
    titleEs.textContent = cat.titleEs;
    textSpan.appendChild(titleEn);
    textSpan.appendChild(titleEs);
    a.appendChild(textSpan);
    if (cat.id === activeId) a.classList.add("active");
    scrollableCategories.appendChild(a);
  });

  navEl.appendChild(scrollableCategories);

  // Inicializar iconos de lucide
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function renderHome() {
  // renderNav('home');
  updateRankingSidebar();
  mainEl.innerHTML = "";

  // Ocultar botón reset del header
  document.getElementById("resetAll").style.display = "none";

  // Ocultar botones de navegación de categorías y expandir buscador
  const categoryNav = document.querySelector(".category-nav");
  const searchContainer = document.getElementById("headerSearch");
  if (categoryNav) categoryNav.style.display = "none";
  if (searchContainer) searchContainer.style.width = "100%";

  // Actualizar footer para mantener la última selección
  updateFooter();

  // Header wrapper con filtro y botón reset
  const headerWrapper = document.createElement("div");
  headerWrapper.className = "header-wrapper";

  const h = document.createElement("h2");
  h.innerHTML = '<i data-lucide="trophy" class="lucide-icon"></i> Categorías';

  const controlsWrapper = document.createElement("div");
  controlsWrapper.className = "header-controls";

  // Desplegable de ordenación
  const sortSelect = document.createElement("select");
  sortSelect.className = "sort-select";
  sortSelect.innerHTML = `
		<option value="event">Evento</option>
		<option value="alphabetical">Alfabéticamente</option>
	`;
  sortSelect.value = STATE.sortOrder;

  const resetBtn = document.createElement("button");
  resetBtn.className = "winner-btn";
  resetBtn.innerHTML =
    '<i data-lucide="rotate-ccw" style="width:18px;height:18px"></i>';
  resetBtn.setAttribute("aria-label", "Restablecer todo");
  resetBtn.setAttribute("title", "Restablecer todo");
  resetBtn.addEventListener("click", () => {
    if (
      !confirm(
        "¿Restablecer todas las predicciones, ganadores y participantes? (se borrará todo del localStorage)"
      )
    )
      return;
    STATE = {
      predictions: {},
      winners: {},
      voters: VOTERS,
      sortOrder: "event",
    };
    saveState(STATE);
    route();
  });

  controlsWrapper.appendChild(sortSelect);
  controlsWrapper.appendChild(resetBtn);

  headerWrapper.appendChild(h);
  headerWrapper.appendChild(controlsWrapper);
  mainEl.appendChild(headerWrapper);

  // Inicializar iconos de lucide
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  const list = document.createElement("div");
  list.className = "grid";

  // Función para renderizar categorías
  const renderCategories = (sortType) => {
    list.innerHTML = "";
    let categoriesToRender = getSortedCategories();

    const userInitials = getActiveUserInitials();
    categoriesToRender.forEach((cat) => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = "#/category/" + cat.id;

      // Verificar si la categoría tiene ganador
      const hasWinner = STATE.winners[cat.id];
      if (hasWinner) {
        card.classList.add("has-winner");
      }

      // Añadir .has-winner si el usuario activo tiene nominación en esta categoría
      const userHasNomination =
        userInitials &&
        STATE.nominations &&
        STATE.nominations[userInitials] &&
        STATE.nominations[userInitials][cat.id];
      if (userHasNomination) {
        card.classList.add("has-winner");
      }

      const m = document.createElement("div");
      m.style.flex = "1";
      const title = document.createElement("h3");

      // Añadir icono de check si tiene ganador
      if (hasWinner) {
        const winnerIcon = document.createElement("span");
        winnerIcon.className = "nav-winner-icon";
        winnerIcon.textContent = "✓";
        title.appendChild(winnerIcon);
      }

      const titleText = document.createTextNode(cat.title);
      title.appendChild(titleText);

      const info = document.createElement("div");
      info.style.color = "var(--muted)";
      info.style.fontSize = "13px";
      const total = cat.games.length;
      const winnerAssigned = hasWinner ? " · Ganador marcado" : "";
      info.textContent = `${total} nominados${winnerAssigned}`;
      m.appendChild(title);
      m.appendChild(info);
      card.appendChild(m);
      list.appendChild(card);
    });
  };

  // Renderizar inicialmente
  renderCategories(STATE.sortOrder);
  mainEl.appendChild(list);

  // Ajustar altura de .grid dinámicamente considerando header, header-wrapper, footer y paddings
  function ajustarAlturaGridHome() {
    requestAnimationFrame(() => {
      const gridEl = document.querySelector(".grid");
      if (gridEl) {
        const header = document.querySelector("header");
        const headerWrapper = document.querySelector(".header-wrapper");
        const footer = document.querySelector(".selection-footer");
        const content = document.querySelector(".content");
        const body = document.body;
        const headerHeight = header ? header.offsetHeight : 0;
        const headerMarginBottom = header
          ? parseInt(getComputedStyle(header).marginBottom)
          : 0;
        const headerWrapperHeight = headerWrapper
          ? headerWrapper.offsetHeight
          : 0;
        const headerWrapperMarginBottom = headerWrapper
          ? parseInt(getComputedStyle(headerWrapper).marginBottom)
          : 0;
        const footerHeight = footer ? footer.offsetHeight : 0;
        const contentPaddingTop = content
          ? parseInt(getComputedStyle(content).paddingTop)
          : 0;
        const contentPaddingBottom = content
          ? parseInt(getComputedStyle(content).paddingBottom)
          : 0;
        const bodyPaddingTop = parseInt(getComputedStyle(body).paddingTop);
        const bodyPaddingBottom = parseInt(
          getComputedStyle(body).paddingBottom
        );
        const vh = window.innerHeight;
        // Debug: mostrar valores
        const totalToSubtract =
          headerHeight +
          headerMarginBottom +
          headerWrapperHeight +
          headerWrapperMarginBottom +
          footerHeight +
          contentPaddingTop +
          contentPaddingBottom +
          bodyPaddingTop +
          bodyPaddingBottom;
        gridEl.style.height = vh - totalToSubtract + "px";
      }
    });
  }
  ajustarAlturaGridHome();
  window.addEventListener("resize", ajustarAlturaGridHome);

  // Event listener para el cambio de ordenación
  sortSelect.addEventListener("change", (e) => {
    STATE.sortOrder = e.target.value;
    saveState(STATE);
    renderCategories(STATE.sortOrder);
    renderNav("home"); // Actualizar nav con nuevo orden
  });
}

function renderCategory(catId) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  renderNav(catId);
  updateRankingSidebar();
  if (!cat) {
    mainEl.innerHTML = "<p>Categoría no encontrada</p>";
    return;
  }

  // Ocultar botón reset del header
  document.getElementById("resetAll").style.display = "none";

  mainEl.innerHTML = "";

  // Mostrar el buscador de categorías en todas las páginas menos en la home
  const categoryNav = document.querySelector(".category-nav");
  const searchContainer = document.getElementById("headerSearch");
  if (categoryNav) categoryNav.style.display = "flex";
  if (searchContainer) searchContainer.style.display = "block";
  // Ocultar .header-actions fuera de la home
  const headerActions = document.querySelector(".header-actions");
  if (headerActions) headerActions.style.display = "none";

  // Actualizar footer con la selección de esta categoría
  const winnerId = STATE.winners[catId];
  if (winnerId) {
    const winnerGame = cat.games.find((g) => g.id === winnerId);
    if (winnerGame) {
      FOOTER_STATE.nomineeTitle = winnerGame.name || guessNameFromId(winnerId);
      FOOTER_STATE.categoryId = catId;
    } else {
      FOOTER_STATE.nomineeTitle = null;
      FOOTER_STATE.categoryId = null;
    }
  } else {
    FOOTER_STATE.nomineeTitle = null;
    FOOTER_STATE.categoryId = null;
  }
  updateFooter();

  // Header de categoría
  const header = document.createElement("div");
  header.className = "category-header";

  // Navegación entre categorías
  const sortedCategories = getSortedCategories();
  const currentIndex = sortedCategories.findIndex((c) => c.id === catId);
  const prevCat = currentIndex > 0 ? sortedCategories[currentIndex - 1] : null;
  const nextCat =
    currentIndex < sortedCategories.length - 1
      ? sortedCategories[currentIndex + 1]
      : null;

  const navButtons = document.createElement("div");
  navButtons.className = "category-nav";

  // Botón anterior (siempre se crea)
  const prevBtn = document.createElement("button");
  prevBtn.className = "category-nav-btn prev icon-btn";
  prevBtn.innerHTML =
    '<i data-lucide="chevron-left" style="width:18px;height:18px"></i>';
  prevBtn.setAttribute("aria-label", "Categoría anterior");
  prevBtn.setAttribute("title", "Categoría anterior");
  if (prevCat) {
    prevBtn.addEventListener("click", () => {
      window.location.hash = `#/category/${prevCat.id}`;
    });
  } else {
    prevBtn.style.visibility = "hidden";
  }
  navButtons.appendChild(prevBtn);

  // Botón siguiente (siempre se crea)
  const nextBtn = document.createElement("button");
  nextBtn.className = "category-nav-btn next icon-btn";
  nextBtn.innerHTML =
    '<i data-lucide="chevron-right" style="width:18px;height:18px"></i>';
  nextBtn.setAttribute("aria-label", "Siguiente categoría");
  nextBtn.setAttribute("title", "Siguiente categoría");
  if (nextCat) {
    nextBtn.addEventListener("click", () => {
      window.location.hash = `#/category/${nextCat.id}`;
    });
  } else {
    nextBtn.style.visibility = "hidden";
  }
  navButtons.appendChild(nextBtn);

  // Insertar botones en el header junto al search
  const headerSearchContainer = document.getElementById("headerSearch");
  if (headerSearchContainer && headerSearchContainer.parentElement) {
    // Buscar si ya hay botones de navegación previos y eliminarlos
    const existingNavBtns =
      headerSearchContainer.parentElement.querySelector(".category-nav");
    if (existingNavBtns) {
      existingNavBtns.remove();
    }
    // Insertar los nuevos botones después del search
    headerSearchContainer.parentElement.insertBefore(
      navButtons,
      headerSearchContainer.nextSibling
    );
  }

  const headerTop = document.createElement("div");
  headerTop.className = "category-header-top";
  const h = document.createElement("h2");
  const titleEn = document.createElement("span");
  titleEn.textContent = cat.title;
  const titleEs = document.createElement("span");
  titleEs.className = "title-es";
  titleEs.textContent = " " + cat.titleEs;
  h.appendChild(titleEn);
  h.appendChild(titleEs);

  headerTop.appendChild(h);
  header.appendChild(headerTop);
  mainEl.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "nominees-grid";
  const userInitials = getActiveUserInitials();
  const userHasNomination =
    userInitials &&
    STATE.nominations &&
    STATE.nominations[userInitials] &&
    STATE.nominations[userInitials][catId];

  cat.games.forEach((game) => {
    const gid = game.id;
    const gname = game.name || guessNameFromId(gid);
    // Usar nominación del usuario activo
    const isWinner = getNomination(catId) === gid;

    const card = document.createElement("div");
    // Si el usuario ha seleccionado algún nominee en esta categoría, añadir .has-winner a todas las cards
    card.className =
      "nominee-card" +
      (isWinner ? " is-winner" : "") +
      (userHasNomination ? " has-winner" : "");

    // Imagen principal
    const imageContainer = document.createElement("div");
    imageContainer.className = "nominee-image";
    const img = document.createElement("img");
    img.src = game.img || makeImgUrl(gid, gname);
    img.alt = gname;
    imageContainer.appendChild(img);

    // Info del juego
    const info = document.createElement("div");
    info.className = "nominee-info";
    const title = document.createElement("h3");
    title.className = "nominee-title";
    title.textContent = gname;

    // Badge de ganador (solo icono)
    if (isWinner) {
      const winnerBadge = document.createElement("div");
      winnerBadge.className = "winner-badge";
      winnerBadge.innerHTML =
        '<i data-lucide="trophy" class="lucide-icon-sm"></i>';
      info.appendChild(winnerBadge);
    }

    // Ensamblar card
    info.appendChild(title);
    card.appendChild(imageContainer);
    card.appendChild(info);

    // Click en toda la card para marcar ganador
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("voter-chip")) return;
      const grid = document.querySelector(".nominees-grid");
      const scrollPos = grid ? grid.scrollTop : 0;
      if (getNomination(catId) === gid) {
        // Deseleccionar
        saveNomination(catId, null);
      } else {
        saveNomination(catId, gid);
      }
      renderCategory(catId);
      requestAnimationFrame(() => {
        const newGrid = document.querySelector(".nominees-grid");
        if (newGrid) newGrid.scrollTop = scrollPos;
      });
    });
    grid.appendChild(card);
  });

  mainEl.appendChild(grid);

  // Ajustar altura del grid dinámicamente calculando todos los elementos
  function ajustarAlturaNomineesGrid() {
    const nomineeGrid = document.querySelector(".nominees-grid");
    if (nomineeGrid) {
      const header = document.querySelector("header");
      const categoryHeader = document.querySelector(".category-header");
      const footer = document.querySelector(".selection-footer");
      const content = document.querySelector(".content");
      const body = document.body;
      const headerHeight = header ? header.offsetHeight : 0;
      const categoryHeaderHeight = categoryHeader
        ? categoryHeader.offsetHeight
        : 0;
      const categoryHeaderMarginBottom = categoryHeader
        ? parseInt(getComputedStyle(categoryHeader).marginBottom)
        : 0;
      const footerHeight = footer ? footer.offsetHeight : 0;
      const contentPaddingTop = content
        ? parseInt(getComputedStyle(content).paddingTop)
        : 0;
      const contentPaddingBottom = content
        ? parseInt(getComputedStyle(content).paddingBottom)
        : 0;
      const bodyPaddingTop = parseInt(getComputedStyle(body).paddingTop);
      const bodyPaddingBottom = parseInt(getComputedStyle(body).paddingBottom);
      const headerMarginBottom = header
        ? parseInt(getComputedStyle(header).marginBottom)
        : 0;
      // Usar window.innerHeight para el alto visible real
      const vh = window.innerHeight;
      // Debug: mostrar valores
      const totalToSubtract =
        headerHeight +
        headerMarginBottom +
        categoryHeaderHeight +
        categoryHeaderMarginBottom +
        footerHeight +
        contentPaddingTop +
        contentPaddingBottom +
        bodyPaddingTop +
        bodyPaddingBottom;
      nomineeGrid.style.height = vh - totalToSubtract + "px";
    }
  }
  // Llamar tras renderizar
  requestAnimationFrame(ajustarAlturaNomineesGrid);
  // Llamar en cada resize
  window.addEventListener("resize", ajustarAlturaNomineesGrid);

  // Inicializar iconos de lucide en las categorías
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function renderRanking() {
  renderNav("ranking");
  updateRankingSidebar();
  mainEl.innerHTML = "";

  // Ocultar botón reset del header
  document.getElementById("resetAll").style.display = "none";

  // Ocultar botones de navegación de categorías y expandir buscador
  const categoryNav = document.querySelector(".category-nav");
  const searchContainer = document.getElementById("headerSearch");
  if (categoryNav) categoryNav.style.display = "none";
  if (searchContainer) searchContainer.style.display = "block";
  // Ocultar .header-actions fuera de la home
  const headerActions = document.querySelector(".header-actions");
  if (headerActions) headerActions.style.display = "none";

  // Actualizar footer para mantener la última selección
  updateFooter();

  const h = document.createElement("h2");
  h.className = "page-title";
  h.innerHTML =
    '<i data-lucide="bar-chart-3" class="lucide-icon"></i> Desglose del ranking';
  mainEl.appendChild(h);

  // Inicializar iconos de lucide
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // breakdown per category
  const breakdown = document.createElement("div");
  breakdown.className = "ranking-breakdown";
  getSortedCategories().forEach((cat) => {
    const row = document.createElement("div");
    row.className = "ranking-breakdown-category";
    const w = STATE.winners[cat.id];
    const total = document.createElement("p");
    total.className = "category-winner-label";

    // Añadir icono de check si hay ganador
    if (w) {
      const checkIcon = document.createElement("span");
      checkIcon.className = "nav-winner-icon";
      checkIcon.textContent = "✓";
      total.appendChild(checkIcon);
    }

    const titleBold = document.createElement("strong");
    titleBold.textContent = cat.title;
    total.appendChild(titleBold);

    // Solo mostrar separador y ganador si hay ganador
    if (w) {
      const separator = document.createElement("span");
      separator.className = "category-separator";
      separator.textContent = "|";
      total.appendChild(separator);
      const winnerSpan = document.createElement("span");
      winnerSpan.className = "winner-name";
      winnerSpan.textContent = guessNameFromId(w);
      total.appendChild(winnerSpan);
    }
    row.appendChild(total);
    const small = document.createElement("div");
    small.className = "rank-breakdown-row";
    getVoters().forEach((v) => {
      const pred = STATE.predictions[cat.id] && STATE.predictions[cat.id][v];
      const pt = w && pred && pred === w ? 1 : 0;
      const b = document.createElement("div");
      b.className = "rank-item rank-item-fixed";
      if (pt === 1) b.classList.add("correct");
      const topRow = document.createElement("div");
      topRow.className = "rank-item-top";
      const initialsDiv = document.createElement("div");
      initialsDiv.className = "rank-item-initials";
      initialsDiv.textContent = v;
      const pointsDiv = document.createElement("div");
      pointsDiv.className = "rank-item-points";
      pointsDiv.textContent = pt;
      topRow.appendChild(initialsDiv);
      topRow.appendChild(pointsDiv);
      const predSpan = document.createElement("span");
      predSpan.className = "rank-item-prediction";
      predSpan.textContent = pred ? guessNameFromId(pred) : "—";
      b.appendChild(topRow);
      b.appendChild(predSpan);
      small.appendChild(b);
    });
    row.appendChild(small);
    breakdown.appendChild(row);
  });
  mainEl.appendChild(breakdown);
}

function computeScores() {
  const scores = {};
  // Solo usuarios distintos de FIN
  STATE.voters.forEach((v) => {
    if (v.initials !== "FIN") scores[v.initials] = 0;
  });
  CATEGORIES.forEach((cat) => {
    // El valor de referencia es la nominación de FIN
    const finalNom =
      STATE.nominations && STATE.nominations["FIN"]
        ? STATE.nominations["FIN"][cat.id]
        : null;
    if (!finalNom) return;
    STATE.voters.forEach((v) => {
      if (v.initials === "FIN") return;
      const pred =
        STATE.nominations && STATE.nominations[v.initials]
          ? STATE.nominations[v.initials][cat.id]
          : null;
      if (pred && pred === finalNom) scores[v.initials] += 1;
    });
  });
  return scores;
}

function guessNameFromId(id) {
  // busca el nombre en las categorías
  for (const cat of CATEGORIES) {
    const found = cat.games.find((g) => g.id === id);
    if (found && found.name) return found.name;
  }
  return id;
}

function renderBingo() {
  renderNav("bingo");
  updateRankingSidebar();
  mainEl.innerHTML = "";

  // Ocultar botón reset del header
  document.getElementById("resetAll").style.display = "none";

  // Ocultar botones de navegación de categorías y expandir buscador
  const categoryNav = document.querySelector(".category-nav");
  const searchContainer = document.getElementById("headerSearch");
  if (categoryNav) categoryNav.style.display = "none";
  if (searchContainer) searchContainer.style.display = "block";
  // Ocultar .header-actions fuera de la home
  const headerActions = document.querySelector(".header-actions");
  if (headerActions) headerActions.style.display = "none";

  // Actualizar footer para mantener la última selección
  updateFooter();

  const h = document.createElement("h2");
  h.className = "page-title";
  h.innerHTML = '<i data-lucide="grid-3x3" class="lucide-icon"></i> Bingo';
  mainEl.appendChild(h);

  // Inicializar iconos de lucide
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
    // Fin de renderBingo

    // Cargar datos de bingo del localStorage
    const bingoData = loadBingoData();

    // Contenedor de las 4 columnas
    const bingoGrid = document.createElement("div");
    bingoGrid.className = "bingo-grid";
    const selectedInitials = getActiveUserInitials();
    const selectedVoter = STATE.voters.find(
      (v) => v.initials === selectedInitials
    );
    if (selectedVoter) {
      const column = document.createElement("div");
      column.className = "bingo-column";
      // Header de la columna con nombre del votante
      const columnHeader = document.createElement("div");
      columnHeader.className = "bingo-column-header";
      const totalItems = getBingoTotal(bingoData, selectedVoter.initials);
      const completedItems = getBingoCount(bingoData, selectedVoter.initials);
      columnHeader.innerHTML = `<h3>${selectedVoter.name}</h3><span class="bingo-count">${completedItems}/${totalItems}</span>`;
      column.appendChild(columnHeader);
      // Selector de opciones BINGO
      const selectorContainer = document.createElement("div");
      selectorContainer.className = "bingo-selector-container";
      const select = document.createElement("select");
      select.className = "bingo-item-selector";
      select.innerHTML = '<option value="">Seleccionar opción...</option>';
      // Agrupar opciones por categoría
      const categories = [...new Set(BINGO.map((item) => item.categoria))];
      categories.forEach((categoria) => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = categoria;
        BINGO.filter((item) => item.categoria === categoria).forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.texto;
          // Deshabilitar si ya está seleccionada
          if (isItemSelected(bingoData, selectedVoter.initials, item.id)) {
            option.disabled = true;
            option.textContent += " ✓";
          }
          optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
      });
      select.addEventListener("change", (e) => {
        const itemId = parseInt(e.target.value);
        if (!itemId) return;
        // Verificar límite de 10 items
        const currentItems = bingoData[selectedVoter.initials] || [];
        if (currentItems.length >= 10) {
          alert(
            "Ya has seleccionado 10 opciones. Elimina alguna para añadir otra."
          );
          e.target.value = "";
          return;
        }
        const bingoItem = BINGO.find((b) => b.id === itemId);
        if (bingoItem) {
          addBingoItem(bingoData, selectedVoter.initials, {
            id: bingoItem.id,
            text: bingoItem.texto,
            completed: false,
          });
          saveBingoData(bingoData);
          renderBingo();
        }
      });
      selectorContainer.appendChild(select);
      column.appendChild(selectorContainer);
      // Input para opciones personalizadas
      const customContainer = document.createElement("div");
      customContainer.className = "bingo-custom-container";
      const customInput = document.createElement("input");
      customInput.type = "text";
      customInput.className = "bingo-custom-input";
      customInput.placeholder = "Añadir opción personalizada...";
      const customBtn = document.createElement("button");
      customBtn.className = "bingo-custom-btn";
      customBtn.innerHTML = '<i data-lucide="plus" class="lucide-icon-sm"></i>';
      customBtn.addEventListener("click", () => {
        const customText = customInput.value.trim();
        if (!customText) return;
        // Verificar límite de 10 items
        const currentItems = bingoData[selectedVoter.initials] || [];
        if (currentItems.length >= 10) {
          alert(
            "Ya has seleccionado 10 opciones. Elimina alguna para añadir otra."
          );
          return;
        }
        // Crear ID único para item personalizado (negativo para distinguir)
        const customId = -Date.now();
        addBingoItem(bingoData, selectedVoter.initials, {
          id: customId,
          text: customText,
          completed: false,
        });
        saveBingoData(bingoData);
        customInput.value = "";
        renderBingo();
      });
      customContainer.appendChild(customInput);
      customContainer.appendChild(customBtn);
      column.appendChild(customContainer);
      // Lista de items seleccionados
      const itemsList = document.createElement("div");
      itemsList.className = "bingo-items-list";
      const userItems = bingoData[selectedVoter.initials] || [];
      userItems.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "bingo-item" + (item.completed ? " completed" : "");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "bingo-checkbox";
        checkbox.checked = item.completed;
        checkbox.addEventListener("change", (e) => {
          toggleBingoItem(
            bingoData,
            selectedVoter.initials,
            index,
            e.target.checked
          );
          saveBingoData(bingoData);
          renderBingo();
        });
        const label = document.createElement("label");
        label.className = "bingo-label";
        label.textContent = item.text;
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "bingo-delete-btn";
        deleteBtn.innerHTML = '<i data-lucide="x" class="lucide-icon-sm"></i>';
        deleteBtn.addEventListener("click", () => {
          deleteBingoItem(bingoData, selectedVoter.initials, index);
          saveBingoData(bingoData);
          renderBingo();
        });
        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(label);
        itemDiv.appendChild(deleteBtn);
        itemsList.appendChild(itemDiv);
      });
      column.appendChild(itemsList);
      bingoGrid.appendChild(column);
    }
    mainEl.appendChild(bingoGrid);
    // Ajustar altura de la lista de items de bingo igual que nominees-grid
    setTimeout(() => ajustarAlturaGrid(".bingo-items-list"), 0);
    window.addEventListener("resize", () =>
      ajustarAlturaGrid(".bingo-items-list")
    );
    // Inicializar iconos de lucide al final
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }
}

// Funciones auxiliares para Bingo
// Alterna el estado completado de un item de bingo
function toggleBingoItem(data, voterInitials, index, completed) {
  if (!data[voterInitials] || !data[voterInitials][index]) return;
  data[voterInitials][index].completed = completed;
}
// Guarda los datos de bingo en localStorage
function saveBingoData(data) {
  try {
    localStorage.setItem("tga2025_bingo", JSON.stringify(data));
  } catch (e) {
    console.error("Error guardando datos de bingo", e);
  }
}
// Añade un item de bingo al usuario
function addBingoItem(data, voterInitials, item) {
  if (!data[voterInitials]) {
    data[voterInitials] = [];
  }
  data[voterInitials].push(item);
}

function loadState() {
  const rawPred = localStorage.getItem(STORAGE_KEYS.predictions);
  const rawWin = localStorage.getItem(STORAGE_KEYS.winners);
  const rawVoters = localStorage.getItem(STORAGE_KEYS.voters);
  const rawSort = localStorage.getItem(STORAGE_KEYS.sortOrder);
  const rawNoms = localStorage.getItem(STORAGE_KEYS.nominations);
  try {
    let voters = rawVoters ? JSON.parse(rawVoters) : [];
    if (
      typeof VOTERS !== "undefined" &&
      voters.length === 0 &&
      VOTERS.length > 0
    ) {
      voters = VOTERS;
      localStorage.setItem(STORAGE_KEYS.voters, JSON.stringify(VOTERS));
    }
    return {
      predictions: rawPred ? JSON.parse(rawPred) : {},
      winners: rawWin ? JSON.parse(rawWin) : {},
      voters: voters,
      sortOrder: rawSort || "event",
      nominations: rawNoms ? JSON.parse(rawNoms) : {}, // cargar nominaciones
    };
  } catch (e) {
    console.error("Error parseando localStorage", e);
    return {
      predictions: {},
      winners: {},
      voters: typeof VOTERS !== "undefined" ? VOTERS : [],
      sortOrder: "event",
      nominations: {},
    };
  }
}

// function ajustarAlturaGrid(selector) {
// 	const gridEl = document.querySelector(selector);
// 	if (gridEl) {
// 		const header = document.querySelector('header');
// 		const categoryHeader = document.querySelector('.category-header');
// 		const footer = document.querySelector('.selection-footer');
// 		const content = document.querySelector('.content');
// 		const body = document.body;
// 		const headerHeight = header ? header.offsetHeight : 0;
// 		const categoryHeaderHeight = categoryHeader ? categoryHeader.offsetHeight : 0;
// 		const categoryHeaderMarginBottom = categoryHeader ? parseInt(getComputedStyle(categoryHeader).marginBottom) : 0;
// 		const footerHeight = footer ? footer.offsetHeight : 0;
// 		const contentPaddingTop = content ? parseInt(getComputedStyle(content).paddingTop) : 0;
// 		const contentPaddingBottom = content ? parseInt(getComputedStyle(content).paddingBottom) : 0;
// 		const bodyPaddingTop = parseInt(getComputedStyle(body).paddingTop);
// 		const bodyPaddingBottom = parseInt(getComputedStyle(body).paddingBottom);
// 		const headerMarginBottom = header ? parseInt(getComputedStyle(header).marginBottom) : 0;
// 		const vh = window.innerHeight;
// 		// Debug: mostrar valores
// 		const totalToSubtract = headerHeight + headerMarginBottom + categoryHeaderHeight + categoryHeaderMarginBottom + footerHeight +
// 			contentPaddingTop + contentPaddingBottom +
// 			bodyPaddingTop + bodyPaddingBottom;
// 		gridEl.style.height = (vh - totalToSubtract) + 'px';
// 	}
// }

// Guarda el estado completo en localStorage
function saveState(state) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.predictions,
      JSON.stringify(state.predictions || {})
    );
    localStorage.setItem(
      STORAGE_KEYS.winners,
      JSON.stringify(state.winners || {})
    );
    localStorage.setItem(
      STORAGE_KEYS.voters,
      JSON.stringify(state.voters || [])
    );
    localStorage.setItem(STORAGE_KEYS.sortOrder, state.sortOrder || "event");
    localStorage.setItem(
      STORAGE_KEYS.nominations,
      JSON.stringify(state.nominations || {})
    );
  } catch (e) {
    console.error("Error guardando en localStorage", e);
  }
  // Mostrar el título del juego seleccionado para la categoría activa
  let nomineeTitle = null;
  // Determinar la categoría activa desde el hash
  const hash = location.hash || "";
  let catId = null;
  if (hash.startsWith("#/category/")) {
    catId = hash.split("/")[2];
  } else if (FOOTER_STATE.categoryId) {
    catId = FOOTER_STATE.categoryId;
  }
  if (
    selectedInitials &&
    catId &&
    STATE.nominations &&
    STATE.nominations[selectedInitials]
  ) {
    const nomineeId = STATE.nominations[selectedInitials][catId];
    if (nomineeId) {
      // Buscar el nombre del juego
      const cat = CATEGORIES.find((c) => c.id === catId);
      if (cat) {
        const game = cat.games.find((g) => g.id === nomineeId);
        nomineeTitle = game ? game.name : guessNameFromId(nomineeId);
      } else {
        nomineeTitle = guessNameFromId(nomineeId);
      }
    }
  }
  if (nomineeTitle) {
    nomineeEl.textContent = nomineeTitle;
    separatorEl.style.display = "inline";
  } else {
    nomineeEl.textContent = "";
    separatorEl.style.display = "none";
  }
}

// inicializa
let STATE = loadState();

function getBingoTotal(data, voterInitials) {
  const items = data[voterInitials] || [];
  return items.length;
}

function route() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/category/")) {
    const cid = hash.split("/")[2];
    renderCategory(cid);
  } else if (hash.startsWith("#/ranking")) {
    renderRanking();
  } else if (hash.startsWith("#/bingo")) {
    renderBingo();
  } else {
    renderHome();
  }
}

window.addEventListener("hashchange", () => {
  route();
  updateFooter();
});

document.getElementById("resetAll").addEventListener("click", () => {
  if (
    !confirm(
      "¿Restablecer todas las predicciones, ganadores y participantes? (se borrará todo del localStorage)"
    )
  )
    return;
  STATE = { predictions: {}, winners: {}, voters: [] };
  saveState(STATE);
  route();
});

// Menu toggle
const menuToggle = document.getElementById("menuToggle");
const navEl2 = document.getElementById("nav");
const navOverlay = document.getElementById("navOverlay");

function openMenu() {
  navEl2.classList.add("open");
  navOverlay.classList.add("active");
}

function closeMenu() {
  navEl2.classList.remove("open");
  navOverlay.classList.remove("active");
}

menuToggle.addEventListener("click", () => {
  if (navEl2.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

navOverlay.addEventListener("click", closeMenu);

// Cerrar menú al hacer clic en un enlace
navEl2.addEventListener("click", (e) => {
  // Buscar el elemento <a> más cercano (puede ser el target o un ancestro)
  const link = e.target.closest("a");
  if (link && navEl2.contains(link)) {
    closeMenu();
  }
});

// Inicializar buscador del header
const headerSearchInput = document.getElementById("headerSearchInput");
const headerSearchResults = document.getElementById("headerSearchResults");
const headerSearchContainer = document.getElementById("headerSearch");

headerSearchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (query === "") {
    headerSearchResults.classList.remove("show");
    headerSearchResults.innerHTML = "";
    return;
  }

  const filtered = CATEGORIES.filter(
    (cat) =>
      cat.title.toLowerCase().includes(query) ||
      cat.titleEs.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    headerSearchResults.innerHTML =
      '<div class="search-result-item no-results">No se encontraron categorías</div>';
    headerSearchResults.classList.add("show");
    return;
  }

  headerSearchResults.innerHTML = "";
  filtered.forEach((cat) => {
    const item = document.createElement("a");
    item.className = "search-result-item";
    item.href = "#/category/" + cat.id;
    item.innerHTML = `<strong>${cat.title}</strong><br><span class="search-result-subtitle">${cat.titleEs}</span>`;
    item.addEventListener("click", () => {
      headerSearchInput.value = "";
      headerSearchResults.classList.remove("show");
    });
    headerSearchResults.appendChild(item);
  });
  headerSearchResults.classList.add("show");
});

// Cerrar resultados al hacer clic fuera
document.addEventListener("click", (e) => {
  if (!headerSearchContainer.contains(e.target)) {
    headerSearchResults.classList.remove("show");
  }
});

// Modal de gestión de participantes
const votersModal = document.getElementById("votersModal");
const manageVotersBtn = document.getElementById("manageVotersBtn");
const voterEl = document.getElementById("footerVoter");
const nomineeEl = document.getElementById("footerNominee");
const separatorEl = document.querySelector(".footer-separator");
// Mostrar el usuario seleccionado en el footer
let selectedInitials = localStorage.getItem("tga2025_selectedUser");
let userName = "Usuario";
if (selectedInitials) {
  const user = STATE.voters.find((v) => v.initials === selectedInitials);
  if (user) userName = user.name;
} else if (STATE.voters.length > 0) {
  userName = STATE.voters[0].name;
}
voterEl.textContent = userName;

// Obtener la categoría activa
const hash = location.hash || "";
let catId = null;
if (hash.startsWith("#/category/")) {
  catId = hash.split("/")[2];
} else if (FOOTER_STATE.categoryId) {
  catId = FOOTER_STATE.categoryId;
}

// Obtener el id del juego seleccionado para este usuario y categoría
let nomineeTitle = "";
if (
  selectedInitials &&
  catId &&
  STATE.nominations &&
  STATE.nominations[selectedInitials]
) {
  const nomineeId = STATE.nominations[selectedInitials][catId];
  if (nomineeId) {
    // Buscar el nombre del juego en CATEGORIES
    for (const cat of CATEGORIES) {
      if (cat.id === catId) {
        const game = cat.games.find((g) => g.id === nomineeId);
        nomineeTitle = game ? game.name : nomineeId;
        break;
      }
    }
  }
}
if (nomineeTitle) {
  nomineeEl.textContent = nomineeTitle;
  separatorEl.style.display = "inline";
} else {
  nomineeEl.textContent = "";
  separatorEl.style.display = "none";
}
manageVotersBtn.addEventListener("click", () => {
  votersModal.classList.add("show");
  renderVotersList();
  lucide.createIcons();
});

closeModal.addEventListener("click", () => {
  votersModal.classList.remove("show");
});

votersModal.addEventListener("click", (e) => {
  if (e.target === votersModal) {
    votersModal.classList.remove("show");
  }
});

addVoterBtn.addEventListener("click", () => {
  const name = voterNameInput.value.trim();
  const initials = voterInitialsInput.value.trim().toUpperCase();

  if (!name || !initials) {
    alert("Por favor, completa todos los campos");
    return;
  }

  if (initials.length !== 3) {
    alert("Las siglas deben tener exactamente 3 letras");
    return;
  }

  // Verificar si ya existe
  const allVoters = getVoters();
  if (allVoters.includes(initials)) {
    alert("Ya existe un participante con esas siglas");
    return;
  }

  // Añadir votante
  STATE.voters.push({ name, initials });
  saveState(STATE);

  // Limpiar inputs
  voterNameInput.value = "";
  voterInitialsInput.value = "";

  renderVotersList();
  updateRankingSidebar();
  route(); // Re-renderizar vista actual
});

function loadTheme() {
  // Forzar siempre el tema dark como base
  localStorage.setItem(STORAGE_KEYS.theme, "dark");
  document.documentElement.classList.remove("light-theme");
}

// inicial render
loadTheme();
route();
updateRankingSidebar();
updateFooter();
