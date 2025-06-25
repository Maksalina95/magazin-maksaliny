// favorites.js

document.addEventListener('DOMContentLoaded', () => {
  // При загрузке отмечаем уже избранные товары кнопками
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    if (favorites.includes(btn.dataset.id)) {
      btn.style.color = 'red';
    }
  });

  // Обработчик клика на кнопках "Избранное"
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('favorite-btn')) {
      const productId = e.target.dataset.id;
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

      if (favorites.includes(productId)) {
        // Удаляем из избранного
        favorites = favorites.filter(id => id !== productId);
        e.target.style.color = 'gray';
      } else {
        // Добавляем в избранное
        favorites.push(productId);
        e.target.style.color = 'red';
      }

      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  });
});
