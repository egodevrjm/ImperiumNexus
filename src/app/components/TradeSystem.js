'use client';

import React, { useState } from 'react';

const TradeSystem = ({ resources, players, playerNation, onTrade }) => {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [tradeOffer, setTradeOffer] = useState({ give: '', giveAmount: 0, receive: '', receiveAmount: 0 });

  const handleTrade = () => {
    if (resources[tradeOffer.give] >= tradeOffer.giveAmount) {
      onTrade({
        partnerId: selectedPartner.id,
        give: tradeOffer.give,
        giveAmount: tradeOffer.giveAmount,
        receive: tradeOffer.receive,
        receiveAmount: tradeOffer.receiveAmount
      });
      setTradeOffer({ give: '', giveAmount: 0, receive: '', receiveAmount: 0 });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Trade System</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Resources</h3>
          {Object.entries(resources).map(([resource, amount]) => (
            <div key={resource} className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <span className="capitalize">{resource}:</span>
              <span>{amount}</span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Trade</h3>
          <select
            value={selectedPartner?.id || ''}
            onChange={(e) => setSelectedPartner(players.find(p => p.id === e.target.value))}
            className="w-full p-2 mb-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
          >
            <option value="">Select Trade Partner</option>
            {players.filter(p => p.id !== playerNation.id).map(partner => (
              <option key={partner.id} value={partner.id}>{partner.name}</option>
            ))}
          </select>
          {selectedPartner && (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <select
                  value={tradeOffer.give}
                  onChange={(e) => setTradeOffer(prev => ({ ...prev, give: e.target.value }))}
                  className="flex-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                >
                  <option value="">Give</option>
                  {Object.keys(resources).map(resource => (
                    <option key={resource} value={resource}>{resource}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={tradeOffer.giveAmount}
                  onChange={(e) => setTradeOffer(prev => ({ ...prev, giveAmount: parseInt(e.target.value) || 0 }))}
                  className="flex-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={tradeOffer.receive}
                  onChange={(e) => setTradeOffer(prev => ({ ...prev, receive: e.target.value }))}
                  className="flex-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                >
                  <option value="">Receive</option>
                  {Object.keys(resources).map(resource => (
                    <option key={resource} value={resource}>{resource}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={tradeOffer.receiveAmount}
                  onChange={(e) => setTradeOffer(prev => ({ ...prev, receiveAmount: parseInt(e.target.value) || 0 }))}
                  className="flex-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <button
                onClick={handleTrade}
                disabled={!tradeOffer.give || !tradeOffer.receive || tradeOffer.giveAmount <= 0 || tradeOffer.receiveAmount <= 0}
                className="w-full px-4 py-2 bg-green-500 dark:bg-green-700 text-white rounded hover:bg-green-600 dark:hover:bg-green-800 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400"
              >
                Propose Trade
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeSystem;