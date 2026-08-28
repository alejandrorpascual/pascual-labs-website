interface Env {
  ASSETS: Fetcher;
  GIT_COMMIT_SHA?: string;
}

const canonicalOrigin = "https://pascual-labs.com";

function healthResponse(request: Request, env: Env): Response {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });

  if (request.method !== "GET" && request.method !== "HEAD") {
    headers.set("Allow", "GET, HEAD");
    return new Response(null, { status: 405, headers });
  }

  const payload: { status: "ok"; service: string; commit?: string } = {
    status: "ok",
    service: "pascual-labs-website",
  };

  if (env.GIT_COMMIT_SHA) {
    payload.commit = env.GIT_COMMIT_SHA;
  }

  return new Response(
    request.method === "HEAD" ? null : JSON.stringify(payload),
    { status: 200, headers },
  );
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === "www.pascual-labs.com") {
      return Response.redirect(`${canonicalOrigin}${url.pathname}${url.search}`, 308);
    }

    if (url.pathname === "/health") {
      return healthResponse(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

