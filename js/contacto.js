/* Activate only after the owner supplies the endpoint AND approves published privacy copy. */
(() => {
  const config = Object.freeze({ endpoint: '', privacyApproved: false, privacyUrl: '' });
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const fields = [...form.querySelectorAll('[data-validate]')];
  const fieldset = form.querySelector('fieldset');
  const privacy = form.querySelector('#privacidad');
  const send = form.querySelector('[data-send]');
  const review = form.querySelector('[data-review]');
  const status = form.querySelector('[data-status]');
  let busy = false;
  const ready = /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(config.endpoint)
    && config.privacyApproved && Boolean(config.privacyUrl.trim());
  fieldset.disabled = false;
  review.hidden = false;
  privacy.disabled = !ready;
  privacy.required = ready;
  send.disabled = !ready;
  if (ready) {
    const link = document.querySelector('[data-privacy-link]');
    link.href = config.privacyUrl;
    link.hidden = false;
    document.querySelector('[data-privacy-pending]').hidden = true;
    status.textContent = 'Completa los campos obligatorios para enviar tu mensaje.';
  }
  function validate(field) {
    let message = '';
    const value = field.value.trim();
    if (field.required && !value) message = 'Completa este campo obligatorio.';
    else if (field.type === 'email' && field.validity.typeMismatch) message = 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
    else if (field.validity.tooLong) message = 'Reduce la extensión de este campo.';
    const error = document.getElementById(field.id + '-error');
    field.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
    error.hidden = !message;
    return !message;
  }
  fields.forEach(field => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
    field.addEventListener('change', () => validate(field));
  });
  function validateAll() {
    const valid = fields.map(validate).every(Boolean);
    const privacyError = form.querySelector('#privacidad-error');
    const privacyValid = !ready || privacy.checked;
    privacy.setAttribute('aria-invalid', String(!privacyValid));
    privacyError.hidden = privacyValid;
    if (!valid || !privacyValid) {
      status.textContent = 'Revisa los campos señalados. El mensaje no se ha enviado.';
      form.querySelector('[aria-invalid="true"]').focus();
      return false;
    }
    return true;
  }
  privacy.addEventListener('change', () => {
    privacy.setAttribute('aria-invalid', String(!privacy.checked));
    form.querySelector('#privacidad-error').hidden = privacy.checked;
  });
  review.addEventListener('click', () => {
    if (validateAll()) status.textContent = ready
      ? 'Los campos son válidos. Puedes enviar tu mensaje.'
      : 'Los campos son válidos. Envío aún no disponible. No se ha enviado ningún dato.';
  });
  async function submit(event) {
    event.preventDefault();
    if (busy || !validateAll()) return;
    if (!ready) { status.textContent = 'Envío aún no disponible. No se ha enviado ningún dato.'; return; }
    busy = true;
    send.disabled = true;
    review.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Enviando mensaje…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const payload = new FormData(form);
      fields.forEach(field => payload.set(field.name, field.value.trim()));
      const response = await fetch(config.endpoint, {
        method: 'POST', body: payload, headers: { Accept: 'application/json' }, signal: controller.signal
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.ok !== true) throw new Error('Service did not accept submission');
      status.textContent = 'Formspree ha recibido tu mensaje. Gracias por escribirnos.';
      form.reset();
      fields.forEach(field => field.removeAttribute('aria-invalid'));
    } catch {
      status.textContent = 'No pudimos confirmar la recepción del mensaje. Tus datos siguen aquí; revisa la conexión antes de intentar de nuevo.';
    } finally {
      clearTimeout(timer);
      busy = false;
      send.disabled = false;
      review.disabled = false;
      form.setAttribute('aria-busy', 'false');
    }
  }
  form.addEventListener('submit', submit);
  send.addEventListener('click', submit);
})();
