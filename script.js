/* Le Petit Baigneur — carnet de bord */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Entrée : la ligne d'eau ---------- */
  var entree = document.getElementById("entree");
  if (entree && /[?&]calme/.test(location.search)) {
    entree.remove();
    entree = null;
  }
  if (entree) {
    var deja = false;
    try { deja = sessionStorage.getItem("lpb-vu") === "1"; } catch (e) {}

    var duree = reduced ? 250 : (deja ? 700 : 2100);
    if (deja) entree.classList.add("rapide");

    requestAnimationFrame(function () {
      entree.classList.add("animee");
    });

    var fini = false;
    function finir() {
      if (fini) return;
      fini = true;
      entree.classList.add("finie");
      try { sessionStorage.setItem("lpb-vu", "1"); } catch (e) {}
      setTimeout(function () { entree.remove(); }, 650);
    }

    setTimeout(finir, duree);
    /* jamais bloquant : le moindre geste écourte */
    ["scroll", "pointerdown", "keydown", "wheel", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, finir, { once: true, passive: true });
    });
  }

  /* ---------- Révélations au scroll ---------- */
  var cibles = document.querySelectorAll(
    ".sec-tete, .pont, .lieu-histoire, .rituel, .agenda-note, .snap-large, .carte li, .bord-snaps, .carnet-grille .snap, .info-bloc, .hero-rdv"
  );
  cibles.forEach(function (el) { el.classList.add("rev"); });

  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("vu");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    cibles.forEach(function (el) { io.observe(el); });
  } else {
    cibles.forEach(function (el) { el.classList.add("vu"); });
  }

  /* ---------- Nav pouce : discrète à la descente ---------- */
  var pouce = document.getElementById("pouce");
  if (pouce) {
    var dernierY = window.scrollY;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < 200) {
          pouce.classList.add("cachee");
        } else if (y > dernierY + 6) {
          pouce.classList.add("cachee");
        } else if (y < dernierY - 6) {
          pouce.classList.remove("cachee");
        }
        dernierY = y;
        ticking = false;
      });
    }, { passive: true });
    pouce.classList.add("cachee");
  }
})();
