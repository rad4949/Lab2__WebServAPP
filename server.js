import express from 'express'
import axios from 'axios'
import cors from 'cors';
const app = express();
app.use(express.json());

app.use(cors({ origin: '*' }));

const PORT = 3300;

async function getWeatherData() {
    const apiKey = '64964a77aa3e32bf787a793f247b9dfa';
    const cities = ['Kyiv', 'Kharkiv', 'Odesa', 'Lviv', 'Dnipro', 'Zaporizhzhia', 'Vinnytsia', 'Khmelnytskyi', 'Rivne', 'Simferopol'];
  
    try {
      const weatherPromises = cities.map(async (city) => {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},ua&appid=${apiKey}`);
        const temperatureCelsius = response.data.main.temp - 273.15;
        return {
          city: city,
          temperatureCelsius: temperatureCelsius.toFixed(2),
        };
      });
  
      const weatherData = await Promise.all(weatherPromises);
  
      console.log(JSON.stringify(weatherData, null, 2));
  
      return weatherData;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

app.get('/', (req, res) => {
    res.status(200).json({status: 200, message:"OK"});
});

app.get('/weatherC', async (req, res) => {
    try {
        const weatherData = await getWeatherData();
        res.json(weatherData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error!' });
        }
});

app.listen(PORT, () => {
    console.log('PORT: ' + PORT + '')
});