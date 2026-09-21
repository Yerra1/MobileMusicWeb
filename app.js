const tracks=[{name:"Damn.",artist:"Kendrick Lamar",cls:"c1"},{name:"Midnights",artist:"Taylor",cls:"c2"},{name:"After Hours",artist:"The Weeknd",cls:"c3"},{name:"Blinding Lights",artist:"The Weeknd",cls:"c4"},{name:"As It Was",artist:"Harry Styles",cls:"c5"},{name:"Heat Waves",artist:"Glass Animals",cls:"c6"},{name:"Random music",artist:"Artist & Artist",cls:"c7"},{name:"Certified Lover Boy",artist:"Drake",cls:"c8"}];
const playlists=["Cool Music Top 1","Late Night","Friends pack","Focus Mode"];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];let currentIndex=0,isPlaying=false;
function setPlayingState(){$('#playBtn').classList.toggle('is-playing',isPlaying);$('#playBtn').setAttribute('aria-label',isPlaying?'Pause':'Play')}
function card(t,i){const e=document.createElement("div");e.className="music-card";e.innerHTML=`<div class="album-art ${t.cls}"><strong>${t.name}</strong></div><div class="name">${t.name}</div><div class="sub">Play Now</div>`;e.onclick=()=>playTrack(i);return e}
function fillHome(){[["hits",[0,1,2]],["newForYou",[0,1,3,4]],["friends",[0,2,4]]].forEach(([id,ids])=>ids.forEach(i=>document.getElementById(id).appendChild(card(tracks[i],i))))}
function fillSearch(){const box=$("#searchResults");tracks.forEach((t,i)=>{const row=document.createElement("div");row.className="result";row.innerHTML=`<div class="result-art album-art ${t.cls}"><strong>${t.name}</strong></div><div><div class="result-name">${t.name}</div><div class="result-sub">Artist & Artist</div></div>`;row.onclick=()=>playTrack(i);box.appendChild(row)})}
function fillPlaylists(){const box=$("#playlists");playlists.forEach((n,i)=>{const r=document.createElement("div");r.className="playlist";r.innerHTML=`<div class="playlist-art c${i+1}"></div><div>${n}</div>`;r.onclick=()=>playTrack(i%tracks.length);box.appendChild(r)})}
function navigate(page){document.body.dataset.page=page;$('.page').forEach(p=>p.classList.toggle('active',p.id===page));$$('.mobile-bottom button').forEach(b=>b.classList.toggle('selected',b.dataset.page===page));$$('.side-link').forEach(b=>b.classList.toggle('active',b.dataset.page===page));window.scrollTo({top:0,behavior:'smooth'})}
function playTrack(i){currentIndex=(i+tracks.length)%tracks.length;const t=tracks[currentIndex];$('#playerTitle').textContent=t.name;$('#playerArtist').textContent=t.artist;$('#heroArt').className=`hero-art ${t.cls}`;$('#progress').value=0;navigate('playing');isPlaying=true;setPlayingState()}
function togglePlay(){isPlaying=!isPlaying;setPlayingState()}
function nextTrack(step=1){playTrack(currentIndex+step)}
function filterSearch(){const q=$('#searchInput').value.trim().toLowerCase();$$('.result').forEach((r,i)=>r.style.display=!q||`${tracks[i].name} ${tracks[i].artist}`.toLowerCase().includes(q)?'flex':'none')}
fillHome();fillSearch();fillPlaylists();setPlayingState();
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));
$$('[data-open-search]').forEach(e=>e.addEventListener('click',()=>navigate('search')));
$('#homeSearch').addEventListener('focus',()=>navigate('search'));$('#playBtn').addEventListener('click',togglePlay);$('#nextBtn').addEventListener('click',()=>nextTrack(1));$('#prevBtn').addEventListener('click',()=>nextTrack(-1));$('#searchInput').addEventListener('input',filterSearch);$('#searchSubmit').addEventListener('click',filterSearch);
$$('.stem').forEach(b=>b.addEventListener('click',()=>b.classList.toggle('active')));
document.addEventListener('keydown',e=>{if(e.code==='Space'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();togglePlay()}if(e.code==='ArrowRight')nextTrack(1);if(e.code==='ArrowLeft')nextTrack(-1)});

$$('.section-arrow').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const box=document.getElementById(btn.dataset.section);
    if(box) box.scrollBy({left:240,behavior:'smooth'});
  });
});
