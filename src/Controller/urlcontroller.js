import URL from '../Models/urlSchema.js';
import { nanoid } from 'nanoid';

// In your backend controller

export const shorten = async (req, res) => {
    console.log('Received request:', req.body);
    const { longUrl } = req.body;
    const shortId = nanoid(6); // Generates a unique short ID
    const shortUrl = `https://url-backend-mod0.onrender.com/api/${shortId}`; // Explicitly set the base URL
  
    try {
      await URL.create({ longUrl, shortUrl, shortId });
      res.json({ shortUrl });
    } catch (error) {
      console.error('Error creating short URL:', error);
      res.status(500).send('Error creating short URL');
    }
  };
  
  export const redirect = async (req, res) => {
    const { shortId } = req.params;
    console.log(`Redirecting shortId: ${shortId}`);
    try {
      const url = await URL.findOne({ shortId });
      if (url) {
        console.log(`Redirecting to longUrl: ${url.longUrl}`);
        res.redirect(url.longUrl);
      } else {
        console.log('URL not found');
        res.status(404).send('URL not found');
      }
    } catch (error) {
      console.error('Error redirecting URL:', error);
      res.status(500).send('Error redirecting URL');
    }
  };
  
