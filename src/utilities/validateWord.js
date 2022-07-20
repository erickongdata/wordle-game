import axios from 'axios';

async function validateWord(word) {
  const options = {
    method: 'GET',
    url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
  };

  const response = await axios.request(options);
  if (response.status === 200) {
    return response.data.length;
  }

  throw new Error(response.status);
}

export default validateWord;
