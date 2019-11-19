'use strict';

module.exports = {
  "title": "Fractale",
  "subtitle": "Javascript data modeling",
  "tags": {
    "allowUnknownTags": ["category"],
    "dictionaries": ["jsdoc"]
  },
  "plugins": [
    "docs/theme/plugins/category"
  ],
  "source": {
    "include": ["./lib"],
    "includePattern": ".js$",
    "exclude": ["./lib/property_definers"]
  },
  "opts": {
    "encoding": "utf8",
    "destination": "docs/public/",
    "readme": "README.md",
    "template": "docs/theme",
    "recurse": true,
    "verbose": true,
    "tutorials": "./docs/tutorials"
  },
  "templates": {
    "cleverLinks": false,
    "monospaceLinks": false,
    "custom": {
      "name": "Fractale Documentation",
      "logo": "images/logo.svg",
      "navigation": [
        { "label": "NPM", "href": "https://www.npmjs.com/package/fractale" },
        { "label": "Github",
          "href": "https://github.com/JochLAin/fractale"
        }
      ]
    }
  }
}
