// 旅館またべゑ HP メインJS
(function () {
  'use strict';

  // ============================================
  // ハンバーガーメニュー
  // ============================================
  const btn = document.getElementById('hamburgerBtn');
  const nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
      }
    });
  }

  // フッター 年自動更新（必要であれば）
  const yearEl = document.querySelector('[data-current-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================================
  // スマホ専用：句読点（、。）の後に自動改行
  // PC（>768px）では何もしない
  // ============================================
  function wrapJapanesePunctuation() {
    if (window.innerWidth > 768) return;

    // 改行を入れたい要素（テキストが流れて読みにくくなるところ）
    const selectors = [
      '.article-section p',
      '.article-section li',
      '.section-lead',
      '.hero-sub',
      '.page-hero-sub',
      '.plan-desc',
      '.spot-desc',
      '.hub-card-content p',
      '.sight-card-body p',
      '.cta-block p',
      '.contact-lead',
      '.about-list li',
      '.feature-list li',
      '.calendar-table td',
      '.spot-meta dd',
      '.access-info p'
    ];

    document.querySelectorAll(selectors.join(',')).forEach(el => {
      if (el.dataset.brWrapped === '1') return;
      el.dataset.brWrapped = '1';

      // すでに手動でbrが入っている要素はスキップ（手動レイアウトを優先）
      if (el.querySelector('br')) return;

      // 子要素のテキストノードのみ走査して、句読点後にbrを差し込む
      const textNodes = [];
      const walker = document.createTreeWalker(
        el,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {
            // br/空白のみのノードはスキップ
            if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
            // 親が <a class="btn"> や <code> はスキップ
            const parent = node.parentNode;
            if (parent.closest('.btn') || parent.tagName === 'CODE') {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      let node;
      while ((node = walker.nextNode())) textNodes.push(node);

      textNodes.forEach(textNode => {
        const text = textNode.textContent;
        if (!/[、。（]/.test(text)) return;

        // 「、」「。」の後 と「（」の前 で分割
        // (?<=、|。) で 、。 の後を分割位置に
        // (?=（) で 「（」 の前を分割位置に
        const parts = text.split(/(?<=、|。)|(?=（)/);
        const frag = document.createDocumentFragment();

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (!part) continue;
          frag.appendChild(document.createTextNode(part));
          // 最後の部分でなければ <br> を挿入
          if (i < parts.length - 1) {
            const rest = parts.slice(i + 1).join('').trim();
            if (rest) {
              frag.appendChild(document.createElement('br'));
            }
          }
        }

        textNode.parentNode.replaceChild(frag, textNode);
      });
    });
  }

  // 初回実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wrapJapanesePunctuation);
  } else {
    wrapJapanesePunctuation();
  }
})();
