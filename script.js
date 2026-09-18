const ITEMS = [
  { id: 1, section: "coaching", name: "1-to-1 Coaching Session", desc: "Personalised one-on-one coaching.", price: 30.00 },
  { id: 2, section: "coaching", name: "Group Session", desc: "Small-group coaching session.", price: 15.00 },
  { id: 3, section: "parties", name: "Bronze Party Package", desc: "A fun themed party session.", price: 75.00 },
  { id: 4, section: "parties", name: "Silver Party Package", desc: "Extended package with more games.", price: 120.00 },
  { id: 5, section: "parties", name: "Gold Party Package", desc: "Full party experience with a host.", price: 180.00 },
];

const SECTIONS = [
  { key: "coaching", elementId: "list-coaching" },
  { key: "parties", elementId: "list-parties" },
];

let basket = [];

function formatPrice(amount) {
  return `£${amount.toFixed(2)}`;
}

function renderProducts() {
  SECTIONS.forEach(section => {
    const list = document.getElementById(section.elementId);
    list.innerHTML = "";
    ITEMS.filter(i => i.section === section.key).forEach(item => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-name">${item.name}</div>
        <div class="product-desc">${item.desc}</div>
        <div class="product-footer">
          <span class="product-price">${formatPrice(item.price)}</span>
          <button class="add-btn" data-id="${item.id}">Add</button>
        </div>
      `;
      list.appendChild(card);
    });
  });

  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToBasket(Number(btn.dataset.id)));
  });
}

function addToBasket(itemId) {
  const item = ITEMS.find(i => i.id === itemId);
  const existing = basket.find(b => b.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    basket.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }
  renderBasket();
}

function removeFromBasket(itemId) {
  basket = basket.filter(b => b.id !== itemId);
  renderBasket();
}

function renderBasket() {
  const container = document.getElementById("basket-items");
  const totalEl = document.getElementById("basket-total");

  if (basket.length === 0) {
    container.innerHTML = `<p class="empty-basket">Nothing added yet</p>`;
    totalEl.textContent = formatPrice(0);
    updateCheckoutAvailability();
    return;
  }

  container.innerHTML = "";
  let total = 0;
  basket.forEach(item => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    const row = document.createElement("div");
    row.className = "basket-row";
    row.innerHTML = `
      <span>${item.qty} × ${item.name}</span>
      <span>${formatPrice(lineTotal)} <button data-id="${item.id}">remove</button></span>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => removeFromBasket(Number(btn.dataset.id)));
  });

  totalEl.textContent = formatPrice(total);
  updateCheckoutAvailability();
}

function updateCheckoutAvailability() {
  const nameInput = document.getElementById("customer-name");
  const dateInput = document.getElementById("booking-date");
  const checkoutBtn = document.getElementById("checkout-btn");
  checkoutBtn.disabled = basket.length === 0 || !nameInput.value.trim() || !dateInput.value;
}

function setupCheckout() {
  const overlay = document.getElementById("confirmation-overlay");
  document.getElementById("checkout-btn").addEventListener("click", () => {
    overlay.classList.remove("hidden");
    basket = [];
    renderBasket();
    document.getElementById("customer-name").value = "";
    document.getElementById("booking-date").value = "";
  });
  document.getElementById("close-overlay").addEventListener("click", () => overlay.classList.add("hidden"));
}

function setupDatePicker() {
  const dateInput = document.getElementById("booking-date");
  const today = new Date();
  const pad = n => String(n).padStart(2, "0");
  dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  dateInput.addEventListener("change", updateCheckoutAvailability);
}

document.getElementById("customer-name").addEventListener("input", updateCheckoutAvailability);

renderProducts();
renderBasket();
setupCheckout();
setupDatePicker();
