const url = `http://localhost:3000/api/products/`;

// Fonction pour générer les articles du panier
async function generateCartItems() {
  const cartItemsContainer = document.getElementById("cart__items");

  let totalAmount = 0
  let totalQuantity = 0

  cartItemsContainer.innerHTML = "";

  const cartData = JSON.parse(localStorage.getItem("addToCart")) || [];

  for (const cartProduct of cartData) {
    const response = await fetch(url + cartProduct._id);
    const product = await response.json();

    if (product) {
      const article = createCartItemElement(cartProduct, product);
      cartItemsContainer.appendChild(article);

      totalAmount += cartProduct.price * cartProduct.quantity
      totalQuantity += cartProduct.quantity;
    }
  }

  updateTotal(totalQuantity, totalAmount);
}

// Fonction pour supprimer un article du panier





// Fonction pour créer un élément d'article du panier
function createCartItemElement(cartProduct) {
  const article = document.createElement("article");
  article.className = "cart__item";
  article.dataset.id = cartProduct._id;
  article.dataset.color = cartProduct.color;

  article.innerHTML = `
  <div class="cart__item__img">
    <img src="${cartProduct.imageUrl}" alt="${cartProduct.altTxt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${cartProduct.name}</h2>
      <p>${cartProduct.color}</p>
      <p>${cartProduct.price} €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartProduct.quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>
  `;

  return article;
}

// Fonction pour mettre à jour le montant total et la quantité totale
function updateTotal(totalQuantity, totalAmount) {
  const totalQuantityElement = document.getElementById("totalQuantity");
  const totalPriceElement = document.getElementById("totalPrice");

  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalAmount;
}

// Détecter les changements dans la quantité des articles
const cartItemsContainer = document.getElementById("cart__items");
cartItemsContainer.addEventListener("input", () => {
  updateTotalQuantity();
  updateTotalAmount();
});

// Générer les articles et calculer le montant total
generateCartItems();