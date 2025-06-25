// favorites.js
document.addEventListener("DOMContentLoaded", () => {
  const favoritesList = document.getElementById("favorites-list");

  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<p>Пока ничего не добавлено в избранное.</p>";
    return;
  }

  favoritesList.innerHTML = "";

  favorites.forEach(product => {
    const div = document.createElement("div");
    div.className = "favorite-item";
    div.innerHTML = `
      <img src="${product.photo}" alt="${product.name}" style="width:100px;height:auto;border-radius:10px;" />
      <h3>${product.name}</h3>
      <p>${product.price} ₽</p>
    `;
    favoritesList.appendChild(div);
  });
});
