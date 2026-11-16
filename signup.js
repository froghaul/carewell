/* Carewell email sign-up (Brevo double opt-in → list "Carewell free fridge page" → welcome email; confirm link → /free/).
   Put <div data-cw-signup></div> where the form should go. Optional: data-cw-signup="compact" (no first-name field),
   data-direct="0" (hide the "just download it" links). Posts straight to Brevo's form endpoint (CORS allows this site). */
(function () {
  var ACTION = 'https://bf0543fd.sibforms.com/serve/MUIFAHeeQCWPRadox94sIWw_gXq8LrXmVdG5wOVy2DLdv8Gk9PmqAKCdpao-ryG52lQVoODGQ7elYdQsCZaDOCmPMOvThBQRTVHubEftaBI9m-d7Sn1GH39AV3cdRJ5Zwb8CbPC_y8vqWNenEiM49f1-jaIUhBnWxFeS93OmQBWufGWImxkurhgqObpzKwSphvknWGF1yw2kYsvcGg==';
  var css = '.cws{display:grid;gap:10px;max-width:520px;margin:14px 0 4px}' +
    '.cws .row{display:grid;gap:10px;grid-template-columns:1fr}' +
    '@media(min-width:560px){.cws .row.two{grid-template-columns:3fr 2fr}}' +
    '.cws label{display:grid;gap:4px;font-weight:700;font-size:.95rem}' +
    '.cws label i{font-style:normal;font-weight:400;color:var(--muted,#5d6b72)}' +
    '.cws input[type=email],.cws input[type=text]{font:inherit;padding:12px 14px;border-radius:12px;border:2px solid var(--line,#d9ddd5);background:var(--surface,#fff);color:var(--ink,#1d3236);width:100%;box-sizing:border-box}' +
    '.cws input:focus{outline:3px solid var(--sun,#f2b544);outline-offset:1px;border-color:var(--teal,#1f6f78)}' +
    '.cws button{font:inherit;font-weight:700;cursor:pointer;justify-self:start;background:var(--teal,#1f6f78);color:#fff;border:0;border-radius:999px;padding:13px 26px}' +
    '.cws button[disabled]{opacity:.6;cursor:wait}' +
    '.cws .fine{font-size:.9rem;color:var(--muted,#5d6b72);margin:0}' +
    '.cws .fine a{color:var(--teal,#1f6f78)}' +
    '.cws .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.cws .msg{border-radius:12px;padding:12px 14px;margin:0}' +
    '.cws .msg.err{background:#ffeded;color:#661d1d}' +
    '.cws-done{background:var(--surface,#fff);border-radius:14px;padding:16px 18px;max-width:520px;margin:14px 0 4px;color:var(--ink,#1d3236)}' +
    '.cws-done b{color:var(--teal,#1f6f78)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var direct = '<p class="fine">Need it this minute? <a href="/free-fridge-emergency-page.pdf" download>Just download it (A4)</a> · <a href="/free-fridge-emergency-page-us.pdf" download>US Letter</a></p>';

  function build(box, n) {
    var compact = box.getAttribute('data-cw-signup') === 'compact';
    var showDirect = box.getAttribute('data-direct') !== '0';
    var id = 'cws' + n;
    box.innerHTML =
      '<form class="cws" novalidate>' +
      '<div class="row' + (compact ? '' : ' two') + '">' +
      '<label for="' + id + 'e">Your email<input id="' + id + 'e" type="email" name="EMAIL" autocomplete="email" required placeholder="you@example.com"></label>' +
      (compact ? '' : '<label for="' + id + 'n"><span>First name <i>(optional)</i></span><input id="' + id + 'n" type="text" name="FIRSTNAME" maxlength="200" autocomplete="given-name"></label>') +
      '</div>' +
      '<div class="hp" aria-hidden="true"><input type="text" name="email_address_check" tabindex="-1" autocomplete="off" value=""></div>' +
      '<input type="hidden" name="locale" value="en">' +
      '<button type="submit">Email me the page</button>' +
      '<p class="msg err" role="alert" hidden></p>' +
      '<p class="fine">We\'ll email you the page, plus the odd short note for carers from Ben. Unsubscribe any time.</p>' +
      (showDirect ? direct : '') +
      '</form>';
    var f = box.querySelector('form'), err = f.querySelector('.msg'), btn = f.querySelector('button');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = f.EMAIL.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { err.textContent = 'Please check the email address.'; err.hidden = false; f.EMAIL.focus(); return; }
      err.hidden = true; btn.disabled = true; btn.textContent = 'Sending…';
      var fail = function () {
        btn.disabled = false; btn.textContent = 'Email me the page';
        err.innerHTML = 'Sorry, that didn\'t go through. Please try again, or <a href="/free-fridge-emergency-page.pdf" download>download the page here</a>.';
        err.hidden = false;
      };
      fetch(ACTION + '?isAjax=1', { method: 'POST', body: new FormData(f) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j || !j.success) return fail();
          box.innerHTML = '<div class="cws-done" role="status"><p style="margin:0 0 6px"><b>Nearly there: check your inbox.</b></p>' +
            '<p style="margin:0">We\'ve sent an email to ' + em.replace(/[<>&"]/g, '') + '. Click <b>“Yes, send me the page”</b> in it and the fridge page is yours. ' +
            'If it isn\'t there in a few minutes, look in Spam or Promotions.</p>' + (showDirect ? '<p class="fine" style="margin-top:10px"><a href="/free-fridge-emergency-page.pdf" download>Download it now anyway (A4)</a></p>' : '') + '</div>';
        })
        .catch(fail);
    });
  }
  function init() { var b = document.querySelectorAll('[data-cw-signup]'); for (var i = 0; i < b.length; i++) build(b[i], i); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
