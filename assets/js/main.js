/* Sara Blomster — site interactions.
   BUSINESS_NAME = "Sara Blomster" — the single swappable constant.
   All copy on the pages uses this exact name; change it here and
   in the page <title>/brand text together. */
const BUSINESS_NAME = "Sara Blomster";

(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Bloom-in reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Collection filters (Kollektioner) ---------- */
  var chipGroup = document.querySelector("[data-filter-group='collections']");
  if (chipGroup) {
    var chips = chipGroup.querySelectorAll(".chip");
    var cards = document.querySelectorAll("[data-occasion]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        var f = chip.getAttribute("data-filter");
        cards.forEach(function (card) {
          var show = f === "alle" || card.getAttribute("data-occasion").split(" ").indexOf(f) !== -1;
          card.hidden = !show;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- Calendar filters + export (Indholdskalender) ---------- */
  var calGroup = document.querySelector("[data-filter-group='calendar']");
  if (calGroup) {
    var calChips = calGroup.querySelectorAll(".chip");
    var days = document.querySelectorAll("[data-format]");
    calChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        calChips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        var f = chip.getAttribute("data-filter");
        days.forEach(function (day) {
          var show = f === "alle" || day.getAttribute("data-format").split(" ").indexOf(f) !== -1;
          day.hidden = !show;
          day.style.display = show ? "" : "none";
        });
      });
    });
  }

  var exportBtn = document.getElementById("export-calendar");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      var lines = [];
      lines.push(BUSINESS_NAME + " — 7-DAGES INDHOLDSKALENDER (EKSEMPEL)");
      lines.push("Alle tider er eksempler og markeret [TO CONFIRM — sample schedule].");
      lines.push("");
      document.querySelectorAll(".day-card").forEach(function (day) {
        var d = day.querySelector(".day-card__day");
        var t = day.querySelector("h3");
        var fmt = day.querySelector(".day-card__format");
        var cap = day.querySelector(".day-card__caption");
        lines.push((d ? d.textContent.trim().replace(/\s+/g, " ") : "") + " — " + (t ? t.textContent.trim() : ""));
        if (fmt) lines.push("Format: " + fmt.textContent.trim());
        if (cap) lines.push("Caption: " + cap.textContent.trim());
        lines.push("");
      });
      var blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "sara-blomster-7-dages-indholdskalender-eksempel.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }

  /* ---------- "Tilpas tidsplan" demo panel (calendar) ---------- */
  var planForm = document.getElementById("plan-form");
  if (planForm) {
    planForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var saved = document.getElementById("plan-saved");
      if (saved) saved.classList.add("is-visible");
    });
  }

  /* ---------- Enquiry form (Om & Kontakt) ---------- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var required = form.querySelectorAll("[required]");
      required.forEach(function (field) {
        var err = form.querySelector('[data-error-for="' + field.id + '"]');
        var bad = !field.value || (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
        field.setAttribute("aria-invalid", String(bad));
        if (err) err.classList.toggle("is-visible", bad);
        if (bad) valid = false;
      });
      if (!valid) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }
      var success = document.getElementById("form-success");
      if (success) {
        success.classList.add("is-visible");
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
      form.reset();
    });
  }
})();
