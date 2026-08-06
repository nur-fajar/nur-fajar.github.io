/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves static files only — no Node server, no image
  // optimization endpoint. `output: 'export'` produces plain HTML/CSS/JS in
  // `out/`, and `trailingSlash` makes routes like /lab resolve to
  // /lab/index.html the way a static host expects.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
