// ==========================================
// EMBER PA — Consent Mode v2 banner (GDPR, advanced)
// ==========================================
// Sdílená utilita pro celý ember-pa.cz (hlavní web, Tools Hub, Fun Hub).
// Použití na každé stránce (na konci <body>, po ostatních scriptech):
//
//   <script src="/consent.js"></script>
//
// Vyžaduje, aby <head> stránky obsahoval Consent Mode v2 default snippet
// (gtag('consent','default',...)) PŘED GTM a funkci emberLoadClarity()
// místo přímého vložení Clarity tagu — viz index.html.
// Jazyk se čte z <html lang="cs|en">, ne z JS přepínače (weby ember-pa.cz
// řeší i18n přes samostatné adresáře /en/, žádné SPA přepínání).
// Klíč: emberpa_consent ("granted" | "denied")
// ==========================================
(function(){
  var KEY = 'emberpa_consent';

  function curLang(){
    try{
      var l = (document.documentElement.getAttribute('lang') || 'cs').toLowerCase();
      return l.indexOf('en') === 0 ? 'en' : 'cs';
    }catch(e){ return 'cs'; }
  }

  var CSS = `
#epa-consent-bar{position:fixed;left:50%;bottom:calc(10px + env(safe-area-inset-bottom,0px));
  transform:translateX(-50%);width:calc(100% - 20px);max-width:640px;z-index:99998;display:none;
  background:linear-gradient(145deg,rgba(17,24,39,0.97),rgba(10,14,39,0.97) 65%);color:#e8edf4;
  border:1px solid rgba(59,130,246,0.35);border-radius:14px;
  box-shadow:0 20px 60px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.04);
  font-family:'Inter',sans-serif;padding:18px 20px;text-align:left;
  backdrop-filter:blur(12px);}
#epa-consent-bar.epa-on{display:block;animation:epaIn .35s ease;}
@keyframes epaIn{from{opacity:0;transform:translate(-50%,16px);}to{opacity:1;transform:translate(-50%,0);}}
.epa-inner{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.epa-text{flex:1 1 320px;font-size:13px;line-height:1.6;color:#94a3b8;}
.epa-title{display:block;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;
  letter-spacing:1.5px;color:#f97316;font-weight:700;margin-bottom:6px;}
.epa-text a,.epa-box a{color:#3b82f6;font-weight:600;text-decoration:underline;cursor:pointer;}
.epa-text a:hover,.epa-box a:hover{color:#60a5fa;}
.epa-actions{display:flex;gap:8px;flex:0 0 auto;}
.epa-btn{min-width:112px;padding:10px 16px;border-radius:8px;border:1px solid rgba(59,130,246,.4);
  background:rgba(255,255,255,.03);color:#e8edf4;font-family:'Inter',sans-serif;font-size:13px;
  font-weight:600;cursor:pointer;transition:background .2s,border-color .2s;}
.epa-btn:hover{background:rgba(59,130,246,.12);border-color:rgba(59,130,246,.6);}
.epa-btn.epa-accept{background:linear-gradient(135deg,#3b82f6,#f97316);color:#fff;
  border-color:transparent;font-weight:700;}
.epa-btn.epa-accept:hover{filter:brightness(1.08);}
@media (max-width:560px){.epa-actions{flex:1 1 100%;}.epa-btn{flex:1;min-width:0;}}
#epa-consent-modal{position:fixed;inset:0;z-index:99999;background:rgba(2,4,16,.75);display:none;
  align-items:center;justify-content:center;padding:18px;}
#epa-consent-modal.epa-on{display:flex;}
.epa-box{background:linear-gradient(145deg,#111827,#0a0e27 70%);color:#e8edf4;
  border:1px solid rgba(59,130,246,.35);border-radius:14px;max-width:480px;width:100%;
  max-height:82vh;overflow:auto;padding:24px;text-align:left;
  font-family:'Inter',sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.65);}
.epa-box h3{font-family:'JetBrains Mono',monospace;font-size:15px;letter-spacing:.3px;
  margin:0 0 16px;color:#f97316;}
.epa-box p{font-size:13px;line-height:1.65;margin:0 0 10px;color:#94a3b8;}
.epa-status{font-size:12px;color:#64748b;font-style:italic;
  border-top:1px solid rgba(59,130,246,.15);padding-top:10px;margin-top:6px;}
.epa-status strong{color:#3b82f6;font-style:normal;}
.epa-box .epa-actions{margin-top:16px;justify-content:flex-end;flex-wrap:wrap;}
`;

  var TX = {
    cs: {
      title: `Měření návštěvnosti`,
      text: `ember-pa.cz používá Google Analytics, Google Tag Manager a Microsoft Clarity, abychom věděli, jak web funguje a kde má rezervy. Žádné reklamní cookies, žádná osobní data k prodeji.`,
      more: `Více info`,
      deny: `Odmítám`,
      accept: `Souhlasím`,
      close: `✕ Zavřít`,
      mTitle: `Soukromí a měření`,
      m1: `ember-pa.cz měří návštěvnost pomocí Google Analytics 4 (přes Google Tag Manager) a Microsoft Clarity (mapy chování a nahrávky relací). Zajímá nás jen to, jak se web a nástroje používají — kolik lidí je navštíví, které stránky a nástroje jsou oblíbené a kde uživatelé narazí na potíže.`,
      m2: `Nepoužíváme reklamní cookies ani remarketing a žádná osobní data neprodáváme ani nesdílíme s dalšími stranami.`,
      m3: `Dokud souhlas nedáte, neukládají se žádné analytické cookies a Microsoft Clarity se vůbec nenačítá — Google dostává pouze anonymní signály bez cookies (Google Consent Mode v2).`,
      m4: `Volbu můžete kdykoli změnit odkazem 🍪 Soukromí v patičce stránky. Globální odhlášení: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">doplněk Google Analytics Opt-out</a>.`,
      m5: `Provozovatel: Ember PA, Ondřej Panuška, IČO 04351193 · <a href="https://ember-pa.cz/" target="_blank" rel="noopener">ember-pa.cz</a>`,
      st: `Aktuální volba`,
      sG: `souhlas udělen`,
      sD: `odmítnuto`,
      sN: `zatím nerozhodnuto`
    },
    en: {
      title: `Analytics`,
      text: `ember-pa.cz uses Google Analytics, Google Tag Manager and Microsoft Clarity to understand how the site performs and where it can improve. No advertising cookies, no personal data sold.`,
      more: `More info`,
      deny: `Decline`,
      accept: `Accept`,
      close: `✕ Close`,
      mTitle: `Privacy & analytics`,
      m1: `ember-pa.cz measures traffic with Google Analytics 4 (via Google Tag Manager) and Microsoft Clarity (behavior maps and session recordings). We only want to know how the site and tools are used — how many people visit, which pages and tools are popular, and where users run into trouble.`,
      m2: `We use no advertising cookies or remarketing, and no personal data is sold or shared with third parties.`,
      m3: `Until you consent, no analytics cookies are stored and Microsoft Clarity does not load at all — Google only receives anonymous cookieless signals (Google Consent Mode v2).`,
      m4: `You can change your choice at any time via the 🍪 Privacy link in the page footer. Global opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics Opt-out add-on</a>.`,
      m5: `Operator: Ember PA, Ondřej Panuška, Company ID (IČO) 04351193 · <a href="https://ember-pa.cz/" target="_blank" rel="noopener">ember-pa.cz</a>`,
      st: `Current choice`,
      sG: `accepted`,
      sD: `declined`,
      sN: `not decided yet`
    }
  };

  var bar = null, modal = null;

  function getSaved(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } }
  function decided(){ var s = getSaved(); return s === 'granted' || s === 'denied'; }
  function label(l){
    var t = TX[l === 'en' ? 'en' : 'cs'], s = getSaved();
    return s === 'granted' ? t.sG : (s === 'denied' ? t.sD : t.sN);
  }

  function clearAnalyticsCookies(){
    try{
      var host = location.hostname, parts = host.split('.'),
          root = parts.length > 1 ? '.' + parts.slice(-2).join('.') : host;
      var prefixes = ['_ga', '_gid', '_gat', '_clck', '_clsk', 'CLID', 'ANONCHK', 'MUID', 'SM', 'MR'];
      document.cookie.split(';').forEach(function(c){
        var n = c.split('=')[0].trim();
        for(var i = 0; i < prefixes.length; i++){
          if(n.indexOf(prefixes[i]) === 0){
            var exp = '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            document.cookie = n + exp;
            document.cookie = n + exp + ';domain=' + host;
            document.cookie = n + exp + ';domain=' + root;
            break;
          }
        }
      });
    }catch(e){}
  }

  function pushConsent(granted){
    window.dataLayer = window.dataLayer || [];
    if(typeof gtag === 'function'){
      gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
        functionality_storage: granted ? 'granted' : 'denied'
      });
    }
    window.dataLayer.push({ event: 'consent_update', consent_analytics: granted ? 'granted' : 'denied' });
    if(granted && typeof emberLoadClarity === 'function'){ emberLoadClarity(); }
  }

  function injectCss(){
    if(document.getElementById('epa-consent-style')) return;
    var s = document.createElement('style');
    s.id = 'epa-consent-style'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function fillBar(){
    var t = TX[curLang()];
    bar.innerHTML = `<div class="epa-inner">
  <div class="epa-text"><span class="epa-title">${t.title}</span>${t.text} <a href="#" class="epa-more">${t.more}</a></div>
  <div class="epa-actions">
    <button type="button" class="epa-btn epa-deny">${t.deny}</button>
    <button type="button" class="epa-btn epa-accept">${t.accept}</button>
  </div>
</div>`;
    bar.querySelector('.epa-more').addEventListener('click', function(e){ e.preventDefault(); openModal(); });
    bar.querySelector('.epa-deny').addEventListener('click', function(){ setConsent(false); });
    bar.querySelector('.epa-accept').addEventListener('click', function(){ setConsent(true); });
  }

  function fillModal(){
    var t = TX[curLang()];
    modal.innerHTML = `<div class="epa-box" role="dialog" aria-modal="true">
  <h3>${t.mTitle}</h3>
  <p>${t.m1}</p><p>${t.m2}</p><p>${t.m3}</p><p>${t.m4}</p><p>${t.m5}</p>
  <div class="epa-status">${t.st}: <strong>${label(curLang())}</strong></div>
  <div class="epa-actions">
    <button type="button" class="epa-btn epa-close">${t.close}</button>
    <button type="button" class="epa-btn epa-deny">${t.deny}</button>
    <button type="button" class="epa-btn epa-accept">${t.accept}</button>
  </div>
</div>`;
    modal.querySelector('.epa-close').addEventListener('click', closeModal);
    modal.querySelector('.epa-deny').addEventListener('click', function(){ setConsent(false); });
    modal.querySelector('.epa-accept').addEventListener('click', function(){ setConsent(true); });
  }

  function openBar(){
    injectCss();
    if(!bar){
      bar = document.createElement('div'); bar.id = 'epa-consent-bar'; bar.setAttribute('role', 'region');
      document.body.appendChild(bar);
    }
    fillBar();
    bar.classList.add('epa-on');
  }
  function closeBar(){ if(bar){ bar.classList.remove('epa-on'); } }

  function openModal(){
    injectCss();
    if(!modal){
      modal = document.createElement('div'); modal.id = 'epa-consent-modal';
      modal.addEventListener('click', function(e){ if(e.target === modal){ closeModal(); } });
      document.body.appendChild(modal);
    }
    fillModal();
    modal.classList.add('epa-on');
  }
  function closeModal(){ if(modal){ modal.classList.remove('epa-on'); } }

  function setConsent(granted){
    try{ localStorage.setItem(KEY, granted ? 'granted' : 'denied'); }catch(e){}
    pushConsent(granted);
    if(!granted){ clearAnalyticsCookies(); }
    closeBar(); closeModal();
  }

  window.emberConsentOpen = openBar;
  window.emberConsentInfo = openModal;
  window.emberConsentDecided = decided;
  window.emberConsentLabel = label;

  function init(){
    if(!decided()){ openBar(); }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
