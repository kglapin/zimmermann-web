(() => {
  const word = document.querySelector('.footer__word');
  if (!word) return;

  word.innerHTML = `
    <svg class="footer-deboss" viewBox="0 0 1400 210" role="img" aria-label="Zimmermann">
      <defs>
        <filter id="zimmermann-deboss" x="-10%" y="-25%" width="120%" height="150%" color-interpolation-filters="sRGB">
          <feComponentTransfer in="SourceAlpha" result="inverse-alpha">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>

          <feGaussianBlur in="inverse-alpha" stdDeviation="5.2" result="dark-blur" />
          <feOffset in="dark-blur" dx="-5" dy="-5" result="dark-offset" />
          <feComposite in="dark-offset" in2="SourceAlpha" operator="in" result="dark-inner-mask" />
          <feFlood flood-color="#000000" flood-opacity="0.92" result="dark-color" />
          <feComposite in="dark-color" in2="dark-inner-mask" operator="in" result="dark-inner" />

          <feGaussianBlur in="inverse-alpha" stdDeviation="4.2" result="light-blur" />
          <feOffset in="light-blur" dx="4" dy="4" result="light-offset" />
          <feComposite in="light-offset" in2="SourceAlpha" operator="in" result="light-inner-mask" />
          <feFlood flood-color="#c8d5ef" flood-opacity="0.11" result="light-color" />
          <feComposite in="light-color" in2="light-inner-mask" operator="in" result="light-inner" />

          <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="soft-edge" />
          <feComposite in="soft-edge" in2="SourceAlpha" operator="out" result="edge-mask" />
          <feFlood flood-color="#000611" flood-opacity="0.55" result="edge-color" />
          <feComposite in="edge-color" in2="edge-mask" operator="in" result="edge-shadow" />

          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="dark-inner" />
            <feMergeNode in="light-inner" />
            <feMergeNode in="edge-shadow" />
          </feMerge>
        </filter>
      </defs>

      <text
        x="700"
        y="166"
        text-anchor="middle"
        textLength="1320"
        lengthAdjust="spacingAndGlyphs"
        class="footer-deboss__text"
        filter="url(#zimmermann-deboss)"
      >ZIMMERMANN</text>
    </svg>
  `;
})();
