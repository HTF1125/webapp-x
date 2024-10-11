"use client";

import { useState, useEffect } from "react";
import {
  fetchTickers,
  addTicker,
  updateTicker,
  deleteTicker,
  Ticker,
} from "./api";

interface TickersClientProps {
  initialTickers: Ticker[];
}

export default function TickersClient({ initialTickers }: TickersClientProps) {
  const [tickers, setTickers] = useState<Ticker[]>(initialTickers);
  const [newTicker, setNewTicker] = useState<Ticker>({
    code: '', name: '', exchange: '', market: '',
    source: 'YAHOO', bloomberg: null, fred: null, yahoo: null
  });
  const [editingTicker, setEditingTicker] = useState<Ticker | null>(null);

  const fetchTickersData = async () => {
    try {
      const fetchedTickers = await fetchTickers();
      setTickers(fetchedTickers);
    } catch (error) {
      console.error('Error fetching tickers:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, ticker: Ticker = newTicker) => {
    const { name, value } = e.target;
    if (ticker === newTicker) {
      setNewTicker({ ...ticker, [name]: value });
    } else {
      setEditingTicker({ ...ticker, [name]: value });
    }
  };

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTicker(newTicker);
      setNewTicker({
        code: '', name: '', exchange: '', market: '',
        source: 'YAHOO', bloomberg: null, fred: null, yahoo: null
      });
      fetchTickersData();
    } catch (error) {
      console.error('Error adding ticker:', error);
    }
  };

  const handleUpdateTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTicker) {
      try {
        await updateTicker(editingTicker);
        setEditingTicker(null);
        fetchTickersData();
      } catch (error) {
        console.error('Error updating ticker:', error);
      }
    }
  };

  const handleDeleteTicker = async (code: string) => {
    try {
      await deleteTicker(code);
      fetchTickersData();
    } catch (error) {
      console.error('Error deleting ticker:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tickers</h1>

      <form onSubmit={handleAddTicker} className="mb-4">
        <input
          type="text"
          name="code"
          value={newTicker.code}
          onChange={handleInputChange}
          placeholder="Code"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="name"
          value={newTicker.name || ''}
          onChange={handleInputChange}
          placeholder="Name"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="exchange"
          value={newTicker.exchange || ''}
          onChange={handleInputChange}
          placeholder="Exchange"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="market"
          value={newTicker.market || ''}
          onChange={handleInputChange}
          placeholder="Market"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="source"
          value={newTicker.source}
          onChange={handleInputChange}
          placeholder="Source"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="bloomberg"
          value={newTicker.bloomberg || ''}
          onChange={handleInputChange}
          placeholder="Bloomberg"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="fred"
          value={newTicker.fred || ''}
          onChange={handleInputChange}
          placeholder="FRED"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="yahoo"
          value={newTicker.yahoo || ''}
          onChange={handleInputChange}
          placeholder="Yahoo"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Add Ticker</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Code</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Exchange</th>
              <th className="border p-2">Market</th>
              <th className="border p-2">Source</th>
              <th className="border p-2">Bloomberg</th>
              <th className="border p-2">FRED</th>
              <th className="border p-2">Yahoo</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickers.map((ticker) => (
              <tr key={ticker.code}>
                <td className="border p-2">{ticker.code}</td>
                <td className="border p-2">{ticker.name}</td>
                <td className="border p-2">{ticker.exchange}</td>
                <td className="border p-2">{ticker.market}</td>
                <td className="border p-2">{ticker.source}</td>
                <td className="border p-2">{ticker.bloomberg}</td>
                <td className="border p-2">{ticker.fred}</td>
                <td className="border p-2">{ticker.yahoo}</td>
                <td className="border p-2">
                  <button onClick={() => setEditingTicker(ticker)} className="bg-yellow-500 text-white p-1 mr-2">Edit</button>
                  <button onClick={() => handleDeleteTicker(ticker.code)} className="bg-red-500 text-white p-1">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTicker && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Edit Ticker</h3>
            <form onSubmit={handleUpdateTicker}>
              <input
                type="text"
                name="code"
                value={editingTicker.code}
                onChange={(e) => handleInputChange(e, editingTicker)}
                placeholder="Code"
                className="border p-2 mb-2 w-full"
                readOnly
              />
              <input
                type="text"
                name="name"
                value={editingTicker.name || ''}
                onChange={(e) => handleInputChange(e, editingTicker)}
                placeholder="Name"
                className="border p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="exchange"
                value={editingTicker.exchange || ''}
                onChange={(e) => handleInputChange(e, editingTicker)}
                placeholder="Exchange"
                className="border p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="market"
                value={editingTicker.market || ''}
                onChange={(e) => handleInputChange(e, editingTicker)}
                placeholder="Market"
                className="border p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="source"
                value={editingTicker.source}
                onChange={(e) => handleInputChange(e, editingTicker)}
                placeholder="Source"
                className="border p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="bloomberg"
                value={editingTicker.bloomberg || ''}
                onChange={(e) => handleInputChange(e, editingTicker)}
                placeholder="Bloomberg"
                className="border p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="fred"
                value={editingTicker.fred || ''}
                onChange={(e) => handleInputChange(e, editingTicker)}
                placeholder="FRED"
                className="border p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="yahoo"
                value={editingTicker.yahoo || ''}
                onChange={(e) => handleInputChange(e, editingTicker)}
                placeholder="Yahoo"
                className="border p-2 mb-2 w-full"
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white p-2">Update</button>
                <button onClick={() => setEditingTicker(null)} className="bg-gray-500 text-white p-2">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}