const appUrl = `${baseUrl}/Sheet1`;

const productList = document.getElementById('product-list');
const categoryGallery = document.getElementById('category-gallery');
const filters = document.getElementById('filters');
const searchInput = document.getElementById('searchInput');
const autoList = document.getElementById('autocompleteList');

// Создаем контейнер для отображения карточки товара
let productDetailContainer = document.getElementById('product-detail-container');
if (!productDetailContainer) {
  productDetailContainer = document.createElement('div');
  productDetailContainer.id = 'product-detail-container';
  productDetailContainer.style.display = 'none';
  productDetailContainer.style.padding = '20px';
  productDetailContainer.style.border = '1px solid #ccc';
  productDetailContainer.style.borderRadius = '12px';
  productDetailContainer.style.background = '#fff';
  productDetailContainer.style.position = 'relative';
  productDetailContainer.style.maxWidth = '600px';
  productDetailContainer.style.margin = '20px auto';
  productDetailContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  document.body.appendChild(productDetailContainer);
}

let productsData = [];
let currentProductIndex = -1;

// Загрузка данных
fetch(appUrl)
  .then(res => res.json())
  .then(data => {
    productsData = data.filter(item => item.фото && item.название && item.цена);

    renderCategories();
    setupAutocompleteList();
    setupSearchHandler();
    updateFilters(productsData);
    setupFilterHandlers();
    setInitialView();

    // Показ товаров — изначально пусто, показываем только категории и фильтры при поиске
  })
  .catch(err => {
    if (productList) productList.innerHTML = '<p>Ошибка загрузки товаров.</p>';
    console.error(err);
  });

// --- Функция отрисовки категорий ---
function renderCategories() {
  if (!categoryGallery) return;
  const categoriesMap = {};
  productsData.forEach(item => {
    const cat = item.категория;
    if (cat && !categoriesMap[cat]) {
      categoriesMap[cat] = item['картинка категории'] || '';
    }
  });

  categoryGallery.innerHTML = '';
  Object.entries(categoriesMap).forEach(([category, image]) => {
    const tile = document.createElement('div');
    tile.className = 'category-tile';
    tile.innerHTML = `
      <a href="category-products.html?category=${encodeURIComponent(category)}">
        <img src="${image}" alt="${category}" />
        <span>${category}</span>
      </a>
    `;
    categoryGallery.appendChild(tile);
  });
}

// --- Настройка автозаполнения ---
function setupAutocompleteList() {
  if (!autoList) return;
  autoList.innerHTML = '';
  productsData.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.название;
    autoList.appendChild(opt);
  });
}

// --- Настройка обработчика поиска с подсказками ---
function setupSearchHandler() {
  if (!searchInput) return;

  // Создаем контейнер подсказок (если еще нет)
  let suggestionsContainer = document.getElementById('suggestions');
  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'suggestions';
    suggestionsContainer.style.position = 'absolute';
    suggestionsContainer.style.background = '#fff';
    suggestionsContainer.style.border = '1px solid #ccc';
    suggestionsContainer.style.zIndex = '999';
    suggestionsContainer.style.maxHeight = '150px';
    suggestionsContainer.style.overflowY = 'auto';
    suggestionsContainer.style.width = '90%';
    suggestionsContainer.style.display = 'none';
    searchInput.parentNode.appendChild(suggestionsContainer);
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query === '') {
      // Скрываем товары и фильтры, показываем категории
      if (filters) filters.style.display = 'none';
      if (productList) productList.style.display = 'none';
      if (categoryGallery) categoryGallery.style.display = 'grid';
      suggestionsContainer.style.display = 'none';
      productDetailContainer.style.display = 'none';
    } else {
      if (filters) filters.style.display = 'flex';
      if (productList) productList.style.display = 'grid';
      if (categoryGallery) categoryGallery.style.display = 'none';

      const matched = productsData.filter(item => item.название.toLowerCase().includes(query));
      showProducts(matched);
      
      // Показываем подсказки
      const matches = productsData
        .map(item => item.название)
        .filter(name => name.toLowerCase().includes(query))
        .slice(0, 10);

      suggestionsContainer.innerHTML = '';
      matches.forEach(match => {
        const div = document.createElement('div');
        div.textContent = match;
        div.style.padding = '6px';
        div.style.cursor = 'pointer';
        div.addEventListener('click', () => {
          searchInput.value = match;
          suggestionsContainer.style.display = 'none';
          searchInput.dispatchEvent(new Event('input'));
        });
        suggestionsContainer.appendChild(div);
      });

      suggestionsContainer.style.display = matches.length ? 'block' : 'none';
      productDetailContainer.style.display = 'none';
    }
  });

  document.addEventListener('click', e => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.style.display = 'none';
    }
  });
}

// --- Показ списка товаров ---
function showProducts(list) {
  if (!productList) return;
  productList.innerHTML = '';
  list.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'product-card';
    el.innerHTML = `
      ${item.видео
        ? `<video controls src="${item.видео}"></video>`
        : `<img src="${item.фото}" alt="${item.название}" />`}
      <h3>${item.название}</h3>
      ${item.описание ? <p>${item.описание}</p> : ''}
      <strong>${item.цена} ₽</strong>
      <div class="card-buttons">
        <a href="https://wa.me/79376280080" target="_blank">WhatsApp</a>
        <button class="fav-btn" data-name="${item.название}">⭐</button>
      </div>
    `;
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => openProductDetail(idx));
    productList.appendChild(el);
  });

  // Избранное
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation(); // чтобы клик по кнопке не открывал детальный просмотр
      const name = btn.getAttribute('data-name');
      let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favs.includes(name)) {
        favs = favs.filter(n => n !== name);
        btn.textContent = '⭐';
      } else {
        favs.push(name);
        btn.textContent = '✅';
      }
      localStorage.setItem('favorites', JSON.stringify(favs));
    });
  });
}

// --- Открыть карточку товара ---
function openProductDetail(index) {
  currentProductIndex = index;
  const product = productsData[index];
  if (!product) return;

  productDetailContainer.style.display = 'block';
  if (productList) productList.style.display = 'none';
  if (filters) filters.style.display = 'none';
  if (categoryGallery) categoryGallery.style.display = 'none';

  productDetailContainer.innerHTML = `
    <button id="backBtn" style="margin-bottom: 15px;">← Назад</button>
    <div style="text-align:center;">
      ${product.видео
        ? `<video controls src="${product.видео}" style="max-width:100%;border-radius:12px;"></video>`
        : `<img src="${product.фото}" alt="${product.название}" style="max-width:100%;border-radius:12px;" />`}
    </div>
    <h2>${product.название}</h2>
    <p>${product.описание || ''}</p>
    <strong style="font-size: 1.2em;">${product.цена} ₽</strong>
    <div style="margin-top: 15px;">
      <a href="https://wa.me/79376280080" target="_blank" style="margin-right: 10px;">WhatsApp</a>
      <button id="prevBtn">← Предыдущий</button>
      <button id="nextBtn">Следующий →</button>
    </div>
  `;

  document.getElementById('backBtn').onclick = () => {
    productDetailContainer.style.display = 'none';
    if (productList) productList.style.display = 'grid';
    if (filters
