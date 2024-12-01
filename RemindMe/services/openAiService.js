import axios from 'axios';
import { OPENAI_API_KEY } from '@env'; // Lataa API-avain ympäristömuuttujista

// Luo Axios-instanse OpenAI API:lle
const openAiApi = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

// Funktio lahjaehdotuksen generointiin
export const generateGiftSuggestion = async (intrest) => {
  const prompt = `Ehdota yksi lahjaidea henkilölle, jonka kiinnostuksen kohteena on ${intrest}.`;

  try {
    // GPT-3.5-turbon päätepisteen käyttö
    const response = await openAiApi.post('/chat/completions', {
      model: 'gpt-3.5-turbo', // Mallin nimi
      messages: [
        { role: 'system', content: 'Sinä olet lahjaideoita ehdottava assistentti.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200, // Maksimi määrä vastauksen sanoja
      temperature: 0.7, // Luovuuden taso
    });

    // Palautetaan vastauksen sisältö
    return response.data.choices[0]?.message?.content?.trim() || 'Ei lahjaideoita saatavilla.';
  } catch (error) {
    console.error('Error generating gift suggestion:', error.response?.data || error.message);
    throw new Error('Lahjaehdotuksen luominen epäonnistui.');
  }
};
