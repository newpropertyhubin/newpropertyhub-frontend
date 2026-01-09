import Head from 'next/head';

const SeoGenerator = ({ title, description, image, url }) => {
    const siteName = "New Property Hub";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const metaDesc = description || "Find your dream property with New Property Hub.";
    const metaImage = image || "/img/default-og.jpg"; // Make sure to have a default image in public/img/

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDesc} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDesc} />
            <meta property="og:image" content={metaImage} />
            {url && <meta property="og:url" content={url} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDesc} />
            <meta name="twitter:image" content={metaImage} />
        </Head>
    );
};

export default SeoGenerator;
