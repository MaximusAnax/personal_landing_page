// Motif: maze. A depth-first maze is generated on load; its solution draws in as the reader scrolls.
// Settings are documented in src/_includes/motifs/maze.njk.
window.Motifs = window.Motifs || {};
window.Motifs.maze = function (ctx) {
  var root = ctx.root, inst = ctx.inst;
  var cv = ctx.article.querySelector("#maze");
  var again = ctx.article.querySelector("#remaze");
  if (!cv) return {};
  var g = cv.getContext("2d"), M = null, cell = 0, p = 0;

  function gen(c, r) {
    var walls = [], seen = new Uint8Array(c * r), dx = [0, 1, 0, -1], dy = [-1, 0, 1, 0], stack = [0], i, d;
    for (i = 0; i < c * r; i++) walls.push([1, 1, 1, 1]); // N, E, S, W
    seen[0] = 1;
    while (stack.length) {
      i = stack[stack.length - 1];
      var x = i % c, y = (i / c) | 0, opts = [];
      for (d = 0; d < 4; d++) {
        var nx = x + dx[d], ny = y + dy[d];
        if (nx >= 0 && ny >= 0 && nx < c && ny < r && !seen[ny * c + nx]) opts.push(d);
      }
      if (!opts.length) { stack.pop(); continue; }
      d = opts[(Math.random() * opts.length) | 0];
      var j = (y + dy[d]) * c + x + dx[d];
      walls[i][d] = 0; walls[j][(d + 2) % 4] = 0; seen[j] = 1; stack.push(j);
    }
    // Shortest path from the first cell to the last, breadth-first.
    var prev = new Int32Array(c * r).fill(-1), q = [0];
    prev[0] = 0;
    for (var k = 0; k < q.length; k++) {
      i = q[k];
      for (d = 0; d < 4; d++) {
        if (walls[i][d]) continue;
        var n = (((i / c) | 0) + dy[d]) * c + (i % c) + dx[d];
        if (prev[n] < 0) { prev[n] = i; q.push(n); }
      }
    }
    var path = [];
    i = c * r - 1;
    while (i !== 0) { path.push(i); i = prev[i]; }
    path.push(0); path.reverse();
    return { walls: walls, path: path, c: c, r: r };
  }

  function draw() {
    if (!M) return;
    var cs = getComputedStyle(root);
    var ink = cs.getPropertyValue("--panel-ink").trim(), acc = cs.getPropertyValue("--panel-accent").trim();
    var c = M.c, r = M.r, s = cell, dpr = cv.width / cv.clientWidth, i;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, c * s, r * s);
    g.strokeStyle = ink; g.lineWidth = 1; g.globalAlpha = 0.55; g.beginPath();
    for (i = 0; i < c * r; i++) {
      var x = (i % c) * s, y = ((i / c) | 0) * s;
      if (M.walls[i][0]) { g.moveTo(x, y + 0.5); g.lineTo(x + s, y + 0.5); }
      if (M.walls[i][3]) { g.moveTo(x + 0.5, y); g.lineTo(x + 0.5, y + s); }
    }
    g.moveTo(c * s - 0.5, 0); g.lineTo(c * s - 0.5, r * s);
    g.moveTo(0, r * s - 0.5); g.lineTo(c * s, r * s - 0.5);
    g.stroke(); g.globalAlpha = 1;

    function pt(n) { return [((n % c) + 0.5) * s, (((n / c) | 0) + 0.5) * s]; }
    var path = M.path, f = p * (path.length - 1), n = Math.floor(f), h = pt(path[0]);
    g.strokeStyle = acc; g.fillStyle = acc; g.lineWidth = Math.max(2, s * 0.22); g.lineJoin = g.lineCap = "round";
    g.beginPath(); g.moveTo(h[0], h[1]);
    for (i = 1; i <= n; i++) { h = pt(path[i]); g.lineTo(h[0], h[1]); }
    if (n < path.length - 1) {
      var a = pt(path[n]), b = pt(path[n + 1]);
      h = [a[0] + (b[0] - a[0]) * (f - n), a[1] + (b[1] - a[1]) * (f - n)];
      g.lineTo(h[0], h[1]);
    }
    g.stroke();
    g.beginPath(); g.arc(h[0], h[1], s * 0.28, 0, 7); g.fill();
    var e = pt(path[path.length - 1]);
    g.lineWidth = 1.5; g.beginPath(); g.arc(e[0], e[1], s * 0.3, 0, 7); g.stroke();
  }

  function size(fresh) {
    var W = cv.clientWidth;
    if (!W) return;
    var c = W > 560 ? 30 : 17, r = 9;
    cell = W / c;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.style.height = cell * r + "px";
    cv.width = W * dpr; cv.height = cell * r * dpr;
    if (fresh || !M || M.c !== c) M = gen(c, r);
    draw();
  }

  if (again) again.addEventListener("click", function () { size(true); });

  return {
    update: function (progress) {
      p = progress;
      if (inst) inst.innerHTML = "<span>Maze</span><span class=\"" + (p >= 1 ? "lead" : "") + "\"><b>" + (p >= 1 ? "Solved" : Math.round(p * 100) + "%") + "</b></span>";
      draw();
    },
    resize: function () { size(false); },
    redraw: draw,
  };
};
