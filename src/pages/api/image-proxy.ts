import type {NextApiRequest, NextApiResponse} from 'next';

/**
 * Image Proxy API Route
 *
 * This endpoint proxies image requests to bypass CORS restrictions.
 * It fetches images server-side (where CORS doesn't apply) and returns them
 * with appropriate caching headers.
 *
 * Usage: /api/image-proxy?url=<encoded-image-url>
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {url} = req.query;

  // Validate URL parameter
  if (!url || typeof url !== 'string') {
    return res.status(400).json({error: 'Missing or invalid URL parameter'});
  }

  try {
    // Decode the URL
    const decodedUrl = decodeURIComponent(url);

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(decodedUrl);
    } catch {
      return res.status(400).json({error: 'Invalid URL format'});
    }

    // Whitelist allowed domains (CloudFront, CDNs, and Cerebellum Academy domains)
    // Patterns starting with '.' are suffix matches (e.g., '.cloudfront.net' matches 'abc.cloudfront.net')
    // Other patterns are exact hostname matches or will also match subdomains
    const allowedDomains = [
      '.cloudfront.net',
      '.amazonaws.com',
      'media.cerebellumacademy.com',
      'cerebellumacademy.com',
      // Add other allowed domains as needed
    ];

    const isAllowedDomain = allowedDomains.some(domain => {
      if (domain.startsWith('.')) {
        // Suffix match for patterns like '.cloudfront.net'
        return parsedUrl.hostname.endsWith(domain);
      } else {
        // Exact match or subdomain match
        return (
          parsedUrl.hostname === domain ||
          parsedUrl.hostname.endsWith('.' + domain)
        );
      }
    });

    if (!isAllowedDomain) {
      return res.status(403).json({error: 'Domain not allowed'});
    }

    // Fetch the image server-side (bypasses CORS)
    const response = await fetch(decodedUrl, {
      headers: {
        // Forward user agent to prevent blocking
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch image: ${response.statusText}`,
      });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Set caching headers (cache for 7 days)
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', imageBuffer.byteLength);

    // Add CORS headers to allow client-side fetching
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Send the image
    return res.send(Buffer.from(imageBuffer));
  } catch (error) {
    return res.status(500).json({error: 'Failed to proxy image'});
  }
}

// Increase body size limit for images
export const config = {
  api: {
    responseLimit: '10mb',
  },
};
