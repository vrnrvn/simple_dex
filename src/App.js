import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import WalletButton from './components/WalletButton';
import './App.css';

// Lazy-loaded components
const LiquidityComponent = lazy(() => import('./components/LiquidityComponent'));
const SwapComponent = lazy(() => import('./components/SwapComponent'));

function App() {
  const [isLoading, setIsLoading] = useState(false);

  // Loading handler for Suspense fallback
  const handleLoading = (loading) => {
    setIsLoading(loading);
  };

  return (
    <Router>
      <div className="app-container">
        <nav aria-label="Main navigation" className="main-nav">
          <div className="nav-content">
            <div className="brand">
              <span className="brand-name">SimpleDEX</span>
            </div>
            
            <ul className="navbar-list">
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/add-liquidity" className={({ isActive }) => isActive ? "active" : ""}>
                  Add Liquidity
                </NavLink>
              </li>
              <li>
                <NavLink to="/swap" className={({ isActive }) => isActive ? "active" : ""}>
                  Swap Tokens
                </NavLink>
              </li>
            </ul>
            
            <div className="wallet-wrapper">
              <WalletButton />
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Suspense fallback={
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading content...</p>
            </div>
          }>
            <Routes>
              <Route path="/add-liquidity" element={<LiquidityComponent />} />
              <Route path="/swap" element={<SwapComponent />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} SimpleDEX. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className="home-container">
    <div className="hero-section">
      <h1>Welcome to SimpleDEX</h1>
      <p className="tagline">Your gateway to decentralized token swaps</p>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">💱</div>
          <h3>Simple Swaps</h3>
          <p>Exchange tokens with minimal fees and maximum efficiency.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">💧</div>
          <h3>Liquidity Provision</h3>
          <p>Earn rewards by providing liquidity to trading pairs.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Security First</h3>
          <p>Non-custodial trading with complete control of your assets.</p>
        </div>
      </div>
      
      <div className="cta-container">
        <NavLink to="/swap" className="cta-button primary">Start Trading</NavLink>
        <NavLink to="/add-liquidity" className="cta-button secondary">Provide Liquidity</NavLink>
      </div>
    </div>
  </div>
);

export default App;