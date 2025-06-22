const sheetId = '1uvZDDq7y3D73InwHYQ4vKqmhHXGtK9KjdRcVXzm5KAk';
const url = `https://opensheet.elk.sh/${sheetId}/Sheet1`;

const productList = document.getElementById('product-list');

fetch(url)
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(item => item.фото && item.название && item.цена);
    productList.innerHTML = '';
    filtered.forEach(item => {
      const productEl = document.createElement('div');
      productEl.innerHTML = `
        <img src="${item.фото}" alt="${item.название}" style="max-width:100%;border-radius:12px;" />
        <h3>${item.название}</h3>
        <p>${item.описание || ''}</p>
        <strong>${item.цена} ₽</strong><br/>
        <a href="https://wa.me/ваш_номер" target="_blank">WhatsApp</a>
      `;
      productList.appendChild(productEl);
    });
  })
  .catch(err => {
    productList.innerHTML = '<p>Ошибка загрузки товаров.</p>';
    console.error(err);
  });
