console.log("seo.js loaded");

// Example: Generate SEO meta tags dynamically
function setSEOMeta(title, description, keywords){
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    let metaKey = document.querySelector('meta[name="keywords"]');

    if(!metaDesc){
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
    }
    if(!metaKey){
        metaKey = document.createElement('meta');
        metaKey.name = "keywords";
        document.head.appendChild(metaKey);
    }

    metaDesc.content = description;
    metaKey.content = keywords;
}
window.setSEOMeta = setSEOMeta;

// Bulk SEO example (cities/pincodes)
const cities = ["Delhi", "Mumbai", "Bangalore", "Raipur"];
cities.forEach(city => {
    console.log(`Generating SEO page for ${city}`);
    // Future: generate static HTML in /assets/seo/
});