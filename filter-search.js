// filterSearch.js

// Товары — пример. В реале можешь загрузить из Google Sheets или файла
const products = [
  {
    id: 1,
    category: "Техника",
    subcategory: "Кухонная техника",
    brand: "BrandA",
    country: "Россия",
    price: 3500,
    name: "Миксер",
    description: "Качественный миксер для кухни",
    img: "images/mixer.jpg"
  },
  {
    id: 2,
    category: "Посуда",
    subcategory: "Тарелки",
    brand: "BrandB",
    country: "Италия",
    price: 1500,
    name: "Тарелка фарфоровая",
    description: "Белая фарфоровая тарелка",
    img: "images/plate.jpg"
  },
  // Добавляй свои товары
];

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");

const filterCategory = document.getElementById("filter-category");
const filterSubcategory = document.getElementById("filter-subcategory");
const filterBrand = document.getElementById("filter-brand");
const filterCountry = document.getElementById("filter-country");
const filterPriceMin = document.getElementById("filter-price-min");
const filterPriceMax = document.getElementById("filter-price-max");

// Функция для заполнения селектов уникальными значениями из товаров
function fillFilterOptions() {
  const categories = [...new Set(products.map(p => p.category))];
  const subcategories = [...new Set(products.map(p => p.subcategory))];
  const brands = [...new Set(products.map(p => p.brand))];
  const countries = [...new Set(products.map(p => p.country))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filterCategory.appendChild(option);
  });

  subcategories.forEach(sub => {
    const option = document.createElement("option");
    option.value = sub;
    option.textContent = sub;
    filterSubcategory.appendChild(option);
  });

  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    filterBrand.appendChild(option);
  });

  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    filterCountry.appendChild(option);
  });
}

// Функция отрисовки товаров на страницу
function renderProducts(filteredProducts) {
  if (filteredProducts.length === 0) {
    productList.innerHTML = "<p>Товаров не найдено</p>";
    return;
  }
  productList.innerHTML = filteredProducts
    .map(p => `
      <div class="product-card">
        <img src="${p.img}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p><strong>Цена: ${p.price} ₽</strong></p>
        <button onclick="addToFavorites(${p.id})">❤ В избранное</button>
      </div>
    `)
    .join("");
}

// Фильтрация товаров по выбранным фильтрам и поиску
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const categoryVal = filterCategory.value;
  const subcategoryVal = filterSubcategory.value;
  const brandVal = filterBrand.value;
  const countryVal = filterCountry.value;
  const priceMinVal = parseFloat(filterPriceMin.value) || 0;
  const priceMaxVal = parseFloat(filterPriceMax.value) || Infinity;

  const filtered = products.filter(p => {
    return (
      (categoryVal === "" || p.category === categoryVal) &&
      (subcategoryVal === "" || p.subcategory === subcategoryVal) &&
      (brandVal === "" || p.brand === brandVal) &&
      (countryVal === "" || p.country === countryVal) &&
      p.price >= priceMinVal &&
      p.price <= priceMaxVal &&
      (p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm))
    );
  });
  renderProducts(filtered);
}

// Инициализация
fillFilterOptions();
renderProducts(products);

// Слушатели событий для фильтров и поиска
searchInput.addEventListener("input", filterProducts);
filterCategory.addEventListener("change", filterProducts);
filterSubcategory.addEventListener("change", filterProducts);
filterBrand.addEventListener("change", filterProducts);
filterCountry.addEventListener("change", filterProducts);
filterPriceMin.addEventListener("input", filterProducts);
filterPriceMax.addEventListener("input", filterProducts);

// Кнопка обновления страницы
document.getElementById("refreshBtn").addEventListener("click", () => {
  location.reload();
});
