// src/components/GeneratePosts.js
import React, { useState } from 'react';
import supabase from '../supabaseClient';
import Parser from 'rss-parser';

const GeneratePosts = () => {
  const [posts, setPosts] = useState([]);

  const generatePosts = async () => {
    const { data: feeds } = await supabase.from('rss_feeds').select('*');
    const parser = new Parser();
    const articles = [];

    for (const feed of feeds) {
      const parsedFeed = await parser.parseURL(feed.url);
      const todayArticles = parsedFeed.items.filter(item =>
        new Date(item.pubDate).toDateString() === new Date().toDateString()
      );
      articles.push(...todayArticles);
    }

    const openAiSummaries = await Promise.all(articles.map(async (article) => {
      const summary = await generateSummary(article);
      return await generateLinkedInPost(article, summary);
    }));

    setPosts(openAiSummaries);
  };

  const generateSummary = async (article) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: `You are a LinkedIn post editor.` },
                  { role: 'user', content: `Summarize this article: ${article.contentSnippet}` }]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const generateLinkedInPost = async (article, summary) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: `You are a LinkedIn post editor.` },
                  { role: 'user', content: `Create a LinkedIn post for this article: ${summary}` }]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  };

  return (
    <div>
      <button onClick={generatePosts}>Generate LinkedIn Posts</button>
      <div>
        {posts.map((post, index) => (
          <div key={index}>
            <textarea value={post} readOnly />
            <button onClick={() => navigator.clipboard.writeText(post)}>Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratePosts;
