const params = new URL(document.location).searchParams;
const id = params.get("id");

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
                if (color == null || color === "" || quantity == null || quantity == 0) {
                    alert("Merci de selectionner une couleur et une quantité")
                    return
                }

                // Création d'un objet pour le produit à ajouter au panier

                const addCanap = {
                    quantity: parseInt(quantity, 10),
                    color: color,
                    id: id,
                    price: data.price,
                    name: data.name,
                    imageUrl: data.imageUrl,
                    altTxt: data.altTxt,
                    description: data.description
                };

                // Vérification et ajout du contenu du panier dans le LocalStorage
                let addProductLocalStorage = [];
                if (localStorage.getItem("addToCart") !== null) {
                    addProductLocalStorage = JSON.parse(localStorage.getItem("addToCart"));
                }

                addProductLocalStorage.push(addCanap);
                localStorage.setItem("addToCart", JSON.stringify(addProductLocalStorage));
            });
        });
};

// Fonction pour charger les données du produit
getCanape();