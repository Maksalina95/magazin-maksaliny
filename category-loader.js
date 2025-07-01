const categoryUrl = `${baseUrl}/Sheet1`;

let categoryGallery = document.getElementById('category-gallery'); // ✅ ID исправлен

fetch(urlCategory)
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
  })
  .catch(err => {
    console.error('Ошибка загрузки категорий:', err);
    if (categoryGallery) categoryGallery.innerHTML = '<p>Не удалось загрузить категории.</p>';
  });
