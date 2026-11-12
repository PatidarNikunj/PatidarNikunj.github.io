(function () {
  "use strict";

  var GITHUB_USER = "PatidarNikunj";

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Theme toggle (saved per visitor)
  var root = document.documentElement;
  document.getElementById("themeBtn").addEventListener("click", function () {
    var next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Typing effect for the role line
  var phrases = [
    "scalable web apps",
    "React Native mobile apps",
    "Next.js platforms",
    "secure, tested products",
    "teams that ship"
  ];
  var typed = document.getElementById("typed");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    var p = 0, c = phrases[0].length, deleting = true;
    setTimeout(function tick() {
      var word = phrases[p];
      c += deleting ? -1 : 1;
      typed.textContent = word.slice(0, c);
      var delay = deleting ? 40 : 80;
      if (!deleting && c === word.length) { deleting = true; delay = 1800; }
      else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 300; }
      setTimeout(tick, delay);
    }, 2000);
  }

  // Skills with category filters
  var skills = {
    "Frontend": ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Material UI", "shadcn/ui", "Storybook", "Monorepo", "WCAG 2.1"],
    "Mobile & Security": ["React Native", "Expo", "Android (Java/Kotlin)", "Native Modules (Swift)", "SSL Pinning", "Device Fingerprinting", "OAuth2/JWT", "Keychain/Keystore"],
    "State & APIs": ["Redux Toolkit", "Zustand", "React Query", "GraphQL", "REST APIs", "Axios"],
    "Quality": ["Clean Architecture", "SOLID", "Performance Optimization", "Jest", "RN Testing Library", "SonarQube", "Checkmarx"],
    "Cloud & Delivery": ["Azure", "CI/CD", "App & Play Store Releases", "Vite", "Webpack", "Sentry", "Crashlytics"],
    "Backend": ["Node.js", "Python (FastAPI)", "PostgreSQL", "MongoDB", "Redis", "SQLite"]
  };
  var filters = document.getElementById("skillFilters");
  var chips = document.getElementById("skillChips");
  var groups = ["All"].concat(Object.keys(skills));

  function renderSkills(group) {
    var list = group === "All"
      ? Object.keys(skills).reduce(function (a, k) { return a.concat(skills[k]); }, [])
      : skills[group];
    chips.innerHTML = "";
    list.forEach(function (s) {
      var li = document.createElement("li");
      li.textContent = s;
      chips.appendChild(li);
    });
    Array.prototype.forEach.call(filters.children, function (b) {
      b.classList.toggle("active", b.dataset.group === group);
    });
  }
  groups.forEach(function (g) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = g;
    b.dataset.group = g;
    b.addEventListener("click", function () { renderSkills(g); });
    filters.appendChild(b);
  });
  renderSkills("All");

  // Latest non-fork repositories from the GitHub API
  var repoList = document.getElementById("repoList");
  fetch("https://api.github.com/users/" + GITHUB_USER + "/repos?per_page=100&sort=pushed")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (repos) {
      var own = repos
        .filter(function (r) { return !r.fork && r.name.toLowerCase() !== (GITHUB_USER + ".github.io").toLowerCase(); })
        .slice(0, 6);
      if (!own.length) throw new Error("empty");
      repoList.innerHTML = "";
      own.forEach(function (r) {
        var a = document.createElement("a");
        a.className = "repo";
        a.href = r.html_url;
        a.target = "_blank";
        a.rel = "noreferrer";
        var h = document.createElement("h3");
        h.textContent = r.name;
        var d = document.createElement("p");
        d.textContent = r.description || "No description yet.";
        var m = document.createElement("div");
        m.className = "meta";
        m.textContent = [r.language || "—", "★ " + r.stargazers_count, "Updated " + new Date(r.pushed_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })].join("  ·  ");
        a.appendChild(h); a.appendChild(d); a.appendChild(m);
        repoList.appendChild(a);
      });
    })
    .catch(function () {
      repoList.innerHTML = '<p class="muted">Couldn\'t load repositories right now. <a class="accent" href="https://github.com/' + GITHUB_USER + '" target="_blank" rel="noreferrer">View them on GitHub →</a></p>';
    });

  // Reveal sections on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("shown"); });
  }
})();
