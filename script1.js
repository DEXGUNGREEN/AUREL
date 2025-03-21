// Initialiser le panier depuis le localStorage ou créer un nouveau tableau vide
let panier = JSON.parse(localStorage.getItem('cafeDelicePanier')) || [];

// Fonction pour mettre à jour l'indicateur de nombre d'articles dans le panier
function updateCartIndicator() {
  const cartIndicator = document.getElementById('cart-count');
  if (cartIndicator) {
    const totalItems = panier.reduce((sum, item) => sum + item.quantity, 0);
    cartIndicator.textContent = totalItems;
    cartIndicator.style.display = totalItems > 0 ? 'inline-block' : 'none';
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
        <span id="cart-count" class="cart-badge">${panier.reduce((sum, item) => sum + item.quantity, 0)}</span>
      </a>
    `;
    cartIcon.style.position = 'fixed';
    cartIcon.style.bottom = '20px';
    cartIcon.style.right = '20px';
    cartIcon.style.backgroundColor = '#8b4513';
    cartIcon.style.color = 'white';
    cartIcon.style.padding = '10px';
    cartIcon.style.borderRadius = '50%';
    cartIcon.style.cursor = 'pointer';
    document.body.appendChild(cartIcon);
  }
}

// Ouvrir/fermer les détails au clic sur "Ajouter au panier"
document.querySelectorAll("button[data-id]").forEach(bouton => {
  bouton.addEventListener("click", function(event) {
    event.preventDefault();
    let detail = this.closest("details");
    detail.open = !detail.open;
  });
});

// Gérer la soumission du formulaire pour ajouter au panier
document.querySelectorAll('form.order-form, form[id="order-form"]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const button = form.closest('details').querySelector('button[data-id]');
    const productId = button.getAttribute('data-id');
    const quantityInput = form.querySelector('input[type="number"]');
    const quantity = parseInt(quantityInput.value) || 1;
    const priceElement = form.closest('li, .produit-card').querySelector('.prix');
    const price = parseFloat(priceElement.textContent.replace('Prix : ', '').replace('€', ''));

    // Vérifier si le produit existe déjà dans le panier
    const existingItem = panier.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      panier.push({ id: productId, quantity: quantity, price: price });
    }

    // Sauvegarder le panier dans le localStorage
    localStorage.setItem('cafeDelicePanier', JSON.stringify(panier));

    // Mettre à jour l'indicateur du panier
    updateCartIndicator();

    // Afficher une confirmation
    alert(`Produit ${productId} ajouté au panier (${quantity} fois) !`);

    // Réinitialiser le formulaire et fermer les détails
    form.reset();
    form.closest('details').open = false;
  });
});

// Initialiser la page au chargement
document.addEventListener('DOMContentLoaded', function() {
  addCartIcon();
  updateCartIndicator();
});