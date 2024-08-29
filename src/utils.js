const validateRSSFeed = (url) => {
    try {
      const newURL = new URL(url);
      return newURL.protocol === 'http:' || newURL.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };
  
  const addRSSFeed = async () => {
    if (!validateRSSFeed(url)) {
      setError('Invalid RSS feed URL');
      return;
    }
    const { data, error } = await supabase.from('rss_feeds').insert([{ url }]);
    if (error) setError('Error saving RSS feed');
    else fetchRSSFeeds();
  };
  