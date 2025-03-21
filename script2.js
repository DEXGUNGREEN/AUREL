// Récupérer le panier depuis le localStorage
let panier = JSON.parse(localStorage.getItem('cafeDelicePanier')) || [];

// Fonction pour mettre à jour l'affichage du panier
function updateCartSummary() {
  const cartItems = document.getElementById('cart-items');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const itemsCount = document.getElementById('items-count');
  const cartTotalPrice = document.getElementById('cart-total-price');
  
  cartItems.innerHTML = '';
  
  if (panier.length === 0) {
    emptyCartMessage.style.display = 'block';
    itemsCount.textContent = '0';
    cartTotalPrice.textContent = '0';
  } else {
    emptyCartMessage.style.display = 'none';
    
    let totalItems = 0;
    let totalPrice = 0;
    
    panier.forEach((item, index) => {
      const itemTotal = item.quantity * item.price;
      totalItems += item.quantity;
      totalPrice += itemTotal;
      
      const li = document.createElement('li');
      li.innerHTML = `
        Produit ${item.id} 
        <span class="quantity-controls">
          <button class="decrease" data-index="${index}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </span> 
        - ${itemTotal}€ 
        <button class="remove-item" data-index="${index}">X</button>
      `;
      cartItems.appendChild(li);
    });
    
    itemsCount.textContent = totalItems;
    cartTotalPrice.textContent = totalPrice.toFixed(2); // 2 décimales pour les euros
  }
}

// Fonction pour sauvegarder le panier dans le localStorage
function saveCart() {
  localStorage.setItem('cafeDelicePanier', JSON.stringify(panier));
}

// Gérer les événements de modification du panier
document.addEventListener('click', function(e) {
  const index = parseInt(e.target.getAttribute('data-index'));

  // Supprimer un produit
  if (e.target.classList.contains('remove-item')) {
    panier.splice(index, 1);
    saveCart();
    updateCartSummary();
  }

  // Augmenter la quantité
  if (e.target.classList.contains('increase')) {
    panier[index].quantity++;
    saveCart();
    updateCartSummary();
  }

  // Diminuer la quantité
  if (e.target.classList.contains('decrease')) {
    if (panier[index].quantity > 1) {
      panier[index].quantity--;
    } else {
      panier.splice(index, 1); // Supprimer si la quantité tombe à 0
    }
    saveCart();
    updateCartSummary();
  }
});

// Gérer le bouton de paiement
document.getElementById('checkout').addEventListener('click', () => {
  if (panier.length > 0) {
    alert('Redirection vers le système de paiement...');
    // Ajouter ici la logique réelle de redirection ou de paiement
  } else {
    alert('Votre panier est vide. Veuillez ajouter des produits avant de procéder au paiement.');
  }
});

// Initialiser l'affichage du panier au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  updateCartSummary();
});