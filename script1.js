// Sélectionne tous les boutons "Ajouter au panier"
document.querySelectorAll("button[data-id]").forEach(bouton => {
    bouton.addEventListener("click", function(event) {
      event.preventDefault();
      // Trouve l'élément details parent le plus proche
      let detail = this.closest("details");
      detail.open = !detail.open;
    });
  });

// Panier selection page menu

// Initialiser le panier depuis le localStorage ou créer un nouveau tableau vide
let panier = JSON.parse(localStorage.getItem('cafeDelicePanier')) || [];

// Ajouter des produits au panier
document.querySelectorAll('button[data-id]').forEach(button => {
  button.addEventListener('click', (e) => {
    const productId = e.target.getAttribute('data-id');
    panier.push(productId);
    console.log(`Produit ${productId} ajouté au panier.`);
    
    // Sauvegarder le panier dans le localStorage
    localStorage.setItem('cafeDelicePanier', JSON.stringify(panier));
    
    // Mettre à jour le compteur de produits dans le panier
    updateCartIndicator();
    
    // Afficher une confirmation
    alert(`Produit ${productId} ajouté au panier!`);
  });
});

// Fonction pour mettre à jour l'indicateur de nombre d'articles dans le panier
function updateCartIndicator() {
  const cartIndicator = document.getElementById('cart-count');
  if (cartIndicator) {
    cartIndicator.textContent = panier.length;
    cartIndicator.style.display = panier.length > 0 ? 'inline-block' : 'none';
  }
}

// Ajouter une icône de panier flottante à la page
function addCartIcon() {
  if (!document.getElementById('floating-cart')) {
    const cartIcon = document.createElement('div');
    cartIcon.id = 'floating-cart';
    cartIcon.innerHTML = `
      <a href="panier.html" class="cart-icon">
        🛒
        <span id="cart-count" class="cart-badge">${panier.length}</span>
      </a>
    `;
    document.body.appendChild(cartIcon);
  }
}

// Initialiser la page au chargement
document.addEventListener('DOMContentLoaded', function() {
  addCartIcon();
  updateCartIndicator();
});  