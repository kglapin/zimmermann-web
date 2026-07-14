const EMAIL_ENDPOINT = 'https://api.resend.com/emails';
const requests = new Map();

function clean(value, maxLength = 1000) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getClientIp(request) {
  const forwarded = request.headers['x-forwarded-for'];
  return Array.isArray(forwarded) ? forwarded[0] : String(forwarded || request.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

function isRateLimited(ip) {
  const now = Date.now();
  const previous = requests.get(ip) || [];
  const recent = previous.filter((timestamp) => now - timestamp < 10 * 60 * 1000);
  recent.push(now);
  requests.set(ip, recent);
  return recent.length > 5;
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return response.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const body = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : (request.body || {});
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 30);
  const type = clean(body.type, 80);
  const message = clean(body.message, 1000);
  const website = clean(body.website, 200);
  const consent = clean(body.consent, 20);

  if (website) return response.status(200).json({ ok: true });

  const digits = phone.replace(/\D/g, '');
  if (name.length < 2 || digits.length < 9 || digits.length > 15 || !type || !consent) {
    return response.status(400).json({ ok: false, error: 'invalid_payload' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return response.status(503).json({ ok: false, error: 'email_not_configured' });
  }

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeType = escapeHtml(type);
  const safeMessage = escapeHtml(message || 'Brak dodatkowych informacji').replaceAll('\n', '<br>');

  try {
    const emailResponse = await fetch(EMAIL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: to,
        subject: `Nowe zapytanie: ${type} — ${name}`,
        html: `
          <h1>Nowa prośba o kontakt</h1>
          <p><strong>Ubezpieczenie:</strong> ${safeType}</p>
          <p><strong>Imię:</strong> ${safeName}</p>
          <p><strong>Telefon:</strong> <a href="tel:${digits}">${safePhone}</a></p>
          <p><strong>Informacje dodatkowe:</strong><br>${safeMessage}</p>
          <hr>
          <p style="color:#666;font-size:12px">Wiadomość wysłana przez formularz na stronie Ubezpieczenia Zimmermann.</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const details = await emailResponse.text();
      console.error('Resend error:', emailResponse.status, details);
      return response.status(502).json({ ok: false, error: 'email_provider_error' });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact endpoint error:', error);
    return response.status(500).json({ ok: false, error: 'server_error' });
  }
}
