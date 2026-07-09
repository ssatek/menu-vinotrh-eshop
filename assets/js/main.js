// Scroll-spy pro quick-nav — zvýrazní aktivní kategorii a scrolluje pill do viewu
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.quicknav a'));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  var quicknav = document.getElementById('quicknav');

  function setActive(id) {
    links.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isActive);
      if (isActive && quicknav) {
        var target = link.offsetLeft - quicknav.clientWidth / 2 + link.clientWidth / 2;
        quicknav.scrollTo({ left: target, behavior: 'smooth' });
      }
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach(function (section) { observer.observe(section); });
})();
