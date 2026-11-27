/* Publicités AdMob dans l'appli Android/iPhone (Capacitor). Sur le web, rien ne s'affiche.
   Bannière en bas (au-dessus de la barre d'onglets) + interstitiel toutes les N recherches.
   Consentement Google (UMP) demandé avant toute pub, comme l'exige le RGPD. */
(function () {
  var IDS = {
    // Vrais blocs AdMob d'À Côté de Toi (appli Android ca-app-pub-2279402263917578~6203201750, créée le 18/11/2026).
    android: { banniere: 'ca-app-pub-2279402263917578/4948608642', interstitiel: 'ca-app-pub-2279402263917578/3577038415' },
    // Vrais blocs AdMob iPhone (appli iOS ca-app-pub-2279402263917578~7613016576, créée le 22/11/2026).
    ios: { banniere: 'ca-app-pub-2279402263917578/8237326390', interstitiel: 'ca-app-pub-2279402263917578/6084312485' }
  };
  var C = window.Capacitor, natif = !!(C && C.isNativePlatform && C.isNativePlatform());
  var A = natif && C.Plugins && C.Plugins.AdMob, plate = natif && C.getPlatform ? C.getPlatform() : 'web';
  var pret = null, interPret = false;
  function ids() { return IDS[plate] || IDS.android; }
  function hauteur(h) { document.documentElement.style.setProperty('--pub-h', (h || 0) + 'px'); }
  function preparerInter() { if (!A) return; A.prepareInterstitial({ adId: ids().interstitiel }).then(function () { interPret = true; }).catch(function () { interPret = false; }); }
  function init() {
    if (!A) return Promise.resolve(false);
    if (pret) return pret;
    pret = A.initialize({ initializeForTesting: false })
      .then(function () { return A.requestConsentInfo(); })
      .then(function (info) { if (info && info.isConsentFormAvailable && info.status === 'REQUIRED') return A.showConsentForm(); return info; })
      // iPhone : demande Apple « Autoriser le suivi ? » (App Tracking Transparency), obligatoire avant les pubs personnalisées
      .then(function () { if (plate === 'ios' && A.trackingAuthorizationStatus && A.requestTrackingAuthorization) return A.trackingAuthorizationStatus().then(function (r) { if (r && r.status === 'notDetermined') return A.requestTrackingAuthorization(); }).catch(function () {}); })
      .then(function () {
        A.addListener('bannerAdSizeChanged', function (s) { hauteur(s && s.height); });
        A.addListener('bannerAdFailedToLoad', function () { hauteur(0); });
        return A.showBanner({ adId: ids().banniere, adSize: 'ADAPTIVE_BANNER', position: 'BOTTOM_CENTER', margin: 0 });
      })
      .then(function () { preparerInter(); return true; })
      .catch(function () { return false; });
    return pret;
  }
  window.ACDT_PUB = {
    natif: natif,
    init: init,
    // interstitiel : appelle « apres » quand la pub est fermée (ou tout de suite s'il n'y en a pas)
    interstitiel: function (apres) {
      if (!A || !interPret) { if (apres) apres(); return; }
      interPret = false;
      var fini = false, h1, h2;
      var fin = function () { if (fini) return; fini = true; try { h1 && h1.remove(); h2 && h2.remove(); } catch (e) {} preparerInter(); if (apres) apres(); };
      Promise.resolve(A.addListener('interstitialAdDismissed', fin)).then(function (h) { h1 = h; });
      Promise.resolve(A.addListener('interstitialAdFailedToShow', fin)).then(function (h) { h2 = h; });
      A.showInterstitial().catch(fin);
      setTimeout(fin, 45000);
    },
    // formulaire Google pour modifier son choix de consentement (exigé par le RGPD)
    choix: function () { if (A && A.showPrivacyOptionsForm) A.showPrivacyOptionsForm().catch(function () {}); }
  };
  if (natif) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init(); }
})();
