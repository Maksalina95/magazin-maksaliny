const sheetId = '1gBcuPzWv_nH2i7sWyCaERVCjO-hLg8EcndPkEMlNqgw';
const url = `https://opensheet.elk.sh/${sheetId}/Sheet1`;

const productList = document.getElementById('product-list');
const categoryGallery = document.getElementById('category-gallery');
const filters = document.getElementById('filters');
const searchInput = document.getElementById('searchInput');

fetch(url)
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(item => item.фото && item.название && item.цена);

    // Категории с картинками
    if (categoryGallery) {
      const categoriesMap = {};
      filtered.forEach(item => {
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
          <a href="category.html?category=${encodeURIComponent(category)}">
            <img src="${image}" alt="${category}" />
            <span>${category}</span>
          </a>
        `;
        categoryGallery.appendChild(tile);
      });
    }

    // Автоподсказки для поиска
    const datalist = document.getElementById('autocompleteList');
    if (datalist) {
      datalist.innerHTML = '';
      filtered.forEach(item => {
        const option = document.createElement('option');
        option.value = item.название;
        datalist.appendChild(option);
      });
    }

    // Функция показа товаров
    function renderProducts(items) {
      if (!productList) return;
      productList.innerHTML = '';
      items.forEach((item, index) => {
        const productEl = document.createElement('div');
        productEl.className = 'product-card';
        productEl.innerHTML = `
          <img src="${item.фото}" alt="${item.название}" />
          <h3>${item.название}</h3>
          <p>${item.описание || ''}</p>
          ${item.видео ? `<video src="${item.видео}" controls></video>` : ''}
          <strong>${item.цена} ₽</strong><br/>
          <button class="fav-btn" data-id="${index}">⭐</button>
          <a href="https://wa.me/79376280080" target="_blank">WhatsApp</a>
        `;
        productList.appendChild(productEl);
      });

      // Кнопки избранного
      document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          let favs = JSON.parse(localStorage.getItem('favorites')) || [];
          if (!favs.includes(id)) {
            favs.push(id);
            localStorage.setItem('favorites', JSON.stringify(favs));
            btn.textContent = '✅';
          }
        });
      });
    }

    // Обработчик поиска
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();

        if (query === '') {
          // Показать только категории, скрыть фильтры и товары
          if (filters) filters.style.display = 'none';
          if (productList) productList.style.display = 'none';
          if (categoryGallery) categoryGallery.style.display = 'grid'; // или block, как у тебя в CSS
        } else {
          // Показать фильтры и товары, скрыть категории
          if (filters) filters.style.display = 'flex';
          if (productList) productList.style.display = 'grid'; // или block
          if (categoryGallery) categoryGallery.style.display = 'none';

          // Фильтрация товаров по названию
          const matched = filtered.filter(item => item.название.toLowerCase().includes(query));
          renderProducts(matched);
        }
      });

      // Изначально скрываем фильтры и товары, показываем категории
      if (filters) filters.style.display = 'none';
      if (productList) productList.style.display = 'none';
      if (categoryGallery) categoryGallery.style.display = 'grid';
    }
  })
  .catch(err => {
    if (productList) productList.innerHTML = '<p>Ошибка загрузки товаров.</p>';
    console.error(err);
  });

// Кнопка обновления сайта, если есть
const refreshBtn = document.getElementById('refreshBtn');
if (refreshBtn) {
  refreshBtn.onclick = () => location.reload();
}
