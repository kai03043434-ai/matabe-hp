// 旅館またべゑ HP メインJS（仮公開版）
(function () {
  'use strict';

  // ハンバーガーメニュー
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
})();
