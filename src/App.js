import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import WalletButton from './components/WalletButton';
import './App.css';

const LiquidityComponent = lazy(() => import('./components/LiquidityComponent'));
const SwapComponent = lazy(() => import('./components/SwapComponent'));

function App() {
  return (
    <Router>
      <div>
        <nav aria-label="Main navigation">
          <ul className="navbar-list">
            <li>
              <NavLink to="/" activeClassName="active" exact>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/add-liquidity" activeClassName="active">
                Add Liquidity
              </NavLink>
            </li>
            <li>
              <NavLink to="/swap" activeClassName="active">
                Swap Tokens
              </NavLink>
            </li>
            <li>
              <WalletButton />
            </li>
          </ul>
        </nav>

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/add-liquidity" element={<LiquidityComponent />} />
            <Route path="/swap" element={<SwapComponent />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className="home-container">
    <h1>Welcome to Simple DEX</h1>
    <p>Your gateway to decentralized token swaps.</p>
    <p>
      Connect your wallet to start trading or providing liquidity in a secure and decentralized
      manner.
    </p>
  </div>
);

export default App;