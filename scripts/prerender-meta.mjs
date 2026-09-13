const SEO_TAGS = [
  /\s*<title>[\s\S]*?<\/title>/gi,
  /\s*<meta name="description"[^>]*>/gi,
  /\s*<link rel="canonical"[^>]*>/gi,
  /\s*<meta property="og:(title|description|url|type|image)"[^>]*>/gi,
  /\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi,
]

export function applySeoHead(shell, meta) {
  const cleanShell = SEO_TAGS.reduce((html, pattern) => html.replace(pattern, ''), shell)
  const head = [
    `<title>${meta.title}</title>`,
    `<meta name="description" content="${meta.description}" />`,
    `<link rel="canonical" href="${meta.canonical}" />`,
    `<meta property="og:title" content="${meta.title}" />`,
    `<meta property="og:description" content="${meta.description}" />`,
    `<meta property="og:url" content="${meta.canonical}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:image" content="${meta.image}" />`,
    `<script type="application/ld+json">${meta.jsonLd}</script>`,
  ].join('\n    ')

  return cleanShell.replace('</head>', `    ${head}\n  </head>`)
}
