(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(id, focus) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById('panel-' + t.dataset.tab).hidden = !on;
      if (on && focus) t.focus();
    });
  }
  if (tabs.length) {
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t.dataset.tab); history.replaceState(null, '', '#' + t.dataset.tab); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length].dataset.tab, true); }
      });
    });
    var h = location.hash.slice(1);
    select(tabs.some(function (t) { return t.dataset.tab === h; }) ? h : tabs[0].dataset.tab);
  }
  document.querySelectorAll('.copy[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var src = document.getElementById(b.dataset.copy);
      var text = src.dataset.raw || src.innerText.replace(/^\$ /gm, '');
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () {
        var t = b.querySelector('.t'); var old = t.textContent;
        b.classList.add('done'); t.textContent = 'Copied';
        setTimeout(function () { b.classList.remove('done'); t.textContent = old; }, 1400);
      }).catch(function () {});
    });
  });
})();
