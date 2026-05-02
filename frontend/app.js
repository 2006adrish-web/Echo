const API = "https://echo-gtbc.onrender.com";

// ---------------- USER SYSTEM ----------------
let user = sessionStorage.getItem("user") || "anonymous";

// sync UI on load
window.addEventListener("load", () => {
  const nameInput = document.getElementById("nameInput");
  if (nameInput) {
    nameInput.value = user;
  }
});

// ---------------- UPDATE USERNAME ----------------
function saveName() {
  const input = document.getElementById("nameInput");
  const val = input.value.trim();

  if (!val) return;

  user = val;
  sessionStorage.setItem("user", user);

  alert(`Name updated to ${user} ⚡`);
}

// ---------------- CREATE POST ----------------
async function createPost() {
  const input = document.getElementById("postInput");
  const text = input.value.trim();

  if (!text) return;

  await fetch(`${API}/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      user
    }),
  });

  input.value = "";
}

// ---------------- RENDER FEED ----------------
function renderPosts(data) {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  data.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post";

    const text = document.createElement("p");
    text.textContent = post[1];

    const meta = document.createElement("small");
    meta.textContent = `@${post[2] || "anonymous"}`;

    div.appendChild(text);
    div.appendChild(meta);

    feed.appendChild(div);
  });
}

// ---------------- LIVE FEED ----------------
let lastData = "";

async function fetchPostsLive() {
  try {
    const res = await fetch(`${API}/posts`);
    const data = await res.json();

    const serialized = JSON.stringify(data);

    if (serialized !== lastData) {
      lastData = serialized;
      renderPosts(data);
    }
  } catch (err) {
    console.log("Feed error:", err);
  }
}

// start live updates
setInterval(fetchPostsLive, 2000);
fetchPostsLive();

// ---------------- KEYBOARD SUPPORT ----------------
document.addEventListener("DOMContentLoaded", () => {
  const postInput = document.getElementById("postInput");

  if (postInput) {
    postInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") createPost();
    });
  }
});
