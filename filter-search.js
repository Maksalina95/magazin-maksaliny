// 📦 filter-search.js — логика загрузки и фильтрации товаров (без категорий)

const url = `${baseUrl}/Sheet1`;

const productList = document.getElementById('product-list');
const searchInput = document.getElementById('searchInput');
const autoList = document.getElementById('autocompleteList');

let products = [];

// 📥 Загрузка товаров из Google Таблицы
fetch(url)
  .then(res => res.json())
  .then(data => {
    products = data.filter(item => item.фото && item.название && item.цена);
    updateFilters(products);
    showProducts(products);
    setupAutocomplete(products);
  })
  .catch(err => {
    if (productList) productList.innerHTML = '<p>Ошибка загрузки товаров.</p>';
    console.error(err);
  });

// 🧱 Отображение товаров
function showProducts(list) {
  if (!productList) return;
  productList.innerHTML = '';
  list.forEach(item => {
    const el = document.createElement('div');
    el.className = 'product-card';

    el.innerHTML = `
      ${item.видео 
        ? `<video controls src="${item.видео}"></video>` 
        : `<img src="${item.фото}" alt="${item.название}" />`}
      <h3>${item.название}</h3>
      ${item.описание ? `<p>${item.описание}</p>` : ''}
      <strong>${item.цена} ₽</strong>
      <div class="card-buttons">
        <a href="https://wa.me/79376280080" target="_blank">WhatsApp</a>
        <button class="fav-btn" onclick="toggleFavorite('${item.название}')">⭐</button>
      </div>
    `;
    productList.appendChild(el);
  });
}

// 🔍 Поиск
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.название.toLowerCase().includes(term));
    showProducts(filtered);
  });
}

// 💡 Автозаполнение
function setupAutocomplete(list) {
  if (!autoList) return;
  autoList.innerHTML = '';
  list.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.название;
    autoList.appendChild(opt);
  });
}

// 🎯 Фильтры
const selects = document.querySelectorAll('#filters select, #filters input');
selects.forEach(sel => sel.addEventListener('change', applyFilters));

function applyFilters() {
  let result = [...products];
  selects.forEach(sel => {
    const id = sel.id.replace('filter-', '');
    const val = sel.value.toLowerCase();
    if (val && val !== 'все') {
      result = result.filter(p => (p[id] || '').toLowerCase().includes(val));
    }
  });
  showProducts(result);
}

// 🧃 Обновление фильтров
function updateFilters(data) {
  const filterFields = ['category', 'subcategory', 'section', 'brand', 'country', 'type'];
  filterFields.forEach(field => {
    const select = document.getElementById(`filter-${field}`);
    if (!select) return;
    const unique = [...new Set(data.map(item => item[field]).filter(Boolean))];
    unique.forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      select.appendChild(opt);
    });
  });
}

// ⭐ Избранное
function toggleFavorite(name) {
  let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (favs.includes(name)) {
    favs = favs.filter(n => n !== name);
  } else {
    favs.push(name);
  }
  localStorage.setItem('favorites', JSON.stringify(favs));
}
