(() => {
  'use strict';

  const dataNode = document.querySelector('[data-services]');
  const imageWrap = document.querySelector('[data-service-image-wrap]');
  const tabs = [...document.querySelectorAll('[data-service-tab]')];

  if (!dataNode || !imageWrap || !tabs.length) return;

  let services = [];
  try {
    services = JSON.parse(dataNode.textContent || '[]');
  } catch {
    return;
  }

  const syncActiveService = () => {
    const activeTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');
    if (!activeTab) return;

    const index = Number(activeTab.dataset.serviceIndex);
    const service = services[index];
    if (!service?.id) return;

    imageWrap.dataset.serviceId = service.id;
  };

  const observer = new MutationObserver(syncActiveService);
  tabs.forEach((tab) => observer.observe(tab, { attributes: true, attributeFilter: ['aria-selected'] }));

  syncActiveService();
})();
