// src/components/RSSFeedConfig.js
import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

const RSSFeedConfig = () => {
  const [rssUrl, setRssUrl] = useState('');
  const [rssFeeds, setRssFeeds] = useState([]);

  useEffect(() => {
    fetchRSSFeeds();
  }, []);

  const fetchRSSFeeds = async () => {
    const { data, error } = await supabase.from('rss_feeds').select('*');
    if (error) console.error(error);
    else setRssFeeds(data);
  };

  const validateRSSFeed = async (url) => {
    // Add your RSS feed validation logic here (e.g., check with RSS parser)
    return true;
  };

  const handleAddFeed = async () => {
    if (await validateRSSFeed(rssUrl)) {
      const { error } = await supabase.from('rss_feeds').insert({ url: rssUrl });
      if (error) console.error(error);
      else fetchRSSFeeds();
    } else {
      alert('Invalid RSS Feed URL');
    }
  };

  return (
    <div>
      <input
        type="url"
        placeholder="Enter RSS feed URL"
        value={rssUrl}
        onChange={(e) => setRssUrl(e.target.value)}
      />
      <button onClick={handleAddFeed}>Add Feed</button>
      <ul>
        {rssFeeds.map(feed => (
          <li key={feed.id}>{feed.url}</li>
        ))}
      </ul>
    </div>
  );
};

export default RSSFeedConfig;
