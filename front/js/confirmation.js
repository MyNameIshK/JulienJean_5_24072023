const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");

orderCommande = document.querySelector("#orderId");
orderCommande.innerText = orderId;