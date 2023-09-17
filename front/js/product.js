const params = new URL(document.location).searchParams;
const id = params.get("id");

// Récupération des informations depuis le fichier package.json
const url = 'http://localhost:3000/api/products/' + id;
const data = {};

const getCanape = () => {
    // Faire une requête pour récupérer les données JSON
    fetch(url)
        .then((response) => response.json())
        .then((data) => {

            // Création d'un élément d'image pour l'image du produit
            const imageElement = document.createElement("img");
            imageElement.setAttribute("src", data.imageUrl);
            imageElement.setAttribute("alt", data.altTxt);
            document.querySelector(".item__img").appendChild(imageElement);

            // Ajout du titre du produit
            document.getElementById("title").innerHTML = data.name;

            // Ajout du prix du produit
            document.getElementById("price").innerHTML = data.price;

            // Ajout de la description du produit
            document.getElementById("description").innerHTML = data.description;

            // Ajout des choix de couleur dans la liste déroulante
            const colorsSelect = document.getElementById("colors");
            for (const color of data.colors) {
                const option = document.createElement("option");
                option.value = color;
                option.textContent = color
                colorsSelect.appendChild(option);
            }

            const addToCart = document.getElementById("addToCart");
            addToCart.addEventListener("click", () => {

                // Récupération de la quantité et de la couleur sélectionnées + ajout de l'alerte
                const quantity = document.getElementById("quantity").value;
                const color = document.getElementById("colors").value;
                if (color == null || color === "" || quantity == null || quantity == 0 || quantity > 100) {
                    alert("Merci de selectionner une couleur et une quantité inférieure ou égale à 100")
                    return
                }

                // Création d'un objet pour le produit à ajouter au panier
                const addCanap = {
                    quantity: parseInt(quantity, 10),
                    color: color,
                    id: id,
                    name: data.name,
                    imageUrl: data.imageUrl,
                    altTxt: data.altTxt,
                    description: data.description
                };

                // Vérification et ajout du contenu du panier dans le LocalStorage
                let cartData = [];
                if (localStorage.getItem("Cart") !== null) {
                    cartData = JSON.parse(localStorage.getItem("Cart"));
                }

                // Vérification si un produit identique est déjà présent dans le panier
                let actualProductQuantityInCart = 0;
                for (var i in cartData) {
                    if (cartData[i].id == addCanap.id && cartData[i].color == addCanap.color) {
                        actualProductQuantityInCart += cartData[i].quantity;
                    }
                }

                if (actualProductQuantityInCart > 0) {
                    let newQuantity = actualProductQuantityInCart + addCanap.quantity;
                    if (newQuantity > 100) {
                        newQuantity = 100;
                        alert("La quantité maximum est atteinte, la quantité est réduite à 100.");
                    }
                    changeQuantityInCart(addCanap.id, addCanap.color, newQuantity);
                }
                else {
                    cartData.push(addCanap);
                    localStorage.setItem("Cart", JSON.stringify(cartData));
                }

                alert("L'article a été ajouté au panier.");
            });

            // Fonction pour mettre à jour les quantités dans le localStorage
            function changeQuantityInCart(product_id, product_color, new_quantity) {
                const cartData = JSON.parse(localStorage.getItem("Cart")) || [];
                for (var i in cartData) {
                    if (cartData[i].id == product_id && cartData[i].color == product_color) {
                        cartData[i].quantity = new_quantity;
                        localStorage.setItem('Cart', JSON.stringify(cartData));
                        return;
                    }
                }
            }

        })
};

// Fonction pour charger les données du produit
getCanape();