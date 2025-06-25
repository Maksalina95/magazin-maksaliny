const sheetId = '1gBcuPzWv_nH2i7sWyCaERVCjO-hLg8EcndPkEMlNqgw';
const url = `https://opensheet.elk.sh/${sheetId}/Sheet1`;

const gallery = document.getElementById('category-gallery');
const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

fetch(url)
  .then(res => res.json())
  .then(data => {
    const valid = data.filter(item => item.категория && item.фото && item.название);
    const grouped = groupBy(valid, 'категория');

    gallery.innerHTML = '';

    Object.entries(grouped).forEach(([category, items]) => {
      const section = document.createElement('section');
      section.className = 'category-section';

      const title = document.createElement('h2');
      title.textContent = category;
      section.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'product-grid';

      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';

        let media = '';
        if (item.видео && item.видео.includes('http')) {
          media = <video src="${item.видео}" controls muted></video>;
        } else {
          media = <img src="${item.фото}" alt="${item.название}" />;
        }

        card.innerHTML = `
          ${media}
          <h3>${item.название}</h3>
          ${item.описание ? <p>${item.описание}</p> : ''}
          <strong>${item.цена} ₽</strong>
          <div class="card-buttons">
            <a href="https://wa.me/79376280080" target="_blank">WhatsApp</a>
            <button class="fav-btn" data-id="${item.название}">⭐</button>
          </div>
        `;

        // отметка как избранное
        if (favorites.includes(item.название)) {
          card.querySelector('.fav-btn').classList.add('active');
        }

        // обработка клика на ⭐
        card.querySelector('.fav-btn').addEventListener('click', (e) => {
          const name = e.target.dataset.id;
          const idx = favorites.indexOf(name);
          if (idx === -1) {
            favorites.push(name);
            e.target.classList.add('active');
          } else {
            favorites.splice(idx, 1);
            e.target.classList.remove('active');
          }
          localStorage.setItem('favorites', JSON.stringify(favorites));
        });

        grid.appendChild(card);
      });

      section.appendChild(grid);
      gallery.appendChild(section);
    });
  })
  .catch(err => {
    gallery.innerHTML = '<p>Ошибка загрузки товаров.</p>';
    console.error(err);
  });

function groupBy(array, key) {
  return array.reduce((acc, obj) => {
    const group = obj[key] || 'Другое';
    if (!acc[group]) acc[group] = [];
    acc[group].push(obj);
    return acc;
  }, {});
}
