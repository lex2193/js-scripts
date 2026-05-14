// img-queue by lex2193
// Sequentially load images by simply using the [queue-src] attribute instead of [src]

(() => {
  let current = null,
    items = [];
  const next = () => {
    if (items.length === 0) return;
    current = items.shift();
    current.onload = () => {
      current = null;
      next();
    };
    current.onerror = () => {
      current = null;
      next();
    };
    const url = current.getAttribute('queue-src');
    current.removeAttribute('queue-src');
    current.setAttribute('src', url);
  };
  new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList)
      if (mutation.type === 'childList')
        for (const node of mutation.addedNodes)
          if (node.tagName === 'IMG' && node.hasAttribute('queue-src')) {
            items.push(node);
            if (!current) next();
          }
  }).observe(document.body, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ['queue-src']
  });
})();
