const sheetId = '1uvZDDq7y3D73InwHYQ4vKqmhHXGtK9KjdRcVXzm5KAk';
const url = "https://opensheet.elk.sh/" + sheetId + "/Sheet1";

const productList = document.getElementById("product-list");

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    const filtered = data.filter(function(item) {
      return item.фото && item.название && item.цена;
    });
    productList.innerHTML = "";
    filtered.forEach(function(item) {
      const productEl = document.createElement("div");
      productEl.innerHTML =
        "<img src='" + item.фото + "' alt='" + item.название + "' style='max-width:100%;border-radius:12px;' />" +
        "<h3>" + item.название + "</h3>" +
        "<p>" + (item.описание || "") + "</p>" +
        "<strong>" + item.цена + " ₽</strong><br/>" +
        "<a href='https://wa.me/ваш_номер'>WhatsApp</a>";
      productList.appendChild(productEl);
    });
  })
  .catch(function(err) {
    productList.innerHTML = "<p>Ошибка загрузки товаров.</p>";
    console.error(err);
  });

// Очистка кеша, если есть кнопка
const refreshBtn = document.getElementById("refreshBtn");
if (refreshBtn) {
  refreshBtn.addEventListener("click", async function() {
    if ("caches" in window) {
      const names = await caches.keys();
      await Promise.all(names.map(function(name) {
        return caches.delete(name);
      }));
    }
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ action: "skipWaiting" });
    }
    location.reload(true);
  });
}
