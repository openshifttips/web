module.exports = {
  pathPrefix: "/openshift-compendium",
  siteMetadata: {
    title: 'The Openshift Compendium',
    description: `The Openshift Compendium`,
    author: 'Alex Kretzschmar',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-code-notes',
      options: {
        contentPath: 'notes',
        basePath: '/',
        showThemeInfo: true,
        showDescriptionInSidebar: true,
      },
    },
  ],
}
