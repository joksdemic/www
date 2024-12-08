let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

// Funkcija za prikazivanje proizvoda
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';  // Očisti prethodne proizvode

    // Dodaj nove proizvode sa products.json
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="addCart">Add To Cart</button>
                </div>
                <h2>${product.name}</h2>
                <div class="price">${product.price} din.</div>
            `;
            listProductHTML.appendChild(newProduct);

            const productImageDiv = newProduct.querySelector('.product-image');
            const addCartButton = newProduct.querySelector('.addCart');

            // Prikazivanje dugmeta "Add to Cart" kada pređeš mišem
            productImageDiv.addEventListener('mouseover', () => {
                addCartButton.style.display = 'block';
            });

            productImageDiv.addEventListener('mouseout', () => {
                addCartButton.style.display = 'none';
            });

            // Dodavanje proizvoda u korpu
            addCartButton.addEventListener('click', (event) => {
                event.stopPropagation();
                addToCart(product.id);
                addCartButton.style.display = 'none';  // Sakrij dugme nakon klika
            });
        });
    }
};

// Funkcija za dodavanje proizvoda u korpu
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((item) => item.product_id == product_id);
    
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity++;
    }
    
    updateCartDisplay();
    updateCartInLocalStorage();
};

// Funkcija za prikazivanje stavki u korpi
const updateCartDisplay = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let product = products.find(p => p.id == item.product_id);
            
            newItem.innerHTML = `
                <div class="image">
                    <img src="${product.image}">
                </div>
                <div class="name">${product.name}</div>
                <div class="totalPrice">${(product.price * item.quantity)} din.</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
            listCartHTML.appendChild(newItem);
        });
    }

    iconCartSpan.innerText = totalQuantity;  // Ažuriraj broj u ikoni korpe
};

// Funkcija za ažuriranje količine proizvoda u korpi
listCartHTML.addEventListener('click', (event) => {
    let target = event.target;
    if (target.classList.contains('minus') || target.classList.contains('plus')) {
        let product_id = target.closest('.item').dataset.id;
        let action = target.classList.contains('plus') ? 'plus' : 'minus';
        changeProductQuantityInCart(product_id, action);
    }
});

const changeProductQuantityInCart = (product_id, action) => {
    let itemIndex = cart.findIndex((item) => item.product_id == product_id);
    if (itemIndex >= 0) {
        let item = cart[itemIndex];
        if (action === 'plus') {
            item.quantity++;
        } else if (action === 'minus' && item.quantity > 1) {
            item.quantity--;
        } else if (action === 'minus' && item.quantity === 1) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartDisplay();
    updateCartInLocalStorage();
};

// Funkcija za čuvanje korpe u localStorage
const updateCartInLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};


// Funkcija za inicijalizaciju aplikacije
const initApp = () => {
    // Učitaj proizvode sa products.json
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            // Učitaj korpu iz localStorage
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                updateCartDisplay();
            }
        });
};

// Pokreni aplikaciju
initApp();

// Toggle korpe kada se klikne na ikonu korpe
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Zatvori korpu kada se klikne na dugme CLOSE
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

document.querySelector('.checkOut').addEventListener('click', function() {
    window.location.href = 'checkout.html';  // Preusmerava korisnika na checkout.html
});






















