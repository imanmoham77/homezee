const products = [
  {id:1,name:"فنجان سرامیکی مینیمال",category:"فنجان و لیوان",price:185000,image:"photo_30945318560_x.jfif",tone:1},
  {id:2,name:"ست لیوان شیشه‌ای",category:"فنجان و لیوان",price:240000,emoji:"🥛",tone:2},
  {id:3,name:"دیس پذیرایی سرامیکی",category:"ظروف پذیرایی",price:390000,emoji:"🍽️",tone:3},
  {id:4,name:"استند چوبی چندمنظوره",category:"استند چوبی",price:320000,emoji:"🪵",tone:5},
  {id:5,name:"تراول ماگ روزمره",category:"ماگ و تراول",price:450000,emoji:"🥤",tone:4},
  {id:6,name:"ماگ ساده دسته‌دار",category:"ماگ و تراول",price:275000,emoji:"🍵",tone:6},
  {id:7,name:"ظرف سرو دکوراتیو",category:"ظروف پذیرایی",price:510000,emoji:"🏺",tone:1},
  {id:8,name:"گلدان رومیزی هدیه",category:"هدیه و دکور",price:295000,emoji:"🌷",tone:3}
];
let activeCategory = "همه";
let cart = [];
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");
let toastTimer;

const money = value => new Intl.NumberFormat("fa-IR").format(value) + " تومان";
function renderProducts(){
  const term = searchInput.value.trim().toLocaleLowerCase("fa");
  const shown = products.filter(p =>
    (activeCategory === "همه" || p.category === activeCategory) &&
    (p.name.toLocaleLowerCase("fa").includes(term) || p.category.toLocaleLowerCase("fa").includes(term))
  );
  grid.innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-art tone-${p.tone}"><span class="emoji" aria-hidden="true">${p.emoji}</span></div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add-button" data-add="${p.id}" aria-label="افزودن ${p.name} به سبد خرید">+</button>
        </div>
      </div>
    </article>`).join("");
  resultCount.textContent = new Intl.NumberFormat("fa-IR").format(shown.length) + " محصول";
  emptyState.hidden = shown.length !== 0;
}
function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"),1800);
}
function renderCart(){
  document.getElementById("cartCount").textContent = new Intl.NumberFormat("fa-IR").format(cart.reduce((sum,item)=>sum+item.qty,0));
  document.getElementById("cartTotal").textContent = new Intl.NumberFormat("fa-IR").format(cart.reduce((sum,item)=>sum+item.qty,0));
  const container = document.getElementById("cartItems");
  container.innerHTML = cart.length ? cart.map(item=>`
    <div class="cart-row"><div>${item.name}<small>${new Intl.NumberFormat("fa-IR").format(item.qty)} عدد · ${money(item.price*item.qty)}</small></div>
    <button class="remove-item" data-remove="${item.id}">حذف</button></div>`).join("") : '<p class="cart-empty">سبد خرید شما خالی است.</p>';
}
grid.addEventListener("click",e=>{
  const button=e.target.closest("[data-add]");
  if(!button)return;
  const product=products.find(p=>p.id===Number(button.dataset.add));
  const existing=cart.find(item=>item.id===product.id);
  if(existing)existing.qty++; else cart.push({...product,qty:1});
  renderCart(); showToast("به سبد خرید اضافه شد");
});
document.getElementById("cartItems").addEventListener("click",e=>{
  const button=e.target.closest("[data-remove]");
  if(!button)return;
  cart=cart.filter(item=>item.id!==Number(button.dataset.remove));
  renderCart();
});
document.getElementById("categoryList").addEventListener("click",e=>{
  const button=e.target.closest("[data-category]");
  if(!button)return;
  activeCategory=button.dataset.category;
  document.querySelectorAll(".category-chip").forEach(chip=>chip.classList.toggle("active",chip===button));
  renderProducts();
});
searchInput.addEventListener("input",renderProducts);
const panel=document.getElementById("cartPanel"),overlay=document.getElementById("overlay");
function openCart(){panel.classList.add("open");overlay.classList.add("show");panel.setAttribute("aria-hidden","false")}
function closeCart(){panel.classList.remove("open");overlay.classList.remove("show");panel.setAttribute("aria-hidden","true")}
document.getElementById("cartButton").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("menuToggle").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
renderProducts();renderCart();
