// ✅ ID твоей Google Таблицы
const sheetId = '1gBcuPzWv_nH2i7sWyCaERVCjO-hLg8EcndPkEMlNqgw';

// ✅ Ссылка для получения данных (в обратных кавычках!)
const url = `https://opensheet.elk.sh/${sheetId}/Лист1`;

const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search');

let products = [];

// Загружаем данные из Google Таблицы
fetch(url)
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  })
  .catch(err => {
    console.error('Ошибка при загрузке товаров:', err);
    productList.innerHTML = '<p style="color: red;">Не удалось загрузить товары. Проверь подключение к таблице.</p>';
  });

// Функция отрисовки товаров
function renderProducts(items) {
  productList.innerHTML = '';

  items.forEach(item => {
    if (!item.фото || !item.название || !item.цена) return;

    const el = document.createElement('div');
    el.className = 'product';
    el.innerHTML = `
      <img src="${item.фото}" alt="${item.название}" style="max-width: 100%; height: auto; object-fit: contain;">
      <h3>${item.название}</h3>
      <p><b>${item.цена} ₽</b></p>
      <p>${item.описание || ''}</p>
      <div class="buttons">
        <a href="https://wa.me/79376280080" target="_blank">WhatsApp</a>
        <a href="https://t.me/internet_magazin_v_ingushetii" target="_blank">Telegram</a>
        <a href="https://instagram.com" target="_blank">Instagram</a>
      </div>
    `;
    productList.appendChild(el);
  });
}

// 🔍 Поиск по товарам
searchInput.addEventListener('input', () => {
  const value = searchInput.value.toLowerCase();
  const filtered = products.filter(p =>
    p.название?.toLowerCase().includes(value) ||
    p.описание?.toLowerCase().includes(value) ||
    p.категория?.toLowerCase().includes(value) ||
    p.подкатегория?.toLowerCase().includes(value)
  );
  renderProducts(filtered);
});
