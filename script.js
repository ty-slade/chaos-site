const app = document.getElementById("app");
const historyStack = [];

/* ---------- music ---------- */
const audio = document.getElementById("bgm");
const playBtn = document.getElementById("playBtn");
const vol = document.getElementById("vol");

// mobile detection for volume control
const isMobile = window.matchMedia("(max-width: 768px)").matches;

function initAudio() {
  if (!audio || !playBtn) return;

  // Only wire up volume control on desktop/tablet-like layouts.
  // iOS Safari often ignores programmatic volume changes.
  if (vol && !isMobile) {
    audio.volume = parseFloat(vol.value);

    vol.addEventListener("input", () => {
      audio.volume = parseFloat(vol.value);
    });
  }

  playBtn.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play(); // iPhone requires a tap
        playBtn.textContent = "⏸";
      } else {
        audio.pause();
        playBtn.textContent = "▶";
      }
    } catch {
      alert("Tap play again 🙂 (your phone wants a user tap)");
    }
  });
}

/* ---------- modal (tap-to-zoom images) ---------- */
function openModal(src) {
  const modal = document.getElementById("modal");
  const img = document.getElementById("modalImg");
  if (!modal || !img) return;
  img.src = src;
  modal.classList.add("open");
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  modal.classList.remove("open");
}

/* ---------- helpers ---------- */
function render(html, push = true) {
  if (push) historyStack.push(html);
  app.innerHTML = `<div class="scene">${html}</div>`;
}

function goBack() {
  if (historyStack.length <= 1) return;
  historyStack.pop();
  app.innerHTML = `<div class="scene">${historyStack[historyStack.length - 1]}</div>`;
}

function topBar(label = "") {
  return `
    <div class="backRow">
      <button class="backBtn" onclick="goBack()">← Back</button>
      <div style="opacity:.7;font-size:12px;">${label}</div>
      <div style="width:60px;"></div>
    </div>
  `;
}

function copyEmoji(emoji) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(emoji).then(() => {
      alert(`Copied: ${emoji} — Now text it to me 😏`);
    });
  } else {
    alert(`Text me this: ${emoji}`);
  }
}

/* ---------- scenes ---------- */
function home(push = true) {
  render(`
    <h1>Welcome back, troublemaker 😏</h1>
    <p>Choose wisely.</p>

    <div class="buttons">
      <button onclick="sceneGoOut()">Go out again</button>
      <button onclick="sceneBirds()">Stay in and behave</button>
      <button onclick="sceneChaos()">Cause problems</button>
    </div>
  `, push);
}

/* PATH A */
function sceneGoOut() {
  render(`
    ${topBar("Clock it.")}
    <h1>Correct 😈</h1>
    <p>I fear we have more memories to make.</p>
    <p>Now pick your energy.</p>

    <div class="buttons">
      <button onclick="sceneNext('out')">Choose vibe</button>
      <button onclick="home()">Restart</button>
    </div>
  `);
}

/* PATH B */
function sceneChaos() {
  render(`
    ${topBar("Chaos mode")}
    <div class="imgWrap">
      <img class="sceneImg" src="sidney_middle_finger.jpg" alt="chaos"
           onclick="openModal('sidney_middle_finger.jpg')">
    </div>
    <div class="imgHint">Tap image to zoom</div>

    <h1>Chaos accepted.</h1>
    <p>Now pick your energy. Don’t disappoint me.</p>

    <div class="buttons">
      <button onclick="sceneNext('chaos')">Choose vibe</button>
      <button onclick="home()">Restart</button>
    </div>
  `);
}

function sceneBirds() {
  render(`
    ${topBar("Birds.")}
    <div class="imgWrap">
      <img class="sceneImg" src="sidney_thumbs_down.png" alt="thumbs down"
           onclick="openModal('sidney_thumbs_down.png')">
    </div>
    <div class="imgHint">Tap image to zoom</div>

    <h1>Birds. 👎</h1>
    <p>Wrong answer. Try again.</p>

    <div class="buttons">
      <button onclick="goBack()">Ok fine</button>
      <button onclick="home()">Restart</button>
    </div>
  `);
}

/* unique final emojis per path */
function sceneNext(mode) {
  const isOut = mode === "out";

  // Path A (out): 🐢 / 🦂
  // Path B (chaos): 🧨 / 🐍
  const option1 = isOut
    ? { label: "Cute chaos", emoji: "🐢", name: "turtle" }
    : { label: "Cute chaos", emoji: "🧨", name: "dynamite" };

  const option2 = isOut
    ? { label: "Brat mode", emoji: "🦂", name: "scorpion" }
    : { label: "Brat mode", emoji: "🐍", name: "snake" };

  render(`
    ${topBar("Pick your vibe")}
    <h1>Choose your energy</h1>
    <p>Don’t overthink it.</p>

    <div class="buttons">
      <button onclick="finalScene('${mode}', 'You understood the assignment.', '${option1.emoji}', '${option1.name}')">${option1.label}</button>
      <button onclick="finalScene('${mode}', 'Certified menace.', '${option2.emoji}', '${option2.name}')">${option2.label}</button>
      <button onclick="sceneResponsible()">Responsible choice</button>
    </div>
  `);
}

function sceneResponsible() {
  render(`
    ${topBar("Respectfully...")}
    <div class="imgWrap">
      <img class="sceneImg" src="ty_thumbs_down.png" alt="nope"
           onclick="openModal('ty_thumbs_down.png')">
    </div>
    <div class="imgHint">Tap image to zoom</div>

    <h1>No. 👎</h1>
    <p>That answer is for the birds.</p>

    <div class="buttons">
      <button onclick="goBack()">Try again</button>
      <button onclick="home()">Restart</button>
    </div>
  `);
}

function finalScene(mode, line, emoji, name) {
  const prefix = mode === "out"
    ? "Out path, the Scorpion energy we needed!"
    : "Chaos path";

  render(`
    ${topBar("Final")}
    <h1>${line}</h1>
    <p>${prefix}. Clock it.</p>

    <p><b>Text me this emoji so I know:</b><br>
      ${emoji} <span style="opacity:.75;">(${name})</span>
    </p>

    <div class="buttons">
      <button onclick="copyEmoji('${emoji}')">Copy emoji</button>
      <button onclick="home()">Play again</button>
    </div>
  `);
}

/* start */
initAudio();
home(true);
