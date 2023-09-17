// Récupération des informations depuis le fichier package.json
const url = `http://localhost:3000/api/products/`;

if (isEmptyCard()) {
  document.getElementsByClassName('cart__order').item(0).style.display = "none";
}

// Fonction pour générer les articles du panier
async function generateCartItems() {
  const cartItemsContainer = document.getElementById("cart__items");
  cartItemsContainer.innerHTML = "";

  let totalAmount = 0;
  let totalQuantity = 0;

  const cartData = JSON.parse(localStorage.getItem("Cart")) || [];

  for (const cartProduct of cartData) {

    const response = await fetch(`${url}${cartProduct.id}`);
    const product = await response.json();

    if (product) {
      const price = product.price;

      const article = createCartItemElement(cartProduct, product);
      cartItemsContainer.appendChild(article);

      totalAmount += price * cartProduct.quantity;
      totalQuantity += cartProduct.quantity;
    }
  }

  updateTotal();
}

// Fonction pour créer un élément d'article du panier
function createCartItemElement(cartProduct, product) {
  const article = document.createElement("article");

  article.innerHTML = `
    <article class="cart__item" data-id="${cartProduct.id}" data-color="${cartProduct.color}">
    <div class="cart__item__img">
      <img src="${cartProduct.imageUrl}" alt="${cartProduct.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${cartProduct.name}</h2>
        <p>${cartProduct.color}</p>
        <p>${product.price} €</p>
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

  article.getElementsByClassName('itemQuantity').item(0).addEventListener('change', function () {
    changeQuantityInCart(cartProduct.id, cartProduct.color, parseInt(this.value));
  });

  // Supprimer un article
  const deleteItem = article.querySelector('.deleteItem');

  if (deleteItem) {
    deleteItem.addEventListener('click', function () {
      const cartItem = deleteItem.closest('.cart__item');

      if (cartItem) {
        const cartContent = JSON.parse(localStorage.getItem('Cart')) || [];
        const itemIndex = cartContent.findIndex((item) => item.id === cartProduct.id && cartProduct.color === item.color);

        if (itemIndex !== -1) {
          cartContent.splice(itemIndex, 1);
          localStorage.setItem('Cart', JSON.stringify(cartContent));

          cartItem.remove();
          if (isEmptyCard()) {
            document.getElementsByClassName('cart__order').item(0).style.display = "none";
          }
          updateTotal();
        }
      }
    });
  }

  return article;
}

// Fonction pour mettre à jour le montant total et la quantité totale
async function updateTotal() {
  const cartData = JSON.parse(localStorage.getItem("Cart")) || [];
  totalQuantity = 0;
  totalAmount = 0;
  for (const cartProduct of cartData) {
    const response = await fetch(`${url}${cartProduct.id}`);
    const product = await response.json();

    totalQuantity += parseInt(cartProduct.quantity, 10);
    totalAmount += product.price * cartProduct.quantity;
  }
  const totalQuantityElement = document.getElementById("totalQuantity");
  const totalPriceElement = document.getElementById("totalPrice");

  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalAmount;
}

// Fonction pour mettre à jour les quantités dans le localStorage
function changeQuantityInCart(product_id, product_color, new_quantity) {
  const cartData = JSON.parse(localStorage.getItem("Cart")) || [];
  for (var i in cartData) {
    if (cartData[i].id == product_id && cartData[i].color == product_color) {
      cartData[i].quantity = new_quantity;
      localStorage.setItem('Cart', JSON.stringify(cartData));
      updateTotal();
      return;
    }
  }
}

// Générer les articles et calculer le montant total
generateCartItems();


// ******** RegExp ******** //

let form = document.querySelector('.cart__order__form')

// Verification de chaque renseignement
form.firstName.addEventListener('change', function () {
  validFirstName(this);
});

form.lastName.addEventListener('change', function () {
  validLastName(this);
});

form.address.addEventListener('change', function () {
  validAddress(this)
})

form.city.addEventListener('change', function () {
  validCity(this)
})

form.email.addEventListener('change', function () {
  validEmail(this)
})

// Soumission du formulaire
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  // Crée un tableau qui contient les identifiants des produits du panier.
  const cartData = JSON.parse(localStorage.getItem('Cart')) || [];
  const identifiantsProduits = [];

  for (const cartProduct of cartData) {
    for (let i = 0; i < cartProduct.quantity; i++) {
      identifiantsProduits.push(cartProduct.id);
    }
  }
  if (isEmptyCard()) {
    alert("Le panier est vide");
    return;
  }
  // Vérifie la validité des champs du formulaire
  if ((form.firstName) && validLastName(form.lastName) && validAddress(form.address) && validCity(form.city) && validEmail(form.email)) {
    const contact = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      address: form.address.value,
      city: form.city.value,
      email: form.email.value,
    }

    // Crée l'objet de commande
    const order = {
      contact,
      products: identifiantsProduits,
      orderID:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
    }

    // Envoie la requête POST à l'API
    try {
      const response = await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const cartData = await response.json();

        if (cartData && cartData.orderId) {
          localStorage.removeItem("Cart");
          window.location.href = `./confirmation.html?orderId=${cartData.orderId}`;
        }
      } else {
        console.error("Erreur lors du chargement de la page confirmation.html");
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la soumission du formulaire :", error);
    }
  } else {
    alert("Formulaire invalide. Veuillez vérifier que toutes les données ont été saisies correctement et réessayer.");
  }
});

function isEmptyCard() {
  const cartData = JSON.parse(localStorage.getItem('Cart')) || [];
  return cartData.length === 0;
}

// Validation Regex
function validRegex(field, regexPattern, errorMessage) {

  let regex = new RegExp(
    regexPattern,
    'g'
  );
  let test = regex.test(field.value);
  let errorElement = field.nextElementSibling;

  if (test) {
    return true
  } else {
    errorElement.innerHTML = errorMessage
    return false
  }
}

// Validation First Name
const validFirstName = function (inputfirstName) {
  return validRegex(inputfirstName, '^[A-Za-zÀ-ÿ\- \'çÇ]+$', 'Veuillez ne renseigner uniquement des lettres ou caractère');
}

// Validation Last Name
const validLastName = function (inputlastName) {
  return validRegex(inputlastName, '^[A-Za-zÀ-ÿ\- \'çÇ]+$', 'Veuillez ne renseigner uniquement des lettres');
}

// Validation Address
const validAddress = function (inputaddress) {
  return validRegex(inputaddress, '^[A-Za-zÀ-ÿ\-, \'çÇ0-9]+$', 'Adresse non valide');
}

// Validation City
const validCity = function (inputcity) {
  return validRegex(inputcity, '^[A-Za-zÀ-ÿ\-, \'çÇ]+$', 'Veuillez ne renseigner uniquement un nom de ville');
}

// Validation Email
const validEmail = function (inputemail) {
  return validRegex(inputemail, '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'E-mail non valide');
}