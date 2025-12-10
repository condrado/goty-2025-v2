
// sessionStorage keys
const STORAGE_KEYS = {
	predictions: 'tga2025_predictions', // formato: { categoryId: { voterName: gameId } }
	winners: 'tga2025_winners', // formato: { categoryId: gameId }
	voters: 'tga2025_voters', // formato: [{ name: string, initials: string }]
	sortOrder: 'tga2025_sortOrder', // formato: 'event' | 'alphabetical'
	theme: 'tga2025_theme', // formato: 'dark' | 'light'
	bingo: 'tga2025_bingo' // formato: { voterInitials: [{ id, text, completed }] }
};

// carga/guarda
function loadState() {
	const rawPred = localStorage.getItem(STORAGE_KEYS.predictions);
	const rawWin = localStorage.getItem(STORAGE_KEYS.winners);
	const rawVoters = localStorage.getItem(STORAGE_KEYS.voters);
	const rawSort = localStorage.getItem(STORAGE_KEYS.sortOrder);
	try {
		// Si no hay voters guardados o está vacío, usar los predefinidos de VOTERS
		let voters = rawVoters ? JSON.parse(rawVoters) : [];
		// Si no hay voters, usar los predefinidos
		if (voters.length === 0 && VOTERS.length > 0) {
			voters = VOTERS;
			localStorage.setItem(STORAGE_KEYS.voters, JSON.stringify(VOTERS));
		}
		return {
			predictions: rawPred ? JSON.parse(rawPred) : {},
			winners: rawWin ? JSON.parse(rawWin) : {},
			voters: voters,
			sortOrder: rawSort || 'event'
		}
	} catch (e) {
		console.error('Error parseando localStorage', e);
		return { predictions: {}, winners: {}, voters: VOTERS, sortOrder: 'event' };
	}
}
function saveState(state) {
	localStorage.setItem(STORAGE_KEYS.predictions, JSON.stringify(state.predictions));
	localStorage.setItem(STORAGE_KEYS.winners, JSON.stringify(state.winners));
	localStorage.setItem(STORAGE_KEYS.voters, JSON.stringify(state.voters));
	localStorage.setItem(STORAGE_KEYS.sortOrder, state.sortOrder);
}

// inicializa
let STATE = loadState();

// Estado del footer
let FOOTER_STATE = {
	voterName: null,
	nomineeTitle: null,
	categoryId: null
};

// Obtener lista de votantes
function getVoters() {
	return STATE.voters.map(v => v.initials);
}

// Actualizar footer
function updateFooter() {
	const voterEl = document.getElementById('footerVoter');
	const nomineeEl = document.getElementById('footerNominee');
	const separatorEl = document.querySelector('.footer-separator');
	
	// Siempre mostrar el nombre del usuario
	const userName = STATE.voters.length > 0 ? STATE.voters[0].name : 'Usuario';
	voterEl.textContent = userName;
	
	// Mostrar nominee y separador solo si hay selección
	if (FOOTER_STATE.nomineeTitle) {
		nomineeEl.textContent = FOOTER_STATE.nomineeTitle;
		separatorEl.style.display = 'inline';
	} else {
		nomineeEl.textContent = '';
		separatorEl.style.display = 'none';
	}
}

// Obtener nombre formateado del votante
function getVoterName(initials) {
	const customVoter = STATE.voters.find(v => v.initials === initials);
	if (customVoter) {
		return `${customVoter.name} (${customVoter.initials})`;
	}
	return initials;
}

// Obtener categorías ordenadas según preferencia
function getSortedCategories() {
	let categories = [...CATEGORIES];
	if (STATE.sortOrder === 'alphabetical') {
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
const navEl = document.getElementById('nav');
const mainEl = document.getElementById('main');
const rankingContent = document.getElementById('rankingContent');
const rankingSidebar = document.getElementById('rankingSidebar');

function updateRankingSidebar() {
	const currentHash = location.hash || '#/';
	
	// Solo mostrar el sidebar en la página de ranking
	if (!currentHash.startsWith('#/ranking')) {
		rankingSidebar.style.display = 'none';
		return;
	}
	
	rankingSidebar.style.display = 'block';
	const scores = computeScores();
	rankingContent.innerHTML = '';
	
	if (getVoters().length === 0) {
		const emptyMessage = document.createElement('div');
		emptyMessage.style.textAlign = 'center';
		emptyMessage.style.color = 'var(--muted)';
		emptyMessage.style.fontSize = '13px';
		emptyMessage.style.padding = '16px 8px';
		emptyMessage.innerHTML = 'Aún no hay participantes.<br>Haz clic en <i data-lucide="user-plus" style="width:14px;height:14px;display:inline-block;vertical-align:middle"></i> para añadir.';
		rankingContent.appendChild(emptyMessage);
		if (typeof lucide !== 'undefined') {
			lucide.createIcons();
		}
		return;
	}
	
	// Ranking por puntos de predicciones
	Object.entries(scores).sort((a, b) => b[1] - a[1]).forEach(([name, pts]) => {
		const item = document.createElement('div');
		item.className = 'rank-item';
		const customVoter = STATE.voters.find(v => v.initials === name);
		const displayName = customVoter ? customVoter.name : name;
		item.innerHTML = `<div><strong>${displayName}</strong></div><div class="rank-points">${pts} pts</div>`;
		rankingContent.appendChild(item);
	});
}

function renderNav(activeId) {
	navEl.innerHTML = '';
	
	// Contenedor de enlaces fijos
	const fixedLinks = document.createElement('div');
	fixedLinks.className = 'nav-fixed';
	
	const home = document.createElement('a');
	home.href = '#/';
	home.className = activeId === 'home' ? 'active nav-link-row' : 'nav-link-row';
	home.innerHTML = '<i data-lucide="trophy" class="lucide-icon"></i> Categorías';
	fixedLinks.appendChild(home);
	
	const rank = document.createElement('a');
	rank.href = '#/ranking';
	rank.className = 'nav-link-row';
	rank.innerHTML = '<i data-lucide="bar-chart-3" class="lucide-icon"></i> Desglose del ranking';
	if (activeId === 'ranking') rank.classList.add('active');
	fixedLinks.appendChild(rank);
	
	const bingo = document.createElement('a');
	bingo.href = '#/bingo';
	bingo.className = 'nav-link-row';
	bingo.innerHTML = '<i data-lucide="grid-3x3" class="lucide-icon"></i> Bingo';
	if (activeId === 'bingo') bingo.classList.add('active');
	fixedLinks.appendChild(bingo);
	
	navEl.appendChild(fixedLinks);
	
	// Contenedor scrollable de categorías
	const scrollableCategories = document.createElement('div');
	scrollableCategories.className = 'nav-scrollable';

	getSortedCategories().forEach(cat => {
		const a = document.createElement('a');
		a.href = '#/category/' + cat.id;
		a.className = 'nav-link-row';
		
		// Verificar si la categoría tiene ganador
		const hasWinner = STATE.winners[cat.id];
		
		if (hasWinner) {
			const iconSpan = document.createElement('span');
			iconSpan.className = 'nav-winner-icon';
			iconSpan.textContent = '✓';
			a.appendChild(iconSpan);
			a.classList.add('has-winner');
		}
		
		const textSpan = document.createElement('span');
		textSpan.className = 'nav-text-column';
		const titleEn = document.createElement('span');
		titleEn.className = 'nav-title-en';
		titleEn.textContent = cat.title;
		const titleEs = document.createElement('span');
		titleEs.className = 'nav-title-es';
		titleEs.textContent = cat.titleEs;
		textSpan.appendChild(titleEn);
		textSpan.appendChild(titleEs);
		a.appendChild(textSpan);
		
		if (cat.id === activeId) a.classList.add('active');
		scrollableCategories.appendChild(a);
	});

	navEl.appendChild(scrollableCategories);
	
	// Inicializar iconos de lucide
	if (typeof lucide !== 'undefined') {
		lucide.createIcons();
	}
}

function renderHome() {
	renderNav('home');
	updateRankingSidebar();
	mainEl.innerHTML = '';
	
	// Ocultar botón reset del header
	document.getElementById('resetAll').style.display = 'none';
	
	// Ocultar botones de navegación de categorías y expandir buscador
	const categoryNav = document.querySelector('.category-nav');
	const searchContainer = document.getElementById('headerSearch');
	if (categoryNav) categoryNav.style.display = 'none';
	if (searchContainer) searchContainer.style.width = '100%';
	
	// Actualizar footer para mantener la última selección
	updateFooter();
	
	// Header wrapper con filtro y botón reset
	const headerWrapper = document.createElement('div');
	headerWrapper.className = 'header-wrapper';
	
	const h = document.createElement('h2');
	h.innerHTML = '<i data-lucide="trophy" class="lucide-icon"></i> Categorías';
	
	const controlsWrapper = document.createElement('div');
	controlsWrapper.className = 'header-controls';
	
	// Desplegable de ordenación
	const sortSelect = document.createElement('select');
	sortSelect.className = 'sort-select';
	sortSelect.innerHTML = `
		<option value="event">Evento</option>
		<option value="alphabetical">Alfabéticamente</option>
	`;
	sortSelect.value = STATE.sortOrder;
	
	const resetBtn = document.createElement('button');
	resetBtn.className = 'winner-btn';
	resetBtn.innerHTML = '<i data-lucide="rotate-ccw" style="width:18px;height:18px"></i>';
	resetBtn.setAttribute('aria-label', 'Restablecer todo');
	resetBtn.setAttribute('title', 'Restablecer todo');
	resetBtn.addEventListener('click', () => {
		if (!confirm('¿Restablecer todas las predicciones, ganadores y participantes? (se borrará todo del localStorage)')) return;
		STATE = { predictions: {}, winners: {}, voters: VOTERS, sortOrder: 'event' }; 
		saveState(STATE); 
		route();
	});
	
	controlsWrapper.appendChild(sortSelect);
	controlsWrapper.appendChild(resetBtn);
	
	headerWrapper.appendChild(h);
	headerWrapper.appendChild(controlsWrapper);
	mainEl.appendChild(headerWrapper);
	
	// Inicializar iconos de lucide
	if (typeof lucide !== 'undefined') {
		lucide.createIcons();
	}
	
	const list = document.createElement('div');
	list.className = 'grid';
	
	// Función para renderizar categorías
	const renderCategories = (sortType) => {
		list.innerHTML = '';
		let categoriesToRender = getSortedCategories();
		
		categoriesToRender.forEach(cat => {
		const card = document.createElement('a');
		card.className = 'card';
		card.href = '#/category/' + cat.id;
		
		// Verificar si la categoría tiene ganador
		const hasWinner = STATE.winners[cat.id];
		if (hasWinner) {
			card.classList.add('has-winner');
		}
		
		const m = document.createElement('div');
		m.style.flex = '1';
		const title = document.createElement('h3'); 
		
		// Añadir icono de check si tiene ganador
		if (hasWinner) {
			const winnerIcon = document.createElement('span');
			winnerIcon.className = 'nav-winner-icon';
			winnerIcon.textContent = '✓';
			title.appendChild(winnerIcon);
		}
		
		const titleText = document.createTextNode(cat.title);
		title.appendChild(titleText);
		
		const info = document.createElement('div'); info.style.color = 'var(--muted)'; info.style.fontSize = '13px';
		const total = cat.games.length;
		const winnerAssigned = hasWinner ? ' · Ganador marcado' : '';
		info.textContent = `${total} nominados${winnerAssigned}`;
		m.appendChild(title); m.appendChild(info);
		card.appendChild(m);
		list.appendChild(card);
		});
	};
	
	// Renderizar inicialmente
	renderCategories(STATE.sortOrder);
	mainEl.appendChild(list);
	
	// Event listener para el cambio de ordenación
	sortSelect.addEventListener('change', (e) => {
		STATE.sortOrder = e.target.value;
		saveState(STATE);
		renderCategories(STATE.sortOrder);
		renderNav('home'); // Actualizar nav con nuevo orden
	});
}

function renderCategory(catId) {
	const cat = CATEGORIES.find(c => c.id === catId);
	renderNav(catId);
	updateRankingSidebar();
	if (!cat) { mainEl.innerHTML = '<p>Categoría no encontrada</p>'; return; }

	// Ocultar botón reset del header
	document.getElementById('resetAll').style.display = 'none';

	mainEl.innerHTML = '';
	
	// Mostrar botones de navegación de categorías y restaurar ancho del buscador
	const categoryNav = document.querySelector('.category-nav');
	const searchContainer = document.getElementById('headerSearch');
	if (categoryNav) categoryNav.style.display = 'flex';
	if (searchContainer) searchContainer.style.width = '';
	
	// Actualizar footer con la selección de esta categoría
	const winnerId = STATE.winners[catId];
	if (winnerId) {
		const winnerGame = cat.games.find(g => g.id === winnerId);
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
	const header = document.createElement('div'); header.className = 'category-header';
	
	// Navegación entre categorías
	const sortedCategories = getSortedCategories();
	const currentIndex = sortedCategories.findIndex(c => c.id === catId);
	const prevCat = currentIndex > 0 ? sortedCategories[currentIndex - 1] : null;
	const nextCat = currentIndex < sortedCategories.length - 1 ? sortedCategories[currentIndex + 1] : null;
	
	const navButtons = document.createElement('div'); navButtons.className = 'category-nav';
	
	// Botón anterior (siempre se crea)
	const prevBtn = document.createElement('button');
	prevBtn.className = 'category-nav-btn prev icon-btn';
	prevBtn.innerHTML = '<i data-lucide="chevron-left" style="width:18px;height:18px"></i>';
	prevBtn.setAttribute('aria-label', 'Categoría anterior');
	prevBtn.setAttribute('title', 'Categoría anterior');
	if (prevCat) {
		prevBtn.addEventListener('click', () => {
			window.location.hash = `#/category/${prevCat.id}`;
		});
	} else {
		prevBtn.style.visibility = 'hidden';
	}
	navButtons.appendChild(prevBtn);
	
	// Botón siguiente (siempre se crea)
	const nextBtn = document.createElement('button');
	nextBtn.className = 'category-nav-btn next icon-btn';
	nextBtn.innerHTML = '<i data-lucide="chevron-right" style="width:18px;height:18px"></i>';
	nextBtn.setAttribute('aria-label', 'Siguiente categoría');
	nextBtn.setAttribute('title', 'Siguiente categoría');
	if (nextCat) {
		nextBtn.addEventListener('click', () => {
			window.location.hash = `#/category/${nextCat.id}`;
		});
	} else {
		nextBtn.style.visibility = 'hidden';
	}
	navButtons.appendChild(nextBtn);
	
	// Insertar botones en el header junto al search
	const headerSearchContainer = document.getElementById('headerSearch');
	if (headerSearchContainer && headerSearchContainer.parentElement) {
		// Buscar si ya hay botones de navegación previos y eliminarlos
		const existingNavBtns = headerSearchContainer.parentElement.querySelector('.category-nav');
		if (existingNavBtns) {
			existingNavBtns.remove();
		}
		// Insertar los nuevos botones después del search
		headerSearchContainer.parentElement.insertBefore(navButtons, headerSearchContainer.nextSibling);
	}
	
	const headerTop = document.createElement('div'); headerTop.className = 'category-header-top';
	const h = document.createElement('h2');
	const titleEn = document.createElement('span');
	titleEn.textContent = cat.title;
	const titleEs = document.createElement('span');
	titleEs.className = 'title-es';
	titleEs.textContent = ' ' + cat.titleEs;
	h.appendChild(titleEn);
	h.appendChild(titleEs);
	
	headerTop.appendChild(h);
	header.appendChild(headerTop);
	mainEl.appendChild(header);

	const grid = document.createElement('div'); grid.className = 'nominees-grid';
	cat.games.forEach(game => {
		const gid = game.id;
		const gname = game.name || guessNameFromId(gid);
		const isWinner = STATE.winners[catId] === gid;
		
		const card = document.createElement('div');
		card.className = 'nominee-card' + (isWinner ? ' is-winner' : '');

		// Imagen principal
		const imageContainer = document.createElement('div'); 
		imageContainer.className = 'nominee-image';
		const img = document.createElement('img'); 
		img.src = game.img || makeImgUrl(gid, gname); 
		img.alt = gname;
		imageContainer.appendChild(img);

		// Info del juego
		const info = document.createElement('div'); info.className = 'nominee-info';
		const title = document.createElement('h3'); 
		title.className = 'nominee-title';
		title.textContent = gname;

		// Badge de ganador (solo icono)
		if (isWinner) {
			const winnerBadge = document.createElement('div');
			winnerBadge.className = 'winner-badge';
			winnerBadge.innerHTML = '<i data-lucide="trophy" class="lucide-icon-sm"></i>';
			info.appendChild(winnerBadge);
		}

		// Ensamblar card
		info.appendChild(title);
		
		card.appendChild(imageContainer);
		card.appendChild(info);
		
		// Click en toda la card para marcar ganador
		card.addEventListener('click', (e) => {
			// No toggle si se hizo click en un voter chip
			if (e.target.classList.contains('voter-chip')) return;
			
			// Guardar posición del scroll antes de re-renderizar
			const grid = document.querySelector('.nominees-grid');
			const scrollPos = grid ? grid.scrollTop : 0;
			
			if (STATE.winners[catId] === gid) {
				delete STATE.winners[catId];
				// Limpiar footer si se deselecciona
				if (FOOTER_STATE.categoryId === catId) {
					FOOTER_STATE.nomineeTitle = null;
					FOOTER_STATE.categoryId = null;
					updateFooter();
				}
			} else {
				STATE.winners[catId] = gid;
				// Actualizar footer con la selección
				FOOTER_STATE.nomineeTitle = gname;
				FOOTER_STATE.categoryId = catId;
				updateFooter();
			}
			saveState(STATE);
			renderCategory(catId);
			
			// Restaurar posición del scroll después de re-renderizar
			requestAnimationFrame(() => {
				const newGrid = document.querySelector('.nominees-grid');
				if (newGrid) {
					newGrid.scrollTop = scrollPos;
				}
			});
		});
		
		grid.appendChild(card);
	});

	mainEl.appendChild(grid);
	
	// Ajustar altura del grid dinámicamente calculando todos los elementos
	requestAnimationFrame(() => {
		const nomineeGrid = document.querySelector('.nominees-grid');
		if (nomineeGrid) {
			// Obtener altura de cada elemento del DOM
			const header = document.querySelector('header');
			const categoryHeader = document.querySelector('.category-header');
			const footer = document.querySelector('.selection-footer');
			const content = document.querySelector('.content');
			const body = document.body;
			
			// Calcular espacios
			const headerHeight = header ? header.offsetHeight : 0;
			const categoryHeaderHeight = categoryHeader ? categoryHeader.offsetHeight : 0;
			const categoryHeaderMarginBottom = categoryHeader ? parseInt(getComputedStyle(categoryHeader).marginBottom) : 0;
			const footerHeight = footer ? footer.offsetHeight : 0;
			const contentPaddingTop = content ? parseInt(getComputedStyle(content).paddingTop) : 0;
			const contentPaddingBottom = content ? parseInt(getComputedStyle(content).paddingBottom) : 0;
			const bodyPaddingTop = parseInt(getComputedStyle(body).paddingTop);
			const bodyPaddingBottom = parseInt(getComputedStyle(body).paddingBottom);
			const headerMarginBottom = header ? parseInt(getComputedStyle(header).marginBottom) : 0;
			
			// Debug: mostrar valores
			console.log('📏 Alturas calculadas:');
			console.log('  header:', headerHeight + 'px');
			console.log('  header margin-bottom:', headerMarginBottom + 'px');
			console.log('  categoryHeader:', categoryHeaderHeight + 'px');
			console.log('  categoryHeader margin-bottom:', categoryHeaderMarginBottom + 'px');
			console.log('  footer:', footerHeight + 'px');
			console.log('  content padding-top:', contentPaddingTop + 'px');
			console.log('  content padding-bottom:', contentPaddingBottom + 'px');
			console.log('  body padding-top:', bodyPaddingTop + 'px');
			console.log('  body padding-bottom:', bodyPaddingBottom + 'px');
			
			// Calcular altura total a restar
			const totalToSubtract = headerHeight + headerMarginBottom + categoryHeaderHeight + categoryHeaderMarginBottom + footerHeight + 
				contentPaddingTop + contentPaddingBottom + 
				bodyPaddingTop + bodyPaddingBottom;
			
			console.log('  TOTAL a restar:', totalToSubtract + 'px');
			console.log('  Altura final del grid: calc(100vh - ' + totalToSubtract + 'px)');
			
			nomineeGrid.style.height = `calc(100vh - ${totalToSubtract}px)`;
		}
	});
	
	// Inicializar iconos de lucide en las categorías
	if (typeof lucide !== 'undefined') {
		lucide.createIcons();
	}
}

function renderRanking() {
	renderNav('ranking');
	updateRankingSidebar();
	mainEl.innerHTML = '';
	
	// Ocultar botón reset del header
	document.getElementById('resetAll').style.display = 'none';
	
	// Ocultar botones de navegación de categorías y expandir buscador
	const categoryNav = document.querySelector('.category-nav');
	const searchContainer = document.getElementById('headerSearch');
	if (categoryNav) categoryNav.style.display = 'none';
	if (searchContainer) searchContainer.style.width = '100%';
	
	// Actualizar footer para mantener la última selección
	updateFooter();
	
	const h = document.createElement('h2'); 
	h.className = 'page-title';
	h.innerHTML = '<i data-lucide="bar-chart-3" class="lucide-icon"></i> Desglose del ranking';
	mainEl.appendChild(h);
	
	// Inicializar iconos de lucide
	if (typeof lucide !== 'undefined') {
		lucide.createIcons();
	}

	// breakdown per category
	const breakdown = document.createElement('div'); breakdown.className = 'ranking-breakdown';
	getSortedCategories().forEach(cat => {
		const row = document.createElement('div'); row.className = 'ranking-breakdown-category';
		const w = STATE.winners[cat.id];
		const total = document.createElement('p'); total.className = 'category-winner-label';
		
		// Añadir icono de check si hay ganador
		if (w) {
			const checkIcon = document.createElement('span');
			checkIcon.className = 'nav-winner-icon';
			checkIcon.textContent = '✓';
			total.appendChild(checkIcon);
		}
		
		const titleBold = document.createElement('strong'); titleBold.textContent = cat.title;
		total.appendChild(titleBold);
		
		// Solo mostrar separador y ganador si hay ganador
		if (w) {
			const separator = document.createElement('span'); 
			separator.className = 'category-separator'; 
			separator.textContent = '|';
			total.appendChild(separator);
			const winnerSpan = document.createElement('span'); 
			winnerSpan.className = 'winner-name'; 
			winnerSpan.textContent = guessNameFromId(w);
			total.appendChild(winnerSpan);
		}
		row.appendChild(total);
		const small = document.createElement('div'); small.className = 'rank-breakdown-row';
		getVoters().forEach(v => {
			const pred = STATE.predictions[cat.id] && STATE.predictions[cat.id][v];
			const pt = (w && pred && pred === w) ? 1 : 0;
			const b = document.createElement('div'); b.className = 'rank-item rank-item-fixed';
			if (pt === 1) b.classList.add('correct');
			const topRow = document.createElement('div'); topRow.className = 'rank-item-top';
			const initialsDiv = document.createElement('div'); initialsDiv.className = 'rank-item-initials'; initialsDiv.textContent = v;
			const pointsDiv = document.createElement('div'); pointsDiv.className = 'rank-item-points'; pointsDiv.textContent = pt;
			topRow.appendChild(initialsDiv); topRow.appendChild(pointsDiv);
			const predSpan = document.createElement('span'); predSpan.className = 'rank-item-prediction'; predSpan.textContent = pred ? guessNameFromId(pred) : '—';
			b.appendChild(topRow); b.appendChild(predSpan);
			small.appendChild(b);
		});
		row.appendChild(small);
		breakdown.appendChild(row);
	});
	mainEl.appendChild(breakdown);
}

function computeScores() {
	const scores = {};
	getVoters().forEach(v => scores[v] = 0);
	CATEGORIES.forEach(cat => {
		const winner = STATE.winners[cat.id];
		if (!winner) return;
		getVoters().forEach(v => {
			const pred = STATE.predictions[cat.id] && STATE.predictions[cat.id][v];
			if (pred && pred === winner) scores[v] += 1;
		});
	});
	return scores;
}

function guessNameFromId(id) {
	// busca el nombre en las categorías
	for (const cat of CATEGORIES) {
		const found = cat.games.find(g => g.id === id);
		if (found && found.name) return found.name;
	}
	return id;
}

function renderBingo() {
	renderNav('bingo');
	updateRankingSidebar();
	mainEl.innerHTML = '';
	
	// Ocultar botón reset del header
	document.getElementById('resetAll').style.display = 'none';
	
	// Ocultar botones de navegación de categorías y expandir buscador
	const categoryNav = document.querySelector('.category-nav');
	const searchContainer = document.getElementById('headerSearch');
	if (categoryNav) categoryNav.style.display = 'none';
	if (searchContainer) searchContainer.style.width = '100%';
	
	// Actualizar footer para mantener la última selección
	updateFooter();
	
	const h = document.createElement('h2'); 
	h.className = 'page-title';
	h.innerHTML = '<i data-lucide="grid-3x3" class="lucide-icon"></i> Bingo';
	mainEl.appendChild(h);
	
	// Inicializar iconos de lucide
	if (typeof lucide !== 'undefined') {
		lucide.createIcons();
	}

	// Cargar datos de bingo del localStorage
	const bingoData = loadBingoData();
	
	// Contenedor de las 4 columnas
	const bingoGrid = document.createElement('div');
	bingoGrid.className = 'bingo-grid';
	
	STATE.voters.forEach(voter => {
		const column = document.createElement('div');
		column.className = 'bingo-column';
		
		// Header de la columna con nombre del votante
		const columnHeader = document.createElement('div');
		columnHeader.className = 'bingo-column-header';
		const totalItems = getBingoTotal(bingoData, voter.initials);
		const completedItems = getBingoCount(bingoData, voter.initials);
		columnHeader.innerHTML = `<h3>${voter.name}</h3><span class="bingo-count">${completedItems}/${totalItems}</span>`;
		column.appendChild(columnHeader);
		
		// Selector de opciones BINGO
		const selectorContainer = document.createElement('div');
		selectorContainer.className = 'bingo-selector-container';
		
		const select = document.createElement('select');
		select.className = 'bingo-item-selector';
		select.innerHTML = '<option value="">Seleccionar opción...</option>';
		
		// Agrupar opciones por categoría
		const categories = [...new Set(BINGO.map(item => item.categoria))];
		categories.forEach(categoria => {
			const optgroup = document.createElement('optgroup');
			optgroup.label = categoria;
			BINGO.filter(item => item.categoria === categoria).forEach(item => {
				const option = document.createElement('option');
				option.value = item.id;
				option.textContent = item.texto;
				// Deshabilitar si ya está seleccionada
				if (isItemSelected(bingoData, voter.initials, item.id)) {
					option.disabled = true;
					option.textContent += ' ✓';
				}
				optgroup.appendChild(option);
			});
			select.appendChild(optgroup);
		});
		
		select.addEventListener('change', (e) => {
			const itemId = parseInt(e.target.value);
			if (!itemId) return;
			
			// Verificar límite de 10 items
			const currentItems = bingoData[voter.initials] || [];
			if (currentItems.length >= 10) {
				alert('Ya has seleccionado 10 opciones. Elimina alguna para añadir otra.');
				e.target.value = '';
				return;
			}
			
			const bingoItem = BINGO.find(b => b.id === itemId);
			if (bingoItem) {
				addBingoItem(bingoData, voter.initials, {
					id: bingoItem.id,
					text: bingoItem.texto,
					completed: false
				});
				saveBingoData(bingoData);
				renderBingo();
			}
		});
		
		selectorContainer.appendChild(select);
		column.appendChild(selectorContainer);
		
		// Input para opciones personalizadas
		const customContainer = document.createElement('div');
		customContainer.className = 'bingo-custom-container';
		
		const customInput = document.createElement('input');
		customInput.type = 'text';
		customInput.className = 'bingo-custom-input';
		customInput.placeholder = 'Añadir opción personalizada...';
		
		const customBtn = document.createElement('button');
		customBtn.className = 'bingo-custom-btn';
		customBtn.innerHTML = '<i data-lucide="plus" class="lucide-icon-sm"></i>';
		
		customBtn.addEventListener('click', () => {
			const customText = customInput.value.trim();
			if (!customText) return;
			
			// Verificar límite de 10 items
			const currentItems = bingoData[voter.initials] || [];
			if (currentItems.length >= 10) {
				alert('Ya has seleccionado 10 opciones. Elimina alguna para añadir otra.');
				return;
			}
			
			// Crear ID único para item personalizado (negativo para distinguir)
			const customId = -Date.now();
			addBingoItem(bingoData, voter.initials, {
				id: customId,
				text: customText,
				completed: false
			});
			saveBingoData(bingoData);
			customInput.value = '';
			renderBingo();
		});
		
		customContainer.appendChild(customInput);
		customContainer.appendChild(customBtn);
		column.appendChild(customContainer);
		
		// Lista de items seleccionados
		const itemsList = document.createElement('div');
		itemsList.className = 'bingo-items-list';
		
		const userItems = bingoData[voter.initials] || [];
		userItems.forEach((item, index) => {
			const itemDiv = document.createElement('div');
			itemDiv.className = 'bingo-item' + (item.completed ? ' completed' : '');
			
			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.className = 'bingo-checkbox';
			checkbox.checked = item.completed;
			checkbox.addEventListener('change', (e) => {
				toggleBingoItem(bingoData, voter.initials, index, e.target.checked);
				saveBingoData(bingoData);
				renderBingo();
			});
			
			const label = document.createElement('label');
			label.className = 'bingo-label';
			label.textContent = item.text;
			
			const deleteBtn = document.createElement('button');
			deleteBtn.className = 'bingo-delete-btn';
			deleteBtn.innerHTML = '<i data-lucide="x" class="lucide-icon-sm"></i>';
			deleteBtn.addEventListener('click', () => {
				deleteBingoItem(bingoData, voter.initials, index);
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
	});
	
	mainEl.appendChild(bingoGrid);
	
	// Inicializar iconos de lucide al final
	if (typeof lucide !== 'undefined') {
		lucide.createIcons();
	}
}

// Funciones auxiliares para Bingo
function loadBingoData() {
	const raw = localStorage.getItem(STORAGE_KEYS.bingo);
	try {
		return raw ? JSON.parse(raw) : {};
	} catch (e) {
		return {};
	}
}

function saveBingoData(data) {
	localStorage.setItem(STORAGE_KEYS.bingo, JSON.stringify(data));
}

function addBingoItem(data, voterInitials, item) {
	if (!data[voterInitials]) {
		data[voterInitials] = [];
	}
	data[voterInitials].push(item);
}

function deleteBingoItem(data, voterInitials, index) {
	if (data[voterInitials]) {
		data[voterInitials].splice(index, 1);
	}
}

function toggleBingoItem(data, voterInitials, index, completed) {
	if (data[voterInitials] && data[voterInitials][index]) {
		data[voterInitials][index].completed = completed;
	}
}

function isItemSelected(data, voterInitials, itemId) {
	const items = data[voterInitials] || [];
	return items.some(item => item.id === itemId);
}

function getBingoCount(data, voterInitials) {
	const items = data[voterInitials] || [];
	return items.filter(item => item.completed).length;
}

function getBingoTotal(data, voterInitials) {
	const items = data[voterInitials] || [];
	return items.length;
}

function route() {
	const hash = location.hash || '#/';
	if (hash.startsWith('#/category/')) {
		const cid = hash.split('/')[2]; renderCategory(cid);
	} else if (hash.startsWith('#/ranking')) {
		renderRanking();
	} else if (hash.startsWith('#/bingo')) {
		renderBingo();
	} else {
		renderHome();
	}
}

window.addEventListener('hashchange', route);

	document.getElementById('resetAll').addEventListener('click', () => {
	if (!confirm('¿Restablecer todas las predicciones, ganadores y participantes? (se borrará todo del localStorage)')) return;
	STATE = { predictions: {}, winners: {}, voters: [] }; 
	saveState(STATE); 
	route();
});

// Menu toggle
const menuToggle = document.getElementById('menuToggle');
const navEl2 = document.getElementById('nav');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
	navEl2.classList.add('open');
	navOverlay.classList.add('active');
}

function closeMenu() {
	navEl2.classList.remove('open');
	navOverlay.classList.remove('active');
}

menuToggle.addEventListener('click', () => {
	if (navEl2.classList.contains('open')) {
		closeMenu();
	} else {
		openMenu();
	}
});

navOverlay.addEventListener('click', closeMenu);

// Cerrar menú al hacer clic en un enlace
navEl2.addEventListener('click', (e) => {
	// Buscar el elemento <a> más cercano (puede ser el target o un ancestro)
	const link = e.target.closest('a');
	if (link && navEl2.contains(link)) {
		closeMenu();
	}
});

// Inicializar buscador del header
const headerSearchInput = document.getElementById('headerSearchInput');
const headerSearchResults = document.getElementById('headerSearchResults');
const headerSearchContainer = document.getElementById('headerSearch');

headerSearchInput.addEventListener('input', (e) => {
	const query = e.target.value.toLowerCase().trim();
	if (query === '') {
		headerSearchResults.classList.remove('show');
		headerSearchResults.innerHTML = '';
		return;
	}
	
	const filtered = CATEGORIES.filter(cat => 
		cat.title.toLowerCase().includes(query) || 
		cat.titleEs.toLowerCase().includes(query)
	);
	
	if (filtered.length === 0) {
		headerSearchResults.innerHTML = '<div class="search-result-item no-results">No se encontraron categorías</div>';
		headerSearchResults.classList.add('show');
		return;
	}
	
	headerSearchResults.innerHTML = '';
	filtered.forEach(cat => {
		const item = document.createElement('a');
		item.className = 'search-result-item';
		item.href = '#/category/' + cat.id;
		item.innerHTML = `<strong>${cat.title}</strong><br><span class="search-result-subtitle">${cat.titleEs}</span>`;
		item.addEventListener('click', () => {
			headerSearchInput.value = '';
			headerSearchResults.classList.remove('show');
		});
		headerSearchResults.appendChild(item);
	});
	headerSearchResults.classList.add('show');
});

// Cerrar resultados al hacer clic fuera
document.addEventListener('click', (e) => {
	if (!headerSearchContainer.contains(e.target)) {
		headerSearchResults.classList.remove('show');
	}
});

// Modal de gestión de participantes
const votersModal = document.getElementById('votersModal');
const manageVotersBtn = document.getElementById('manageVotersBtn');
const closeModal = document.getElementById('closeModal');
const addVoterBtn = document.getElementById('addVoterBtn');
const voterNameInput = document.getElementById('voterName');
const voterInitialsInput = document.getElementById('voterInitials');
const votersList = document.getElementById('votersList');

function renderVotersList() {
	votersList.innerHTML = '';
	STATE.voters.forEach((voter, index) => {
		const item = document.createElement('div');
		item.className = 'voter-item';
		item.innerHTML = `
			<div class="voter-info">
				<strong>${voter.name} (${voter.initials})</strong>
			</div>
			<button class="delete-voter-btn" data-index="${index}">Eliminar</button>
		`;
		votersList.appendChild(item);
	});
	
	// Event listeners para eliminar
	document.querySelectorAll('.delete-voter-btn').forEach(btn => {
		btn.addEventListener('click', () => {
			const index = parseInt(btn.dataset.index);
			const voter = STATE.voters[index];
			if (confirm(`¿Eliminar a ${voter.name}? Se borrarán todas sus predicciones.`)) {
				// Eliminar predicciones del votante
				const initials = voter.initials;
				Object.keys(STATE.predictions).forEach(catId => {
					if (STATE.predictions[catId][initials]) {
						delete STATE.predictions[catId][initials];
					}
				});
			// Eliminar votante
			STATE.voters.splice(index, 1);
			saveState(STATE);
			renderVotersList();
			updateRankingSidebar();
			route(); // Re-renderizar vista actual
			}
		});
	});
}

manageVotersBtn.addEventListener('click', () => {
	votersModal.classList.add('show');
	renderVotersList();
	lucide.createIcons();
});

closeModal.addEventListener('click', () => {
	votersModal.classList.remove('show');
});

votersModal.addEventListener('click', (e) => {
	if (e.target === votersModal) {
		votersModal.classList.remove('show');
	}
});

addVoterBtn.addEventListener('click', () => {
	const name = voterNameInput.value.trim();
	const initials = voterInitialsInput.value.trim().toUpperCase();
	
	if (!name || !initials) {
		alert('Por favor, completa todos los campos');
		return;
	}
	
	if (initials.length !== 3) {
		alert('Las siglas deben tener exactamente 3 letras');
		return;
	}
	
	// Verificar si ya existe
	const allVoters = getVoters();
	if (allVoters.includes(initials)) {
		alert('Ya existe un participante con esas siglas');
		return;
	}
	
	// Añadir votante
	STATE.voters.push({ name, initials });
	saveState(STATE);
	
	// Limpiar inputs
	voterNameInput.value = '';
	voterInitialsInput.value = '';
	
	renderVotersList();
	updateRankingSidebar();
	route(); // Re-renderizar vista actual
});

function loadTheme() {
	const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
	if (savedTheme === 'light') {
		document.documentElement.classList.add('light-theme');
	} else {
		document.documentElement.classList.remove('light-theme');
	}
}

// inicial render
loadTheme();
route();
updateRankingSidebar();
updateFooter();
