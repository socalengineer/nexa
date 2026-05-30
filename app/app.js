/* ===================== Nexa app ===================== */
const U = (id,w=1080)=>`https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=${w}`;

/* ---- Data ---- */
const LISTINGS = {
  l1:{img:U('1677100091536-4a311441afb5'),title:'1BR Apartment – Hai Chau',price:'12,000,000₫',loc:'Hoang Dieu St, Hai Chau',type:'Apartment',beds:'1',baths:'1',area:'45 m²',featured:true},
  l2:{img:U('1758611970184-c600f45cbb71'),title:'Beachside Studio – My Khe',price:'9,800,000₫',loc:'Vo Nguyen Giap, Son Tra',type:'Studio',beds:'1',baths:'1',area:'45 m²',featured:true},
  l3:{img:U('1761395105130-c77ea4a8e3ab'),title:'Cozy Studio – My An',price:'8,500,000₫',loc:'My An, Ngu Hanh Son',type:'Studio',beds:'1',baths:'1',area:'38 m²',agent:U('1560520653-9e0e4c89eb11',200)},
  l4:{img:U('1730656447563-53fa32d2c425'),title:'2BR Riverside – Han River',price:'15,000,000₫',loc:'Bach Dang St, Hai Chau',type:'2 Bed',beds:'2',baths:'2',area:'72 m²',agent:U('1668752600261-e56e7f3780b6',200)},
  l5:{img:U('1669232509455-9f9075b3a6ee'),title:'Garden House – Cam Le',price:'18,000,000₫',loc:'Cam Le District',type:'House',beds:'3',baths:'2',area:'110 m²',agent:U('1632765854612-9b02b6ec2b15',200)},
  l6:{img:U('1640432341934-578d21439579'),title:'Sea-view Studio – My Khe',price:'9,800,000₫',loc:'My An, Ngu Hanh Son',type:'Studio',beds:'1',baths:'1',area:'40 m²',agent:U('1652882860938-f90aa298e644',200)},
};
const FEATURED = ['l1','l2'];
const NEARBY = ['l3','l4','l5'];
const SAVED = ['l6','l4','l5'];

const AVATAR = U('1519744434498-a0de604df9db',400);

/* ---- DOM helpers ---- */
function h(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild;}
const esc = s => (s==null?'':String(s));

function tabBar(active){
  const tabs=[
    ['explore','compass','Explore'],['saved','heart','Saved'],
    ['messages','chat-circle','Messages'],['viewings','calendar-check','Viewings'],
    ['profile','user','Profile']];
  return `<nav class="tabbar">${tabs.map(([k,ic,l])=>`
    <div class="tab ${k===active?'active':''}" data-tab="${k}">
      <i class="${k===active?'ph-fill ph-'+ic:'ph ph-'+ic}"></i><span>${l}</span></div>`).join('')}</nav>`;
}

function featuredCard(id){const c=LISTINGS[id];return `
  <div class="fcard tappable" data-open="${id}">
    <div class="img" style="background-image:url('${c.img}')">
      <div class="tag"><i class="ph-fill ph-star"></i>Featured</div>
      <div class="bookmark"><i class="ph ph-heart"></i></div>
      <div class="price-pill"><span class="amt">${c.price}</span><span class="per">/mo</span></div>
    </div>
    <div>
      <div class="title">${c.title}</div>
      <div class="loc"><i class="ph ph-map-pin"></i>${c.loc}</div>
      <div class="specs">
        <div class="spec"><i class="ph ph-bed"></i>${c.beds} Bed</div>
        <div class="spec"><i class="ph ph-bathtub"></i>${c.baths} Bath</div>
        <div class="spec"><i class="ph ph-ruler"></i>${c.area}</div>
      </div>
    </div></div>`;
}
function listCard(id,saved){const c=LISTINGS[id];return `
  <div class="lcard tappable" data-open="${id}">
    <div class="lthumb" style="background-image:url('${c.img}')"><div class="type-tag">${c.type}</div></div>
    <div class="linfo">
      <div class="ltop"><div class="ltitle">${c.title}</div><i class="${saved?'ph-fill ph-heart saved':'ph ph-heart'}"></i></div>
      <div class="lloc"><i class="ph ph-map-pin"></i>${c.loc}</div>
      <div class="lspecs">
        <div class="lspec"><i class="ph ph-bed"></i>${c.beds}</div>
        <div class="lspec"><i class="ph ph-bathtub"></i>${c.baths}</div>
        <div class="lspec"><i class="ph ph-ruler"></i>${c.area}</div>
      </div>
      <div class="lprice-row">
        <div class="lprice"><span class="amt">${c.price}</span><span class="per">/mo</span></div>
        ${c.agent?`<div class="lagent" style="background-image:url('${c.agent}')"></div>`:''}
      </div>
    </div></div>`;
}

/* ===================== Screens ===================== */
const screens = {};

screens.explore = () => h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="scroll with-tabs">
      <div class="home-head">
        <div>
          <div class="hello">Find your home in</div>
          <div class="loc tappable"><i class="ph-fill ph-map-pin pin"></i><span class="city">Da Nang, Vietnam</span><i class="ph ph-caret-down caret"></i></div>
        </div>
        <div class="head-actions">
          <div class="bell tappable" data-toast="No new notifications"><i class="ph ph-bell"></i><span class="dot"></span></div>
          <div class="avatar tappable" data-tab="profile" style="background-image:url('${AVATAR}')"></div>
        </div>
      </div>
      <div class="search-row">
        <div class="search tappable" data-toast="Search coming soon"><i class="ph ph-magnifying-glass"></i><span>Search area, price, ID…</span></div>
        <div class="filter tappable" data-toast="Filters coming soon"><i class="ph ph-sliders-horizontal"></i><span class="dot"></span></div>
      </div>
      <div class="chips" id="cats"></div>
      <div class="sec"><div class="sec-head"><div class="sec-title">Featured stays</div><div class="see-all tappable" data-nav="map">See all</div></div></div>
      <div class="featured">${FEATURED.map(featuredCard).join('')}</div>
      <div class="sec"><div class="sec-head"><div class="sec-title">Nearby listings</div><div class="sort tappable" data-toast="Sorted by newest"><i class="ph ph-arrows-down-up"></i>Newest</div></div></div>
      <div class="list">${NEARBY.map(id=>listCard(id)).join('')}</div>
    </div>
    ${tabBar('explore')}
  </section>`);

function afterExplore(el){
  const cats=[['squares-four','All',1],['buildings','Apartment'],['bed','Studio'],['house-line','House']];
  el.querySelector('#cats').innerHTML=cats.map(([ic,l,a])=>`<div class="chip ${a?'active':''}"><i class="ph ph-${ic}"></i>${l}</div>`).join('');
  el.querySelectorAll('#cats .chip').forEach(c=>c.onclick=()=>{el.querySelectorAll('#cats .chip').forEach(x=>x.classList.remove('active'));c.classList.add('active');});
}

/* ----- Explore mode switcher target placeholders filled in later waves ----- */

screens.saved = () => {
  const el=h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="page-head"><div class="page-title">Saved</div><i class="ph ph-pencil-simple-line head-ic tappable" data-toast="Edit saved"></i></div>
    <div class="pilltabs">
      <div class="pilltab active">Homes · 3</div>
      <div class="pilltab tappable" data-toast="Saved searches">Saved searches · 2</div>
    </div>
    <div class="count-row"><div class="c">3 saved homes</div><div class="s tappable" data-toast="Recently saved"><i class="ph ph-arrows-down-up"></i>Recently saved</div></div>
    <div class="scroll with-tabs"><div class="list">${SAVED.map(id=>listCard(id,true)).join('')}</div></div>
    ${tabBar('saved')}
  </section>`);
  return el;
};

screens.profile = () => {
  const grp=(title,rows)=>`
    <div><div class="group-title">${title}</div><div class="settings-card">${
      rows.map((r,i)=>`${i?'<div class="divider"></div>':''}
      <div class="setting tappable" data-toast="${r.t}">
        <div class="chip ${r.danger?'danger':''}"><i class="ph ph-${r.ic}"></i></div>
        <div class="l ${r.danger?'danger':''}">${r.t}</div>
        ${r.v?`<div class="v">${r.v}</div>`:''}
        ${r.danger?'':'<i class="ph ph-caret-right ch"></i>'}
      </div>`).join('')}</div></div>`;
  return h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="page-head"><div class="page-title">Profile</div><i class="ph ph-gear-six head-ic tappable" data-toast="Settings"></i></div>
    <div class="scroll with-tabs" style="padding:0 20px;">
      <div class="profile-card">
        <div class="av" style="background-image:url('${U('1484684096794-03e03b5e713e',400)}')"></div>
        <div>
          <div class="nm">Nguyen Van An</div>
          <div class="em">an.nguyen@email.com</div>
          <div class="role-badge"><i class="ph ph-user"></i>Tenant</div>
        </div>
        <div class="edit-btn tappable" data-toast="Edit profile"><i class="ph ph-pencil-simple"></i></div>
      </div>
      <div class="stats" style="margin:18px 0;">
        <div class="stat"><div class="v">6</div><div class="l">Saved</div></div>
        <div class="stat"><div class="v">3</div><div class="l">Viewings</div></div>
        <div class="stat"><div class="v">4</div><div class="l">Messages</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;">
        ${grp('ACCOUNT',[{ic:'user',t:'Personal info'},{ic:'bell',t:'Notifications'},{ic:'credit-card',t:'Payment methods'}])}
        ${grp('PREFERENCES',[{ic:'sliders-horizontal',t:'Search preferences'},{ic:'translate',t:'Language',v:'English'},{ic:'coins',t:'Currency',v:'VND ₫'}])}
        ${grp('SUPPORT',[{ic:'question',t:'Help center'},{ic:'shield-check',t:'Terms & privacy'}])}
        <div class="settings-card"><div class="setting tappable" data-toast="Logged out"><div class="chip danger"><i class="ph ph-sign-out"></i></div><div class="l danger">Log out</div></div></div>
        <div style="text-align:center;color:var(--text-3);font-size:12px;">Nexa · v1.0.0</div>
      </div>
    </div>
    ${tabBar('profile')}
  </section>`);
};

/* ----- Messages / Viewings (filled out in wave 2) ----- */
screens.messages = () => h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="page-head"><div class="page-title">Messages</div><i class="ph ph-magnifying-glass head-ic"></i></div>
    <div class="empty"><i class="ph ph-chat-circle-dots"></i><div class="t">No messages yet</div><div class="s">Start a conversation with an agent from any listing.</div></div>
    ${tabBar('messages')}
  </section>`);

screens.viewings = () => h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="page-head"><div class="page-title">Viewings</div><i class="ph ph-calendar-check head-ic"></i></div>
    <div class="empty"><i class="ph ph-calendar-blank"></i><div class="t">No viewings booked</div><div class="s">Book a viewing from a listing and it'll show up here.</div></div>
    ${tabBar('viewings')}
  </section>`);

/* ----- Listing detail ----- */
screens.detail = ({id}) => {
  const c=LISTINGS[id]||LISTINGS.l1;
  const amen=[['wifi-high','Fast Wi-Fi'],['wind','Air-con'],['car','Parking'],['armchair','Furnished'],['sun','Balcony'],['t-shirt','Washer']];
  return h(`
  <section class="screen">
    <div class="hero" style="background-image:url('${c.img}')">
      <div class="hero-scrim"></div>
      <div class="round-btn tappable" data-back style="left:16px;top:calc(16px + env(safe-area-inset-top,0px));"><i class="ph ph-caret-left"></i></div>
      <div class="round-btn tappable" data-toast="Share link copied" style="right:60px;top:calc(16px + env(safe-area-inset-top,0px));"><i class="ph ph-share-network"></i></div>
      <div class="round-btn tappable" data-toast="Saved to favourites" style="right:16px;top:calc(16px + env(safe-area-inset-top,0px));"><i class="ph ph-heart"></i></div>
      <div class="counter tappable" data-nav="lightbox"><i class="ph ph-image-square"></i><span>1 / 12</span></div>
    </div>
    <div class="scroll">
      <div class="dcontent">
        <div>
          <div class="title-row"><div class="dtitle">${c.title}</div><div class="neg">Negotiable</div></div>
          <div class="dprice" style="margin-top:8px;"><span class="amt">${c.price}</span><span class="per">/ month</span></div>
          <div class="dloc" style="margin-top:8px;"><i class="ph-fill ph-map-pin"></i><span>${c.loc}</span></div>
        </div>
        <div class="specs-card">
          <div class="scell"><i class="ph ph-bed"></i><span class="v">${c.beds}</span><span class="l">Bedroom</span></div>
          <div class="scell"><i class="ph ph-bathtub"></i><span class="v">${c.baths}</span><span class="l">Bathroom</span></div>
          <div class="scell"><i class="ph ph-ruler"></i><span class="v">${c.area.replace(' m²','')}</span><span class="l">m² area</span></div>
          <div class="scell"><i class="ph ph-buildings"></i><span class="v">8th</span><span class="l">Floor</span></div>
        </div>
        <div class="agent-card">
          <div class="av" style="background-image:url('${U('1585240975817-02c40aa44b97',300)}')"></div>
          <div><div class="nm">Em Nam Home <i class="ph-fill ph-seal-check"></i></div><div class="sub">Verified agent · replies in ~1h</div></div>
          <div class="call tappable" data-toast="Calling agent…"><i class="ph-fill ph-phone"></i></div>
        </div>
        <div><div class="block-h">What's inside</div><div class="amen">${amen.map(([ic,l])=>`<div class="a"><i class="ph ph-${ic}"></i>${l}</div>`).join('')}</div></div>
        <div><div class="block-h">About this home</div><div class="about">Bright, fully-furnished home with a private balcony. A short walk to My Khe Beach, cafés and the night market. Move-in ready with modern appliances and round-the-clock building security.</div></div>
        <div style="height:8px;"></div>
      </div>
    </div>
    <div class="dbottom">
      <div class="pr"><div class="amt">${c.price}</div><div class="per">per month</div></div>
      <div class="dbtns">
        <div class="msg-btn tappable" data-nav="chat" data-id="${id}"><i class="ph-fill ph-chat-circle"></i></div>
        <div class="book-btn tappable" data-nav="schedule" data-id="${id}"><i class="ph-fill ph-calendar-check"></i>Book viewing</div>
      </div>
    </div>
  </section>`);
};

/* Stubs replaced in later waves */
screens.chat = ()=>stub('Chat','chat-circle','Conversation with the agent will appear here.');
screens.schedule = ()=>stub('Schedule viewing','calendar-check','Booking form coming next.');
screens.map = ()=>stub('Map view','map-trifold','Map experience coming next.');
screens.lightbox = ()=>stub('Photos','image-square','Photo gallery coming next.');
function stub(title,ic,msg){return h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="topbar"><div class="icon-btn tappable" data-back><i class="ph ph-caret-left"></i></div><div class="t">${title}</div></div>
    <div class="empty"><i class="ph ph-${ic}"></i><div class="t">${title}</div><div class="s">${msg}</div></div>
  </section>`);}

/* ===================== Router ===================== */
const appEl=document.getElementById('app');
let stack=[];
const TABS=['explore','saved','messages','viewings','profile'];

function build(name,params){
  const el=screens[name](params||{});
  if(name==='explore') afterExplore(el);
  return el;
}
function resetTo(name,params){
  stack.forEach(s=>s.el.remove());
  const el=build(name,params);
  appEl.appendChild(el);
  stack=[{el,name,params}];
}
function push(name,params){
  const el=build(name,params);
  el.classList.add('sliding','anim');
  appEl.appendChild(el);
  el.getBoundingClientRect();
  requestAnimationFrame(()=>el.classList.remove('sliding'));
  stack.push({el,name,params});
}
function back(){
  if(stack.length<=1) return;
  const top=stack.pop();
  top.el.classList.add('anim');top.el.getBoundingClientRect();
  top.el.classList.add('leaving');
  setTimeout(()=>top.el.remove(),300);
}
function nav(name,params){
  if(TABS.includes(name)) resetTo(name,params); else push(name,params);
  if(scrollPos) scrollPos=0;
}
let scrollPos=0;

/* Delegated interactions */
let toastTimer;
function showToast(msg){
  let t=document.getElementById('toast');
  if(!t){t=h('<div class="toast" id="toast"></div>');appEl.appendChild(t);}
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),1600);
}
appEl.addEventListener('click',e=>{
  const t=e.target.closest('[data-back],[data-tab],[data-nav],[data-open],[data-toast]');
  if(!t)return;
  if(t.hasAttribute('data-back'))return back();
  if(t.dataset.tab)return resetTo(t.dataset.tab);
  if(t.dataset.open)return push('detail',{id:t.dataset.open});
  if(t.dataset.nav)return nav(t.dataset.nav,{id:t.dataset.id});
  if(t.dataset.toast)return showToast(t.dataset.toast);
});

resetTo('explore');

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}
