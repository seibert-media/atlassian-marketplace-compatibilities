# atlassian-marketplace-compatibility

> NPM module to show compatibility of Atlassian Marketplace Add-Ons. 

## Usage (CLI)

    npm install -g atlassian-marketplace-compatibility
    
    # example vendorID 9093 (vendor: //SEIBERT/MEDIA) 
    atlassian-marketplace-compatibility <your-vendor-id>

## Usage (API)


    npm install --save atlassian-marketplace-compatibility


Require the module in your project:

    const atlassianMarketplaceCompatibility = require('atlassian-marketplace-compatibility');
    
    // example vendorID 9093 (vendor: //SEIBERT/MEDIA) 
    const vendorId = "<your-vendor-id>";
    atlassianMarketplaceCompatibility.listAddonsForVendor(vendorId)
        .then((addons) => {
            console.log(addons);
        });

    // with optional params
    const limit = 50; // addon limit
    const product = "confluence"; // Atlassian product name
    atlassianMarketplaceCompatibility.listAddonsForVendor(vendorId, limit, product)
        .then((addons) => {
            console.log(addons);
        });


Group by compatibility and filter supported add-ons:

    const supported = true; // only list supported add-ons
    
    atlassianMarketplaceCompatibility.listAddonsForVendorByMaxCompatibility(vendorId, limit, product, supported)
        .then((addonsByVersion) => {
            console.log(addonsByVersion);
            
            console.log(addonsByVersion["6.5.0"])
        });
