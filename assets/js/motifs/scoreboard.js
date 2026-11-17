// Motif: scoreboard. Reading progress runs the game clock; the live score sits in the top bar.
// Scores move in a straight line between each side's `from` and `to`, so the only real numbers
// are the ones the post states. Settings are documented in src/_includes/motifs/scoreboard.njk.
window.Motifs = window.Motifs || {};
window.Motifs.scoreboard = function (ctx) {
  var c = ctx.config, inst = ctx.inst;
  var total = (c.minutes || 24) * 60;
  var periods = c.periods && c.periods.length ? c.periods : ["Q3", "Q4"];
  var per = (c.periodMinutes || (c.minutes || 24) / periods.length) * 60;
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  return {
    update: function (p) {
      if (!inst) return;
      var a = Math.round(c.a.from + (c.a.to - c.a.from) * p);
      var b = Math.round(c.b.from + (c.b.to - c.b.from) * p);
      var clock = c.start || "START";
      if (p >= 1) clock = c.end || "FINAL";
      else if (p > 0) {
        var left = Math.ceil(total * (1 - p));           // seconds left in the game
        var idx = Math.min(periods.length - 1, Math.floor((total - left) / per));
        var inPeriod = left - (periods.length - 1 - idx) * per;
        clock = periods[idx] + " " + pad(Math.floor(inPeriod / 60)) + ":" + pad(inPeriod % 60);
      }
      inst.innerHTML =
        '<span class="' + (a > b ? "lead" : "") + '">' + c.a.abbr + " <b>" + a + "</b></span>" +
        '<span class="' + (b > a ? "lead" : "") + '">' + c.b.abbr + " <b>" + b + "</b></span>" +
        "<span>" + clock + "</span>";
    },
  };
};
