/* =========================================================
   PixelPlay - Interacciones con JavaScript
   1. Menú hamburguesa adaptable
   2. Filtro de productos por plataforma
   3. Carrito simple con notificación
   4. Cuenta regresiva de la oferta
   5. Validación del formulario de contacto
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Menú adaptable ---------- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("menuPrincipal");

  const cerrarMenu = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };

  toggle.addEventListener("click", () => {
    const abierto = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(abierto));
    toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });

  menu.querySelectorAll("a").forEach(enlace => enlace.addEventListener("click", cerrarMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarMenu(); });
  window.addEventListener("resize", () => { if (window.innerWidth >= 992) cerrarMenu(); });

  /* ---------- 2. Filtro de productos ---------- */
  const chips = document.querySelectorAll(".chip");
  const tarjetas = document.querySelectorAll("#productGrid .card");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const filtro = chip.dataset.filter;
      tarjetas.forEach(card => {
        const visible = filtro === "todos" || card.dataset.platform === filtro;
        card.classList.toggle("is-hidden", !visible);
      });
    });
  });

  /* ---------- 3. Carrito y notificación ---------- */
  const contador = document.getElementById("cartCount");
  const toast = document.getElementById("toast");
  let total = 0;
  let temporizador;

  const mostrarToast = mensaje => {
    toast.textContent = mensaje;
    toast.classList.add("show");
    clearTimeout(temporizador);
    temporizador = setTimeout(() => toast.classList.remove("show"), 2200);
  };

  document.querySelectorAll(".add-to-cart").forEach(boton => {
    boton.addEventListener("click", () => {
      total += 1;
      contador.textContent = total;
      mostrarToast(`"${boton.dataset.name}" se agregó al carrito`);
    });
  });

  /* ---------- 4. Cuenta regresiva (reinicia cada 24 h) ---------- */
  const reloj = document.getElementById("countdown");
  const dos = n => String(n).padStart(2, "0");

  const actualizarReloj = () => {
    const ahora = new Date();
    const fin = new Date(ahora);
    fin.setHours(23, 59, 59, 999);
    const falta = Math.max(0, fin - ahora);
    const h = Math.floor(falta / 3600000);
    const m = Math.floor((falta % 3600000) / 60000);
    const s = Math.floor((falta % 60000) / 1000);
    reloj.textContent = `${dos(h)}:${dos(m)}:${dos(s)}`;
  };
  actualizarReloj();
  setInterval(actualizarReloj, 1000);

  /* ---------- 5. Validación del formulario ---------- */
  const form = document.getElementById("contactForm");
  const ok = document.getElementById("formOk");

  const validar = (campo, errorId, reglas) => {
    const caja = campo.closest(".field");
    const error = document.getElementById(errorId);
    const valor = campo.value.trim();
    let msg = "";
    if (!valor) msg = "Este campo es obligatorio.";
    else if (reglas.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) msg = "Escribe un correo válido.";
    else if (reglas.min && valor.length < reglas.min) msg = `Escribe al menos ${reglas.min} caracteres.`;
    error.textContent = msg;
    caja.classList.toggle("invalid", Boolean(msg));
    return !msg;
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    ok.hidden = true;
    const a = validar(form.nombre, "errNombre", { min: 3 });
    const b = validar(form.correo, "errCorreo", { email: true });
    const c = validar(form.mensaje, "errMensaje", { min: 10 });
    if (a && b && c) {
      form.reset();
      ok.hidden = false;
      mostrarToast("Mensaje enviado correctamente");
    }
  });
});
