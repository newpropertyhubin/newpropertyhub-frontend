export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message } = req.body;
    
    // --- FUTURE GEMINI INTEGRATION START ---
    // Yahan par aap baad mein Gemini API call kar sakte hain.
    // const geminiResponse = await callGemini(message);
    // --- FUTURE GEMINI INTEGRATION END ---

    const lowerText = message ? message.toLowerCase() : '';
    let botText = "I can help you search for Apartments, Villas, PG, Resorts, or Land. Just tell me what you are looking for!";
    let updates = {};
    let actionTaken = false;
    let redirectUrl = null;

    // Listing Logic
    if (lowerText.includes('list') || lowerText.includes('sell') || lowerText.includes('post')) {
        botText = "Sure! I can help you list your property. Redirecting you to the listing page...";
        redirectUrl = '/add-property';
    }
    // Reset Logic
    else if (lowerText.includes('reset') || lowerText.includes('clear') || lowerText.includes('all')) {
        updates = { propertyType: '', keyword: '', minPrice: '', maxPrice: '', pincode: '' };
        botText = "I've reset the filters. Showing all properties.";
        actionTaken = true;
    }
    else {
        // Search Logic - Property Type
        if (lowerText.includes('villa')) { updates.propertyType = 'Villa'; actionTaken = true; }
        else if (lowerText.includes('apartment') || lowerText.includes('flat')) { updates.propertyType = 'Apartment'; actionTaken = true; }
        else if (lowerText.includes('land') || lowerText.includes('plot')) { updates.propertyType = 'Land'; actionTaken = true; }
        else if (lowerText.includes('commercial')) { updates.propertyType = 'Commercial'; actionTaken = true; }
        else if (lowerText.includes('pg') || lowerText.includes('paying guest')) { updates.propertyType = 'PG'; actionTaken = true; }
        else if (lowerText.includes('resort')) { updates.propertyType = 'Resort'; actionTaken = true; }
        else if (lowerText.includes('holiday')) { updates.propertyType = 'HolidayHome'; actionTaken = true; }

        // Search Logic - Price & Pincode
        const maxPriceMatch = lowerText.match(/(?:under|below|max|budget)\s*(\d+)/);
        if (maxPriceMatch) { updates.maxPrice = maxPriceMatch[1]; actionTaken = true; }
        
        const minPriceMatch = lowerText.match(/(?:above|min|starting)\s*(\d+)/);
        if (minPriceMatch) { updates.minPrice = minPriceMatch[1]; actionTaken = true; }

        const pincodeMatch = lowerText.match(/\b\d{6}\b/);
        if (pincodeMatch) { updates.pincode = pincodeMatch[0]; actionTaken = true; }

        if (actionTaken) {
            botText = "I've updated the search filters based on your request.";
        }
    }

    res.status(200).json({ 
        reply: botText, 
        filters: actionTaken ? updates : null,
        redirect: redirectUrl 
    });
}