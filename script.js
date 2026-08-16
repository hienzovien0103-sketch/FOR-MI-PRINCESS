// ---- Loading screen (cute pause before the bunny gate) ----
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loading-screen');
      if (loader) loader.classList.add('hidden');
    }, 1500);
  });

  /* ============================================================
     📸 ADD YOUR PHOTOS HERE
     ============================================================
     This is the ONLY place you need to touch to add real photos.

     This project expects a "photos" folder sitting right next to
     this HTML file (see the folder layout in README.md). Put your
     image files in that folder, then paste the filename below.
     Leave a value as "" to keep showing the placeholder box.

     - "cover" is the faded background photo on the very first page.
     - "confession-1" through "confession-5" are the 5 photo spots
       inside the confession section, in the order they appear.
  ============================================================ */
  const photos = {
    cover: "",              // e.g. "photos/cover.jpg"
    "confession-1": "photos/1.jpg",     // e.g. "photos/confession-1.jpg"
    "confession-2": "photos/2.jpg",
    "confession-3": "photos/3.jpg",
    "confession-4": "photos/4.jpg",
    "confession-5": "photos/5.jpg",
  };

  function loadPhotos() {
    Object.entries(photos).forEach(([id, path]) => {
      if (!path) return; // nothing pasted in yet, keep the placeholder
      if (id === 'cover') {
        const coverEl = document.querySelector('[data-photo-id="cover"]');
        if (coverEl) coverEl.style.backgroundImage = `url('${path}')`;
        return;
      }
      const wrap = document.querySelector(`.photo-placeholder[data-photo-id="${id}"] .photo-box`);
      if (wrap) {
        wrap.innerHTML = `<img src="${path}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:2px;">`;
      }
    });
  }
  loadPhotos();

  // ---- Scroll progress bar ----
  const scrollFill = document.getElementById('scroll-progress-fill');
  function updateScrollProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
    scrollFill.style.width = (ratio * 100) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ---- Parallax layers ----
  const parallaxPhoto = document.querySelector('.landing-photo');
  const parallaxConfession = document.querySelector('.confession-wrap');
  function updateParallax() {
    const y = window.scrollY;
    if (parallaxPhoto) parallaxPhoto.style.transform = `translateY(${y * 0.22}px)`;
    if (parallaxConfession) parallaxConfession.style.backgroundPosition = `center ${y * 0.04}px`;
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // ---- Subtle typewriter for small text, triggered on scroll into view ----
  function typewriteSmall(el, speed) {
    if (el.dataset.typed) return;
    el.dataset.typed = '1';
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      i++;
      el.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(interval);
    }, speed || 22);
  }
  const smallTextObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) typewriteSmall(entry.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.section-kicker, .about-title, .timer-label, .music-panel-title')
    .forEach(el => smallTextObserver.observe(el));

  // ---- Typewriter (landing headline, plays once on gate close) ----
  function typewrite(el, text, speed) {
    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(document.createTextNode(''));
    el.appendChild(cursor);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      el.childNodes[0].textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => cursor.remove(), 1200);
      }
    }, speed);
  }

  // ---- Touch fallback for the CD hover effect ----
  document.querySelectorAll('.song-disc-wrap').forEach(disc => {
    disc.addEventListener('touchstart', () => {
      disc.classList.add('touch-active');
      clearTimeout(disc._touchTimer);
      disc._touchTimer = setTimeout(() => disc.classList.remove('touch-active'), 1400);
    }, { passive: true });
  });

  // ---- Bunny gate (step 1: bunnies, step 2: device choice) ----
  const bunnyGate = document.getElementById('bunny-gate');
  const bunnyBtn = document.getElementById('bunny-btn');
  const gateStepBunny = document.getElementById('gate-step-bunny');
  const gateStepDevice = document.getElementById('gate-step-device');
  const siteFrame = document.getElementById('site-frame');

  bunnyBtn.addEventListener('click', () => {
    const rect = bunnyBtn.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const b = document.createElement('span');
      b.className = 'bunny-pop';
      b.textContent = '🐰';
      b.style.left = (rect.left + rect.width / 2 + (Math.random() * 100 - 50)) + 'px';
      b.style.top = (rect.top + (Math.random() * 20 - 10)) + 'px';
      b.style.animationDelay = (Math.random() * 0.2) + 's';
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 1300);
    }
    gateStepBunny.classList.remove('active');
    gateStepDevice.classList.add('active');
  });

  document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const device = btn.getAttribute('data-device');
      siteFrame.classList.remove('device-phone', 'device-tablet', 'device-laptop');
      siteFrame.classList.add('device-' + device);
      bunnyGate.classList.add('hidden');
      const h1 = document.getElementById('landing-h1');
      if (h1 && !h1._typed) {
        h1._typed = true;
        typewrite(h1, h1.getAttribute('data-text'), 55);
      }
    });
  });

  // ---- Twinkling star field ----
  const starField = document.getElementById('star-field');
  const starCount = window.innerWidth < 600 ? 45 : 80;
  for (let i = 0; i < starCount; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    const size = (1 + Math.random() * 2).toFixed(1);
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 100 + 'vh';
    s.style.animationDuration = (2 + Math.random() * 3.5) + 's';
    s.style.animationDelay = (Math.random() * 5) + 's';
    starField.appendChild(s);
  }

  // ---- Ambient falling petals ----
  const petalField = document.getElementById('petal-field');
  const petalChars = ['🌸','🏵️','✿','❀','🐰','🐶'];
  const petalCount = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < petalCount; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = petalChars[Math.floor(Math.random() * petalChars.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    p.style.animationDuration = (14 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 14) + 's';
    p.style.fontSize = (0.9 + Math.random() * 0.9) + 'rem';
    petalField.appendChild(p);
  }

  // ---- Scroll reveal for confession paragraphs, photos & favorite cards ----
  // toggles both ways: elements slide out when they leave the viewport
  // (in either direction) and slide back in when they re-enter.
  const revealTargets = document.querySelectorAll('.confession p, .photo-placeholder, .about-item, .song-disc-wrap, .yap-divider');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
      if (entry.isIntersecting) typewriteParagraph(entry.target);
    });
  }, { threshold: 0.25 });
  revealTargets.forEach(el => io.observe(el));

  // ---- Typewriter for the confession body text (plays once per paragraph) ----
  function typewriteParagraph(p) {
    const target = p.querySelector('.type-target');
    if (!target || target.dataset.typed) return;
    target.dataset.typed = '1';
    const fullText = target.textContent;
    target.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    target.appendChild(document.createTextNode(''));
    target.appendChild(cursor);
    let i = 0;
    // scales to paragraph length so every paragraph finishes in
    // roughly the same amount of time, whether it's a sentence or a wall of text
    const tickSpeed = 16;
    const totalTicks = 70;
    const charsPerTick = Math.max(1, Math.ceil(fullText.length / totalTicks));
    const interval = setInterval(() => {
      i += charsPerTick;
      target.childNodes[0].textContent = fullText.slice(0, i);
      if (i >= fullText.length) {
        target.childNodes[0].textContent = fullText;
        clearInterval(interval);
        setTimeout(() => cursor.remove(), 900);
      }
    }, tickSpeed);
  }

  // ---- Blooming flower tied to confession scroll progress ----
  const petalsGroup = document.getElementById('bloom-petals');
  const totalPetals = 8;
  const petalEls = [];
  for (let i = 0; i < totalPetals; i++) {
    const angle = (360 / totalPetals) * i;
    const petal = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    petal.setAttribute('cx', 0);
    petal.setAttribute('cy', -11);
    petal.setAttribute('rx', 4.5);
    petal.setAttribute('ry', 9);
    petal.setAttribute('fill', '#E8A6BE');
    petal.setAttribute('transform', `rotate(${angle}) scale(0)`);
    petal.style.transformOrigin = '0px 0px';
    petal.style.transition = 'transform 0.6s cubic-bezier(.34,1.56,.64,1)';
    petalsGroup.appendChild(petal);
    petalEls.push({ el: petal, angle });
  }

  const confessionSection = document.querySelector('.confession');
  function updateBloom() {
    const rect = confessionSection.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const progressed = Math.min(Math.max(-rect.top, 0), total);
    const ratio = total > 0 ? progressed / total : 0;
    const openCount = Math.round(ratio * totalPetals);
    petalEls.forEach((p, i) => {
      const scale = i < openCount ? 1 : 0;
      p.el.setAttribute('transform', `rotate(${p.angle}) scale(${scale})`);
    });
  }
  window.addEventListener('scroll', updateBloom);
  updateBloom();

  // ---- Background color: smooth, continuous scroll-linked interpolation ----
  // Instead of snapping to the nearest section's hue, this blends between
  // whichever two sections are above/below the viewport center as you
  // scroll, so the color always drifts in lockstep with your scroll
  // position (no sudden jumps anywhere, including landing -> confession).
  const colorLayer = document.getElementById('color-layer');
  let hueStops = [];

  function gradientForHue(hue) {
    const h = Number(hue);
    const h2 = (h + 28) % 360;
    const h3 = (h - 24 + 360) % 360;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const s = isDark ? '38%' : '62%';
    const l1 = isDark ? '16%' : '95%';
    const l2 = isDark ? '14%' : '92%';
    const l3 = isDark ? '17%' : '95%';
    return `linear-gradient(135deg, hsl(${h3}, ${s}, ${l1}) 0%, hsl(${h}, ${s}, ${l2}) 45%, hsl(${h2}, ${s}, ${l3}) 100%)`;
  }

  function shortestHueLerp(a, b, t) {
    const diff = ((b - a + 540) % 360) - 180;
    return (a + diff * t + 360) % 360;
  }

  function computeHueStops() {
    hueStops = Array.from(document.querySelectorAll('[data-hue]'))
      .map(el => ({ y: el.getBoundingClientRect().top + window.scrollY, hue: Number(el.getAttribute('data-hue')) }))
      .sort((a, b) => a.y - b.y);
  }

  let currentHue = 330;
  function updateSmoothColor() {
    if (!hueStops.length) return;
    const center = window.scrollY + window.innerHeight * 0.5;
    let hue = hueStops[0].hue;
    if (center <= hueStops[0].y) {
      hue = hueStops[0].hue;
    } else if (center >= hueStops[hueStops.length - 1].y) {
      hue = hueStops[hueStops.length - 1].hue;
    } else {
      for (let i = 0; i < hueStops.length - 1; i++) {
        const a = hueStops[i], b = hueStops[i + 1];
        if (center >= a.y && center <= b.y) {
          const t = (center - a.y) / Math.max(1, b.y - a.y);
          hue = shortestHueLerp(a.hue, b.hue, t);
          break;
        }
      }
    }
    currentHue = hue;
    colorLayer.style.background = gradientForHue(hue);
  }

  computeHueStops();
  window.addEventListener('resize', computeHueStops);
  window.addEventListener('scroll', updateSmoothColor, { passive: true });
  updateSmoothColor();

  // ---- Dark / light mode toggle ----
  const themeToggle = document.getElementById('theme-toggle');
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
    }
    colorLayer.style.background = gradientForHue(currentHue);
  }
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('site-theme') || 'light'; } catch (e) {}
  applyTheme(savedTheme);
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('site-theme', next); } catch (e) {}
  });

  // ---- Live timer (counting since Feb 3, 2022, 10:32 PM) ----
  // Edit the date below if you want it to count from a different moment.
  const timerStart = new Date(2022, 1, 3, 22, 32, 0); // month is 0-indexed: 1 = February
  const elDays = document.getElementById('timer-days');
  const elHours = document.getElementById('timer-hours');
  const elMins = document.getElementById('timer-mins');
  const elSecs = document.getElementById('timer-secs');
  function updateTimer() {
    const diff = Math.max(0, Date.now() - timerStart.getTime());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    elDays.textContent = days;
    elHours.textContent = String(hours).padStart(2, '0');
    elMins.textContent = String(mins).padStart(2, '0');
    elSecs.textContent = String(secs).padStart(2, '0');
  }
  updateTimer();
  setInterval(updateTimer, 1000);

  // ---- "About her" accordion ----
  document.querySelectorAll('.about-header').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.about-item').classList.toggle('open');
    });
  });

  // ---- Flowery cursor trail (laptop mode only) ----
  let lastTrailTime = 0;
  const trailFlowers = ['🌸', '✿', '❀', '🏵️'];
  document.addEventListener('mousemove', (e) => {
    if (!siteFrame.classList.contains('device-laptop')) return;
    const now = Date.now();
    if (now - lastTrailTime < 70) return;
    lastTrailTime = now;
    const trail = document.createElement('span');
    trail.className = 'cursor-trail';
    trail.textContent = trailFlowers[Math.floor(Math.random() * trailFlowers.length)];
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.fontSize = (0.8 + Math.random() * 0.5) + 'rem';
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 900);
  });

  /* ============================================================
     🎵 MUSIC PLAYER
     ============================================================
     The titles/artists below were pulled from your Spotify playlist
     "doomin n gloomin" — nothing was invented. No audio was scraped
     from Spotify; "src" is left blank for each song on purpose.

     TO ADD REAL AUDIO:
     Put your own legally-owned .mp3 files in a "music/" folder next
     to this HTML file, then paste the filename into the matching
     "src" below, e.g. src: "music/willing-and-able.mp3"
     Leave src as "" and that song will simply show a gentle reminder
     instead of trying to play.

     Note: "Los Ba?s" by Sugarfree came through with a broken
     character from Spotify's page — double check the exact spelling
     before finalizing (possibly "Los Baños").
  ============================================================ */
  const songs = [
    { title: "Willing and Able", artist: "Noah Kahan", src: "music/1 WAB.mp3" },
    { title: "The Climb (Not That One)", artist: "Finn Wolfhard", src: "music/2 TC.mp3" },
    { title: "purple", artist: "Olivia Rodrigo", src: "music/3 p.mp3" },
    { title: "Germany & Rome", artist: "The Ridleys", src: "music/4 GAR.mp3" },
    { title: "Coming Up Roses", artist: "Harry Styles", src: "music/5 CUR.mp3" },
    { title: "We Go Way Back", artist: "Noah Kahan", src: "6 WGWYB.mp3" },
    { title: "Los Ba?s", artist: "Sugarfree", src: "music/7 LPB.mp3" },
    { title: "Take Our Time", artist: "The Ridleys", src: "music/8 TOT.mp3" },
    { title: "Lagi", artist: "Kiss Jane", src: "music/9 L.mp3" },
    { title: "Meaningful Silence", artist: "The Ridleys", src: "music/10 MS.mp3" },
    { title: "u + me = <3", artist: "Olivia Rodrigo", src: "music/11 UME.mp3" },
    { title: "Gilid", artist: "Moonstar88", src: "music/12 G.mp3" },
    { title: "Carla's Song", artist: "Harry Styles", src: "music/13 CS.mp3" },
    { title: "Follow", artist: "Finn Wolfhard", src: "music/14 F.mp3" },
    { title: "Friday I'm In Love", artist: "The Cure", src: "music/15 FIIL.mp3" },
    { title: "Clouds", artist: "One Direction", src: "music/16 C.mp3" },
    { title: "Change Your Ticket", artist: "One Direction", src: "music/17 CYT.mp3" },
    { title: "Just Like Heaven - Remastered 2006", artist: "The Cure", src: "18 JLH.mp3" },
  ];

  (function musicPlayer() {
    const audio = document.getElementById('music-audio');
    const player = document.getElementById('music-player');
    const panel = document.getElementById('music-panel');
    const collapsedBar = document.getElementById('music-collapsed');
    const collapsedTitle = document.getElementById('music-collapsed-title');
    const miniToggle = document.getElementById('music-mini-toggle');
    const noteIcon = document.getElementById('music-note-icon');
    const closeBtn = document.getElementById('music-close');
    const nowTitle = document.getElementById('music-now-title');
    const nowArtist = document.getElementById('music-now-artist');
    const playBtn = document.getElementById('music-play');
    const prevBtn = document.getElementById('music-prev');
    const nextBtn = document.getElementById('music-next');
    const shuffleBtn = document.getElementById('music-shuffle');
    const repeatBtn = document.getElementById('music-repeat');
    const muteBtn = document.getElementById('music-mute');
    const volumeSlider = document.getElementById('music-volume');
    const progressTrack = document.getElementById('music-progress-track');
    const progressFill = document.getElementById('music-progress-fill');
    const progressHandle = document.getElementById('music-progress-handle');
    const timeCurrent = document.getElementById('music-time-current');
    const timeTotal = document.getElementById('music-time-total');
    const playlistEl = document.getElementById('music-playlist');
    const noneBtn = document.getElementById('music-none');
    const hintEl = document.getElementById('music-hint');

    let currentIndex = null; // null = "No Music"
    let isPlaying = false;
    let shuffle = false;
    let repeatMode = 'none'; // 'none' | 'all' | 'one'
    let lastVolume = 70;

    // ---- restore saved preferences (but never autoplay) ----
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('music-prefs') || '{}'); } catch (e) {}
    let volume = typeof saved.volume === 'number' ? saved.volume : 70;
    let muted = !!saved.muted;
    if (typeof saved.songIndex === 'number' && songs[saved.songIndex]) currentIndex = saved.songIndex;
    volumeSlider.value = volume;
    audio.volume = muted ? 0 : volume / 100;
    if (saved.playerOpen) player.classList.add('open');

    function savePrefs() {
      try {
        localStorage.setItem('music-prefs', JSON.stringify({
          songIndex: currentIndex,
          volume: volume,
          muted: muted,
          playerOpen: player.classList.contains('open'),
        }));
      } catch (e) {}
    }

    function formatTime(sec) {
      if (!isFinite(sec) || isNaN(sec)) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${String(s).padStart(2, '0')}`;
    }

    function showHint(msg) {
      hintEl.textContent = msg;
      hintEl.classList.add('show');
      clearTimeout(showHint._t);
      showHint._t = setTimeout(() => hintEl.classList.remove('show'), 3600);
    }

    function renderPlaylist() {
      playlistEl.innerHTML = '';
      songs.forEach((song, i) => {
        const row = document.createElement('div');
        row.className = 'music-song-row' + (i === currentIndex ? ' playing' : '');
        row.innerHTML = `
          <span class="music-song-play-icon">${i === currentIndex && isPlaying ? '❚❚' : '▶'}</span>
          <span class="music-song-info">
            <span class="music-song-title">${song.title}</span>
            <span class="music-song-artist">${song.artist}</span>
          </span>
          <span class="music-now-indicator"><span></span><span></span><span></span></span>
        `;
        row.addEventListener('click', () => selectSong(i, true));
        playlistEl.appendChild(row);
      });
    }

    function updateNowPlayingUI() {
      if (currentIndex === null) {
        nowTitle.textContent = 'no music';
        nowArtist.textContent = '';
        collapsedTitle.textContent = 'choose a song';
        noneBtn.classList.add('active');
      } else {
        const song = songs[currentIndex];
        nowTitle.textContent = song.title;
        nowArtist.textContent = song.artist;
        collapsedTitle.textContent = song.title;
        noneBtn.classList.remove('active');
      }
      playBtn.textContent = isPlaying ? '❚❚' : '▶';
      miniToggle.textContent = isPlaying ? '❚❚' : '▶';
      noteIcon.classList.toggle('spinning', isPlaying);
      renderPlaylist();
    }

    // ---- fade helper for smooth song transitions ----
    function fadeTo(targetVol, duration, done) {
      const start = audio.volume;
      const startTime = performance.now();
      function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        audio.volume = start + (targetVol - start) * t;
        if (t < 1) requestAnimationFrame(step);
        else if (done) done();
      }
      requestAnimationFrame(step);
    }

    function selectSong(index, userInitiated) {
      const song = songs[index];
      currentIndex = index;

      const targetVol = muted ? 0 : volume / 100;

      const startNew = () => {
        if (!song.src) {
          updateNowPlayingUI();
          savePrefs();
          showHint(`no audio file linked to "${song.title}" yet ✧`);
          return;
        }
        audio.src = song.src;
        audio.volume = 0;
        audio.currentTime = 0;
        audio.play().then(() => {
          isPlaying = true;
          fadeTo(targetVol, 350);
          updateNowPlayingUI();
        }).catch(() => {
          isPlaying = false;
          updateNowPlayingUI();
          if (userInitiated) showHint('click a song to start the soundtrack ♡');
        });
        savePrefs();
      };

      if (isPlaying && audio.src) {
        fadeTo(0, 250, () => { audio.pause(); startNew(); });
      } else {
        startNew();
      }
    }

    function togglePlay() {
      if (currentIndex === null) {
        if (songs.length) selectSong(0, true);
        return;
      }
      if (!songs[currentIndex].src) {
        showHint(`no audio file linked to "${songs[currentIndex].title}" yet ✧`);
        return;
      }
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        updateNowPlayingUI();
      } else {
        audio.play().then(() => {
          isPlaying = true;
          updateNowPlayingUI();
        }).catch(() => showHint('click a song to start the soundtrack ♡'));
      }
      savePrefs();
    }

    function pickNextIndex(direction) {
      if (currentIndex === null) return 0;
      if (shuffle) {
        if (songs.length <= 1) return currentIndex;
        let next;
        do { next = Math.floor(Math.random() * songs.length); } while (next === currentIndex);
        return next;
      }
      let next = currentIndex + direction;
      if (next >= songs.length) next = 0;
      if (next < 0) next = songs.length - 1;
      return next;
    }

    function goNext(userInitiated) { selectSong(pickNextIndex(1), userInitiated); }
    function goPrev(userInitiated) { selectSong(pickNextIndex(-1), userInitiated); }

    audio.addEventListener('ended', () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      if (repeatMode === 'none' && currentIndex === songs.length - 1 && !shuffle) {
        isPlaying = false;
        updateNowPlayingUI();
        return;
      }
      goNext(false);
    });

    audio.addEventListener('timeupdate', () => {
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      progressFill.style.width = pct + '%';
      progressHandle.style.left = pct + '%';
      timeCurrent.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      timeTotal.textContent = formatTime(audio.duration);
    });

    progressTrack.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = progressTrack.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * audio.duration;
    });

    // ---- collapsed bar: click opens/closes panel; mini toggle plays/pauses ----
    collapsedBar.addEventListener('click', () => {
      player.classList.toggle('open');
      savePrefs();
    });
    miniToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
    closeBtn.addEventListener('click', () => {
      player.classList.remove('open');
      savePrefs();
    });

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', () => goNext(true));
    prevBtn.addEventListener('click', () => goPrev(true));

    shuffleBtn.addEventListener('click', () => {
      shuffle = !shuffle;
      shuffleBtn.classList.toggle('active', shuffle);
    });

    repeatBtn.addEventListener('click', () => {
      repeatMode = repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none';
      repeatBtn.classList.toggle('active', repeatMode !== 'none');
      repeatBtn.textContent = repeatMode === 'one' ? '🔂' : '🔁';
    });

    muteBtn.addEventListener('click', () => {
      muted = !muted;
      audio.volume = muted ? 0 : volume / 100;
      muteBtn.textContent = muted ? '🔇' : '🔊';
      savePrefs();
    });

    volumeSlider.addEventListener('input', () => {
      volume = Number(volumeSlider.value);
      if (volume > 0 && muted) { muted = false; muteBtn.textContent = '🔊'; }
      audio.volume = muted ? 0 : volume / 100;
      savePrefs();
    });

    noneBtn.addEventListener('click', () => {
      fadeTo(0, 250, () => {
        audio.pause();
        audio.removeAttribute('src');
        currentIndex = null;
        isPlaying = false;
        updateNowPlayingUI();
        savePrefs();
      });
    });

    // initial paint (no autoplay — just reflects any saved state)
    muteBtn.textContent = muted ? '🔇' : '🔊';
    updateNowPlayingUI();
  })();
