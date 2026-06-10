import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    setWordCount(words);
    setCharCount(chars);
  }, [text]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Parallax effect for animated background
      const scrolled = window.scrollY;
      const circles = document.querySelectorAll('.circle');
      circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.1;
        circle.style.transform = `translateY(${scrolled * speed}px)`;
      });
      
      // Fade in elements on scroll
      const elements = document.querySelectorAll('.feature-card, .agent-card, .stat-item');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          el.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 90 ? 90 : prev + 10));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await axios.post('http://localhost:8000/api/summarize', { text });
      setSummary(response.data.summary);
      setProgress(100);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to summarize document');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError('');
    setSummary('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData);
      setSummary(response.data.summary);
      setProgress(100);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process file');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const clearAll = () => {
    setText('');
    setSummary('');
    setError('');
    setFileName('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAnalyze = () => {
    document.querySelector('.input-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatSummary = (text) => {
    let formatted = text
      // Headers and sections
      .replace(/^(#{1,6})\s+(.+)$/gm, '<h3 class="summary-heading">$2</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="highlight-text">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic-text">$1</em>')
      
      // Key terms highlighting
      .replace(/\b(Agreement|Contract|License|Licensor|Licensee|Party|Parties)\b/g, '<span class="key-term">$1</span>')
      .replace(/\b(shall|must|will|may|should)\b/gi, '<span class="obligation-term">$1</span>')
      .replace(/\b(risk|warning|caution|concern|issue|problem)\b/gi, '<span class="risk-term">$1</span>')
      .replace(/\$[\d,]+(?:\.\d{2})?/g, '<span class="amount">$&</span>')
      .replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '<span class="date">$&</span>')
      
      // Lists
      .replace(/^[-•]\s+(.+)$/gm, '<li class="summary-list-item">$1</li>')
      .replace(/(<li class="summary-list-item">.*<\/li>\n?)+/g, '<ul class="summary-list">$&</ul>')
      
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="summary-paragraph">')
      
    return `<p class="summary-paragraph">${formatted}</p>`;
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>LegalAI</span>
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
            <a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
            <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
            <button className="nav-btn" onClick={scrollToAnalyze}>
              Start Analysis
            </button>
          </div>
        </div>
      </nav>

      <div className="animated-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <header className="App-header" id="home">
        <div className="logo-container">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1>Legal Document Summarizer</h1>
        </div>
        <p className="subtitle">AI-Powered Legal Analysis with Risk Assessment</p>
      </header>
      
      <main className="container">
        <section id="features" className="features-section">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>Dual AI Agents</h3>
              <p>Legal Analyst and Risk Assessor work together to provide comprehensive analysis</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Processing</h3>
              <p>Powered by Google Gemini for quick and accurate document analysis</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Risk Detection</h3>
              <p>Identifies potential risks, red flags, and areas of concern automatically</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Insights</h3>
              <p>Get summaries with key points, obligations, and critical clauses highlighted</p>
            </div>
          </div>
        </section>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">📄</span>
            <div>
              <div className="stat-value">{wordCount}</div>
              <div className="stat-label">Words</div>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔤</span>
            <div>
              <div className="stat-value">{charCount}</div>
              <div className="stat-label">Characters</div>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🤖</span>
            <div>
              <div className="stat-value">2</div>
              <div className="stat-label">AI Agents</div>
            </div>
          </div>
        </div>

        <div className="input-section">
          <div className="upload-box">
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <label htmlFor="file-upload" className="file-label">
              {fileName || 'Upload Document'}
            </label>
            <p className="upload-hint">Supports .txt files</p>
            <input
              id="file-upload"
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <form onSubmit={handleTextSubmit}>
            <div className="textarea-wrapper">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your legal document text here..."
                rows="10"
                disabled={loading}
              />
              {text && (
                <button 
                  type="button" 
                  className="clear-btn"
                  onClick={clearAll}
                  disabled={loading}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" disabled={loading || !text} className="submit-btn">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Analyze Document
                </>
              )}
            </button>
          </form>
        </div>

        {loading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">Analyzing with AI agents... {progress}%</p>
          </div>
        )}

        {error && (
          <div className="error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {summary && (
          <div className="summary-section">
            <div className="summary-header">
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Analysis Complete
              </h2>
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(summary)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
            <div className="summary-content" dangerouslySetInnerHTML={{ __html: formatSummary(summary) }}></div>
          </div>
        )}

        <section id="about" className="about-section">
          <h2 className="section-title">About This Tool</h2>
          <div className="about-content">
            <p>
              Our Legal Document Summarizer uses advanced AI technology powered by CrewAI and Google Gemini 
              to help you quickly understand complex legal documents. Two specialized AI agents work in tandem:
            </p>
            <div className="agent-info">
              <div className="agent-card">
                <h4>📋 Legal Document Analyst</h4>
                <p>Summarizes key points, identifies parties involved, and highlights important obligations and clauses</p>
              </div>
              <div className="agent-card">
                <h4>⚠️ Legal Risk Assessor</h4>
                <p>Reviews documents for potential risks, red flags, ambiguous terms, and provides recommendations</p>
              </div>
            </div>
            <p className="disclaimer">
              <strong>Disclaimer:</strong> This tool is for informational purposes only and does not constitute legal advice. 
              Always consult with a qualified attorney for legal matters.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Powered by CrewAI & Google Gemini | Built by HP</p>
      </footer>

      {showScrollTop && (
        <button className="floating-btn scroll-top" onClick={scrollToTop} title="Scroll to top">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      <button className="floating-btn help-btn" title="Need help?">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
}

export default App;
