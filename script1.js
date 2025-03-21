// Initialiser le panier depuis le localStorage ou créer un tableau vide
let panier = JSON.parse(localStorage.getItem('cafeDelicePanier')) || [];

// Mettre à jour l'indicateur du panier (s'il existe)
function updateCartIndicator() {
  const cartIndicator = document.getElementById('cart-count');
  if (cartIndicator) {
    const totalItems = panier.reduce((sum, item) => sum + item.quantity, 0);
    cartIndicator.textContent = totalItems;
    cartIndicator.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

// Ajouter une icône de panier flottante
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

// Récupérer le nom du produit
function getProductName(element) {
  const productElement = element.closest('li').querySelector('.produit');
  return productElement ? productElement.textContent : 'Produit inconnu';
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  console.log("Page chargée, initialisation du script...");

  // Ajouter l'icône du panier
  addCartIcon();
  updateCartIndicator();

  // Gérer le clic sur "Ajouter au panier"
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const details = this.closest('details');
      details.open = !details.open;
    });
  });

  // Gérer la soumission des formulaires
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const button = form.closest('details').querySelector('.add-to-cart');
      const productId = button.getAttribute('data-id');
      const quantityInput = form.querySelector('input[type="number"]');
      const quantity = parseInt(quantityInput.value) || 1;
      const priceElement = form.closest('li').querySelector('span:not(.produit)');
      const priceText = priceElement.textContent.match(/Prix : (\d+)€/);
      const price = priceText ? parseFloat(priceText[1]) : 0;
      const productName = getProductName(form);

      // Ajouter ou mettre à jour le produit dans le panier
      const existingItem = panier.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        panier.push({ id: productId, quantity: quantity, price: price, name: productName });
      }

      // Sauvegarder dans localStorage
      localStorage.setItem('cafeDelicePanier', JSON.stringify(panier));

      // Mettre à jour l'indicateur
      updateCartIndicator();

      // Afficher une confirmation
      alert(`${productName} ajouté au panier (${quantity} fois) !`);

      // Réinitialiser et fermer
      form.reset();
      form.closest('details').open = false;
    });
  });
});