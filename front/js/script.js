// Récupération des informations depuis le fichier package.json
const url = "http://localhost:3000/api/products/";
const items = document.getElementById("items");

// Faire une requête pour récupérer les données JSON
fetch(url)
    .then((response) => response.json())
    .then((data) => {

        // Itérer pour créer les vignettes des canapés
        data.forEach((canape) => {

            // Le href du canapé
            const productElement = document.createElement("a");
            productElement.href = `./product.html?id=${canape._id}`;

            // L'image du canapé
            const imageElement = document.createElement("img");
            imageElement.src = canape.imageUrl;
            imageElement.alt = canape.altTxt;

            // Le nom du canapé
            const nomElement = document.createElement("h3");
            nomElement.innerText = canape.name;

            // La description du canapé
            const categorieElement = document.createElement("p");
            categorieElement.innerText = canape.description;

            // Attacher les balises au </a> du canapé
            const articleElement = document.createElement("article");
            articleElement.appendChild(imageElement);
            articleElement.appendChild(nomElement);
            articleElement.appendChild(categorieElement);

            // Attacher l'article au lien du produit
            productElement.appendChild(articleElement);

            // Attacher le lien du produit à la section "items"
            items.appendChild(productElement);
        });
    })
