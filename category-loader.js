const categoryUrl = `${baseUrl}/Sheet1`;

const catGallery = document.getElementById('category-gallery'); // переменная переименована, чтобы не было конфликтов

fetch(categoryUrl)
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(item => item.категория && item['картинка категории']);
    const categoriesMap = {};

    filtered.forEach(item => {
      const cat = item.категория;
      if (cat && !categoriesMap[cat]) {
        categoriesMap[cat] = item['картинка категории'];
      }
    });

    if (!catGallery) return;

    catGallery.innerHTML = '';
    Object.entries(categoriesMap).forEach(([category, image]) => {
      const tile = document.createElement('div');
      tile.className = 'category-tile';
      tile.innerHTML = `
        <a href="category-products.html?category=${encodeURIComponent(category)}">
          <img src="${image}" alt="${category}" />
          <span>${category}</span>
        </a>
      `;
      catGallery.appendChild(tile);
    });
  })
  .catch(err => {
    console.error('Ошибка загрузки категорий:', err);
    if (catGallery) catGallery.innerHTML = '<p>Не удалось загрузить категории.</p>';
  });
