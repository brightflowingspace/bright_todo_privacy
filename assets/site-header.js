/*
  Shared header behavior (light/dark toggle icons) for brightflowingspace sub-pages.
  Requires #theme-light / #theme-dark buttons matching the markup in
  brightflowingspace/index.html's nav, and the bfs_theme localStorage key set by
  the inline pre-paint script in <head>.
*/
(function () {
  function init() {
    var $themeLight = document.getElementById('theme-light');
    var $themeDark = document.getElementById('theme-dark');
    if (!$themeLight || !$themeDark) return;

    function isDark() { return document.documentElement.classList.contains('dark'); }

    function updateThemeIcons() {
      var dark = isDark();
      $themeLight.style.color = !dark ? 'var(--accent)' : '';
      $themeDark.style.color = dark ? 'var(--accent)' : '';
    }
    updateThemeIcons();

    function setTheme(dark, remember) {
      document.documentElement.classList.toggle('dark', dark);
      if (remember) {
        try { localStorage.setItem('bfs_theme', dark ? 'dark' : 'light'); } catch (e) {}
      }
      updateThemeIcons();
    }

    $themeLight.addEventListener('click', function () { setTheme(false, true); });
    $themeDark.addEventListener('click', function () { setTheme(true, true); });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      var saved = null;
      try { saved = localStorage.getItem('bfs_theme'); } catch (err) {}
      if (!saved) setTheme(e.matches, false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
