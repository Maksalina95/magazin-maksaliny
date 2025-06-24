// filter-search.js

// Создание карточки товара с видео RuTube (если есть)
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  // Фото товара
  const img = document.createElement('img');
  img.src = product.photo || 'images/no-image.png'; // запасное фото
  img.alt = product.name || 'Товар';
  card.appendChild(img);

  // Название
  const title = document.createElement('h3');
  title.textContent = product.name || 'Без названия';
  card.appendChild(title);

  // Описание
  if (product.description) {
    const desc = document.createElement('p');
    desc.textContent = product.description;
    card.appendChild(desc);
  }

  // Цена
  if (product.price) {
    const price = document.createElement('p');
    price.textContent = Цена: ${product.price} ₽;
    card.appendChild(price);
  }

  // Видео RuTube (если есть)
  if (product.видео && product.видео.trim() !== '') {
    const iframe = document.createElement('iframe');
    iframe.width = "320";
    iframe.height = "180";
    iframe.src = https://rutube.ru/play/embed/${product.видео.trim()};
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = '12px';
    iframe.style.marginTop = '10px';
    card.appendChild(iframe);
  }

  return card;
}

// Рендер товаров в контейнер
function renderProducts(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  if (!products || products.length === 0) {
    container.innerHTML = '<p>Товары не найдены.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'products-grid'; // для сетки, стилизуй в CSS
  products.forEach(product => {
    const card = createProductCard(product);
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

// Загрузка данных из Google Таблицы
async function loadProducts() {
  try {
    // URL для JSON Google Таблицы (пример, замени на свою ссылку)
    const sheetUrl = 'https://spreadsheets.google.com/feeds/list/ТВОЙ_ИД_ТАБЛИЦЫ/od6/public/values?alt=json';

    const response = await fetch(sheetUrl);
    const data = await response.json();

    // Преобразуем данные таблицы в массив объектов
    const products = data.feed.entry.map(entry => ({
      name: entry['gsx$name']?.$t || '',
      description: entry['gsx$description']?.$t || '',
      price: entry['gsx$price']?.$t || '',
      photo: entry['gsx$photo']?.$t || '',
      видео: entry['gsx$video']?.$t || '',      // важно, чтобы в таблице колонка называлась video или video на русском
      категория: entry['gsx$category']?.$t || '',
      подкатегория: entry['gsx$subcategory']?.$t || '',
      подподкатегория: entry['gsx$subsubcategory']?.$t || '',
      бренд: entry['gsx$brand']?.$t || '',
      страна: entry['gsx$country']?.$t || '',
      тип: entry['gsx$type']?.$t || ''
    }));

    return products;
  } catch (error) {
    console.error('Ошибка загрузки данных из таблицы:', error);
    return [];
  }
}

// Фильтры и поиск

const filters = {
  category: '',
  subcategory: '',
  subsubcategory: '',
  brand: '',
  country: '',
  type: '',
  priceMin: 0,
  priceMax: Infinity,
  searchText: ''
};

// Функция фильтрации массива товаров по выбранным фильтрам
function filterProducts(products) {
  return products.filter(product => {
    // Фильтр по категории и подкатегориям
    if (filters.category && product.категория.toLowerCase() !== filters.category.toLowerCase()) return false;
    if (filters.subcategory && product.подкатегория.toLowerCase() !== filters.subcategory.toLowerCase()) return false;
    if (filters.subsubcategory && product.подподкатегория.toLowerCase() !== filters.subsubcategory.toLowerCase()) return false;

    // Фильтр по бренду, стране, типу
    if (filters.brand && product.бренд.toLowerCase() !== filters.brand.toLowerCase()) return false;
    if (filters.country && product.страна.toLowerCase() !== filters.country.toLowerCase()) return false;
    if (filters.type && product.тип.toLowerCase() !== filters.type.toLowerCase()) return false;

    // Фильтр по цене
    const priceNum = parseFloat(product.price.replace(/[^\d\.]/g, '')) || 0;
    if (priceNum < filters.priceMin || priceNum > filters.priceMax) return false;

    // Поиск по названию и описанию
    const text = (product.name + ' ' + product.description).toLowerCase();
    if (filters.searchText && !text.includes(filters.searchText.toLowerCase())) return false;

    return true;
  });
}

// Применение фильтров при изменении значений формы
function setupFilterListeners(products) {
  // Здесь предполагаются элементы фильтров с такими id
  const categorySelect = document.getElementById('filter-category');
  const subcategorySelect = document.getElementById('filter-subcategory');
  const subsubcategorySelect = document.getElementById('filter-subsubcategory');
  const brandSelect = document.getElementById('filter-brand');
  const countrySelect = document.getElementById('filter-country');
  const typeSelect = document.getElementById('filter-type');
  const priceMinInput = document.getElementById('filter-price-min');
  const priceMaxInput = document.getElementById('filter-price-max');
  const searchInput = document.getElementById('searchInput');

  function updateFilters() {
    filters.category = categorySelect?.value || '';
    filters.subcategory = subcategorySelect?.value || '';
    filters.subsubcategory = subsubcategorySelect?.value || '';
    filters.brand = brandSelect?.value || '';
    filters.country = countrySelect?.value || '';
    filters.type = typeSelect?.value || '';
    filters.priceMin = parseFloat(priceMinInput?.value) || 0;
    filters.priceMax = parseFloat(priceMaxInput?.value) || Infinity;
    filters.searchText = searchInput?.value.trim() || '';

    const filtered = filterProducts(products);
    renderProducts(filtered);
  }

  // Навешиваем обработчики
  if (categorySelect) categorySelect.addEventListener('change', updateFilters);
  if (subcategorySelect) subcategorySelect.addEventListener('change', updateFilters);
  if (subsubcategorySelect) subsubcategorySelect.addEventListener('change', updateFilters);
  if (brandSelect) brandSelect.addEventListener('change', updateFilters);
  if (countrySelect) countrySelect.addEventListener('change', updateFilters);
  if (typeSelect) typeSelect.addEventListener('change', updateFilters);
  if (priceMinInput) priceMinInput.addEventListener('input', updateFilters);
  if (priceMaxInput) priceMaxInput.addEventListener('input', updateFilters);
  if (searchInput) searchInput.addEventListener('input', updateFilters);
}

// Главная функция инициализации
async function init() {
  const products = await loadProducts();

  // Сначала отображаем все
  renderProducts(products);

  // Настраиваем фильтры
  setupFilterListeners(products);
}

// Запуск после загрузки страницы
window.addEventListener('DOMContentLoaded', init);
