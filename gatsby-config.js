module.exports = {
  pathPrefix: "/",
  siteMetadata: {
    title: "Openshift Tips",
    description: `Openshift Tips`,
    author: "The OpenShift Tips Contributors",
    siteUrl: "https://openshift.tips",
  },
  plugins: [
    {
      resolve: "gatsby-theme-code-notes",
      options: {
        contentPath: "notes",
        basePath: "/",
        showThemeInfo: false,
        gitRepoContentPath:
          "https://github.com/openshifttips/web/tree/master/notes/",
        showDescriptionInSidebar: true,
      },
    },
    { resolve: `gatsby-plugin-sitemap` },
  ],
};
