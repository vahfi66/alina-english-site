(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Text is visible before JavaScript and stays available if animation is unsupported.
  if ('IntersectionObserver' in window && !reducedMotion.matches && Element.prototype.animate) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.animate([
          { opacity: 0, transform: 'translateY(22px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 650, easing: 'cubic-bezier(.23,1,.32,1)' });
        observer.unobserve(entry.target);
      }
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        observer.disconnect();
        document.getAnimations().forEach(animation => animation.finish());
      }
    });
  }

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
