module.exports = {
  siteUrl: 'https://www.campussathi.in', // Replace with your website URL
  generateRobotsTxt: true, // Optional: Generate a robots.txt file
  // Optional: Exclude specific pages from the sitemap
  exclude: [
    '/admin-dashboard',
    '/admin/*',
    '/api/*',
  ],
  // Optional: Customize the sitemap.xml file name
  // outDirectory: './public/sitemaps',
  // Optional: Include a custom stylesheet for the sitemap.xml
  // stylesheet: 'sitemap.css',
};