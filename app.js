const tracks = [
  {name:"Damn.", artist:"Kendrick Lamar", cls:"c1"},
  {name:"Midnights", artist:"Taylor Swift", cls:"c2"},
  {name:"After Hours", artist:"The Weeknd", cls:"c3"},
  {name:"Blinding Lights", artist:"The Weeknd", cls:"c4"},
  {name:"As It Was", artist:"Harry Styles", cls:"c5"},
  {name:"Heat Waves", artist:"Glass Animals", cls:"c6"},
  {name:"Random music", artist:"Artist & Artist", cls:"c7"},
  {name:"Certified Lover Boy", artist:"Drake", cls:"c8"}
];

const playlists = ["Cool Music Top 1","Late Night","Friends pack","Focus Mode"];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function saveTrack(index){
  localStorage.setItem("selectedTrack", String(index));
}

function getTrackIndex(){
  const n = Number(localStorage.getItem("selectedTrack"));
  return Number.isInteger(n) && n >= 0 && n < tracks.length ? n : 0;
}

function openTrack(index){
  saveTrack(index);
  window.location.href = "player.html";
}

function makeCard(track, index){
  const e = document.createElement("article");
  e.className = "music-card";
  e.innerHTML = `
    <button class="album-art ${track.cls}" aria-label="Play ${track.name}">
      <strong>${track.name}</strong>
    </button>
    <div class="name">${track.name}</div>
    <div class="sub">Play Now</div>
  `;
  e.querySelector(".album-art").addEventListener("click", () => openTrack(index));
  return e;
}

function fillHome(){
  const groups = [["hits",[0,1,2]],["newForYou",[0,1,3,4]],["friends",[0,2,4]]];
  groups.forEach(([id, ids]) => {
    const box = document.getElementById(id);
    if (!box) return;
    ids.forEach(i => box.appendChild(makeCard(tracks[i], i)));
  });
}

function fillSearch(){
  const box = $("#searchResults");
  if (!box) return;

  tracks.forEach((track, index) => {
    const row = document.createElement("button");
    row.className = "result";
    row.innerHTML = `
      <span class="result-art album-art ${track.cls}"><strong>${track.name}</strong></span>
      <span class="result-copy">
        <span class="result-name">${track.name}</span>
        <span class="result-sub">${track.artist}</span>
      </span>
    `;
    row.addEventListener("click", () => openTrack(index));
    box.appendChild(row);
  });
}

function fillPlaylists(){
  const box = $("#playlists");
  if (!box) return;

  playlists.forEach((name, index) => {
    const row = document.createElement("button");
    row.className = "playlist";
    row.innerHTML = `
      <span class="playlist-art c${index + 1}"></span>
      <span>${name}</span>
      <span class="playlist-chevron">›</span>
    `;
    row.addEventListener("click", () => openTrack(index % tracks.length));
    box.appendChild(row);
  });
}

function updatePlayer(){
  const title = $("#playerTitle");
  const artist = $("#playerArtist");
  const art = $("#heroArt");
  if (!title || !artist || !art) return;

  const track = tracks[getTrackIndex()];
  title.textContent = track.name;
  artist.textContent = track.artist;
  art.className = `hero-art ${track.cls}`;
}

function setPlayingState(){
  const play = $("#playBtn");
  if (!play) return;
  play.classList.toggle("is-playing", !!play.dataset.playing);
  play.setAttribute("aria-label", play.dataset.playing === "true" ? "Pause" : "Play");
}

function togglePlay(){
  const play = $("#playBtn");
  if (!play) return;
  play.dataset.playing = play.dataset.playing !== "true" ? "true" : "false";
  setPlayingState();
}

function stepTrack(step){
  const next = (getTrackIndex() + step + tracks.length) % tracks.length;
  saveTrack(next);
  window.location.href = "player.html";
}

function filterSearch(){
  const input = $("#searchInput");
  if (!input) return;
  const q = input.value.trim().toLowerCase();
  $$(".result").forEach((row, i) => {
    const t = tracks[i];
    const haystack = `${t.name} ${t.artist}`.toLowerCase();
    row.hidden = Boolean(q) && !haystack.includes(q);
  });
}

fillHome();
fillSearch();
fillPlaylists();
updatePlayer();
setPlayingState();

$$(".section-arrow").forEach(btn => {
  btn.addEventListener("click", () => {
    const box = document.getElementById(btn.dataset.section);
    if (box) box.scrollBy({left: 240, behavior: "smooth"});
  });
});

$("#searchInput")?.addEventListener("input", filterSearch);
$("#searchSubmit")?.addEventListener("click", filterSearch);
$("#playBtn")?.addEventListener("click", togglePlay);
$("#nextBtn")?.addEventListener("click", () => stepTrack(1));
$("#prevBtn")?.addEventListener("click", () => stepTrack(-1));

$$(".stem").forEach(button => {
  button.addEventListener("click", () => button.classList.toggle("active"));
});

$$("[data-page-link]").forEach(link => {
  if (link.dataset.pageLink === document.body.dataset.page) link.classList.add("selected");
});

document.addEventListener("keydown", e => {
  if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
    e.preventDefault();
    togglePlay();
  }
  if (e.code === "ArrowRight") stepTrack(1);
  if (e.code === "ArrowLeft") stepTrack(-1);
});
