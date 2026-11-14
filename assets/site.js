/* REVIVAL MADE mock v0（WANOBA MADE の site.js を流用。フォームはモック＝送らない） */
(() => {
  const q = new URLSearchParams(location.search);
  if (q.has('check')) document.body.classList.add('check');
  if (q.has('static')) document.body.classList.add('static');
  // ?check / ?static をページ間で引き継ぐ
  if (q.has('check') || q.has('static')) {
    const keep = [q.has('check') ? 'check' : '', q.has('static') ? 'static' : ''].filter(Boolean).join('&');
    document.querySelectorAll('a[href$=".html"],a[href*=".html#"]').forEach(a => {
      const [p, h] = a.getAttribute('href').split('#');
      a.setAttribute('href', p + '?' + keep + (h ? '#' + h : ''));
    });
  }
  const menu = document.querySelector('.menu');
  if (menu) menu.addEventListener('click', () => {
    const on = document.body.classList.toggle('menu-open');
    menu.setAttribute('aria-expanded', on ? 'true' : 'false');
  });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  // フォーム（モック：入力の確かめだけ。送信も支払いもしない）
  const LANG = /^ja/i.test(document.documentElement.lang) ? 'ja' : /^zh/i.test(document.documentElement.lang) ? 'zh' : 'en';
  const T = {
    en: { sampleForm: 'Mockup: your request would be sent here. We would reply with the line, the sample fee and the timing; the sample fee is paid by card after that.', contactForm: 'Mockup: your message would be sent here.', fill: 'Please fill in: ', sep: ', ', end: '.', mail: 'Please check your email address.' },
    ja: { sampleForm: 'モックのため送信はしません。実際には、合うライン・サンプル代・期間をお返事し、そのあとサンプル代をカードでお支払いいただきます。', contactForm: 'モックのため送信はしません。', fill: '入力してください：', sep: '、', end: '', mail: 'メールアドレスをご確認ください。' },
    zh: { sampleForm: '这是网站样稿，不会实际发送。正式上线后，我们会回复适合的生产线、样品费和时间安排，之后用银行卡支付样品费。', contactForm: '这是网站样稿，不会实际发送。', fill: '请填写：', sep: '、', end: '', mail: '请检查您的电子邮箱地址。' },
  }[LANG];
  const MOCK = { sampleForm: T.sampleForm, contactForm: T.contactForm };
  Object.keys(MOCK).forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    const msg = form.querySelector('.form__msg');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const miss = [...form.querySelectorAll('[required]')].filter(i => !i.value.trim());
      if (miss.length) {
        msg.classList.add('is-err');
        msg.textContent = T.fill + miss.map(i => (form.querySelector('label[for="' + i.id + '"]') || {}).firstChild.textContent.trim()).join(T.sep) + T.end;
        miss[0].focus(); return;
      }
      const em = form.querySelector('input[type=email]');
      if (em && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(em.value.trim())) { msg.classList.add('is-err'); msg.textContent = T.mail; em.focus(); return; }
      msg.classList.remove('is-err'); msg.textContent = MOCK[id];
    });
  });
})();
