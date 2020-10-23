import React, { useState, useEffect } from 'react';

import css from '../../styles/urlShortner.module.css';

const Shortener = () => {
  const [URL, setURL] = useState('');
  const [error, setError] = useState('');
  const [short, setShort] = useState('');

  async function useAPI() {
    const res = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        long_url: URL,
        domain: 'bit.ly',
        group_guid: 'Ba1bc23dE4F'
      })
    });
    return !res.ok ? res.json().then(e => Promise.reject(e)) : res.json();
  }

  const shorten = event => {
    event.preventDefault();
    useAPI()
      .then(setShort)
      .catch(error => setError(error.message));
  };

  return (
    <div className={css.container}>
      <h3 className={css.title}>URL SHORTENER</h3>
      <div className={css.shortner}>
        <input onChange={e => setURL(e.target.value)} value={URL} />
        <button className={css.button} onClick={shorten}>
          Shorten URL
        </button>
      </div>
      {error && <div className={css.error}>{error}</div>}
      <code>{short}</code>
    </div>
  );
};

export default Shortener;
