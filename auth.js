// Simple demo auth using localStorage. NOT for production.
const auth = (function(){
  const USERS_KEY = 'users';
  const CURRENT_KEY = 'demo_current';

  function loadUsers(){
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch(e){ return []; }
  }
  function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

  function ensureDemoUser(){
    const users = loadUsers();
    if (!users.find(x => x.email === 'demo@demo.com')){
      users.push({ name: ' User', email: 'demo@demo.com', password: 'Demo1234', saved: [] });
      saveUsers(users);
    }
  }

  function register({name, email, password}){
    if(!name || !email || !password) return false;
    const users = loadUsers();
    if (users.find(u => u.email === email)) return false;
    users.push({ name, email, password, saved: [] });
    saveUsers(users);
    return true;
  }

  function login(email, password){
    const users = loadUsers();
    const u = users.find(x => x.email === email && x.password === password);
    if (u) {
      localStorage.setItem(CURRENT_KEY, JSON.stringify({ email: u.email, name: u.name }));
      return true;
    }
    return false;
  }

  function logout(){
    localStorage.removeItem(CURRENT_KEY);
  }

  function getCurrentUser(){
    return JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null');
  }

  // save favorite / cart to user record
  function saveProductToUser(productId){
    const cur = getCurrentUser();
    if(!cur) return false;
    const users = loadUsers();
    const user = users.find(u => u.email === cur.email);
    if(!user.saved) user.saved = [];
    if(!user.saved.includes(productId)) user.saved.push(productId);
    saveUsers(users);
    return true;
  }

  return { ensureDemoUser, register, login, logout, getCurrentUser, saveProductToUser };
})();
