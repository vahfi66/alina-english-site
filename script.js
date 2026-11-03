(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sections = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !motionPreference.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px 200px 0px', threshold: 0 });
    for (const section of sections) {
      if (section.getBoundingClientRect().top > window.innerHeight + 240) {
        section.classList.add('reveal-pending');
        observer.observe(section);
      }
    }
    motionPreference.addEventListener?.('change', event => {
      if (event.matches) { observer.disconnect(); sections.forEach(section => section.classList.remove('reveal-pending')); }
    });
  }

  // Give touch users a brief, visible acknowledgement before the anchor scrolls.
  const introLink = document.querySelector('.hero .button');
  let touchPressed = false;
  const beginTouch = () => { touchPressed = true; introLink.classList.add('is-touch-pressed'); };
  const cancelTouch = () => { touchPressed = false; introLink.classList.remove('is-touch-pressed'); };
  if (window.PointerEvent) {
    introLink.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') beginTouch(); });
    introLink.addEventListener('pointercancel', cancelTouch);
    introLink.addEventListener('pointerup', event => { if (event.pointerType === 'touch') window.setTimeout(() => { if (touchPressed) cancelTouch(); }, 800); });
  } else {
    introLink.addEventListener('touchstart', beginTouch, { passive: true });
    introLink.addEventListener('touchcancel', cancelTouch, { passive: true });
    introLink.addEventListener('touchend', () => { window.setTimeout(() => { if (touchPressed) cancelTouch(); }, 800); }, { passive: true });
  }
  introLink.addEventListener('click', event => {
    if (!touchPressed || event.detail === 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const destination = introLink.hash;
    window.setTimeout(() => {
      cancelTouch();
      if (window.location.hash === destination) document.getElementById(destination.slice(1)).scrollIntoView();
      else window.location.hash = destination;
    }, motionPreference.matches ? 0 : 160);
  });
  window.addEventListener('pageshow', cancelTouch);

  const tabList = document.querySelector('.lesson-tabs');
  const tabs = [...tabList.querySelectorAll('button')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  tabList.setAttribute('role', 'tablist');
  document.querySelector('.lesson-demo').classList.add('js-tabs');
  function selectTab(index, focus = false) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].tabIndex = 0;
      panels[i].hidden = !selected;
    });
    if (focus) tabs[index].focus();
  }
  selectTab(0);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(next, true); }
    });
  });
  document.querySelectorAll('.translate').forEach(button => {
    const translation = document.getElementById(button.getAttribute('aria-controls'));
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      translation.hidden = !expanded;
      button.firstChild.textContent = expanded ? 'Скрыть перевод ' : 'Перевести ';
    });
  });
})();
