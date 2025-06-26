const sheetId = '1gBcuPzWv_nH2i7sWyCaERVCjO-hLg8EcndPkEMlNqgw';
const url = `https://opensheet.elk.sh/${sheetId}/Sheet1`;

const productList = document.getElementById('product-list');

fetch(url)
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(item => item.фото && item.название && item.цена);
    productList.innerHTML = '';

    // Автоподсказки в поиске
    const datalist = document.getElementById('autocompleteList');
    if (datalist) {
      datalist.innerHTML = '';
      filtered.forEach(item => {
        const option = document.createElement('option');
        option.value = item.название;
        datalist.appendChild(option);
      });
    }

    // Фильтрация по категории из ?category=
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('category');
    const visibleItems = selectedCategory
      ? filtered.filter(item => item.категория?.toLowerCase() === selectedCategory.toLowerCase())
      : filtered;

    // Отрисовка товаров
    visibleItems.forEach((item, index) => {
      const productEl = document.createElement('div');
      productEl.className = 'product-card';
      productEl.innerHTML = `
        <img src="${item.фото}" alt="${item.название}" />
        <h3>${item.название}</h3>
        <p>${item.описание || ''}</p>
        ${item.видео ? <video src="${item.видео}" controls></video> : ''}
        <strong>${item.цена} ₽</strong><br/>
        <button class="fav-btn" data-id="${index}">⭐</button>
        <a href="https://wa.me/79376280080" target="_blank">WhatsApp</a>
      `;
      productList.appendChild(productEl);
    });

    // Кнопки "⭐ Избранное"
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
  })
  .catch(err => {
    productList.innerHTML = '<p>Ошибка загрузки товаров.</p>';
    console.error(err);
  });

// 🔍 Поиск по названию
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = name.includes(query) ? '' : 'none';
    });
  });
}

// 🔄 Обновление сайта
const refreshBtn = document.getElementById('refreshBtn');
if (refreshBtn) {
  refreshBtn.onclick = () => location.reload();
}
