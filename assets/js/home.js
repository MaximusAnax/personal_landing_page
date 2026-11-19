// Home page interactions. No dependencies. Each block owns one section.
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const C = { paper: '#0a3a3a', ink: '#eedfc0', accent: '#d6a84f' };
const readColors = () => { const cs = getComputedStyle(root); C.paper = cs.getPropertyValue('--paper').trim(); C.ink = cs.getPropertyValue('--ink').trim(); C.accent = cs.getPropertyValue('--accent').trim(); };

readColors();
$$('[data-scramble]').forEach(el => {
  const txt = el.textContent; let raf = 0;
  el.closest('a').addEventListener('pointerenter', () => {
    if (reduce) return; const t0 = performance.now(); cancelAnimationFrame(raf);
    const step = now => { const k = (now - t0) / 650; el.textContent = [...txt].map((ch, i) => ch === ' ' || i / txt.length < k ? ch : (Math.random() > .5 ? '1' : '0')).join(''); if (k < 1) raf = requestAnimationFrame(step); else el.textContent = txt; };
    raf = requestAnimationFrame(step);
  });
});
{
  const rail = $('.lab__rail'); let down = false, sx = 0, sl = 0;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('is-drag'); });
  addEventListener('pointermove', e => { if (down) rail.scrollLeft = sl - (e.clientX - sx); });
  addEventListener('pointerup', () => { down = false; rail.classList.remove('is-drag'); });
}

/* ticker */
const tickers = [], resizers = [];
const addTicker = (el, fn) => { const k = { fn, on: true }; new IntersectionObserver(es => { k.on = es[0].isIntersecting; }).observe(el); tickers.push(k); };
let lt = 0;
const loop = t => { const dt = clamp((t - lt) / 16.67, .2, 3) || 1; lt = t; for (const k of tickers) if (k.on) k.fn(reduce ? 0 : t, dt); requestAnimationFrame(loop); };
let rq = 0;
addEventListener('resize', () => { cancelAnimationFrame(rq); rq = requestAnimationFrame(() => resizers.forEach(f => f())); });

/* noise */
const perm = new Uint8Array(512);
{ const p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) perm[i] = p[i & 255]; }
const G = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
const grad = (ix, iy, dx, dy) => { const g = G[perm[ix + perm[iy]] & 7]; return g[0] * dx + g[1] * dy; };
function noise(x, y) {
  const X = Math.floor(x), Y = Math.floor(y); x -= X; y -= Y; const xi = X & 255, yi = Y & 255, u = fade(x), v = fade(y);
  const a = grad(xi, yi, x, y), b = grad(xi + 1, yi, x - 1, y), c = grad(xi, yi + 1, x, y - 1), d = grad(xi + 1, yi + 1, x - 1, y - 1);
  const top = a + (b - a) * u; return top + ((c + (d - c) * u) - top) * v;
}

/* intro + title */
const intro = $('#intro');
const dropIntro = () => intro && intro.remove();
intro.addEventListener('animationend', e => { if (e.animationName === 'introOut') dropIntro(); });
setTimeout(dropIntro, 3200);
let ci = 0;
$$('.word').forEach(w => { const t = w.textContent; w.setAttribute('aria-label', t); w.textContent = ''; [...t].forEach(ch => { const i = document.createElement('i'); i.textContent = ch; i.style.setProperty('--i', ci++); i.setAttribute('aria-hidden', 'true'); w.appendChild(i); }); });
function fitTitle() {
  // One line on wide screens and on short ones (a phone held sideways); two lines otherwise.
  const t = $('.hero__title'), one = innerWidth >= 900 || innerHeight < 520; t.classList.toggle('one', one); t.style.fontSize = '100px';
  const avail = t.clientWidth - parseFloat(getComputedStyle(t).paddingLeft) * 2;
  const w1 = $('.w1', t).getBoundingClientRect().width, w2 = $('.w2', t).getBoundingClientRect().width, st = 34, gap = 12;
  const need = one ? w1 + w2 + st + gap * 2 : Math.max(w1 + st + gap, w2);
  t.style.fontSize = (avail / need * 99) + 'px';
  // Never taller than the wave field allows: keep clear of the scroll cue underneath.
  const h = t.offsetHeight, max = t.parentElement.clientHeight - 150;
  if (h > max && max > 40) t.style.fontSize = (parseFloat(t.style.fontSize) * max / h) + 'px';
}
resizers.push(fitTitle);

/* separators */
const bin = n => Array.from({ length: n }, () => Math.random() > .5 ? '1' : '0').join('');
const codes = [];
$$('[data-sep]').forEach(sep => {
  const n = +sep.dataset.sep; let h = '<b>▶</b>';
  for (let i = 0; i < n; i++) h += `<span class="code">${bin(i % 2 ? 12 : 16)}</span>` + (i < n - 1 ? `<i class="${i === 0 ? 'grow' : ''}"></i>` : '');
  sep.innerHTML = h + '<b>◀</b>'; sep.setAttribute('aria-hidden', 'true');
});
codes.push(...$$('.sep .code'));
$$('[data-copy]').forEach(b => b.addEventListener('click', () => { const t = b.textContent, done = m => { b.textContent = m; setTimeout(() => { b.textContent = t; }, 1400); }; try { navigator.clipboard.writeText(b.dataset.copy).then(() => done('Copied'), () => done(b.dataset.copy)); } catch (e) { done(b.dataset.copy); } }));
if (!reduce) setInterval(() => codes.forEach(c => { c.textContent = [...c.textContent].map(ch => Math.random() > .1 ? ch : (Math.random() > .5 ? '1' : '0')).join(''); }), 90);

/* console */
{
  const el = $('#console'), msgs = JSON.parse(el.dataset.msgs || '[""]');
  let mi = 0, n = 0, hold = 0;
  if (!reduce) setInterval(() => { if (hold > 0) { hold--; return; } const m = msgs[mi]; n++; el.textContent = m.slice(0, n) + '▌'; if (n >= m.length) { hold = 45; n = 0; mi = (mi + 1) % msgs.length; } }, 45);
}

/* waves */
{
  const cv = $('#waves'), ctx = cv.getContext('2d'); let W = 0, H = 0, dpr = 1, lines = [];
  const m = { x: -999, y: -999, sx: -999, sy: -999, lx: -999, ly: -999, vs: 0, a: 0, set: false };
  const size = () => {
    const r = cv.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(devicePixelRatio || 1, 2); cv.width = W * dpr; cv.height = H * dpr;
    lines = []; const gx = 10, gy = 32, nx = Math.ceil((W + 200) / gx), ny = Math.ceil((H + 30) / gy), ox = (W - gx * nx) / 2, oy = (H - gy * ny) / 2;
    for (let i = 0; i <= nx; i++) { const col = []; for (let j = 0; j <= ny; j++) col.push({ x: ox + gx * i, y: oy + gy * j, cx: 0, cy: 0, vx: 0, vy: 0 }); lines.push(col); }
  };
  addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; if (!m.set) { m.sx = m.lx = m.x; m.sy = m.ly = m.y; m.set = true; } });
  const tick = t => {
    m.sx += (m.x - m.sx) * .1; m.sy += (m.y - m.sy) * .1;
    const dx = m.x - m.lx, dy = m.y - m.ly, d = Math.hypot(dx, dy); m.vs = Math.min(100, m.vs + (d - m.vs) * .1); m.lx = m.x; m.ly = m.y; if (d > .01) m.a = Math.atan2(dy, dx);
    const R = Math.max(175, m.vs), ca = Math.cos(m.a), sa = Math.sin(m.a);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.beginPath();
    for (const col of lines) for (let j = 0; j < col.length; j++) {
      const p = col[j], n = noise((p.x + t * .0125) * .002, (p.y + t * .005) * .0015) * 12;
      const dist = Math.hypot(p.x - m.sx, p.y - m.sy);
      if (dist < R) { const f = (1 - dist / R) * R * m.vs * .00065; p.vx += ca * f; p.vy += sa * f; }
      p.vx += -p.cx * .005; p.vy += -p.cy * .005; p.vx *= .925; p.vy *= .925;
      p.cx = clamp(p.cx + p.vx * 2, -100, 100); p.cy = clamp(p.cy + p.vy * 2, -100, 100);
      const pin = j === col.length - 1 ? 0 : 1, X = p.x + Math.cos(n) * 32 + p.cx * pin, Y = p.y + Math.sin(n) * 16 + p.cy * pin;
      j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
    }
    ctx.stroke();
    if (m.set) { ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(m.sx, m.sy, 5, 0, 7); ctx.fill(); }
  };
  resizers.push(size); addTicker(cv, tick);
  // The field can change size without a window resize (fonts landing, the browser bar hiding); re-measure when it does.
  if ('ResizeObserver' in window) new ResizeObserver(() => { const r = cv.getBoundingClientRect(); if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) size(); }).observe(cv);
}

/* work */
{
  const sec = $('#work'), pin = $('.work__pin'), mask = $('.work__mask'), ring = $('.work__ring'), scene = $('#scene'), hint = $('.work__hint');
  const cards = $$('.card', scene).map((el, k) => ({ el, y: (k % 2 ? 1 : -1) * (4 + (k * 37 % 9)), w: 0 })), N = cards.length;
  // A card opens its full write-up in the list below and collapses the others.
  const openEntry = (id, scroll) => {
    const d = document.getElementById(id); if (!d || d.tagName !== 'DETAILS') return false;
    $$('.index details').forEach(x => { x.open = x === d; });
    if (scroll) d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    return true;
  };
  cards.forEach(c => c.el.addEventListener('click', e => { const id = c.el.getAttribute('href').slice(1); if (openEntry(id, true)) { e.preventDefault(); history.replaceState(null, '', '#' + id); } }));
  if (location.hash.length > 1) openEntry(location.hash.slice(1), false);
  let rows = [], vw = 0, vh = 0, pw = 0, ph = 0, P = 0;
  const build = () => {
    vw = pin.clientWidth; vh = pin.clientHeight; pw = Math.min(vw * .5, 340); ph = vh * .88;
    $$('.ghost', scene).forEach(g => g.remove()); rows = [];
    const rowH = vh * .25, fs = rowH * 1.02;
    [...'WORK'].forEach((ch, r) => {
      const mk = () => { const g = document.createElement('span'); g.className = 'ghost'; g.textContent = ch; g.setAttribute('aria-hidden', 'true'); g.style.cssText = `top:${rowH * r}px;font-size:${fs}px;line-height:${rowH}px`; scene.appendChild(g); return g; };
      const first = mk(), spacing = first.offsetWidth + fs * .2, n = Math.ceil(vw / spacing) + 3, ghosts = [first];
      for (let i = 1; i < n; i++) ghosts.push(mk());
      ghosts.forEach((g, i) => { if ((i + r) % 4 === 0 && r !== 1) g.style.zIndex = 3; });
      rows.push({ ghosts, spacing, n, dir: r % 2 ? -1 : 1, freq: 1 + (r * .37 % 1) * .6 });
    });
    cards.forEach(c => { c.w = c.el.offsetWidth; });
  };
  const eIn = x => x * x * x, eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const tick = () => {
    const total = sec.offsetHeight - vh, target = clamp((64 - sec.getBoundingClientRect().top) / total, 0, 1);
    P += (target - P) * (reduce ? 1 : .12);
    const o = P < .14 ? eIn(P / .14) : P > .86 ? 1 - eIO((P - .86) / .14) : 1;
    const t = (vh - ph) / 2 * (1 - o), s = (vw - pw) / 2 * (1 - o), rad = pw / 2 * (1 - o);
    mask.style.clipPath = `inset(${t}px ${s}px round ${rad}px)`;
    ring.style.cssText = `top:${t - 8}px;left:${s - 8}px;width:${vw - 2 * s + 16}px;height:${vh - 2 * t + 16}px;border-radius:${rad + 8}px;opacity:${o > .97 ? 0 : 1}`;
    hint.style.opacity = P < .02 ? 1 : 0;
    scene.style.transform = `scale(${.75 + .25 * o})`;
    const anim = P * vw * 5;
    scene.style.backgroundPosition = `${-(anim * .05) % 24}px 0`;
    for (const row of rows) {
      const span = row.n * row.spacing;
      row.ghosts.forEach((g, i) => {
        const x = (((i * row.spacing + anim * row.freq * row.dir) % span + span) % span - span / 2) * o, p = clamp(x / (vw / 2), -1.4, 1.4);
        g.style.transform = `translateX(-50%) translateX(${x.toFixed(1)}px) rotate(${(p * 5).toFixed(2)}deg)`;
        g.style.setProperty('--p', p.toFixed(2));
      });
    }
    const c = clamp((P - .14) / .72, 0, 1);
    cards.forEach((card, k) => {
      const q = clamp((c - (k + .5) / N) / (.9 / N), -1, 1), vis = Math.abs(q) < 1 && o > .5;
      card.el.style.visibility = vis ? 'visible' : 'hidden'; if (!vis) return;
      const e = q * q * q * .75 + q * .25, R = vw / 2 + card.w * .7;
      // While a card is in the middle of the screen it sits above every letter, so its text is never covered.
      // Further out (entering or leaving) it drops back between the letter layers for depth.
      card.el.style.zIndex = Math.abs(e * R) < vw * .18 ? 4 : 2;
      card.el.style.transform = `translate(-50%,-50%) translate3d(${(-e * R).toFixed(1)}px,${card.y}vh,0) rotateY(${(e * 42).toFixed(2)}deg) rotateZ(${(e * -5).toFixed(2)}deg)`;
    });
  };
  resizers.push(build); addTicker(sec, tick);
}

/* way */
{
  const sec = $('#way'), svg = $('.way__rays'), path = $('path', svg), face = $('.way__face'), wrap = $('#objs');
  const objs = $$('.obj', wrap).map((el, i) => ({ el, i, state: 'idle' }));
  let W = 0, H = 0, cx = 0, cy = 0, lastThrow = 0, delay = 600; const ptr = { x: 0, y: 0 };
  const size = () => {
    W = sec.clientWidth; H = sec.clientHeight; cx = W / 2; cy = face.offsetTop + face.offsetHeight / 2;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); const n = W > 767 ? 12 : 8; let d = `M0 ${H - .5}H${W}`;
    for (let i = 0; i <= n; i++) d += `M${W / n * i} 0L${cx} ${cy}M${W / n * i} ${H}L${cx} ${cy}`;
    for (let i = 1; i < n; i++) d += `M0 ${H / n * i}L${cx} ${cy}M${W} ${H / n * i}L${cx} ${cy}`;
    path.setAttribute('d', d); wrap.style.perspectiveOrigin = `${cx}px ${cy}px`;
    objs.forEach(o => { o.el.style.left = cx + 'px'; o.el.style.top = cy + 'px'; });
  };
  const launch = (o, pre) => {
    const frames = 430, r = Math.random; o.state = 'fly'; o.s = pre ? 1 : 0; o.vz = 12 + r() * 4;
    o.vx = (.15 + .85 * r()) * W * .55 / frames * (o.i % 2 ? -1 : 1); o.vy = (-.2 + 1.1 * r()) * H * .45 / frames;
    o.vrx = .2 + r() * .6; o.vry = .2 + r() * .6; o.rx = r() * 360; o.ry = r() * 40 - 20;
    const k = pre ? r() * 380 : 0; o.z = -6000 + o.vz * k; o.x = o.vx * k; o.y = o.vy * k;
  };
  const track = e => { const r = sec.getBoundingClientRect(); ptr.x = e.clientX - r.left - cx; ptr.y = e.clientY - r.top - cy; };
  objs.forEach(o => {
    o.el.addEventListener('pointerdown', e => { if (o.state !== 'fly') return; e.preventDefault(); try { o.el.setPointerCapture(e.pointerId); } catch (err) {} o.state = 'drag'; o.el.classList.add('is-drag'); track(e); });
    o.el.addEventListener('pointermove', e => { if (o.state === 'drag') track(e); });
    const up = () => { if (o.state !== 'drag') return; o.state = 'fall'; o.t0 = performance.now(); o.el.classList.remove('is-drag'); };
    o.el.addEventListener('pointerup', up); o.el.addEventListener('pointercancel', up);
  });
  addEventListener('pointermove', e => { const r = face.getBoundingClientRect(), a = Math.atan2(e.clientY - r.top - 45, e.clientX - r.left - 45); face.style.setProperty('--ex', Math.cos(a) * 5 + 'px'); face.style.setProperty('--ey', Math.sin(a) * 5 + 'px'); });
  const tick = (t, dt) => {
    if (reduce) return;
    const now = performance.now();
    if (now - lastThrow > delay) { const idle = objs.filter(o => o.state === 'idle'); if (idle.length && objs.length - idle.length < 5) launch(idle[Math.random() * idle.length | 0]); lastThrow = now; delay = 600 + Math.random() * 700; }
    for (const o of objs) {
      if (o.state === 'idle') continue;
      if (o.state === 'drag') {
        o.vx += (ptr.x - o.x) * .075; o.vy += (ptr.y - o.y) * .075; o.vx *= .9; o.vy *= .9; o.x += o.vx * .5 * dt; o.y += o.vy * .5 * dt; o.z += (0 - o.z) * .15;
        o.ry = o.vx * .5; o.rx = o.vy * -.5; o.s += (1 - o.s) * .5;
      } else if (o.state === 'fall') {
        o.vy += .6 * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.rx += o.vrx * 2 * dt; o.ry += o.vry * 2 * dt;
        if (now - o.t0 > 1100) { o.state = 'idle'; o.el.style.opacity = 0; continue; }
      } else {
        o.s = Math.min(1, o.s + .02 * dt); o.z += o.vz * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.rx += o.vrx * dt; o.ry += o.vry * dt;
        if (o.z > 720) { o.state = 'idle'; o.el.style.opacity = 0; continue; }
      }
      o.el.style.opacity = o.s;
      o.el.style.transform = `translate(-50%,-50%) translate3d(${o.x.toFixed(1)}px,${o.y.toFixed(1)}px,${o.z.toFixed(1)}px) rotateX(${o.rx.toFixed(1)}deg) rotateY(${o.ry.toFixed(1)}deg)`;
    }
  };
  resizers.push(size);
  resizers.push(() => { if (!objs.some(o => o.state !== 'idle')) objs.slice(0, W > 767 ? 4 : 2).forEach(o => launch(o, true)); });
  addTicker(sec, tick);
}

/* contact panel: opens under the header from any [data-contact] button */
{
  const panel = $('#contact-panel'), head = $('.head'), btns = $$('[data-contact]');
  const set = open => { panel.hidden = !open; btns.forEach(b => b.setAttribute('aria-expanded', open)); if (open) panel.style.top = Math.max(0, head.getBoundingClientRect().bottom) + 'px'; };
  btns.forEach(b => b.addEventListener('click', e => { e.stopPropagation(); set(panel.hidden); }));
  document.addEventListener('click', e => { if (!panel.hidden && !panel.contains(e.target)) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { set(false); btns[0].focus(); } });
  addEventListener('scroll', () => { if (!panel.hidden) panel.style.top = Math.max(0, head.getBoundingClientRect().bottom) + 'px'; }, { passive: true });
}

/* share: native sheet when available, otherwise copy the link */
{
  const toast = $('.toast'); let tt = 0;
  const say = msg => { if (!toast) return; toast.textContent = msg; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2200); };
  $$('.share-btn').forEach(btn => btn.addEventListener('click', () => {
    const data = { title: btn.dataset.shareTitle, text: btn.dataset.shareText, url: btn.dataset.shareUrl };
    if (navigator.share) navigator.share(data).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(() => say('Link copied'), () => say(data.url));
    else say(data.url);
  }));
}

const boot = () => { resizers.forEach(f => f()); };
boot();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
requestAnimationFrame(loop);
})();
