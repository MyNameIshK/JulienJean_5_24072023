const url = `http://localhost:3000/api/products/`;

// Fonction pour générer les articles du panier
async function generateCartItems() {
  const cartItemsContainer = document.getElementById("cart__items");
  cartItemsContainer.innerHTML = "";

  let totalAmount = 0;
  let totalQuantity = 0;

  const cartData = JSON.parse(localStorage.getItem("Cart")) || [];

  for (const cartProduct of cartData) {
    const response = await fetch(url);
    const product = await response.json();

    if (product) {
      const article = createCartItemElement(cartProduct, product);
      cartItemsContainer.appendChild(article);

      totalAmount += cartProduct.price * cartProduct.quantity;
      totalQuantity += cartProduct.quantity;
    }
  }

  updateTotal();
}

// Fonction pour créer un élément d'article du panier
function createCartItemElement(cartProduct) {
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
  
  article.getElementsByClassName('itemQuantity').item(0).addEventListener('change', function () {
    changeQuantityInCart(cartProduct.id, this.value);
  });

  // Supprimer un article
  const deleteItem = article.querySelector('.deleteItem');

  if (deleteItem) {
    deleteItem.addEventListener('click', function () {
      const cartItem = deleteItem.closest('.cart__item');

      if (cartItem) {
        const cartContent = JSON.parse(localStorage.getItem('Cart')) || [];
        const itemIndex = cartContent.findIndex((item) => item._id === cartProduct._id);

        if (itemIndex !== -1) {
          cartContent.splice(itemIndex, 1);
          localStorage.setItem('Cart', JSON.stringify(cartContent));

          cartItem.remove();
          updateTotal();
        }
      }
    });
  }
  return article;
}

// Fonction pour mettre à jour le montant total et la quantité totale
function updateTotal() {
  const cartData = JSON.parse(localStorage.getItem("Cart")) || [];
  totalQuantity = 0;
  totalAmount = 0;
  for (const cartProduct of cartData) {
    totalQuantity += parseInt(cartProduct.quantity, 10);
    totalAmount += cartProduct.price * cartProduct.quantity;
  }
  const totalQuantityElement = document.getElementById("totalQuantity");
  const totalPriceElement = document.getElementById("totalPrice");

  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalAmount;
}

function changeQuantityInCart(product_id, new_quantity){
  const cartData = JSON.parse(localStorage.getItem("Cart")) || [];
  for (var i in cartData) {
    if(cartData[i].id == product_id){
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
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (validFirstName(form.firstName) && validLastName(form.lastName) && validAddress(form.address) && validCity(form.city) && validEmail(form.email)) {
    contact = {
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      city: form.city,
      email: form.email,
    }
    
    //Créer un tableau qui contient les identifiants des produits du panier.
    //Si un produit est en plusieurs quantités, l'identifiant du produit doit être listé plusieurs fois dans le tableau

    //Appeler l'api orderProducts en lui passant le contact et le tableau de produit, pour récupérer le numéro de commande.

    //Une fois le numéro de commande récupéré, redirigier vers confirmation.html
  }
  form.submit();
});

// Validation Regex
function validRegex(field, regexPattern, errorMessage, validationMessage) {

  let regex = new RegExp(
    regexPattern,
    'g'
  );
  let test = regex.test(field.value);
  let errorElement = field.nextElementSibling;

  if (test) {
    errorElement.innerHTML = validationMessage
    return true
  } else {
    errorElement.innerHTML = errorMessage
    return false
  }
}

// Validation First Name
const validFirstName = function (inputfirstName) {
  return validRegex(inputfirstName, '^[A-Za-zÀ-ÿ\- \'çÇ]+$', 'Veuillez ne renseigner uniquement des lettres ou caractère', 'Prénom valide');
}

// Validation Last Name
const validLastName = function (inputlastName) {
  return validRegex(inputlastName, '^[A-Za-zÀ-ÿ\- \'çÇ]+$', 'Veuillez ne renseigner uniquement des lettres', 'Nom valide');
}

// Validation Address
const validAddress = function (inputaddress) {
  return validRegex(inputaddress, '^[A-Za-zÀ-ÿ\-, \'çÇ0-9]+$', 'Adresse non valide', 'Adresse valide');
}

// Validation City
const validCity = function (inputcity) {
  return validRegex(inputcity, '^[A-Za-zÀ-ÿ\-, \'çÇ]+$', 'Veuillez ne renseigner uniquement un nom de ville', 'Ville valide');
}

// Validation Email
const validEmail = function (inputemail) {
  return validRegex(inputemail, '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'E-mail non valide', 'E-mail valide');
}