import { NextResponse } from 'next/server';
import { githubClientId, githubClientSecret, githubTokenUrl } from '~/lib/env';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const data = {
    code: searchParams.get('code'),
    client_id: githubClientId,
    client_secret: githubClientSecret,
  };

  try {
    const response = await fetch(githubTokenUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.json();

    const content = {
      token: body.access_token,
      provider: 'github',
    };

    const script = `
      <script>
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:${content.provider}:success:${JSON.stringify(content)}',
            message.origin
          );

          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);

        window.opener.postMessage("authorizing:${content.provider}", "*");
      </script>
    `;

    return new Response(script, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.redirect('/?error=argg');
  }
}
