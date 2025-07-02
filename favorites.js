const favoritesUrl = `${baseUrl}/Sheet1`;
const favList = document.getElementById('favorites-list');

const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');

fetch(favoritesUrl)
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(item =>
      item.фото && item.название && item.цена && favoriteIds.includes(item.название)
    );

    if (!favList) return;

    favList.innerHTML = '';

    if (filtered.length === 0) {
      favList.innerHTML = '<p>Нет избранных товаров.</p>';
      return;
    }

    filtered.forEach(item => {
      const el = document.createElement('div');
      el.classList.add('product');
      el.innerHTML = `
        <img src="${item.фото}" alt="${item.название}" />
        <h3>${item.название}</h3>
        <p>${item.описание || ''}</p>
        <strong>${item.цена} ₽</strong><br/>
        ${item.видео ? `<video controls src="${item.видео}" style="max-width:100%;border-radius:12px;margin-top:10px;"></video>` : ''}
        <a href="https://wa.me/79376280080" target="_blank">WhatsApp</a>
      `;
      favList.appendChild(el);
    });
  })
  .catch(err => {
    if (favList) favList.innerHTML = '<p>Ошибка загрузки избранного.</p>';
    console.error(err);
  });
