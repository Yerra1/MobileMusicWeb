const tracks = [
  {name:"Damn.", artist:"Kendrick Lamar", cls:"c1"},
  {name:"Midnights", artist:"Taylor Swift", cls:"c2"},
  {name:"After Hours", artist:"The Weeknd", cls:"c3"},
  {name:"Blinding Lights", artist:"The Weeknd", cls:"c4"},
  {name:"As It Was", artist:"Harry Styles", cls:"c5"},
  {name:"Heat Waves", artist:"Glass Animals", cls:"c6"},
  {name:"Random music", artist:"Artist & Artist", cls:"c7"},
  {name:"Certified Lover Boy", artist:"Drake", cls:"c8"},
  {name:"Starboy", artist:"The Weeknd", cls:"c4"},
  {name:"Die For You", artist:"The Weeknd", cls:"c7"},
  {name:"Levitating", artist:"Dua Lipa", cls:"c5"},
  {name:"One Dance", artist:"Drake", cls:"c3"},
  {name:"Save Your Tears", artist:"The Weeknd", cls:"c6"},
  {name:"Bad Habit", artist:"Steve Lacy", cls:"c2"},
  {name:"Stargazing", artist:"Travis Scott", cls:"c1"},
  {name:"As You Are", artist:"The Weeknd", cls:"c8"}
];

const playlists = ["Cool Music Top 1","Late Night","Friends pack","Focus Mode"];
const libraryData = {
  playlists: ["My Favorites","Late Night","Gym Mode","Study Session","Friends Pack","Chill Sunday"],
  albums: ["After Hours","Midnights","Damn.","Certified Lover Boy","Starboy","Harry's House"],
  artists: ["The Weeknd","Taylor Swift","Kendrick Lamar","Drake","Dua Lipa","Travis Scott"],
  songs: tracks.map(t => t.name)
};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function saveTrack(index){ localStorage.setItem("selectedTrack", String(index)); }
function getTrackIndex(){ const n=Number(localStorage.getItem("selectedTrack")); return Number.isInteger(n)&&n>=0&&n<tracks.length?n:0; }
function openTrack(index){ saveTrack(index); window.location.href="player.html"; }

function makeCard(track,index){
  const e=document.createElement("article"); e.className="music-card";
  e.innerHTML=`<button class="album-art ${track.cls}" aria-label="Play ${track.name}"><strong>${track.name}</strong></button><div class="name">${track.name}</div><div class="sub">Play Now</div>`;
  e.querySelector(".album-art").addEventListener("click",()=>openTrack(index)); return e;
}
function fillHome(){
  const groups=[["hits",[0,1,2,3,4,5,6,7]],["newForYou",[8,9,10,11,12,13,14,15]],["friends",[0,2,4,6,8,10,12,14]]];
  groups.forEach(([id,ids])=>{const box=document.getElementById(id);if(!box)return;ids.forEach(i=>box.appendChild(makeCard(tracks[i],i)));});
}
function fillSearch(){
  const box=$("#searchResults"); if(!box)return;
  tracks.forEach((track,index)=>{const row=document.createElement("button");row.className="result";row.innerHTML=`<span class="result-art album-art ${track.cls}"><strong>${track.name}</strong></span><span class="result-copy"><span class="result-name">${track.name}</span><span class="result-sub">${track.artist}</span></span>`;row.addEventListener("click",()=>openTrack(index));box.appendChild(row);});
}
function fillPlaylists(){
  const box=$("#playlists");if(!box)return;
  playlists.forEach((name,index)=>{const row=document.createElement("button");row.className="playlist";row.innerHTML=`<span class="playlist-art c${index+1}"></span><span>${name}</span><span class="playlist-chevron">›</span>`;row.addEventListener("click",()=>openTrack(index%tracks.length));box.appendChild(row);});
}
function updatePlayer(){
  const title=$("#playerTitle"),artist=$("#playerArtist"),art=$("#heroArt");if(!title||!artist||!art)return;const track=tracks[getTrackIndex()];title.textContent=track.name;artist.textContent=track.artist;art.className=`hero-art ${track.cls}`;
}
function setPlayingState(){const play=$("#playBtn");if(!play)return;play.classList.toggle("is-playing",!!play.dataset.playing);play.setAttribute("aria-label",play.dataset.playing==="true"?"Pause":"Play");}
function togglePlay(){const play=$("#playBtn");if(!play)return;play.dataset.playing=play.dataset.playing!=="true"?"true":"false";setPlayingState();}
function stepTrack(step){const next=(getTrackIndex()+step+tracks.length)%tracks.length;saveTrack(next);window.location.href="player.html";}
function filterSearch(){const input=$("#searchInput");if(!input)return;const q=input.value.trim().toLowerCase();$$(".result").forEach((row,i)=>{const t=tracks[i];row.hidden=Boolean(q)&&!`${t.name} ${t.artist}`.toLowerCase().includes(q);});}

function fillLibrary(type="playlists"){
  const grid=$("#libraryGrid"), title=$("#libraryTitle"); if(!grid||!title)return;
  const titles={playlists:"Playlists",albums:"Albums",artists:"Artists",songs:"Songs"}; title.textContent=titles[type]||"Playlists"; grid.innerHTML="";
  libraryData[type].forEach((name,index)=>{
    const item=document.createElement("button"); item.className="library-item";
    if(type==="artists"){
      item.innerHTML=`<span class="artist-avatar c${(index%8)+1}">${name.charAt(0)}</span><span class="library-item-copy"><strong>${name}</strong><small>Artist</small></span><span class="library-chevron">›</span>`;
    }else{
      const trackIndex=tracks.findIndex(t=>t.name===name);
      const cls=trackIndex>=0?tracks[trackIndex].cls:`c${(index%8)+1}`;
      item.innerHTML=`<span class="library-art ${cls}"></span><span class="library-item-copy"><strong>${name}</strong><small>${type==="songs"?(tracks[trackIndex]?.artist||"Artist & Artist"):(type==="albums"?"Album":"Playlist")}</small></span><span class="library-chevron">›</span>`;
      if(trackIndex>=0)item.addEventListener("click",()=>openTrack(trackIndex));
    }
    grid.appendChild(item);
  });
}

fillHome();fillSearch();fillPlaylists();updatePlayer();setPlayingState();fillLibrary();

$$(".section-arrow").forEach(btn=>btn.addEventListener("click",()=>{const box=document.getElementById(btn.dataset.section);if(box)box.scrollBy({left:240,behavior:"smooth"});}));
$("#searchInput")?.addEventListener("input",filterSearch);
$("#searchSubmit")?.addEventListener("click",filterSearch);
$("#playBtn")?.addEventListener("click",togglePlay);
$("#nextBtn")?.addEventListener("click",()=>stepTrack(1));
$("#prevBtn")?.addEventListener("click",()=>stepTrack(-1));
$("#libraryPlay")?.addEventListener("click",()=>openTrack(getTrackIndex()));

$$(".stem").forEach(button=>button.addEventListener("click",()=>button.classList.toggle("active")));
$$(".library-filter").forEach(button=>button.addEventListener("click",()=>{$$(".library-filter").forEach(b=>b.classList.remove("active"));button.classList.add("active");fillLibrary(button.dataset.filter);}));
$$("[data-page-link]").forEach(link=>{if(link.dataset.pageLink===document.body.dataset.page)link.classList.add("selected");});

document.addEventListener("keydown",e=>{if(e.code==="Space"&&document.activeElement?.tagName!=="INPUT"){e.preventDefault();togglePlay();}if(e.code==="ArrowRight")stepTrack(1);if(e.code==="ArrowLeft")stepTrack(-1);});

document.addEventListener("pointerdown",e=>{const target=e.target.closest("button,a");if(!target)return;const tag=target.getBoundingClientRect();if(tag.width<1||tag.height<1)return;const ripple=document.createElement("span");ripple.className="ripple";ripple.style.left=e.clientX+"px";ripple.style.top=e.clientY+"px";document.body.appendChild(ripple);window.setTimeout(()=>ripple.remove(),520);});
$$(".section-arrow").forEach(btn=>btn.addEventListener("click",()=>btn.animate([{transform:"translateX(0) scale(1)"},{transform:"translateX(2px) scale(.88)"},{transform:"translateX(0) scale(1)"}],{duration:260,easing:"cubic-bezier(.2,.8,.25,1)"})));
$$(".stem").forEach(button=>button.addEventListener("click",()=>button.animate([{transform:"scale(.94)"},{transform:"scale(1.025)"},{transform:"scale(1)"}],{duration:230,easing:"cubic-bezier(.2,.8,.25,1)"})));
