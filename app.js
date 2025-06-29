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
  <a href="category-products.html?category=${encodeURIComponent(category)}">
    <img src="${image}" alt="${category}" />
    <span>${category}</span>
  </a>
`;
        categoryGallery.appendChild(tile);
      });
    }

    // 🔍 Новое автозаполнение без <datalist>
    const suggestionsContainer = document.createElement('div');
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

    // Обработчик поиска с подсказками
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();

        const matched = filtered.filter(item =>
          item.название.toLowerCase().includes(query)
        );

        // Показать/скрыть блоки
        if (query === '') {
          if (filters) filters.style.display = 'none';
          if (productList) productList.style.display = 'none';
          if (categoryGallery) categoryGallery.style.display = 'grid';
          suggestionsContainer.style.display = 'none';
        } else {
          if (filters) filters.style.display = 'flex';
          if (productList) productList.style.display = 'grid';
          if (categoryGallery) categoryGallery.style.display = 'none';
          renderProducts(matched);

          // Показ подсказок
          const matches = filtered
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
              const evt = new Event('input');
              searchInput.dispatchEvent(evt);
            });
            suggestionsContainer.appendChild(div);
          });

          suggestionsContainer.style.display = matches.length ? 'block' : 'none';
        }
      });

      document.addEventListener('click', e => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
          suggestionsContainer.style.display = 'none';
        }
      });

      // Начальное состояние
      if (filters) filters.style.display = 'none';
      if (productList) productList.style.display = 'none';
      if (categoryGallery) categoryGallery.style.display = 'grid';
    }
  })
  .catch(err => {
    if (productList) productList.innerHTML = '<p>Ошибка загрузки товаров.</p>';
    console.error(err);
  });

// Кнопка обновления сайта
const refreshBtn = document.getElementById('refreshBtn');
if (refreshBtn) {
  refreshBtn.onclick = () => location.reload();
}
