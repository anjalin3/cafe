const menuItems = [
  {
    id: "honey-oat-latte",
    name: "Honey oat latte",
    description: "Velvety espresso, oat milk, and a soft drizzle of local honey.",
    price: 5.5,
    tag: "Cafe favorite",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "bliss-cold-brew",
    name: "Bliss cold brew",
    description: "Slow-steeped for 18 hours, finished with a bright citrus note.",
    price: 4.75,
    tag: "Chilled",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cinnamon-cappuccino",
    name: "Cinnamon cappuccino",
    description: "Rich espresso, cloud-like foam, and a little cinnamon warmth.",
    price: 5.25,
    tag: "Cozy pick",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80"
  }
];

const order = [];
const menuGrid = document.querySelector("#menu-grid");
const orderList = document.querySelector("#order-list");
const orderTotal = document.querySelector("#order-total");
const orderMessage = document.querySelector("#order-message");
const formMessage = document.querySelector("#form-message");
const cartCount = document.querySelector(".cart-count");
const orderItemsLabel = document.querySelector(".order-items-label");

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function renderMenu() {
  menuGrid.innerHTML = menuItems.map((item) => `
    <article class="menu-card">
      <div class="menu-image" style="background-image: url('${item.image}')">
        <span class="menu-tag">${item.tag}</span>
      </div>
      <div class="menu-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-bottom">
          <span class="menu-price">${formatPrice(item.price)}</span>
          <button class="add-button" type="button" data-add-item="${item.id}">
            Add to order <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToOrder(itemId) {
  const item = order.find((orderItem) => orderItem.id === itemId);
  if (item) {
    item.quantity += 1;
  } else {
    order.push({ id: itemId, quantity: 1 });
  }
  orderMessage.textContent = "Added to your order.";
  renderOrder();
}

function updateQuantity(itemId, change) {
  const item = order.find((orderItem) => orderItem.id === itemId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    const itemIndex = order.indexOf(item);
    order.splice(itemIndex, 1);
  }
  orderMessage.textContent = "";
  renderOrder();
}

function renderOrder() {
  const totalItems = order.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = order.reduce((sum, orderItem) => {
    const menuItem = menuItems.find((item) => item.id === orderItem.id);
    return sum + (menuItem.price * orderItem.quantity);
  }, 0);

  cartCount.textContent = totalItems;
  cartCount.setAttribute("aria-label", `${totalItems} item${totalItems === 1 ? "" : "s"}`);
  orderItemsLabel.textContent = `(${totalItems} item${totalItems === 1 ? "" : "s"})`;
  orderTotal.textContent = formatPrice(totalPrice);

  if (order.length === 0) {
    orderList.innerHTML = '<p class="empty-order">Your order is waiting for something delicious.</p>';
    return;
  }

  orderList.innerHTML = order.map((orderItem) => {
    const menuItem = menuItems.find((item) => item.id === orderItem.id);
    return `
      <div class="order-item">
        <div>
          <div class="order-item-name">${menuItem.name}</div>
          <div class="order-item-meta">${formatPrice(menuItem.price)} each</div>
        </div>
        <div class="order-item-actions">
          <button class="quantity-button" type="button" aria-label="Remove one ${menuItem.name}" data-change-item="${menuItem.id}" data-change="-1">-</button>
          <span>${orderItem.quantity}</span>
          <button class="quantity-button" type="button" aria-label="Add one ${menuItem.name}" data-change-item="${menuItem.id}" data-change="1">+</button>
        </div>
      </div>
    `;
  }).join("");
}

menuGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-item]");
  if (addButton) addToOrder(addButton.dataset.addItem);
});

orderList.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-change-item]");
  if (quantityButton) {
    updateQuantity(quantityButton.dataset.changeItem, Number(quantityButton.dataset.change));
  }
});

document.querySelector("#clear-order").addEventListener("click", () => {
  order.length = 0;
  orderMessage.textContent = "";
  renderOrder();
});

document.querySelector("#submit-order").addEventListener("click", () => {
  if (order.length === 0) {
    orderMessage.textContent = "Add at least one drink before placing your order.";
    return;
  }
  orderMessage.textContent = "Thank you! Your order is being prepared with care.";
  order.length = 0;
  renderOrder();
});

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    formMessage.textContent = "Please fill in each field so we can reply to you.";
    form.reportValidity();
    return;
  }
  const name = new FormData(form).get("name");
  formMessage.textContent = `Thanks, ${name}! Your message is on its way to the cafe.`;
  form.reset();
});

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

renderMenu();
renderOrder();
