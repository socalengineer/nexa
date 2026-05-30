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
const AGENT_AV = U('1585240975817-02c40aa44b97',300);

const CONVOS = [
  {id:'c1',agent:'Em Nam Home',av:AGENT_AV,verified:true,online:true,last:'Saturday works — I can do 10:30 AM. Shall I propose it?',time:'9:24',unread:1,listing:'l1'},
  {id:'c2',agent:'Da Nang Rentals',av:U('1573496359142-b8d87734a5a2',300),verified:true,online:false,last:'The riverside apartment is still available 😊',time:'Yesterday',unread:0,listing:'l4'},
  {id:'c3',agent:'Coastal Homes',av:U('1438761681033-6461ffad8d80',300),verified:false,online:true,last:'Sure, I can send a few more photos this evening.',time:'Mon',unread:0,listing:'l5'},
];
const VIEWINGS = [
  {listing:'l1',day:'Sat, May 31',time:'10:30 AM',mode:'In person',status:'Confirmed'},
  {listing:'l4',day:'Tue, Jun 3',time:'2:00 PM',mode:'Video tour',status:'Pending'},
];

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

function listingMini(id,{flat=false,nav=true}={}){const c=LISTINGS[id];return `
  <div class="lmini ${flat?'flat':''} ${nav?'tappable':''}" ${nav?`data-open="${id}"`:''}>
    <div class="th" style="background-image:url('${c.img}')"></div>
    <div class="info"><div class="t">${c.title}</div><div class="p">${c.price} <span>/mo</span></div></div>
    ${nav?'<i class="ph ph-caret-right ch"></i>':''}
  </div>`;}

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

/* ----- Messages ----- */
screens.messages = () => h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="page-head"><div class="page-title">Messages</div><i class="ph ph-magnifying-glass head-ic tappable" data-toast="Search messages"></i></div>
    <div class="scroll with-tabs"><div class="convos">${CONVOS.map(c=>`
      <div class="convo tappable" data-nav="chat" data-id="${c.id}">
        <div class="av" style="background-image:url('${c.av}')">${c.online?'<span class="on"></span>':''}</div>
        <div class="mid">
          <div class="nm">${c.agent} ${c.verified?'<i class="ph-fill ph-seal-check"></i>':''}</div>
          <div class="lm">${c.last}</div>
        </div>
        <div class="rt"><div class="tm">${c.time}</div>${c.unread?`<div class="badge">${c.unread}</div>`:''}</div>
      </div>`).join('')}</div></div>
    ${tabBar('messages')}
  </section>`);

/* ----- Viewings ----- */
screens.viewings = () => h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="page-head"><div class="page-title">Viewings</div><i class="ph ph-calendar-plus head-ic tappable" data-tab="explore"></i></div>
    <div class="scroll with-tabs" style="padding:0 20px;">
      <div style="display:flex;flex-direction:column;gap:12px;">${VIEWINGS.map(v=>{const c=LISTINGS[v.listing];const ok=v.status==='Confirmed';return `
        <div class="tappable" data-open="${v.listing}" style="border:1px solid var(--border);border-radius:18px;padding:12px;display:flex;flex-direction:column;gap:12px;">
          <div class="row between">
            <div class="row" style="gap:8px;"><i class="ph-fill ph-calendar-check" style="color:var(--accent);font-size:18px;"></i><span style="font-family:var(--display);font-weight:700;font-size:14px;">${v.day} · ${v.time}</span></div>
            <span style="font-size:11px;font-weight:700;padding:4px 9px;border-radius:11px;background:${ok?'var(--accent-soft)':'#FEF3C7'};color:${ok?'var(--accent)':'#B45309'};">${v.status}</span>
          </div>
          ${listingMini(v.listing,{nav:false})}
          <div class="row" style="gap:6px;color:var(--text-2);font-size:12.5px;"><i class="ph ph-${v.mode==='In person'?'user':'video-camera'}"></i>${v.mode}</div>
        </div>`;}).join('')}</div>
    </div>
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

/* ----- Chat thread ----- */
function resolveConvo(id){
  const c=CONVOS.find(x=>x.id===id);
  if(c)return c;
  return {agent:'Em Nam Home',av:AGENT_AV,verified:true,online:true,listing:LISTINGS[id]?id:'l1'};
}
screens.chat = ({id}) => {
  const c=resolveConvo(id);
  return h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="chat-head">
      <i class="ph ph-caret-left tappable" data-back style="font-size:24px;"></i>
      <div class="av" style="background-image:url('${c.av}')">${c.online?'<span class="on"></span>':''}</div>
      <div class="info"><div class="nm">${c.agent} ${c.verified?'<i class="ph-fill ph-seal-check"></i>':''}</div><div class="st">${c.online?'Active now':'Last seen 2h ago'} · replies in ~1h</div></div>
      <i class="ph-fill ph-phone hic tappable" data-toast="Calling…"></i>
      <i class="ph-bold ph-dots-three-vertical hic tappable" data-toast="More"></i>
    </div>
    <div class="chat-context">${listingMini(c.listing)}</div>
    <div class="thread" id="thread">
      <div class="day-divider">TODAY</div>
      <div class="brow"><div class="bubble a">Hi! Thanks for your interest in the My Khe apartment 😊</div></div>
      <div class="brow"><div class="bubble a">It's available from June 5 — would you like to see it in person?</div></div>
      <div class="brow u"><div class="bubble u">Yes! Is this weekend possible?</div></div>
      <div class="brow"><div class="bubble a">Saturday works — I can do 10:30 AM. Shall I propose it?</div></div>
      <div class="brow"><div class="proposal">
        <div class="ph"><i class="ph-fill ph-calendar-check"></i>Viewing proposed</div>
        <div><div class="d">Saturday, May 31</div><div class="sub">10:30 AM · In person at the unit</div></div>
        <div class="pb"><div class="pbtn fill tappable" data-nav="booking" data-id="${c.listing}">Confirm</div><div class="pbtn out tappable" data-nav="schedule" data-id="${c.listing}">Reschedule</div></div>
      </div></div>
    </div>
    <div class="composer">
      <div class="qreplies">
        ${['Parking included?','Move in June 5?','More photos'].map(q=>`<div class="qreply tappable" data-toast="Sent: ${q}">${q}</div>`).join('')}
      </div>
      <div class="inputbar"><i class="ph ph-plus-circle"></i><div class="ph-text">Message…</div><i class="ph ph-camera"></i><div class="send tappable" data-toast="Sent"><i class="ph ph-arrow-up"></i></div></div>
    </div>
  </section>`);
};

/* ----- Schedule viewing ----- */
screens.schedule = ({id}) => {
  const lid=LISTINGS[id]?id:'l1';
  const days=[['FRI','30'],['SAT','31'],['SUN','1'],['MON','2'],['TUE','3']];
  const times=[['9:00 AM',0,1],['10:30 AM',1],['12:00 PM'],['2:00 PM'],['3:30 PM'],['5:00 PM']];
  const el=h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="topbar"><div class="icon-btn tappable" data-back><i class="ph ph-caret-left"></i></div><div class="t">Book a viewing</div></div>
    <div class="scroll" style="padding:18px 20px;display:flex;flex-direction:column;gap:22px;">
      ${listingMini(lid,{nav:false})}
      <div class="seg" id="seg">
        <div class="opt active" data-i="0"><i class="ph ph-user"></i>In person</div>
        <div class="opt" data-i="1"><i class="ph ph-video-camera"></i>Video tour</div>
      </div>
      <div>
        <div class="sched-h"><div class="t">Select a date</div><div class="m">May 2026</div></div>
        <div class="dates" id="dates">${days.map(([wd,dn],i)=>`<div class="daycell ${i===1?'active':''}" data-i="${i}"><div class="wd">${wd}</div><div class="dn">${dn}</div></div>`).join('')}</div>
      </div>
      <div>
        <div class="block-h">Available times</div>
        <div class="times" id="times">
          <div class="trow">${times.slice(0,3).map(([t,act,dis],i)=>`<div class="timeslot ${act?'active':''} ${dis?'disabled':''}" ${dis?'':`data-t="${t}"`}>${t}</div>`).join('')}</div>
          <div class="trow">${times.slice(3).map(([t])=>`<div class="timeslot" data-t="${t}">${t}</div>`).join('')}</div>
        </div>
      </div>
      <div>
        <div class="block-h">Add a note (optional)</div>
        <div class="note-field">Any questions for the agent? e.g. parking, pets, move-in date…</div>
      </div>
    </div>
    <div class="sched-bottom">
      <div class="sched-sum"><i class="ph-fill ph-calendar-check"></i><span id="sum">Saturday, May 31  ·  10:30 AM</span></div>
      <div class="cta tappable" data-nav="booking" data-id="${lid}">Confirm viewing <i class="ph ph-arrow-right"></i></div>
    </div>
  </section>`);
  return el;
};
function afterSchedule(el){
  const seg=el.querySelectorAll('#seg .opt');
  seg.forEach(o=>o.onclick=()=>{seg.forEach(x=>x.classList.remove('active'));o.classList.add('active');});
  const dc=el.querySelectorAll('#dates .daycell');
  dc.forEach(d=>d.onclick=()=>{dc.forEach(x=>x.classList.remove('active'));d.classList.add('active');});
  el.querySelectorAll('#times .timeslot[data-t]').forEach(t=>t.onclick=()=>{
    el.querySelectorAll('#times .timeslot').forEach(x=>x.classList.remove('active'));t.classList.add('active');
  });
}

/* ----- Booking confirmed ----- */
screens.booking = ({id}) => {
  const lid=LISTINGS[id]?id:'l1';
  return h(`
  <section class="screen">
    <div class="safe-top"></div>
    <div class="close-row"><i class="ph ph-x close-x tappable" data-tab="explore"></i></div>
    <div class="confirm">
      <div class="success-badge"><div class="inner"><i class="ph-bold ph-check"></i></div></div>
      <div><div class="h">Viewing confirmed!</div><div class="sub" style="margin-top:8px;">You're all set. We've notified Em Nam Home and added it to your schedule.</div></div>
      <div class="summary-card">
        ${listingMini(lid,{nav:false})}
        <div class="divider"></div>
        <div class="sumrow"><div class="chip"><i class="ph ph-calendar-check"></i></div><div><div class="lbl">WHEN</div><div class="val">Saturday, May 31 · 10:30 AM</div></div></div>
        <div class="sumrow"><div class="chip"><i class="ph ph-map-pin"></i></div><div><div class="lbl">WHERE</div><div class="val">In person at the unit</div></div></div>
        <div class="sumrow"><div class="chip" style="background-image:url('${AGENT_AV}');background-size:cover;"></div><div><div class="lbl">AGENT</div><div class="val">Em Nam Home <i class="ph-fill ph-seal-check"></i></div></div></div>
      </div>
      <div class="reminder"><i class="ph ph-bell"></i>We'll remind you 1 hour before.</div>
      <div class="confirm-btns">
        <div class="cbtn out tappable" data-nav="chat" data-id="${lid}"><i class="ph-fill ph-chat-circle"></i>Message</div>
        <div class="cbtn fill tappable" data-toast="Added to calendar"><i class="ph ph-calendar-plus"></i>Add to calendar</div>
      </div>
    </div>
  </section>`);
};

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
  if(name==='schedule') afterSchedule(el);
  if(name==='chat') setTimeout(()=>{const t=el.querySelector('#thread');if(t)t.scrollTop=t.scrollHeight;},30);
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
