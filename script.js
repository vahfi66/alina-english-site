(() => {
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
