import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/lookup', async (req, res) => {
  const { brand, model, modelNumber } = req.query;

  if (!brand || !model) {
    return res.status(400).json({ error: 'Brand and Model are required' });
  }

  console.log(`📲 Lookup requested for ${brand} ${model} ${modelNumber || ''}`);

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
});

app.listen(PORT, () => {
  console.log(`✅ API (dummy mode) running at http://localhost:${PORT}`);
});
