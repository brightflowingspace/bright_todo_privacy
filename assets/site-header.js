/*
  Shared header behavior (system / light / dark theme toggle) for
  brightflowingspace sub-pages. Mirrors the toggle in the main site's nav
  (brightflowingspace/index.html).

  Spec:
    - Three modes: system (default), light, dark.
    - "system" stores nothing: the bfs_theme localStorage key is removed, so the
      inline pre-paint script in <head> falls back to prefers-color-scheme.
    - light / dark are persisted in bfs_theme and win over the OS setting.
    - OS changes are followed only while the visitor is on "system".

  Requires #theme-system / #theme-light / #theme-dark buttons with matching
  data-theme attributes, and the .is-active style in site-header.css.
*/
(function () {
  function init() {
    var $buttons = [
      document.getElementById('theme-system'),
      document.getElementById('theme-light'),
      document.getElementById('theme-dark')
    ];
    if ($buttons.some(function (b) { return !b; })) return;

    function getSavedMode() {
      try {
        var saved = localStorage.getItem('bfs_theme');
        return saved === 'light' || saved === 'dark' ? saved : 'system';
      } catch (e) { return 'system'; }
    }

    function systemPrefersDark() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function updateThemeIcons(mode) {
      $buttons.forEach(function (btn) {
        var active = btn.dataset.theme === mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    function applyTheme() {
      var mode = getSavedMode();
      var dark = mode === 'system' ? systemPrefersDark() : mode === 'dark';
      document.documentElement.classList.toggle('dark', dark);
      updateThemeIcons(mode);
    }
    applyTheme();

    function setMode(mode) {
      try {
        if (mode === 'system') localStorage.removeItem('bfs_theme');
        else localStorage.setItem('bfs_theme', mode);
      } catch (e) {}
      applyTheme();
    }

    $buttons.forEach(function (btn) {
      btn.addEventListener('click', function () { setMode(btn.dataset.theme); });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (getSavedMode() === 'system') applyTheme();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
