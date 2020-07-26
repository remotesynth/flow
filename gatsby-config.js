module.exports = {
    pathPrefix: '/',
    siteMetadata: require('./site-metadata.json'),
    plugins: [
        `gatsby-plugin-sitemap`,
        `gatsby-plugin-react-helmet`,
        `gatsby-source-data`,
        `gatsby-transformer-remark`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages`
            }
        },
        {
            resolve: `gatsby-plugin-stackbit-static-sass`,
            options: {
                inputFile: `${__dirname}/src/sass/main.scss`,
                outputFile: `${__dirname}/public/assets/css/main.css`
            }
        },
        {
            resolve: `gatsby-remark-page-creator`,
            options: {
                
            }
        },
        {
            resolve: `@stackbit/gatsby-plugin-menus`,
            options: {
                sourceUrlPath: `fields.url`,
                pageContextProperty: `menus`,
            }
        },
        {
            resolve: "gatsby-plugin-firebase",
            options: {
              credentials: {
                apiKey: "AIzaSyB4HA801Tmh8z63K9Osl2hbWSZCOP4ndkc",
                authDomain: "flow-br.firebaseapp.com",
                databaseURL: "https://flow-br.firebaseio.com",
                projectId: "flow-br",
                storageBucket: "flow-br.appspot.com",
                messagingSenderId: "432679425264",
                appId: "1:432679425264:web:da417392f3a957f00a1e35"
              }
            }
          },
        
          {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
              // The property ID; the tracking code won't be generated without it
              trackingId: "UA-173533259-1",
              // Avoids sending pageview hits from custom paths
              exclude: ["/preview/**", "/do-not-track/me/too/"],
              // Delays sending pageview hits on route update (in milliseconds)
              pageTransitionDelay: 0,
              // Enables Google Optimize using your container Id
              optimizeId: "OPT-T66N5LJ",
              // Defers execution of google analytics script after page load
              defer: false,
              // Any additional optional fields
              sampleRate: 5,
              siteSpeedSampleRate: 10,
            },
          },
    ]
};
