// components/NewsAPI.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import './NewsApi.css';

const NewsAPI = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('general');
  const tickerRef = useRef(null);

  const categories = [
    'general', 'business', 'entertainment', 
    'health', 'science', 'sports', 'technology'
  ];

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Remplacez par votre clé API NewsAPI
      const API_KEY = '4cc71b285d9742a482fc602634709684';
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
      );
      
      setArticles(response.data.articles);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement des actualités');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  useEffect(() => {
    if (articles.length > 0) {
      const ticker = tickerRef.current;
      let animationFrame;
      let scrollSpeed = 1;
      
      const animate = () => {
        if (ticker.scrollLeft >= ticker.scrollWidth - ticker.clientWidth) {
          ticker.scrollLeft = 0;
        } else {
          ticker.scrollLeft += scrollSpeed;
        }
        animationFrame = requestAnimationFrame(animate);
      };
      
      const handleMouseEnter = () => scrollSpeed = 0;
      const handleMouseLeave = () => scrollSpeed = 1;
      
      ticker.addEventListener('mouseenter', handleMouseEnter);
      ticker.addEventListener('mouseleave', handleMouseLeave);
      animate();
      
      return () => {
        cancelAnimationFrame(animationFrame);
        ticker.removeEventListener('mouseenter', handleMouseEnter);
        ticker.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [articles]);

  return (
    <div className="news-api-container">
      <div className="news-controls">
        <div className="category-selector">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <button className="refresh-btn" onClick={fetchNews}>
          <FiRefreshCw className={`refresh-icon ${loading ? 'spin' : ''}`} />
        </button>
      </div>

      {/* Bande d'actualités (ticker) */}
      <div className="news-ticker-container">
        <div className="ticker-label">Dernières actualités:</div>
        <div className="news-ticker" ref={tickerRef}>
          {articles.map((article, index) => (
            <span key={`ticker-${index}`} className="ticker-item">
              {article.title} | 
            </span>
          ))}
        </div>
      </div>

      {/* Liste des articles */}
      {loading ? (
        <div className="loading-spinner">Chargement...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="articles-grid">
          {articles.map((article, index) => (
            <div key={index} className="article-card">
              {article.urlToImage && (
                <div className="article-image">
                  <img src={article.urlToImage} alt={article.title} />
                </div>
              )}
              <div className="article-content">
                <h3>{article.title}</h3>
                <p className="article-description">{article.description}</p>
                <div className="article-footer">
                  <span className="article-source">{article.source.name}</span>
                  <span className="article-date">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="read-more"
                  >
                    Lire plus <FiExternalLink />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsAPI;