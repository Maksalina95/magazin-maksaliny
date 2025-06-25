// favorites.js

const favoritesKey = "favoritesList";

function getFavorites() {
  return JSON.parse(localStorage.getItem(favoritesKey)) || [];
}

function saveFavorites(favs) {
  localStorage.setItem(favoritesKey, JSON.stringify(favs));
}

function addToFavorites(productId) {
  let favs = getFavorites();
  if (!favs.includes(productId)) {
    favs.push(productId);
    saveFavorites(favs);
    alert("Товар добавлен в избранное!");
  } else {
    alert("Товар уже в избранном");
  }
}

// Для страницы избранного (favorites.html)
function renderFavorites(products) {
  const favs = getFavorites();
  const container = document.getElementById("favorites-list");

  if (!container) return;

  const favProducts = products.filter(p => favs.includes(p.id));
  if (favProducts.length === 0) {
    container.innerHTML = "<p>Избранных товаров пока нет</p>";
    return;
  }
  container.innerHTML = favProducts
    .map(p => `
      <div class="product-card">
        <img src="${p.img}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p><strong>Цена: ${p.price} ₽</strong></p>
        <button onclick="removeFromFavorites(${p.id})">❌ Удалить из избранного</button>
      </div>
    `)
    .join("");
}

function removeFromFavorites(productId) {
  let favs = getFavorites();
  favs = favs.filter(id => id !== productId);
  saveFavorites(favs);
  renderFavorites(window.products || []); // повторно отрисовать
}

// Если на странице favorites.html
if (document.getElementById("favorites-list")) {
  renderFavorites(window.products || []);
}
