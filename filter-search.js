const filterSearchUrl = `${baseUrl}/Sheet1`;

const productListEl = document.getElementById('product-list');
const searchInputEl = document.getElementById('searchInput');
const autoListEl = document.getElementById('autocompleteList');

let productListData = [];

// 📥 Загрузка товаров из Google Таблицы
fetch(filterSearchUrl)
  .then(res => res.json())
  .then(data => {
    productListData = data.filter(item => item.фото && item.название && item.цена);
    updateFilters(productListData);
    showProducts(productListData);
    setupAutocomplete(productListData);
  })
  .catch(err => {
    if (productListEl) productListEl.innerHTML = '<p>Ошибка загрузки товаров.</p>';
    console.error(err);
  });

// 🧱 Отображение товаров
function showProducts(list) {
  if (!productListEl) return;
  productListEl.innerHTML = '';
  list.forEach(item => {
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
        <button class="fav-btn" onclick="toggleFavorite('${item.название}')">⭐</button>
      </div>
    `;
    productListEl.appendChild(el);
  });
}

// 🔍 Поиск
if (searchInputEl) {
  searchInputEl.addEventListener('input', () => {
    const term = searchInputEl.value.toLowerCase();
    const filtered = productListData.filter(p => p.название.toLowerCase().includes(term));
    showProducts(filtered);
  });
}

// 💡 Автозаполнение
function setupAutocomplete(list) {
  if (!autoListEl) return;
  autoListEl.innerHTML = '';
  list.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.название;
    autoListEl.appendChild(opt);
  });
}

// 🎯 Фильтры
const filterSelects = document.querySelectorAll('#filters select, #filters input');
filterSelects.forEach(sel => sel.addEventListener('change', applyFilters));

function applyFilters() {
  let result = [...productListData];
  filterSelects.forEach(sel => {
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
    const select = document.getElementById(filter-${field});
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
