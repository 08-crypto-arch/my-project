// ==========================================================
// Pachi's Room Portfolio - script.js
// ==========================================================

// ハンバーガーメニューの開閉
const navToggle = document.getElementById('navToggle');
const siteHeader = document.querySelector('.site-header');

if (navToggle && siteHeader) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav a').forEach((link) => {
    link.addEventListener('click', () => {
      siteHeader.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// スクロールで各セクションをふわっと表示
const revealTargets = document.querySelectorAll(
  '.about-grid, .works-grid .work-card, .skills-grid .skill-group, .contact-grid'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// 作品カードをクリックしたら、別タブで開く前に詳細ポップアップを表示する
const workModal = document.getElementById('workModal');

if (workModal && typeof workModal.showModal === 'function') {
  const modalThumb = workModal.querySelector('.work-thumb');
  const modalImage = modalThumb.querySelector('img');
  const modalTag = document.getElementById('workModalTag');
  const modalTitle = document.getElementById('workModalTitle');
  const modalText = document.getElementById('workModalText');
  const modalStack = document.getElementById('workModalStack');
  const modalLink = document.getElementById('workModalLink');

  document.querySelectorAll('.work-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      event.preventDefault();

      const thumb = card.querySelector('.work-thumb');
      // サムネの背景色クラス（work-thumb-1 など）も引き継ぐ
      modalThumb.className = thumb.className;
      modalImage.src = thumb.querySelector('img').src;
      modalTag.textContent = card.querySelector('.work-tag').textContent;
      modalTitle.textContent = card.querySelector('h3').textContent;
      modalText.textContent = card.dataset.detail || card.querySelector('.work-body p').textContent;
      modalStack.replaceChildren(
        ...[...card.querySelectorAll('.work-stack span')].map((span) => span.cloneNode(true))
      );
      modalLink.href = card.href;

      workModal.showModal();
    });
  });

  workModal.querySelector('.work-modal-close').addEventListener('click', () => workModal.close());

  // ポップアップの外側（暗い背景）をクリックしても閉じる
  workModal.addEventListener('click', (event) => {
    if (event.target === workModal) workModal.close();
  });
}

// 部屋の時計をクリックすると針が動き出し、もう一度クリックすると最初のコマで止まった状態に戻る
const MOVING_CLOCK_SRC = 'assets/img/clock-anim.gif';
const roomClock = document.querySelector('.item-clock');

if (roomClock) {
  const stillClockSrc = roomClock.getAttribute('src');
  let isClockMoving = false;

  // 初めてクリックしたときもすぐ動くよう、先に読み込んでおく
  new Image().src = MOVING_CLOCK_SRC;

  roomClock.addEventListener('click', () => {
    isClockMoving = !isClockMoving;
    roomClock.src = isClockMoving ? MOVING_CLOCK_SRC : stillClockSrc;
  });
}

// ソファをクリックすると、後ろに隠れていた犬が上から頭だけをのぞかせる（もう一度クリックすると引っ込む）
const roomSofa = document.querySelector('.item-sofa');
const roomDog = document.querySelector('.room-dog');
const roomFrame = document.querySelector('.room-frame');

if (roomSofa && roomDog && roomFrame) {
  const toggleRoomDog = () => roomFrame.classList.toggle('is-dog-out');
  roomSofa.addEventListener('click', toggleRoomDog);
  roomDog.addEventListener('click', toggleRoomDog);
}

// お問い合わせ欄の犬のアニメーション：画面に入ったら1回だけ再生する（繰り返さない）
const DOG_VISIBLE_RATIO = 0.5;
const contactDog = document.querySelector('.contact-dog');

if (contactDog) {
  const playDog = () => {
    contactDog.src = contactDog.dataset.src;
  };

  if ('IntersectionObserver' in window) {
    const dogObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          playDog();
          dogObserver.disconnect();
        }
      },
      { threshold: DOG_VISIBLE_RATIO }
    );
    dogObserver.observe(contactDog);
  } else {
    playDog();
  }
}
