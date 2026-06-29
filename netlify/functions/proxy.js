export async function handler(event) {
  try {
    const path = event.path.replace('/.netlify/functions/proxy', '');
    const query = event.queryStringParameters ? `?${new URLSearchParams(event.queryStringParameters)}` : '';
    const url = `https://apis.ccbp.in${path}${query}`;

    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        host: 'apis.ccbp.in',
      },
      body: event.httpMethod !== 'GET' ? event.body : undefined,
    });

    const body = await response.text();

    return {
      statusCode: response.status,
      body,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
}
