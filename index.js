import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/lookup', async (req, res) => {
  const { brand, model } = req.query;

  if (!brand || !model) {
    return res.status(400).json({ error: 'Brand and Model are required' });
  }

  const searchUrl = `https://www.phonemore.com/search/?q=${encodeURIComponent(brand + ' ' + model)}`;
  console.log("🔍 Searching Phonemore:", searchUrl);

  try {
    const searchPage = await axios.get(searchUrl);
    const $ = cheerio.load(searchPage.data);

    const firstResultLink = $('.card-device a').first().attr('href');
    console.log("🔗 First result link:", firstResultLink);

    if (!firstResultLink) {
      console.log("❌ No result found on search page.");
      return res.json({ brand, model, release_regions: [] });
    }

    const deviceUrl = `https://www.phonemore.com${firstResultLink}`;
    console.log("📄 Visiting device page:", deviceUrl);

    const devicePage = await axios.get(deviceUrl);
    const $$ = cheerio.load(devicePage.data);

    const regionText = $$('.table-carriers').text() || $$('.bands-box .card-header').text();
    console.log("🌍 Region text snippet:", regionText.trim().slice(0, 150));

    // 🧪 Mock fallback region data for testing
    const mockRegions = [
      { region: "North America", country_codes: ["US", "CA"] },
      { region: "Europe", country_codes: ["UK", "DE", "FR"] },
      { region: "Asia", country_codes: ["IN", "CN", "JP"] }
    ];

    return res.json({
      brand,
      model,
      release_regions: mockRegions
    });

  } catch (err) {
    console.error("💥 ERROR while scraping:", err.message);
    res.status(500).json({ error: 'Failed to fetch from Phonemore' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Phonemore API running at http://localhost:${PORT}`);
});
