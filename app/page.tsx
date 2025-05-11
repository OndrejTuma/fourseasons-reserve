'use client';

import { useState } from 'react';
import axios from 'axios';

const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function Home() {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [time, setTime] = useState('19:00');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDayChange = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.get('/api/check-availability', {
        params: {
          days: selectedDays.join(','),
          time
        }
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to check availability' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Four Seasons Reservation Finder</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Select Days:</label>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map(day => (
                <label key={day.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day.value)}
                    onChange={() => handleDayChange(day.value)}
                    className="form-checkbox"
                  />
                  <span>{day.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2">Time:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={selectedDays.length === 0 || loading}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
          >
            {loading ? 'Searching...' : 'Find Reservation'}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 border rounded">
            {result.error ? (
              <p className="text-red-500">{result.error}</p>
            ) : result.success ? (
              <div>
                <p className="text-green-500">Found available slot!</p>
                <p>Date: {result.date}</p>
                <p>Time: {result.time}</p>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <p>{result.message}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 