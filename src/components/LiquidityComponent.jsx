import React, { useState } from 'react';

const LiquidityComponent = ({ onAddLiquidity }) => {
  const [token1Amount, setToken1Amount] = useState('');
  const [token2Amount, setToken2Amount] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddLiquidity(token1Amount, token2Amount);
  };

  return (
    <div className="form-container">
      <h1>Add Liquidity</h1>
  <form onSubmit={handleSubmit}>
    <label className="form-label">Token 1 Amount:</label>
    <input type="number" className="form-control" value={token1Amount} onChange={(e) => setToken1Amount(e.target.value)} />
    <label className="form-label">Token 2 Amount:</label>
    <input type="number" className="form-control" value={token2Amount} onChange={(e) => setToken2Amount(e.target.value)} />
    <button type="submit" className="form-button">Add Liquidity</button>
  </form>
</div>
  );
};

export default LiquidityComponent;
