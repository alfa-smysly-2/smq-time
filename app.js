const app = document.getElementById('app');
const CATALOG_SOURCE = 'McQueen Shop';
const TELEGRAM = 'https://t.me/smcqueen_shop';
const WHATSAPP = 'https://wa.me/8617160890948';
const FEATURED_ROLEX = ['rlw001', 'rlw020', 'rlw026', 'rlw032'];
const FEATURED_AP = ['apw001', 'apw004', 'apw007', 'apw027'];
let watches = [];
let favorites = new Set();
let visibleCount = 24;
let filters = { brand: '', model: '', size: '', query: '' };

try {
  favorites = new Set(JSON.parse(localStorage.getItem('smq-favorites') || '[]'));
} catch (_) {
  favorites = new Set();
}

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);
const getWatch = id => watches.find(watch => watch.id === id);
const brandCount = brand => watches.filter(watch => watch.brand === brand).length;
const unique = values => [...new Set(values)].sort((a, b) => String(a).localeCompare(String(b), 'ru', { numeric: true }));
const numberOf = number => new Intl.NumberFormat('ru-RU').format(number);
const variantWord = number => number % 10 === 1 && number % 100 !== 11 ? 'вариант' : [2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100) ? 'варианта' : 'вариантов';
const modelWord = number => number % 10 === 1 && number % 100 !== 11 ? 'сохранённая модель' : [2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100) ? 'сохранённые модели' : 'сохранённых моделей';
const thumbPath = image => image.replace('assets/watches/', 'assets/watches/thumbs/');

function favoriteButton(watch) {
  const active = favorites.has(watch.id);
  return `<button class="favorite" type="button" data-favorite="${watch.id}" aria-label="${active ? 'Убрать из избранного' : 'Добавить в избранное'}: ${escapeHTML(watch.brand)} ${escapeHTML(watch.model)}, ${watch.article}" aria-pressed="${active}">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-4.8-8-10.1A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.9C20 15.2 12 20 12 20Z"/></svg>
  </button>`;
}

function card(watch) {
  return `<article class="product-card">
    <div class="product-image">
      <a href="#/w/${watch.id}" aria-label="${escapeHTML(watch.brand)} ${escapeHTML(watch.model)}, артикул ${watch.article}"><img src="${thumbPath(watch.image)}" data-full-src="${watch.image}" alt="${escapeHTML(watch.brand)} ${escapeHTML(watch.model)}, артикул ${watch.article}" loading="lazy"></a>
      ${favoriteButton(watch)}
    </div>
    <span class="product-brand">${escapeHTML(watch.brand)}</span>
    <h3><a href="#/w/${watch.id}">${escapeHTML(watch.model)}</a></h3>
    <div class="subline">${watch.size} мм${watch.variant ? ` · ${escapeHTML(watch.variant)}` : ''}</div>
    <div class="article">АРТ. ${watch.article}</div>
  </article>`;
}

function cards(ids) {
  return ids.map(id => getWatch(id)).filter(Boolean).map(card).join('');
}

function section(title, href, ids) {
  return `<section class="section container"><div class="section-head"><h2>${title}</h2><a class="text-link" href="${href}">Смотреть все</a></div><div class="product-grid">${cards(ids)}</div></section>`;
}

function contactBand() {
  return `<section class="contact-band"><div class="container"><div><div class="eyebrow">Индивидуальный выбор</div><h2>Подберите своё исполнение</h2><p>Отправьте артикул или фото модели, чтобы уточнить варианты и стоимость.</p></div><a class="button" href="${TELEGRAM}" target="_blank" rel="noopener noreferrer">Написать в Telegram</a></div></section>`;
}

function home() {
  const hero = getWatch('rlw001');
  return `<section class="hero">
    <div class="hero-copy"><div class="eyebrow">Каталог часов · SMQ TIME</div><h1>Ваши часы.<br>Ваш выбор.</h1>
      <p>Модели Rolex и Audemars Piguet с фотографиями, артикулами и описаниями из предоставленных каталогов.</p>
      <a class="button" href="#/catalog">Смотреть каталог</a>
      <div class="hero-counts"><div><strong>${numberOf(brandCount('Rolex'))}</strong>Rolex</div><div><strong>${numberOf(brandCount('Audemars Piguet'))}</strong>Audemars Piguet</div><div><strong>${numberOf(watches.length)}</strong>варианта</div></div>
    </div>
    <div class="hero-image"><img src="${hero.image}" alt="Rolex Datejust 41, артикул RLW001"><span class="hero-caption">ROLEX DATEJUST 41 · RLW001</span></div>
  </section>
  <div class="intro-strip"><div class="container"><div><b>01</b><span>Фотографии из каталогов</span></div><div><b>02</b><span>Артикул у каждой модели</span></div><div><b>03</b><span>Конфигурация по запросу</span></div></div></div>
  ${section('Rolex', '#/catalog?brand=Rolex', FEATURED_ROLEX)}
  ${section('Audemars Piguet', '#/catalog?brand=Audemars%20Piguet', FEATURED_AP)}
  <section class="story"><div class="story-image"><img src="assets/watches/apw027.webp" alt="Audemars Piguet Royal Oak Offshore, артикул APW027" loading="lazy"></div><div class="story-copy"><div class="eyebrow">По материалам каталога</div><h2>От классики до сложных моделей</h2><p>В подборке есть Datejust и GMT-Master II, Royal Oak и Royal Oak Offshore, модели с хронографом, вечным календарём, турбийоном и открытым механизмом.</p><a class="text-link" href="#/catalog">Посмотреть 93 варианта</a></div></section>
  <section class="section container"><div class="section-head"><h2>Индивидуальный выбор</h2></div><div class="info-cards">
    <div class="info-card"><span>01 / 03</span><h3>Браслет</h3><p>Уточните тип и конфигурацию браслета или ремешка.</p></div>
    <div class="info-card"><span>02 / 03</span><h3>Покрытие</h3><p>В каталоге предложены разные варианты и оттенки покрытия.</p></div>
    <div class="info-card"><span>03 / 03</span><h3>Бриллианты</h3><p>Для некоторых моделей указан выбор натуральных или лабораторных камней.</p></div>
  </div></section>${contactBand()}`;
}

function filteredWatches() {
  const query = filters.query.trim().toLocaleLowerCase('ru');
  return watches.filter(watch =>
    (!filters.brand || watch.brand === filters.brand) &&
    (!filters.model || watch.model === filters.model) &&
    (!filters.size || watch.size === Number(filters.size)) &&
    (!query || [watch.brand, watch.model, watch.variant, watch.article, watch.description].join(' ').toLocaleLowerCase('ru').includes(query))
  );
}

function option(value, label, selected) {
  return `<option value="${escapeHTML(value)}"${value === selected ? ' selected' : ''}>${escapeHTML(label)}</option>`;
}

function catalog(params) {
  filters = { brand: params.get('brand') || '', model: '', size: '', query: params.get('q') || '' };
  visibleCount = 24;
  const title = filters.brand || 'Каталог часов';
  const count = filters.brand ? brandCount(filters.brand) : watches.length;
  const modelList = unique(watches.filter(watch => !filters.brand || watch.brand === filters.brand).map(watch => watch.model));
  return `<div class="container"><header class="page-head"><div class="eyebrow">SMQ TIME / Каталог</div><h1>${escapeHTML(title)}</h1><p>${count} ${variantWord(count)} из предоставленных PDF-каталогов. Стоимость и наличие уточняются индивидуально.</p></header>
    <div class="catalog-tools" role="search" aria-label="Фильтры каталога">
      <input id="catalog-query" type="search" placeholder="Модель, описание или артикул" value="${escapeHTML(filters.query)}" aria-label="Поиск по каталогу" autocomplete="off">
      <select id="brand-filter" aria-label="Бренд">${option('', 'Все бренды', filters.brand)}${option('Rolex', 'Rolex', filters.brand)}${option('Audemars Piguet', 'Audemars Piguet', filters.brand)}</select>
      <select id="model-filter" aria-label="Модель">${option('', 'Все модели', '')}${modelList.map(model => option(model, model, '')).join('')}</select>
      <select id="size-filter" aria-label="Размер корпуса">${option('', 'Любой размер', '')}${unique(watches.map(watch => watch.size)).map(size => option(String(size), `${size} мм`, '')).join('')}</select>
    </div>
    <div class="results-line"><span id="results-count"></span><span>Цена по запросу</span></div>
    <div class="product-grid" id="catalog-grid"></div>
    <button class="button secondary load-more" id="load-more" type="button" hidden>Показать ещё</button>
  </div>`;
}

function updateCatalog() {
  const matches = filteredWatches();
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  grid.innerHTML = matches.length ? matches.slice(0, visibleCount).map(card).join('') : `<div class="empty-state" style="grid-column:1/-1"><h2>Модели не найдены</h2><p>Попробуйте изменить фильтры или артикул.</p><button class="button secondary" id="clear-filters" type="button">Сбросить фильтры</button></div>`;
  document.getElementById('results-count').textContent = `Найдено: ${numberOf(matches.length)}`;
  const more = document.getElementById('load-more');
  more.hidden = visibleCount >= matches.length;
  if (!more.hidden) more.textContent = `Показать ещё · ${numberOf(matches.length - visibleCount)}`;
}

function fact(label, value) {
  return `<div class="fact"><dt>${label}</dt><dd>${escapeHTML(value)}</dd></div>`;
}

function product(watch) {
  const message = encodeURIComponent(`Здравствуйте! Интересуют часы ${watch.brand} ${watch.model}, артикул ${watch.article}. Подскажите стоимость, наличие и варианты исполнения.`);
  const details = watch.description.split(' · ');
  const material = details[0] || 'Уточняется';
  const dial = details.find(part => /циферблат/i.test(part)) || 'См. описание';
  const strap = details.find(part => /браслет|ремешок/i.test(part)) || 'См. описание';
  return `<div class="container">
    <div class="product-layout"><div class="product-visual"><img src="${watch.image}" alt="${escapeHTML(watch.brand)} ${escapeHTML(watch.model)}, артикул ${watch.article}"></div>
      <div class="product-details"><div class="breadcrumbs"><a href="#/catalog">Каталог</a><span>/</span><a href="#/catalog?brand=${encodeURIComponent(watch.brand)}">${escapeHTML(watch.brand)}</a></div>
        <div class="eyebrow">${escapeHTML(watch.brand)}</div><h1>${escapeHTML(watch.model)}</h1>
        <div class="variant">${watch.size} мм${watch.variant ? ` · ${escapeHTML(watch.variant)}` : ''}</div>
        <div class="article">АРТИКУЛ ${watch.article}</div>
        <p class="description">${escapeHTML(watch.description)}</p>
        <a class="button" href="${WHATSAPP}?text=${message}" target="_blank" rel="noopener noreferrer">Уточнить стоимость в WhatsApp</a>
        <a class="button secondary" href="${TELEGRAM}" target="_blank" rel="noopener noreferrer">Написать в Telegram</a>
        <p class="small-note">Назовите артикул ${watch.article}. Наличие, стоимость и точную конфигурацию подтвердит продавец.</p>
      </div>
    </div>
    <dl class="facts">
      ${fact('Бренд в каталоге', watch.brand)}${fact('Размер корпуса', `${watch.size} мм`)}
      ${fact('Материал / исполнение', material)}${fact('Циферблат', dial)}
      ${fact('Браслет / ремешок', strap)}${fact('Артикул', watch.article)}
    </dl>
    <section class="detail-copy"><h2>О модели</h2><div><p>${escapeHTML(watch.description)}</p><p class="source">Источник описания и фотографии: ${CATALOG_SOURCE}, «${escapeHTML(watch.source)}», страница ${watch.sourcePage}. Сведения каталога не являются независимой экспертизой.</p></div></section>
  </div>
  ${section('В этой подборке', `#/catalog?brand=${encodeURIComponent(watch.brand)}`, watches.filter(item => item.brand === watch.brand && item.id !== watch.id).slice(0, 4).map(item => item.id))}
  ${contactBand()}`;
}

function wishlist() {
  const selected = watches.filter(watch => favorites.has(watch.id));
  return `<div class="container"><header class="page-head"><div class="eyebrow">SMQ TIME</div><h1>Избранное</h1><p>${selected.length ? `${selected.length} ${modelWord(selected.length)}` : 'Сохраняйте модели, чтобы вернуться к ним позже.'}</p></header>
    ${selected.length ? `<div class="product-grid">${selected.map(card).join('')}</div>` : `<div class="empty-state"><h2>Пока пусто</h2><p>Нажмите на сердце рядом с интересующей моделью.</p><a class="button" href="#/catalog">Перейти в каталог</a></div>`}
  </div>`;
}

function about() {
  return `<div class="container"><header class="page-head"><div class="eyebrow">Индивидуальный выбор</div><h1>Как выбрать и заказать</h1><p class="about-intro">В заключительных разделах обоих каталогов McQueen Shop предложено обсудить конфигурацию, стоимость и оформление покупки напрямую в Telegram или WhatsApp.</p></header>
    <div class="about-grid"><div class="about-step"><span>01 / Выберите</span><h2>Найдите модель</h2><p>Откройте карточку и запишите артикул RLW или APW. В карточке приведены фотография и описание из PDF.</p></div><div class="about-step"><span>02 / Уточните</span><h2>Обсудите исполнение</h2><p>В каталогах указаны возможные варианты браслета, покрытия и, для некоторых моделей, инкрустации. Доступность конкретного исполнения нужно подтвердить.</p></div><div class="about-step"><span>03 / Согласуйте</span><h2>Узнайте условия</h2><p>Стоимость, наличие, комплектация, оплата и доставка согласовываются индивидуально с продавцом до покупки.</p></div></div>
    <div class="contact-links"><a class="button" href="${TELEGRAM}" target="_blank" rel="noopener noreferrer">Telegram · @smcqueen_shop</a><a class="button secondary" href="${WHATSAPP}" target="_blank" rel="noopener noreferrer">WhatsApp · +86 171 6089 0948</a></div>
    <p class="backline muted">Если нужной модели нет в каталоге, в исходном PDF предлагается отправить продавцу фотографию или название для уточнения доступных вариантов.</p>
  </div>`;
}

function syncFavorites() {
  const count = document.getElementById('fav-count');
  count.textContent = favorites.size;
  count.hidden = favorites.size === 0;
}

function route() {
  const hash = location.hash.startsWith('#/') ? location.hash.slice(1) : '/';
  const [path, query = ''] = hash.split('?');
  const params = new URLSearchParams(query);
  let title = 'SMQ TIME — каталог часов';
  if (path === '/catalog') {
    app.innerHTML = catalog(params);
    updateCatalog();
    title = 'Каталог часов — SMQ TIME';
  } else if (path.startsWith('/w/')) {
    const watch = getWatch(path.split('/')[2]);
    if (watch) {
      app.innerHTML = product(watch);
      title = `${watch.brand} ${watch.model} · ${watch.article} — SMQ TIME`;
    } else {
      app.innerHTML = `<div class="container empty-state"><h1>Модель не найдена</h1><a class="button" href="#/catalog">В каталог</a></div>`;
    }
  } else if (path === '/wishlist') {
    app.innerHTML = wishlist();
    title = 'Избранное — SMQ TIME';
  } else if (path === '/about') {
    app.innerHTML = about();
    title = 'Как заказать — SMQ TIME';
  } else {
    app.innerHTML = home();
  }
  document.title = title;
  document.querySelectorAll('.mobile-nav a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${path}`));
  syncFavorites();
  window.scrollTo(0, 0);
}

document.addEventListener('click', event => {
  const localLink = event.target.closest('a[href^="#/"]');
  if (localLink) {
    event.preventDefault();
    history.pushState(null, '', localLink.getAttribute('href'));
    route();
    return;
  }
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) {
    const id = favorite.dataset.favorite;
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    try { localStorage.setItem('smq-favorites', JSON.stringify([...favorites])); } catch (_) { /* private browsing */ }
    document.querySelectorAll(`[data-favorite="${id}"]`).forEach(button => {
      const active = favorites.has(id);
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', `${active ? 'Убрать из избранного' : 'Добавить в избранное'}: ${getWatch(id).brand} ${getWatch(id).model}, ${getWatch(id).article}`);
    });
    syncFavorites();
    if (location.hash === '#/wishlist') app.innerHTML = wishlist();
  }
  if (event.target.id === 'load-more') {
    visibleCount += 24;
    updateCatalog();
  }
  if (event.target.id === 'clear-filters') {
    location.hash = '#/catalog';
    if (location.hash === '#/catalog') route();
  }
});

document.addEventListener('input', event => {
  if (event.target.id !== 'catalog-query') return;
  filters.query = event.target.value;
  visibleCount = 24;
  updateCatalog();
});

document.addEventListener('change', event => {
  if (event.target.id === 'brand-filter') {
    const brand = event.target.value;
    location.hash = brand ? `#/catalog?brand=${encodeURIComponent(brand)}` : '#/catalog';
    route();
  } else if (event.target.id === 'model-filter') {
    filters.model = event.target.value;
    visibleCount = 24;
    updateCatalog();
  } else if (event.target.id === 'size-filter') {
    filters.size = event.target.value;
    visibleCount = 24;
    updateCatalog();
  }
});

window.addEventListener('hashchange', route);
window.addEventListener('popstate', route);
fetch('catalog.json')
  .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
  .then(data => {
    if (!Array.isArray(data) || data.length !== 93) throw new Error('Incomplete catalog');
    watches = data;
    favorites = new Set([...favorites].filter(id => getWatch(id)));
    route();
  })
  .catch(error => {
    console.error('Catalog load failed:', error);
    app.innerHTML = '<div class="container empty-state"><h1>Каталог не загрузился</h1><p>Пожалуйста, обновите страницу.</p></div>';
  });
