// simple filters and search for product-list page
const filters = (function(){
  function populateCategories(products){
    const set = new Set(products.map(p => p.category));
    const sel = document.getElementById('categoryFilter');
    set.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      sel.appendChild(opt);
    });
    // check url param
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam) sel.value = catParam;
  }

  function init(productsList){
    const grid = document.getElementById('productsGrid');
    const cat = document.getElementById('categoryFilter');
    const sort = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');

    populateCategories(productsList);

    function apply(){
      let out = productsList.slice();
      if(cat && cat.value) out = out.filter(p => p.category === cat.value);
      if(searchInput && searchInput.value) {
        const q = searchInput.value.toLowerCase();
        out = out.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if(sort){
        if(sort.value === 'price-asc') out.sort((a,b)=>a.price-b.price);
        if(sort.value === 'price-desc') out.sort((a,b)=>b.price-a.price);
      }
      ui.renderProducts(out, grid);
    }

    if(cat) cat.addEventListener('change', apply);
    if(sort) sort.addEventListener('change', apply);
    if(searchInput){
      document.getElementById('searchBtn').addEventListener('click', apply);
      searchInput.addEventListener('keydown', function(e){ if(e.key==='Enter') apply(); });
    }

    // also read q param to populate search
    const q = new URLSearchParams(window.location.search).get('q');
    if(q && searchInput){ searchInput.value = q; apply(); }
  }

  return { init, populateCategories };
})();
