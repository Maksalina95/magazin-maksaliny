/* Сетка товаров */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* Карточка товара */
.product-card {
  background-color: #fff7f7;
  border: 1px solid #d37a7a;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 0 8px rgba(166, 59, 59, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 0 15px rgba(166, 59, 59, 0.4);
}

.product-card img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 12px;
  object-fit: contain;
}

.product-card h3 {
  margin: 8px 0 6px;
  font-size: 18px;
  color: #a63b3b;
  text-align: center;
}

.product-card p {
  font-size: 14px;
  color: #4b2e2e;
  text-align: center;
  margin: 4px 0;
}

.product-card iframe {
  border-radius: 12px;
  margin-top: 12px;
  max-width: 100%;
  aspect-ratio: 16 / 9;
}
