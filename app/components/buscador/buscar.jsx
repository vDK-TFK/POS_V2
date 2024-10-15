"use client";

import { useState } from 'react';

export default function Buscador({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Buscar por nombre o ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
      <button onClick={handleSearch} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Buscar
      </button>
    </div>
  );
}
