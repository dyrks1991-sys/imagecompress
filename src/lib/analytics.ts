// Analytics integration stubs — replace with your preferred provider.
//
// Google Analytics 4:
//   gtag('event', name, properties)
//
// Plausible:
//   window.plausible(name, { props: properties })
//   Add to layout.tsx: <Script data-domain="imagecompress-jet.vercel.app"
//     src="https://plausible.io/js/script.js" strategy="afterInteractive" />
//
// Microsoft Clarity:
//   window.clarity('set', key, value)
//   Add to layout.tsx: <Script src="https://www.clarity.ms/tag/YOUR_ID" />
//
// All providers: route calls through trackEvent() and trackPageView() to swap
// providers without touching product code.

export function trackEvent(
  name: string,
  properties?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', name, properties)
  }
  // Replace with:
  // gtag('event', name, properties)
  // window.plausible?.(name, { props: properties })
}

export function trackPageView(url: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics] pageview', url)
  }
  // Replace with:
  // gtag('config', GA_MEASUREMENT_ID, { page_path: url })
}
