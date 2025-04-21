const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

// Endpoint unique
app.get('/api/profit', async (req, res) => {
  try {
    const { symbol, start, end } = req.query;
    
    // Récupération données Binance
    const response = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol: symbol.toUpperCase(),
        interval: '1d',
        startTime: start,
        endTime: end,
        limit: 1000
      }
    });

    const data = response.data;
    if (data.length < 2) return res.status(400).json({ error: 'Pas assez de données' });

    // Calculs basiques
    const firstPrice = parseFloat(data[0][4]); // Prix de fermeture du premier jour
    const lastPrice = parseFloat(data[data.length - 1][4]); // Prix de fermeture dernier jour
    const profit = ((lastPrice - firstPrice) / firstPrice) * 100;

    res.json({
      symbol,
      startPrice: firstPrice,
      endPrice: lastPrice,
      profit: profit.toFixed(2)
    });

  } catch (error) {
    res.status(500).json({ error: 'Erreur de récupération' });
  }
});

app.listen(3001, () => console.log('Serveur prêt sur port 3001'));
