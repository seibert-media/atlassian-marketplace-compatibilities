#!/usr/bin/env node

const atlassianMarketplaceCompatibility = require('./index');
const _ = require('lodash');

const vendorId = process.argv[2];
if (!vendorId) {
    console.error("Please provide Atlassian Marketplace vendorID as parameter.");
    process.exit(1);
}

atlassianMarketplaceCompatibility.listAddonsForVendorByMaxCompatibility(vendorId).then((addons) => {
    const delimiter = "\n * ";

    _.forEach(addons, (addons, compatibleVersion) => {
        console.log(`\n## ${compatibleVersion}`);
        console.log(delimiter + addons.map((addon) => `${addon.name} (Supported: ${addon.supported})`).join(delimiter));
    })
});
