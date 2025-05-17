// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://www.campussathi.in',
  generateRobotsTxt: true,
  // Optional: Exclude specific paths from the sitemap
  exclude: ['/admin-dashboard',
    '/user-dashboard',
    '/payment-status',
    '/auth/*',
    '/apiv1/*'
  ]
};