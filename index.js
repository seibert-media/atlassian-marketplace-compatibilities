
const request = require('request-promise-native');

const _ = require('lodash');

const baseUrl = 'https://marketplace.atlassian.com/rest/2';

function logError(errorResponse) {
    console.error(`Error (Status-Code: ${errorResponse.statusCode}) for request to uri: ${errorResponse.options.uri}`);
    console.error(errorResponse.error);
}

const atlassianMarketplaceCompatibility = {
    listAddonsForVendor(vendorId, limit = 100, application = "confluence") {
        const url = `${baseUrl}/addons/vendor/${vendorId}?limit=${limit}&application=${application}`;

        return request(url).then((response) => {
            const jsonResponse = JSON.parse(response);

            const marketplaceAddons = jsonResponse._embedded.addons;

            const requestPromises = marketplaceAddons.map((addon) => {
                const addonUrl = `${baseUrl}/addons/${addon.key}/versions/latest`;

                return request(addonUrl).then((latestVersionResponse) => {
                    const latestVersion = JSON.parse(latestVersionResponse);
                    const confluenceCompatibility = _.find(latestVersion.compatibilities, {application: "confluence"});
                    const serverCompatibility = confluenceCompatibility.hosting.server;

                    return {
                        key: addon.key,
                        name: addon.name,
                        supported: latestVersion.release.supported,
                        serverCompatibility: serverCompatibility
                    };
                }).catch(logError);
            });

            return Promise.all(requestPromises);
        }).catch(logError);
    },
    listAddonsForVendorByMaxCompatibility(vendor, limit, application, supported = null) {
        return this.listAddonsForVendor(vendor, limit, application).then((addons) => {
            if (supported !== null) {
                addons = _.filter(addons, {supported: true});
            }
            return _.groupBy(addons, (addon) => ((addon.serverCompatibility || {}).max || {}).version || "?");
        });
    }
};

module.exports = atlassianMarketplaceCompatibility;
