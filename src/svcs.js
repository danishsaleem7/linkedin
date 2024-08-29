import axios from 'axios';

const fetchRSSData = async (url) => {
  try {
    const response = await axios.get(url);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');
    const items = xmlDoc.getElementsByTagName('item');
    return Array.from(items).map(item => ({
      title: item.getElementsByTagName('title')[0].textContent,
      link: item.getElementsByTagName('link')[0].textContent,
      description: item.getElementsByTagName('description')[0].textContent,
    }));
  } catch (error) {
    console.log('Error fetching RSS feed:', error);
  }
};
