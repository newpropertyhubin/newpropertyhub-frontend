// src/pages/api/add-city.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { city, state, pincode } = req.body;

    if (!city || !state) {
      return res.status(400).json({ message: 'City and State are required' });
    }

    // 1. JSON फाइल का रास्ता (Path) ढूंढें
    const filePath = path.join(process.cwd(), 'src', 'data', 'cities-seo.json');
    
    // 2. पुराना डेटा पढ़ें
    const fileData = fs.readFileSync(filePath);
    const cities = JSON.parse(fileData);

    // 3. नया स्लग (URL) बनाएं
    const slug = `${state.toLowerCase()}-${city.toLowerCase()}${pincode ? '-' + pincode : ''}`.replace(/ /g, '-');

    // चेक करें कि क्या यह पहले से मौजूद है
    const exists = cities.find(c => c.slug === slug);
    if (exists) {
      return res.status(200).json({ message: 'City already exists', slug });
    }

    // 4. नया ऑब्जेक्ट तैयार करें
    const newEntry = {
      city,
      state,
      pincode: pincode || 'N/A',
      slug,
      url: `/properties/${slug}`,
      title: `Properties in ${city}, ${state} ${pincode ? '(' + pincode + ')' : ''}`,
      generatedAt: new Date().toISOString()
    };

    // 5. लिस्ट में जोड़ें और फाइल वापस सेव करें
    cities.push(newEntry);
    fs.writeFileSync(filePath, JSON.stringify(cities, null, 2));

    // 6. Sitemap Update Logic (New Code)
    try {
      // नए फोल्डर स्ट्रक्चर के हिसाब से सही फाइल का पाथ
      const sitemapPath = path.join(process.cwd(), 'public', 'sitemap-locations.xml');
      
      if (fs.existsSync(sitemapPath)) {
        let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
        const sitemapEntry = `
  <url>
    <loc>https://newpropertyhub.in${newEntry.url}</loc>
    <priority>0.8</priority>
    <changefreq>daily</changefreq>
  </url>`;
        
        // </urlset> से ठीक पहले नया URL जोड़ें
        sitemapContent = sitemapContent.replace('</urlset>', `${sitemapEntry}\n</urlset>`);
        fs.writeFileSync(sitemapPath, sitemapContent);
      }
    } catch (error) {
      console.error('Failed to update sitemap:', error);
    }

    return res.status(201).json({ message: 'New SEO page created!', slug });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
