module.exports = {
  base: '/specs/',
  title: 'Knowledge Grid Specifications',
  themeConfig: {
    logo: '/images/kgrid-logo.png',
    // repo: 'kgrid/specs',
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'KGrid.org', link: 'https://kgrid.org' },
      { text: 'Specifications', items: [
        { text: 'KGrid Common Package', link: '/packaging.md' },
        { text: 'KGrid Activation', link: '/activation.md' },
        { text: 'KGrid Runtime Adapters', link: '/runtimes.md' },
        { text: 'KGrid Shelf API', link: '/shelf-api.md' },
        { text: 'KOIO', link: 'https://github.com/kgrid/koio' }
      ]}
    ],
    search: true,
    searchMaxSuggestions: 10,
    sidebar: 'auto',
    displayAllHeaders: true
  }
}
