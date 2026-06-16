/* =========================================================
   GID / RideLife 手機 prototype — 共用外殼腳本
   用法：頁面 body 內放
     <div class="screen" data-nav="garage">
       <header class="page-head"> ...返回 + 標題... </header>
       <main class="content"> ...可滾動內容... </main>
     </div>
   引入 <script src="gid-shell.js"></script>，本檔會自動：
     - 套上 iPhone 機身 / 狀態列 / 上方 profile+bell bar / 底部導覽
     - 依 data-nav 設定目前頁籤（home / events / discovery / garage）
     - fit-to-screen：整支手機等比縮放塞進視窗（手機高度固定、內容仍可滾動）
     - 綁定 radio 點選互動
   可關閉縮放：body 加 data-fit="off"
   ========================================================= */
(function () {
  // ---- 共用片段 -------------------------------------------------
  var STATUSBAR =
    '<div class="statusbar">' +
      '<span class="time">9:41</span>' +
      '<span class="indicators">' +
        '<svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="1" fill="#000"/><rect x="5" y="5" width="3" height="7" rx="1" fill="#000"/><rect x="10" y="2.5" width="3" height="9.5" rx="1" fill="#000"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#000"/></svg>' +
        '<svg width="17" height="12" viewBox="0 0 17 12" fill="none"><path d="M8.5 2C5.4 2 2.6 3.2.6 5.2l1.4 1.5C3.7 5 6 4 8.5 4S13.3 5 15 6.7l1.4-1.5C14.4 3.2 11.6 2 8.5 2Z" fill="#000"/><path d="M8.5 6c-1.7 0-3.3.7-4.5 1.8l1.5 1.5C6.2 8.5 7.3 8 8.5 8s2.3.5 3 1.3l1.5-1.5C11.8 6.7 10.2 6 8.5 6Z" fill="#000"/><circle cx="8.5" cy="11" r="1.3" fill="#000"/></svg>' +
        '<svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="1" y="1" width="21" height="11" rx="3" stroke="#000" stroke-opacity=".4" stroke-width="1"/><rect x="2.5" y="2.5" width="16" height="8" rx="1.5" fill="#000"/><rect x="23.5" y="4.5" width="1.5" height="4" rx=".75" fill="#000" fill-opacity=".4"/></svg>' +
      '</span>' +
    '</div>';

  var APPBAR =
    '<div class="app-header">' +
      // 左：Profile（使用者提供的正式 SVG）
      '<button class="icon-btn" aria-label="profile"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5ZM7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8Z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.49092 14H16.5094L21.9639 21.5H7.49092L10.9908 19.5H18.0364L15.4909 16H8.50937L4.5 21.5H2L7.49092 14Z" fill="#000"/></svg></button>' +
      // 右：Notification（使用者提供的正式 SVG）
      '<button class="icon-btn" aria-label="notifications"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19.2 15.8571H21V17.5714H3V15.8571H4.8V9.85714C4.8 8.03852 5.55857 6.29437 6.90883 5.00841C8.25909 3.72245 10.0904 3 12 3C13.9096 3 15.7409 3.72245 17.0912 5.00841C18.4414 6.29437 19.2 8.03852 19.2 9.85714V15.8571ZM17.4 15.8571V9.85714C17.4 8.49317 16.8311 7.18507 15.8184 6.22059C14.8057 5.25612 13.4322 4.71429 12 4.71429C10.5678 4.71429 9.19432 5.25612 8.18162 6.22059C7.16893 7.18507 6.6 8.49317 6.6 9.85714V15.8571H17.4ZM9.3 19.2857H14.7V21H9.3V19.2857Z" fill="#000"/></svg></button>' +
    '</div>';

  var NAV = [
    { key: 'home',      label: 'Home',      svg: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M7 25L25 25L25 12.7979L24.5547 12.501L16.5547 7.16797L16 6.79785L15.4453 7.16797L7.44531 12.501L7 12.7979L7 25Z" stroke="white" stroke-width="2"/><path d="M13 24V18H19V24" stroke="white" stroke-width="2"/></svg>' },
    { key: 'events',    label: 'Events',    svg: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 8H26V26H6V8ZM8 10V24H24V10H8Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 9V6H10.5V9H8.5Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M21.5 9V6H23.5V9H21.5Z" fill="white"/><path d="M19.2602 20.748C18.7001 20.748 18.2168 20.6481 17.8101 20.4483C17.4035 20.2485 17.0896 19.9685 16.8684 19.6082C16.6508 19.2479 16.542 18.8252 16.542 18.3401C16.542 17.9156 16.6508 17.5482 16.8684 17.2378C17.0896 16.9275 17.3946 16.6867 17.7834 16.5155C17.6336 16.4406 17.4837 16.3335 17.3339 16.1944C17.1877 16.0553 17.0664 15.8859 16.9701 15.6861C16.8773 15.4828 16.8309 15.2473 16.8309 14.9798C16.8309 14.591 16.9272 14.2485 17.1199 13.9524C17.3125 13.6528 17.589 13.4191 17.9493 13.2515C18.3131 13.0838 18.7501 13 19.2602 13C19.7703 13 20.2073 13.0838 20.5711 13.2515C20.9386 13.4191 21.2186 13.6528 21.4112 13.9524C21.6038 14.2485 21.7002 14.591 21.7002 14.9798C21.7002 15.2366 21.6502 15.4667 21.5503 15.67C21.454 15.8698 21.331 16.041 21.1811 16.1837C21.0349 16.3228 20.8868 16.4281 20.737 16.4994C21.1116 16.6635 21.4148 16.9079 21.6467 17.2325C21.8821 17.5535 21.9998 17.9227 21.9998 18.3401C21.9998 18.8252 21.8892 19.2479 21.6681 19.6082C21.4505 19.9685 21.1365 20.2485 20.7263 20.4483C20.3161 20.6481 19.8274 20.748 19.2602 20.748ZM19.2602 19.3835C19.4956 19.3835 19.7043 19.3389 19.8862 19.2497C20.0682 19.157 20.2109 19.0303 20.3143 18.8698C20.4178 18.7093 20.4695 18.5256 20.4695 18.3187C20.4695 18.1047 20.4178 17.9174 20.3143 17.7569C20.2109 17.5963 20.0682 17.4733 19.8862 17.3877C19.7043 17.302 19.4956 17.2592 19.2602 17.2592C19.0176 17.2592 18.8054 17.302 18.6235 17.3877C18.4451 17.4733 18.306 17.5963 18.2061 17.7569C18.1098 17.9174 18.0616 18.1047 18.0616 18.3187C18.0616 18.5256 18.1098 18.7093 18.2061 18.8698C18.306 19.0303 18.4469 19.157 18.6288 19.2497C18.8107 19.3389 19.0212 19.3835 19.2602 19.3835ZM19.2602 15.8841C19.5384 15.8841 19.7614 15.811 19.929 15.6647C20.1003 15.5149 20.1859 15.3258 20.1859 15.0975C20.1859 14.8763 20.1003 14.6926 19.929 14.5464C19.7578 14.4001 19.5349 14.327 19.2602 14.327C18.9713 14.327 18.7465 14.4001 18.586 14.5464C18.4255 14.6926 18.3452 14.8763 18.3452 15.0975C18.3452 15.3258 18.4237 15.5149 18.5806 15.6647C18.7412 15.811 18.9677 15.8841 19.2602 15.8841Z" fill="white"/><path d="M10 20.6195C10 20.0524 10.0642 19.5547 10.1926 19.1267C10.321 18.695 10.4994 18.3151 10.7277 17.9869C10.9596 17.6588 11.2289 17.3716 11.5357 17.1255C11.846 16.8758 12.1778 16.6528 12.5309 16.4566C12.7093 16.3532 12.8787 16.2444 13.0393 16.1302C13.1998 16.0161 13.33 15.8876 13.4299 15.745C13.5333 15.6023 13.585 15.4382 13.585 15.2527C13.585 14.9994 13.503 14.8032 13.3389 14.6641C13.1748 14.5214 12.959 14.4501 12.6915 14.4501C12.4096 14.4501 12.1689 14.5214 11.9691 14.6641C11.7693 14.8032 11.607 14.9994 11.4822 15.2527L10.1177 14.6266C10.3353 14.1237 10.676 13.7277 11.1397 13.4388C11.6035 13.1463 12.1118 13 12.6647 13C13.1784 13 13.6171 13.0999 13.981 13.2996C14.3484 13.4958 14.6267 13.7616 14.8157 14.0969C15.0083 14.4287 15.1047 14.7979 15.1047 15.2045C15.1047 15.6362 15.0315 15.9982 14.8853 16.2907C14.7426 16.5797 14.5464 16.8276 14.2967 17.0345C14.047 17.2414 13.767 17.4376 13.4566 17.6231C13.1249 17.8193 12.8502 17.9941 12.6326 18.1475C12.415 18.3009 12.2384 18.456 12.1029 18.613C11.9709 18.7664 11.8656 18.943 11.7872 19.1427H15.1689V20.6195H10Z" fill="white"/></svg>' },
    { key: 'discovery', label: 'Discovery', svg: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M11.05 20.95L18.75 18.75L20.95 11.05L13.25 13.25L11.05 20.95ZM16 17.65C15.5417 17.65 15.1521 17.4896 14.8313 17.1687C14.5104 16.8479 14.35 16.4583 14.35 16C14.35 15.5417 14.5104 15.1521 14.8313 14.8313C15.1521 14.5104 15.5417 14.35 16 14.35C16.4583 14.35 16.8479 14.5104 17.1687 14.8313C17.4896 15.1521 17.65 15.5417 17.65 16C17.65 16.4583 17.4896 16.8479 17.1687 17.1687C16.8479 17.4896 16.4583 17.65 16 17.65ZM16 27C14.4783 27 13.0483 26.7113 11.71 26.1337C10.3717 25.5562 9.2075 24.7725 8.2175 23.7825C7.2275 22.7925 6.44375 21.6283 5.86625 20.29C5.28875 18.9517 5 17.5217 5 16C5 14.4783 5.28875 13.0483 5.86625 11.71C6.44375 10.3717 7.2275 9.2075 8.2175 8.2175C9.2075 7.2275 10.3717 6.44375 11.71 5.86625C13.0483 5.28875 14.4783 5 16 5C17.5217 5 18.9517 5.28875 20.29 5.86625C21.6283 6.44375 22.7925 7.2275 23.7825 8.2175C24.7725 9.2075 25.5562 10.3717 26.1337 11.71C26.7113 13.0483 27 14.4783 27 16C27 17.5217 26.7113 18.9517 26.1337 20.29C25.5562 21.6283 24.7725 22.7925 23.7825 23.7825C22.7925 24.7725 21.6283 25.5562 20.29 26.1337C18.9517 26.7113 17.5217 27 16 27ZM16 24.8C18.4383 24.8 20.5146 23.9429 22.2288 22.2288C23.9429 20.5146 24.8 18.4383 24.8 16C24.8 13.5617 23.9429 11.4854 22.2288 9.77125C20.5146 8.05708 18.4383 7.2 16 7.2C13.5617 7.2 11.4854 8.05708 9.77125 9.77125C8.05708 11.4854 7.2 13.5617 7.2 16C7.2 18.4383 8.05708 20.5146 9.77125 22.2288C11.4854 23.9429 13.5617 24.8 16 24.8Z" fill="white"/></svg>' },
    { key: 'garage',    label: 'Garage',    svg: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 24C26.2091 24 28 22.2091 28 20C28 17.7909 26.2091 16 24 16C21.7909 16 20 17.7909 20 20C20 22.2091 21.7909 24 24 24ZM24 26C27.3137 26 30 23.3137 30 20C30 16.6863 27.3137 14 24 14C20.6863 14 18 16.6863 18 20C18 23.3137 20.6863 26 24 26Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8 24C10.2091 24 12 22.2091 12 20C12 17.7909 10.2091 16 8 16C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24ZM8 26C11.3137 26 14 23.3137 14 20C14 16.6863 11.3137 14 8 14C4.68629 14 2 16.6863 2 20C2 23.3137 4.68629 26 8 26Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.63294 6L13.5536 6L13.5519 8H9.6318H6.20069L9.63179 6.00406L9.63294 6ZM17.3387 6.00406L23.8254 6.00406V8H20.5106L21.2768 10.1146L25.2024 19.9321L23.4286 20.9144L20.2351 12.9278L16.0312 21H7.99997V18.6929H15L18.5 12H12L9.99997 15H7.49997L10.5 10H19L17.3387 6.00406Z" fill="white"/></svg>' }
  ];

  function navHtml(active) {
    return '<nav class="nav">' + NAV.map(function (n) {
      return '<button class="nav-item' + (n.key === active ? ' active' : '') + '" data-nav="' + n.key + '">' + n.svg + '<span>' + n.label + '</span></button>';
    }).join('') + '</nav>';
  }

  // ---- 組裝外殼 -------------------------------------------------
  function buildShell() {
    var screen = document.querySelector('.screen');
    if (!screen || screen.dataset.shelled) return;

    var active = screen.getAttribute('data-nav') || document.body.getAttribute('data-nav') || '';

    var stage  = document.createElement('div'); stage.className = 'stage';
    var device = document.createElement('div'); device.className = 'device';
    device.innerHTML = '<span class="btn-power"></span>';
    var phone  = document.createElement('div'); phone.className = 'phone';
    phone.innerHTML = STATUSBAR + APPBAR;

    // 把畫面提供的 .page-head / .content 直接移進 phone（保留 flex 佈局）
    while (screen.firstElementChild) phone.appendChild(screen.firstElementChild);

    // 底部導覽已移除（不再注入 nav）
    phone.insertAdjacentHTML('beforeend', '<div class="home-indicator"><i></i></div>');
    device.appendChild(phone);
    buildKeyboard(phone);   // iOS 鍵盤（聚焦 input 時彈出）
    buildPicker(phone);     // 照片選擇器（點 .upload[data-pick] 時彈出）
    buildSignaturePads(phone); // 簽名手寫板
    buildLightbox(phone);      // 圖片放大檢視
    if (screen.hasAttribute('data-skeleton')) buildSkeleton(phone);  // 進頁骨架動畫（僅特定頁）
    // Dynamic Island 放在最後繪製，確保永遠疊在螢幕最上層（不依賴 z-index）
    device.insertAdjacentHTML('beforeend', '<span class="island"></span>');
    stage.appendChild(device);

    stage.dataset.shelled = '1';
    screen.replaceWith(stage);
    return stage;
  }

  // ---- iOS 鍵盤 -------------------------------------------------
  var KB = {
    letters: [
      ['q','w','e','r','t','y','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l'],
      [['shift','⇧'],'z','x','c','v','b','n','m',['delete','⌫']],
      [['123','123'],['space','space'],['return','Go']]
    ],
    numbers: [
      ['1','2','3','4','5','6','7','8','9','0'],
      ['-','/',':',';','(',')','$','&','@','"'],
      [['symbols','#+='],'.',',','?','!','\'',['delete','⌫']],
      [['ABC','ABC'],['space','space'],['return','Go']]
    ],
    symbols: [
      ['[',']','{','}','#','%','^','*','+','='],
      ['_','\\','|','~','<','>','€','£','¥','•'],
      [['numbers','123'],'.',',','?','!','\'',['delete','⌫']],
      [['ABC','ABC'],['space','space'],['return','Go']]
    ],
    // 純數字鍵盤（序號用）— 無法切換到英文/符號
    numpad: [
      ['1','2','3'],
      ['4','5','6'],
      ['7','8','9'],
      [['return','Go'],'0',['delete','⌫']]
    ]
  };
  var FN = { shift:1, delete:1, '123':1, ABC:1, symbols:1, numbers:1, return:1 };
  var kbEl, kbKeys, activeInput = null, layout = 'letters', shift = false;
  var kbSuppressUntil = 0;   // 此時間前抑制鍵盤彈出（避免選照片後的非同步重新聚焦）
  function suppressKb(ms) { kbSuppressUntil = Date.now() + (ms || 600); }

  function kbRender() {
    var rows = KB[layout], html = '';
    for (var r = 0; r < rows.length; r++) {
      html += '<div class="kb-row' + (layout === 'letters' && r === 1 ? ' r2' : '') + '">';
      for (var c = 0; c < rows[r].length; c++) {
        var cell = rows[r][c], act, label;
        if (Array.isArray(cell)) { act = cell[0]; label = cell[1]; }
        else { act = cell; label = (layout === 'letters' && shift) ? cell.toUpperCase() : cell; }
        var cls = 'kb-key';
        if (FN[act]) cls += ' sp';
        if (act === 'space') cls += ' space';
        if (act === '123' || act === 'ABC' || act === 'symbols' || act === 'numbers' || act === 'return') cls += ' fn';
        if (act === 'shift') { cls += ' fn shift' + (shift ? ' on' : ''); }
        if (act === 'delete') cls += ' fn';
        html += '<div class="' + cls + '" data-k="' + act.replace(/"/g, '&quot;') + '">' + (label === '"' ? '&quot;' : label) + '</div>';
      }
      html += '</div>';
    }
    kbKeys.className = 'kb-keys' + (layout === 'numpad' ? ' np' : '');
    kbKeys.innerHTML = html;
  }

  // 序號格式化：只留數字、最多 12 位、每 4 位一組以空格分隔
  function formatSerial(el) {
    var digits = el.value.replace(/\D/g, '').slice(0, 12);
    var groups = digits.match(/.{1,4}/g);
    el.value = groups ? groups.join(' ') : '';
    var len = el.value.length;
    try { el.setSelectionRange(len, len); } catch (_) {}
  }
  function isNumericInput(el) {
    return el && el.getAttribute && (el.getAttribute('data-kb') === 'number' || el.getAttribute('data-format') === 'serial');
  }
  function helperOf(el) {
    var card = el && el.closest('.card');
    return card && card.querySelector('.helper');
  }
  // 驗證序號並前往 data-go；不合格則把 helper 變紅、不前往
  function gidGo(inputEl) {
    if (!inputEl) return;
    if (inputEl.getAttribute('data-format') === 'serial' &&
        (inputEl.value || '').replace(/\D/g, '').length !== 12) {
      var h = helperOf(inputEl);
      if (h) h.classList.add('error');
      var iw = inputEl.closest('.input'); if (iw) iw.classList.add('error');
      inputEl.focus();           // 保持聚焦讓使用者繼續輸入
      return;
    }
    // 同畫面必填欄位也要通過（Go 等同該頁 Next）
    var scope = inputEl.closest('.phone') || document;
    if (!requireFields(scope)) return;
    // Case 2 prototype：data-case2-error 設定時顯示錯誤而非導頁
    var case2msg = inputEl.getAttribute('data-case2-error');
    if (case2msg) {
      var h = helperOf(inputEl);
      if (h) { if (h.dataset.default == null) h.dataset.default = h.textContent; h.textContent = case2msg; h.classList.add('error'); }
      var wrap = inputEl.closest('.input');
      if (wrap) wrap.classList.add('error');
      return;
    }
    // Case 3 prototype：data-case3-modal 設定時彈出對話框而非導頁
    var case3modal = inputEl.getAttribute('data-case3-modal');
    if (case3modal) {
      var m = document.querySelector(case3modal);
      if (m) {
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        kbHide();
        m.classList.add('show');
      }
      return;
    }
    var dest = inputEl.getAttribute('data-go');
    if (dest) location.href = dest;
  }
  // 必填驗證：檢查 scope 內所有 [data-required] 欄位，空的就把 helper 變紅換字
  function requireFields(scope) {
    var ok = true, first = null;
    scope.querySelectorAll('[data-required]').forEach(function (inp) {
      if (!(inp.value || '').trim()) {
        var h = helperOf(inp);
        if (h) {
          if (h.dataset.default == null) h.dataset.default = h.textContent;
          h.textContent = inp.getAttribute('data-req-msg') || 'This field is required';
          h.classList.add('error');
        }
        var iw = inp.closest('.input'); if (iw) iw.classList.add('error');
        if (!first) first = inp;
        ok = false;
      }
    });
    // 必填的上傳框（尚未選照片）
    scope.querySelectorAll('[data-required-file]').forEach(function (up) {
      if (!up.classList.contains('has-photo')) {
        var h = helperOf(up); if (h) h.classList.add('error');
        if (!first) first = up;
        ok = false;
      }
    });
    // 必填的勾選框（如同意保固規定）— 未勾選就擋住
    scope.querySelectorAll('[data-required-check]').forEach(function (cb) {
      if (!cb.checked) {
        var lab = cb.closest('.agree'); if (lab) lab.classList.add('error');
        if (!first) first = lab || cb;
        ok = false;
      }
    });
    if (first && first.focus) first.focus();
    return ok;
  }

  function kbShow() {
    clearTimeout(kbEl._hideTimer);
    kbEl.style.display = '';
    kbEl.offsetHeight;   // force reflow 讓 transition 從 translateY(110%) 開始
    kbEl.classList.add('show');
    var c = activeInput && activeInput.closest('.content');
    if (!c) return;
    c.style.paddingBottom = (kbEl.offsetHeight || 300) + 'px';   // 讓內容有可捲動空間
    // 等鍵盤滑上來定位後，只在焦點卡片（含按鈕）被鍵盤蓋住時，上滑「剛好」的量
    setTimeout(function () {
      if (!kbEl.classList.contains('show')) return;
      var card = activeInput && activeInput.closest('.card'); if (!card) return;
      // 要確保可見的對象：同卡片內的動作按鈕（如 Look Up），否則只看輸入框本身
      var target = card.querySelector('.cta') || activeInput;
      var kbRect = kbEl.getBoundingClientRect();
      var overlap = target.getBoundingClientRect().bottom - (kbRect.top - 12);   // 12px 緩衝
      if (overlap > 2) {
        var scale = kbRect.width / (kbEl.offsetWidth || kbRect.width);  // 還原 device 縮放
        try { c.scrollBy({ top: overlap / scale, behavior: 'smooth' }); } catch (_) { c.scrollTop += overlap / scale; }
      }
    }, 300);
  }
  function kbHide() {
    kbEl.classList.remove('show');
    document.querySelectorAll('.content').forEach(function (c) { c.style.paddingBottom = ''; });
    // overflow:hidden 在某些瀏覽器不會裁切有 transform 的絕對定位子元素，
    // 因此在 CSS transition 結束後改用 display:none 確實隱藏鍵盤。
    clearTimeout(kbEl._hideTimer);
    kbEl._hideTimer = setTimeout(function () {
      if (!kbEl.classList.contains('show')) kbEl.style.display = 'none';
    }, 280);
  }

  function kbInsert(ch) {
    var el = activeInput; if (!el) return;
    var s = el.selectionStart, e = el.selectionEnd, v = el.value;
    if (s == null) { el.value = v + ch; }
    else { el.value = v.slice(0, s) + ch + v.slice(e); var p = s + ch.length; el.setSelectionRange(p, p); }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function kbDelete() {
    var el = activeInput; if (!el) return;
    var s = el.selectionStart, e = el.selectionEnd, v = el.value;
    if (s == null) { el.value = v.slice(0, -1); }
    else if (s !== e) { el.value = v.slice(0, s) + v.slice(e); el.setSelectionRange(s, s); }
    else if (s > 0) { el.value = v.slice(0, s - 1) + v.slice(s); el.setSelectionRange(s - 1, s - 1); }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function kbHandle(act) {
    switch (act) {
      case 'shift': shift = !shift; kbRender(); break;
      case 'delete': kbDelete(); break;
      case '123': layout = 'numbers'; kbRender(); break;
      case 'numbers': layout = 'numbers'; kbRender(); break;
      case 'symbols': layout = 'symbols'; kbRender(); break;
      case 'ABC': layout = 'letters'; shift = false; kbRender(); break;
      case 'space': kbInsert(' '); break;
      case 'return':
        var inp = activeInput;
        if (inp && inp.getAttribute('data-format') === 'serial' &&
            (inp.value || '').replace(/\D/g, '').length !== 12) {
          var h = helperOf(inp); if (h) h.classList.add('error');   // 不合格：變紅、不收鍵盤、不前往
          break;
        }
        if (inp) inp.blur();
        kbHide();
        gidGo(inp);                  // 「Go」驗證後前往下一個畫面
        break;
      default:
        kbInsert((layout === 'letters' && shift) ? act.toUpperCase() : act);
        if (shift) { shift = false; kbRender(); }   // shift 為一次性
    }
  }

  // ---- 照片選擇器 ----------------------------------------------
  var pickerEl, activeUpload = null;
  function buildPicker(phone) {
    pickerEl = document.createElement('div');
    pickerEl.className = 'picker';
    pickerEl.innerHTML =
      '<div class="backdrop"></div>' +
      '<div class="sheet">' +
        '<div class="sheet-head"><span class="title">Photos</span><button type="button" data-pick-cancel>Cancel</button></div>' +
        '<div class="grid"></div>' +
      '</div>';
    phone.appendChild(pickerEl);
    pickerEl.querySelector('.backdrop').addEventListener('click', closePicker);
    pickerEl.querySelector('[data-pick-cancel]').addEventListener('click', closePicker);
    pickerEl.querySelector('.grid').addEventListener('click', function (e) {
      var t = e.target.closest('.thumb'); if (!t) return;
      selectPhoto(t.getAttribute('data-src'));
    });
  }
  function openPicker(uploadEl) {
    suppressKb(800);
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    kbHide();                 // 開啟選擇器前先收鍵盤
    activeUpload = uploadEl;
    var photos = (uploadEl.getAttribute('data-pick') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    pickerEl.querySelector('.grid').innerHTML = photos.map(function (p) {
      return '<div class="thumb" data-src="' + p + '"><img src="' + p + '" alt=""></div>';
    }).join('');
    pickerEl.classList.add('show');
  }
  function closePicker() { pickerEl.classList.remove('show'); }
  function selectPhoto(src) {
    if (activeUpload) {
      if (activeUpload._orig == null) activeUpload._orig = activeUpload.innerHTML;  // 記住空框內容
      activeUpload.classList.add('has-photo');
      activeUpload.innerHTML = '<img class="upload-preview" src="' + src + '" alt="preview">' +
        '<button type="button" class="upload-clear" aria-label="remove">&times;</button>';
      var h = helperOf(activeUpload); if (h) h.classList.remove('error');  // 清除必填紅字
      var up = activeUpload;
      requestAnimationFrame(function () { try { up.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (_) {} });
    }
    suppressKb(2000);
    activeInput = null;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    kbHide();
    closePicker();
    // picker 關閉後，主動把焦點移到 × 鈕（button，不觸發鍵盤），
    // 讓瀏覽器「記住」的最後焦點不是文字欄位，避免 iOS 非同步還焦再彈鍵盤。
    if (activeUpload) {
      var clearBtn = activeUpload.querySelector('.upload-clear');
      if (clearBtn) try { clearBtn.focus({ preventScroll: true }); } catch (_) {}
    }
  }
  function clearUpload(up) {
    if (!up) return;
    if (up._orig != null) up.innerHTML = up._orig;   // 還原成空框
    up.classList.remove('has-photo');
  }

  // ---- 簽名手寫板 ----------------------------------------------
  function buildSignaturePads(scope) {
    scope.querySelectorAll('.sign-pad').forEach(function (pad) {
      if (pad._wired) return; pad._wired = true;
      var hint = pad.textContent.trim();
      pad.innerHTML =
        '<span class="sign-hint">' + hint + '</span>' +
        '<canvas></canvas>' +
        '<button type="button" class="sign-clear">Clear</button>';
      var canvas = pad.querySelector('canvas');
      var hintEl = pad.querySelector('.sign-hint');
      var ctx = canvas.getContext('2d');
      function sizeCanvas() {
        if (!pad.offsetWidth) return;   // 尚未佈局（脫離 DOM）時跳過
        canvas.width = pad.offsetWidth; canvas.height = pad.offsetHeight;
        ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#25345A';
      }
      requestAnimationFrame(sizeCanvas);   // 等掛上 DOM 後再量尺寸
      window.addEventListener('resize', function () {
        if (!pad.classList.contains('has-ink')) sizeCanvas();
      });
      function pos(e) {
        var r = canvas.getBoundingClientRect();
        return { x: (e.clientX - r.left) * (canvas.width / r.width), y: (e.clientY - r.top) * (canvas.height / r.height) };
      }
      var drawing = false, last = null;
      canvas.addEventListener('pointerdown', function (e) {
        if (canvas.width !== pad.offsetWidth || canvas.height !== pad.offsetHeight) sizeCanvas();  // 確保尺寸正確
        drawing = true; last = pos(e);
        pad.classList.add('has-ink'); hintEl.style.display = 'none';
        try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        e.preventDefault();
      });
      canvas.addEventListener('pointermove', function (e) {
        if (!drawing) return;
        var p = pos(e);
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        last = p; e.preventDefault();
      });
      function end() { drawing = false; }
      canvas.addEventListener('pointerup', end);
      canvas.addEventListener('pointercancel', end);
      pad.querySelector('.sign-clear').addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pad.classList.remove('has-ink'); hintEl.style.display = '';
      });
    });
  }

  // ---- 圖片放大檢視 (lightbox) ---------------------------------
  var lbEl;
  function buildLightbox(phone) {
    lbEl = document.createElement('div');
    lbEl.className = 'lightbox';
    lbEl.innerHTML = '<button type="button" class="lb-close" aria-label="close">&times;</button><img alt="">';
    phone.appendChild(lbEl);
    lbEl.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lbEl.addEventListener('click', function (e) { if (e.target === lbEl) closeLightbox(); });
  }
  function openLightbox(src) { lbEl.querySelector('img').src = src; lbEl.classList.add('show'); }
  function closeLightbox() { lbEl.classList.remove('show'); }

  // ---- 骨架畫面（頁面進入時短暫閃現再淡出）-----------------
  function buildSkeleton(phone) {
    var mask = document.createElement('div');
    mask.className = 'skel-mask';
    mask.innerHTML =
      '<div class="skel-block" style="height:50px;"></div>' +
      '<div class="skel-block" style="height:12px;width:62%;"></div>' +
      '<div class="skel-block" style="height:12px;width:40%;"></div>' +
      '<div class="skel-block" style="height:115px;"></div>' +
      '<div class="skel-block" style="height:12px;width:75%;"></div>' +
      '<div class="skel-block" style="height:12px;width:48%;"></div>';
    phone.appendChild(mask);
    setTimeout(function () {
      mask.classList.add('out');
      setTimeout(function () { if (mask.parentNode) mask.parentNode.removeChild(mask); }, 280);
    }, 370);
  }

  function buildKeyboard(phone) {
    kbEl = document.createElement('div');
    kbEl.className = 'kb';
    kbEl.innerHTML = '<div class="kb-keys"></div><div class="kb-home"><i></i></div>';
    kbKeys = kbEl.querySelector('.kb-keys');
    kbRender();
    phone.appendChild(kbEl);

    // Button loading（capture phase，最先執行）
    // data-loading 按鈕：延長 cleanup 讓導頁先發生（1800ms）；一般按鈕：600ms
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-primary, .btn-outline');
      if (!btn || btn.disabled || btn.hasAttribute('disabled') || btn.classList.contains('btn-disabled') || btn.classList.contains('btn-loading')) return;
      btn.classList.add('btn-loading');
      var delay = btn.hasAttribute('data-loading') ? 1800 : 600;
      setTimeout(function () { btn.classList.remove('btn-loading'); }, delay);
    }, true);

    // 按鍵：pointerdown 阻止失焦（保持 input focus），click 才動作
    kbKeys.addEventListener('pointerdown', function (e) { if (e.target.closest('.kb-key')) e.preventDefault(); });
    kbKeys.addEventListener('mousedown', function (e) { if (e.target.closest('.kb-key')) e.preventDefault(); });
    kbKeys.addEventListener('click', function (e) {
      var k = e.target.closest('.kb-key'); if (!k) return;
      kbHandle(k.getAttribute('data-k'));
    });

    // 只有「文字類」input/textarea 聚焦才彈鍵盤（排除 checkbox/radio/date/number 等）
    function isTextField(el) {
      if (!el || !el.matches) return false;
      if (el.matches('textarea')) return true;
      if (!el.matches('input')) return false;
      var t = (el.getAttribute('type') || 'text').toLowerCase();
      return ['text', 'search', 'tel', 'url', 'email', 'password'].indexOf(t) >= 0;
    }
    document.addEventListener('focusin', function (e) {
      if (isTextField(e.target)) {
        if (Date.now() < kbSuppressUntil) { e.target.blur(); return; }   // 抑制視窗內：不彈鍵盤
        activeInput = e.target;
        layout = isNumericInput(e.target) ? 'numpad' : 'letters';  // 序號欄位只給數字鍵盤
        shift = false; kbRender(); kbShow();
      }
    });

    // 輸入時：序號自動格式化、清除錯誤紅字（序號與必填欄位皆適用）
    document.addEventListener('input', function (e) {
      var el = e.target; if (!el || !el.getAttribute) return;
      if (el.getAttribute('data-format') === 'serial') {
        formatSerial(el);
        var hs = helperOf(el);
        if (hs) { hs.classList.remove('error'); if (hs.dataset.default != null) hs.textContent = hs.dataset.default; }
        var iw = el.closest('.input'); if (iw) iw.classList.remove('error');
      }
      if (el.hasAttribute('data-required') && (el.value || '').trim()) {
        var h = helperOf(el);
        if (h) { if (h.dataset.default != null) h.textContent = h.dataset.default; h.classList.remove('error'); }
        var iw = el.closest('.input'); if (iw) iw.classList.remove('error');
      }
    });

    // Look Up 按鈕：驗證同一張卡內的序號欄位後前往
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lookup]'); if (!btn) return;
      var card = btn.closest('.card');
      var inp = card && card.querySelector('input[data-format="serial"], input[data-go]');
      var delay = btn.hasAttribute('data-loading') ? 1200 : 0;
      setTimeout(function () { gidGo(inp); }, delay);
    });

    // 清除照片的 X 鈕（先處理，避免又開啟 picker）
    document.addEventListener('click', function (e) {
      var x = e.target.closest('.upload-clear'); if (!x) return;
      e.stopPropagation();
      clearUpload(x.closest('.upload'));
    });
    // 點上傳框（有 data-pick）→ 開啟照片選擇器
    document.addEventListener('click', function (e) {
      if (e.target.closest('.upload-clear')) return;   // X 不開 picker
      var up = e.target.closest('.upload[data-pick]'); if (!up) return;
      openPicker(up);
    });

    // 勾選同意框 → 清除錯誤紅字
    document.addEventListener('change', function (e) {
      var cb = e.target.closest && e.target.closest('[data-required-check]'); if (!cb) return;
      var lab = cb.closest('.agree'); if (lab && cb.checked) lab.classList.remove('error');
    });

    // 左右開關
    document.addEventListener('click', function (e) {
      var sw = e.target.closest('.switch'); if (!sw) return;
      sw.classList.toggle('on');
    });

    // 點 [data-zoom] → 放大檢視圖片
    document.addEventListener('click', function (e) {
      var z = e.target.closest('[data-zoom]'); if (!z) return;
      openLightbox(z.getAttribute('data-zoom'));
    });

    // [data-modal-close] → 關閉最近的 .modal
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-modal-close]'); if (!btn) return;
      var m = btn.closest('.modal'); if (m) m.classList.remove('show');
    });

    // .chev[data-back-url] → 返回指定頁面
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.chev[data-back-url]'); if (!btn) return;
      var url = btn.getAttribute('data-back-url');
      setTimeout(function () { location.href = url; }, 550);
    });

    // [data-link] → 直接跳轉（不需驗證）
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-link]'); if (!btn) return;
      var url = btn.getAttribute('data-link');
      setTimeout(function () { location.href = url; }, 550);
    });

    // 帶 data-validate 的按鈕（如 Next）：先驗證必填欄位，通過才前往 data-go
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-validate]'); if (!btn) return;
      var scope = btn.closest('.phone') || document;
      if (requireFields(scope)) {
        var modalSel = btn.getAttribute('data-modal');
        var dest = btn.getAttribute('data-go');
        if (modalSel) {
          var m = document.querySelector(modalSel);
          if (m) {
            if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
            kbHide();                 // 先收鍵盤（並還原內容捲動），對話框才會置中
            m.classList.add('show');
          }
        } else if (dest) location.href = dest;
      }
    });
    document.addEventListener('focusout', function () {
      setTimeout(function () {
        var a = document.activeElement;
        if (!(a && a.matches && a.matches('input, textarea'))) { activeInput = null; kbHide(); }
      }, 120);
    });
    document.addEventListener('focusout', function (e) {
      var el = e.target; if (!el || !el.getAttribute) return;
      if (el.getAttribute('data-case2-error')) {
        var iw = el.closest('.input');
        if (iw && iw.classList.contains('error')) {
          el.value = '';
          iw.classList.remove('error');
          var h = helperOf(el);
          if (h) { h.classList.remove('error'); if (h.dataset.default != null) { h.textContent = h.dataset.default; delete h.dataset.default; } }
        }
      }
    });
  }

  // ---- 互動 -----------------------------------------------------
  function wireInteractions() {
    // radio：同一個 .radio-group 內單選
    document.querySelectorAll('.radio').forEach(function (r) {
      r.addEventListener('click', function () {
        var group = r.closest('.radio-group') || document;
        group.querySelectorAll('.radio').forEach(function (x) { x.classList.remove('sel'); });
        r.classList.add('sel');
      });
    });
  }

  // ---- fit-to-screen：整支手機等比縮放塞進視窗 ------------------
  function setupFit(stage) {
    if (!stage) return;
    if (document.body.getAttribute('data-fit') === 'off') return;
    var device = stage.querySelector('.device');

    function fit() {
      if (window.innerWidth <= 480) {           // 實機：全螢幕，不縮放
        device.style.transform = '';
        stage.style.height = '';
        return;
      }
      device.style.transform = 'none';           // 還原以量測自然尺寸
      var w = device.offsetWidth, h = device.offsetHeight;
      var pad = 32;                              // 視窗邊緣留白
      var scale = Math.min((window.innerWidth - pad) / w, (window.innerHeight - pad) / h, 1);
      device.style.transformOrigin = 'top center';
      device.style.transform = 'scale(' + scale + ')';
      stage.style.height = (h * scale) + 'px';   // 收掉縮放後的多餘空間
    }
    window.addEventListener('resize', fit);
    fit();
  }

  // 日期欄位：未填時顯示灰色
  function wireDateInputs() {
    document.querySelectorAll('input[type=date]').forEach(function (d) {
      function upd() { d.classList.toggle('empty', !d.value); }
      upd();
      d.addEventListener('change', upd);
      d.addEventListener('input', upd);
    });
  }

  // 簽名存檔（供完成頁/保固卡讀取）
  window.gidSaveSignatures = function () {
    var sigs = [];
    document.querySelectorAll('.sign-pad').forEach(function (pad, i) {
      if (pad.classList.contains('has-ink')) {
        var canvas = pad.querySelector('canvas');
        sigs.push({ label: pad.getAttribute('data-sig-label') || ('Signature ' + (i + 1)), img: canvas.toDataURL('image/png') });
      }
    });
    try { localStorage.setItem('gid-signatures', JSON.stringify(sigs)); } catch (_) {}
  };

  function init() {
    var stage = buildShell();
    wireInteractions();
    wireDateInputs();
    setupFit(stage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
