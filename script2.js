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

// Panier selection html

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
      
      let totalPrice = 0;
      const uniqueItems = {};
      
      // Compter les occurrences de chaque produit
      panier.forEach(productId => {
        if (!uniqueItems[productId]) {
          uniqueItems[productId] = 1;
        } else {
          uniqueItems[productId]++;
        }
        
        // Chaque produit coûte 20€ (d'après le HTML original)
        totalPrice += 20;
      });
      
      // Créer un élément de liste pour chaque produit unique
      Object.keys(uniqueItems).forEach(productId => {
        const quantity = uniqueItems[productId];
        const li = document.createElement('li');
        li.innerHTML = `Produit ${productId} <span>(x${quantity})</span> - ${quantity * 20}€ 
                        <button class="remove-item" data-id="${productId}">X</button>`;
        cartItems.appendChild(li);
      });
      
      itemsCount.textContent = panier.length;
      cartTotalPrice.textContent = totalPrice;
    }
  }
  
  // Fonction pour supprimer un produit du panier
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('remove-item')) {
      const productId = e.target.getAttribute('data-id');
      
      // Supprimer toutes les occurrences du produit
      panier = panier.filter(item => item !== productId);
      
      // Mettre à jour le localStorage
      localStorage.setItem('cafeDelicePanier', JSON.stringify(panier));
      
      // Mettre à jour l'affichage
      updateCartSummary();
    }
  });
  
  // Gérer le bouton de paiement
  document.getElementById('checkout').addEventListener('click', () => {
    if (panier.length > 0) {
      alert('Redirection vers le système de paiement...');
    } else {
      alert('Votre panier est vide. Veuillez ajouter des produits avant de procéder au paiement.');
    }
  });
  
  // Initialiser l'affichage du panier au chargement de la page
  document.addEventListener('DOMContentLoaded', function() {
    updateCartSummary();
  });