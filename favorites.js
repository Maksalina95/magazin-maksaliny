const sheetId = '1gBcuPzWv_nH2i7sWyCaERVCjO-hLg8EcndPkEMlNqgw';
const url = `https://opensheet.elk.sh/${sheetId}/Sheet1`;

const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(item =>
        item.фото && item.название && item.цена && favoriteIds.includes(item.название)
      );

      favoritesList.innerHTML = '';

      if (filtered.length === 0) {
        favoritesList.innerHTML = '<p>Нет избранных товаров.</p>';
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
        favoritesList.appendChild(el);
      });
    })
    .catch(err => {
      favoritesList.innerHTML = '<p>Ошибка загрузки избранного.</p>';
      console.error(err);
    });
}
