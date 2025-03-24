// Initialiser le panier depuis localStorage
function getPanier() {
    return JSON.parse(localStorage.getItem('cafeDelicePanier')) || [];
  }
  
  // Sauvegarder le panier dans localStorage
  function savePanier(panier) {
    localStorage.setItem('cafeDelicePanier', JSON.stringify(panier));
  }
  
  // Mettre à jour l'indicateur du panier
  function updateCartIndicator() {
    const cartIndicator = document.getElementById('cart-count');
    if (cartIndicator) {
      const panier = getPanier();
      const totalItems = panier.reduce((sum, item) => sum + item.quantity, 0);
      cartIndicator.textContent = totalItems;
      cartIndicator.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
  }
  
  // Ajouter l'icône flottante du panier
  function addCartIcon() {
    if (!document.getElementById('floating-cart')) {
      const panier = getPanier();
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
    return element.closest('.produit-card').querySelector('.produit-nom').textContent;
  }
  
  // Initialisation au chargement de la page
  document.addEventListener('DOMContentLoaded', function () {
    console.log("Page chargée, initialisation du script...");
  
    // Ajouter l'icône du panier
    addCartIcon();
    updateCartIndicator();
  
    // Gérer le clic sur "Ajouter au panier"
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        const details = this.closest('details');
        details.open = !details.open;
      });
    });
  
    // Gérer la soumission des formulaires
    document.querySelectorAll('.order-form').forEach(form => {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const button = form.closest('details').querySelector('.add-to-cart');
        const productId = button.getAttribute('data-id');
        const quantityInput = form.querySelector('input[type="number"]');
        const quantity = parseInt(quantityInput.value) || 1;
        const priceElement = form.closest('.produit-card').querySelector('.prix');
        const priceText = priceElement.textContent.match(/Prix : (\d+)€/);
        const price = priceText ? parseFloat(priceText[1]) : 0;
        const productName = getProductName(form);
  
        // Ajouter ou mettre à jour le produit dans le panier
        const panier = getPanier();
        const existingItem = panier.find(item => item.id === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          panier.push({ id: productId, quantity: quantity, price: price, name: productName });
        }
  
        // Sauvegarder dans localStorage
        savePanier(panier);
  
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

// Barre de recherche

document.addEventListener('DOMContentLoaded', function() {
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const closeButton = document.getElementById('closeButton');
    const searchStats = document.getElementById('searchStats');
    
    // Variables pour le suivi de la recherche
    let matches = [];
    let currentMatchIndex = -1;
    let textNodesUnderBody = [];
    let originalContents = [];
    
    // Fonction pour trouver tous les nœuds de texte
    function findTextNodes(element) {
        if (element.nodeType === 3) { // 3 = nœud de texte
            // Ignore les nœuds vides ou uniquement des espaces
            if (element.nodeValue.trim() !== '') {
                return [element];
            }
            return [];
        }
        
        // Ignore les scripts et les styles
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
            return [];
        }
        
        let textNodes = [];
        for (let i = 0; i < element.childNodes.length; i++) {
            textNodes.push(...findTextNodes(element.childNodes[i]));
        }
        return textNodes;
    }
    
    // Initialiser la collection de nœuds de texte
    function initTextNodes() {
        textNodesUnderBody = findTextNodes(document.body);
        // Sauvegarder le contenu original
        originalContents = textNodesUnderBody.map(node => node.nodeValue);
    }
    
    // Rechercher du texte dans tous les nœuds
    function searchText(searchTerm) {
        // Réinitialiser les nœuds si nécessaire
        if (originalContents.length > 0) {
            restoreOriginalContent();
        } else {
            initTextNodes();
        }
        
        matches = [];
        currentMatchIndex = -1;
        
        if (!searchTerm) {
            searchStats.textContent = '';
            return;
        }
        
        // Expression régulière pour la recherche
        const regex = new RegExp(searchTerm, 'gi');
        
        textNodesUnderBody.forEach((textNode, nodeIndex) => {
            const text = textNode.nodeValue;
            let match;
            let lastIndex = 0;
            let newText = '';
            
            // Trouver toutes les occurrences dans ce nœud
            while ((match = regex.exec(text))) {
                matches.push({
                    node: textNode,
                    nodeIndex: nodeIndex,
                    startIndex: match.index,
                    endIndex: regex.lastIndex,
                    text: match[0]
                });
            }
        });
        
        searchStats.textContent = `${matches.length} résultat(s)`;
        
        // Aller au premier résultat si disponible
        if (matches.length > 0) {
            highlightCurrentMatch(0);
        }
    }
    
    // Restaurer le contenu original
    function restoreOriginalContent() {
        textNodesUnderBody.forEach((node, i) => {
            node.nodeValue = originalContents[i];
        });
    }
    
    // Surligner le résultat courant
    function highlightCurrentMatch(index) {
        if (matches.length === 0) return;
        
        // Restaurer le contenu original
        restoreOriginalContent();
        
        // Mettre à jour l'index courant
        currentMatchIndex = index;
        if (currentMatchIndex < 0) currentMatchIndex = matches.length - 1;
        if (currentMatchIndex >= matches.length) currentMatchIndex = 0;
        
        // Récupérer le match courant
        const match = matches[currentMatchIndex];
        
        // Créer un span pour le surlignage
        const spanHighlight = document.createElement('span');
        spanHighlight.className = 'current-highlight';
        spanHighlight.textContent = match.text;
        
        // Extraire le texte avant et après le match
        const text = originalContents[match.nodeIndex];
        const beforeText = text.substring(0, match.startIndex);
        const afterText = text.substring(match.endIndex);
        
        // Remplacer le nœud de texte par les trois nouveaux nœuds
        const currentNode = textNodesUnderBody[match.nodeIndex];
        const parentNode = currentNode.parentNode;
        
        // Créer fragment de document
        const fragment = document.createDocumentFragment();
        
        // Ajouter le texte avant
        if (beforeText) {
            fragment.appendChild(document.createTextNode(beforeText));
        }
        
        // Ajouter le span surligné
        fragment.appendChild(spanHighlight);
        
        // Ajouter le texte après
        if (afterText) {
            fragment.appendChild(document.createTextNode(afterText));
        }
        
        // Remplacer le nœud original
        parentNode.replaceChild(fragment, currentNode);
        
        // Mettre à jour le compteur
        searchStats.textContent = `${currentMatchIndex + 1}/${matches.length} résultat(s)`;
        
        // Faire défiler jusqu'au résultat
        spanHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Événements des boutons
    prevButton.addEventListener('click', () => {
        if (matches.length > 0) {
            highlightCurrentMatch(currentMatchIndex - 1);
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (matches.length > 0) {
            highlightCurrentMatch(currentMatchIndex + 1);
        }
    });
    
    closeButton.addEventListener('click', () => {
        // Restaurer le contenu original
        restoreOriginalContent();
        // Cacher la barre de recherche
        searchContainer.style.display = 'none';
        // Réinitialiser les variables
        matches = [];
        currentMatchIndex = -1;
        searchInput.value = '';
        searchStats.textContent = '';
    });
    
    // Rechercher en temps réel
    searchInput.addEventListener('input', () => {
        searchText(searchInput.value.trim());
    });
    
    // Rechercher en appuyant sur Entrée
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // Shift+Enter pour aller au résultat précédent
                if (matches.length > 0) {
                    highlightCurrentMatch(currentMatchIndex - 1);
                }
            } else {
                // Enter pour aller au résultat suivant
                if (matches.length > 0) {
                    highlightCurrentMatch(currentMatchIndex + 1);
                }
            }
        }
    });
    
    // Support du raccourci Ctrl+F
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault(); // Empêcher la recherche native du navigateur
            searchContainer.style.display = 'flex';
            searchInput.focus();
            
            // Initialiser les nœuds de texte si ce n'est pas déjà fait
            if (textNodesUnderBody.length === 0) {
                initTextNodes();
            }
        }
    });
    
    // Afficher la barre de recherche dès le départ
    searchContainer.style.display = 'flex';
    
    // Initialiser le raccourci Ctrl+F
    initTextNodes();
    
    // Mettre le focus sur le champ de recherche au chargement
    searchInput.focus();
  });  