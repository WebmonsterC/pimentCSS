/**
 * Serves /media-placeholder.svg?w=&h=&v= during `astro dev` (static path URLs work in build).
 */
export function mediaPlaceholderDevPlugin() {
  return {
    name: 'pimentcss-media-placeholder-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? '';
        if (pathname !== '/media-placeholder.svg') {
          next();
          return;
        }
        try {
          const mod = await server.ssrLoadModule('/src/lib/media-placeholder-svg.ts');
          const params = new URL(req.url ?? '', 'http://pdoc.local').searchParams;
          const { w, h, variant } = mod.parseMediaPlaceholderSearchParams(params);
          const svg = mod.buildMediaPlaceholderSvg(w, h, variant);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(svg);
        } catch {
          next();
        }
      });
    },
  };
}
