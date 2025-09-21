// UI helpers to render product grid and details
const ui = (function(){
  function formatPrice(v){ return '$' + v.toFixed(2); }

  function productCard(p){
    return `<div class="card product-card">
      <img src="${p.image}" alt="${p.title}">
      <h4>${p.title}</h4>
      <div class="price">${formatPrice(p.price)}</div>
      <p class="muted">${p.category}</p>
      <div style="display:flex;gap:8px;margin-top:10px">
        <a class="btn" href="product-details.html?id=${p.id}">View</a>
        <button class="btn small" data-id="${p.id}" onclick="ui.addToAccount(event)">Save</button>
      </div>
    </div>`;
  }

  function renderProducts(list, container){
    container.innerHTML = list.map(productCard).join('');
  }

  function renderProductDetail(p, container){
    container.innerHTML = `
      <div class="product-detail card">
        <img src="${p.image}" alt="${p.title}">
        <div class="info">
          <h2>${p.title}</h2>
          <p class="price">${formatPrice(p.price)}</p>
          <p>${p.description}</p>
          <div style="margin-top:14px">
            <button class="btn" onclick="ui.addToAccountById('${p.id}')">Save to account</button>
          </div>
        </div>
      </div>`;
  }

  function addToAccount(e){
    const id = e.currentTarget.getAttribute('data-id');
    if (auth.getCurrentUser()){
      auth.saveProductToUser(id);
      alert('Saved to your account');
    } else {
      window.location.href = 'login.html?next=product-list.html';
    }
  }

  function addToAccountById(id){
    if (auth.getCurrentUser()){
      auth.saveProductToUser(id);
      alert('Saved to your account');
    } else {
      window.location.href = 'login.html?next=product-details.html?id=' + id;
    }
  }

  function renderAccount(user, container){
    container.innerHTML = `
      <h1>Welcome, ${user.name}</h1>
      <p>Email: ${user.email}</p>
      <h3>Saved items</h3>
      <div id="savedGrid" class="product-grid"></div>
      <button class="btn" id="logoutBtn">Sign out</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', function(){
      auth.logout();
      window.location.href = 'index.html';
    });

    // load saved products
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userRecord = users.find(u => u.email === user.email) || {};
    const saved = userRecord.saved || [];
    const savedProducts = products.filter(p => saved.includes(p.id));
    document.getElementById('savedGrid').innerHTML = savedProducts.map(productCard).join('') || '<p>No saved items.</p>';
  }

  function bindGlobalSearch(){
    const input = document.getElementById('globalSearch');
    if(!input) return;
    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){
        const q = input.value.trim();
        window.location.href = 'product-list.html?q=' + encodeURIComponent(q);
      }
    });
  }

  function updateHeaderAuth(){
    const user = auth.getCurrentUser();
    const loginLink = document.getElementById('loginLink');
    const accountLink = document.getElementById('accountLink');
    if (user){
      if(loginLink) loginLink.textContent = 'Sign out';
      if(loginLink) loginLink.href = '#';
      if(loginLink) loginLink.onclick = function(){ auth.logout(); window.location.href='index.html'; };

      if(accountLink) accountLink.textContent = user.name.split(' ')[0];
      if(accountLink) accountLink.href = 'account.html';
    } else {
      if(loginLink) loginLink.textContent = 'Login';
      if(loginLink) loginLink.href = 'login.html';
      if(accountLink) accountLink.textContent = 'Account';
      if(accountLink) accountLink.href = 'login.html';
    }
  }

  return { renderProducts, renderProductDetail, renderAccount, addToAccount, addToAccountById, bindGlobalSearch, updateHeaderAuth };
})();
