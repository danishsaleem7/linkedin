import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import axios from 'axios';

function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

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

  const fetchArticles = async () => {
    const { data: feeds } = await supabase.from('rss_feeds').select('*');
    let allArticles = [];
    for (let feed of feeds) {
      const articles = await fetchRSSData(feed.url);
      allArticles = [...allArticles, ...articles];
    }
    const topArticles = await getTopArticles(allArticles);
    setArticles(topArticles);
  };

  const getTopArticles = async (articles) => {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: `You are an editor. Choose the top 3 articles most relevant to executives based on these previews: ${articles.map(a => `${a.title}: ${a.description}`).join('\n')}`,
      max_tokens: 60,
    }, {
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Replace with your OpenAI API key
        'Content-Type': 'application/json'
      }
    });
    const topIndices = response.data.choices[0].text.split(',').map(i => parseInt(i.trim()));
    return topIndices.map(i => articles[i]);
  };

  const generateLinkedInPost = async (article) => {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: `Create a LinkedIn post summary for this article targeted at C-level healthcare executives: ${article.title}\n\n${article.description}\n\nLink: ${article.link}`,
      max_tokens: 100,
    }, {
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Replace with your OpenAI API key
        'Content-Type': 'application/json'
      }
    });
    return response.data.choices[0].text.trim();
  };

  const handleCopyToLinkedIn = async (article) => {
    const postText = await generateLinkedInPost(article);
    navigator.clipboard.writeText(postText);
    alert("LinkedIn post copied to clipboard!");
  };

  return (
    <div>
      <h1>Top 3 News Articles</h1>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <button onClick={() => handleCopyToLinkedIn(article)}>Copy to LinkedIn</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
