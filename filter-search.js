// ✅ filter-search.js

const sheetId = '1gBcuPzWv_nH2i7sWyCaERVCjO-hLg8EcndPkEMlNqgw'; const url = https://opensheet.elk.sh/${sheetId}/Sheet1;

let products = []; // Все товары let filteredProducts = []; // Отфильтрованные товары

// ✅ Создание карточки товара function createProductCard(product) { const card = document.createElement('div'); card.className = 'product-card';

const img = document.createElement('img'); img.src = product.photo || 'images/no-image.png'; img.alt = product.name || 'Товар'; card.appendChild(img);

const title = document.createElement('h3'); title.textContent = product.name || 'Без названия'; card.appendChild(title);

if (product.description) { const desc = document.createElement('p'); desc.textContent = product.description; card.appendChild(desc); }

if (product.price) { const price = document.createElement('p'); price.textContent = Цена: ${product.price} ₽; card.appendChild(price); }

if (product.видео && product.видео.trim() !== '') { const iframe = document.createElement('iframe'); iframe.src = https://rutube.ru/play/embed/${product.видео.trim()}; iframe.allowFullscreen = true; iframe.frameBorder = 0; iframe.style.borderRadius = '12px'; iframe.style.marginTop = '10px'; card.appendChild(iframe); }

return card; }

// ✅ Отрисовка товаров function renderProducts(productsToRender) { const container = document.getElementById('product-list'); container.innerHTML = '';

if (!productsToRender.length) { container.innerHTML = '<p>Товары не найдены.</p>'; return; }

const grid = document.createElement('div'); grid.className = 'products-grid';

productsToRender.forEach(product => { const card = createProductCard(product); grid.appendChild(card); });

container.appendChild(grid); }

// ✅ Фильтрация и поиск function filterProducts() { const category = document.getElementById('filter-category').value.toLowerCase(); const subcategory = document.getElementById('filter-subcategory').value.toLowerCase(); const section = document.getElementById('filter-section').value.toLowerCase(); const brand = document.getElementById('filter-brand').value.toLowerCase(); const country = document.getElementById('filter-country').value.toLowerCase(); const type = document.getElementById('filter-type').value.toLowerCase(); const priceMin = parseFloat(document.getElementById('filter-price-min').value) || 0; const priceMax = parseFloat(document.getElementById('filter-price-max').value) || Infinity; const searchText = (document.getElementById('searchInput')?.value || '').toLowerCase();

filteredProducts = products.filter(p => { const pCategory = (p.category || '').toLowerCase(); const pSubcategory = (p.subcategory || '').toLowerCase(); const pSection = (p.section || p.subsubcategory || '').toLowerCase(); const pBrand = (p.brand || '').toLowerCase(); const pCountry = (p.country || '').toLowerCase(); const pType = (p.type || '').toLowerCase(); const pPrice = parseFloat(p.price) || 0; const pName = (p.name || '').toLowerCase(); const pDescription = (p.description || '').toLowerCase();

if (category && pCategory !== category) return false;
if (subcategory && pSubcategory !== subcategory) return false;
if (section && pSection !== section) return false;
if (brand && pBrand !== brand) return false;
if (country && pCountry !== country) return false;
if (type && pType !== type) return false;
if (pPrice < priceMin || pPrice > priceMax) return false;

if (searchText) {
  if (!pName.includes(searchText) && !pDescription.includes(searchText)) return false;
}

return true;

});

renderProducts(filteredProducts); }

// ✅ Уникальные значения для фильтров function fillFilters() { function uniqueValues(field) { return [...new Set(products.map(p => (p[field] || '').trim()).filter(v => v !== ''))].sort(); }

function fillSelect(id, values) { const select = document.getElementById(id); if (!select) return; select.options.length = 1; values.forEach(v => { const opt = document.createElement('option'); opt.value = v; opt.textContent = v; select.appendChild(opt); }); }

fillSelect('filter-category', uniqueValues('category')); fillSelect('filter-subcategory', uniqueValues('subcategory')); fillSelect('filter-section', uniqueValues('section')); fillSelect('filter-brand', uniqueValues('brand')); fillSelect('filter-country', uniqueValues('country')); fillSelect('filter-type', uniqueValues('type')); }

// ✅ Загрузка данных async function loadProducts() { try { const response = await fetch(url); const data = await response.json();

products = data;
fillFilters();
filterProducts();

} catch (err) { console.error('Ошибка загрузки:', err); document.getElementById('product-list').innerHTML = '<p>Ошибка загрузки товаров.</p>'; } }

function setupEventListeners() { const ids = [ 'filter-category', 'filter-subcategory', 'filter-section', 'filter-brand', 'filter-country', 'filter-type', 'filter-price-min', 'filter-price-max', 'searchInput' ];

ids.forEach(id => { const el = document.getElementById(id); if (el) { el.addEventListener('input', filterProducts); el.addEventListener('change', filterProducts); } }); }

document.addEventListener('DOMContentLoaded', () => { loadProducts(); setupEventListeners(); });
