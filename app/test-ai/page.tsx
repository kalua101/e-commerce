'use client';

import { useState } from 'react';

export default function TestAIPage() {
  const [prompt, setPrompt] = useState('write a haiku about ai');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testOpenAI = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate text');
        console.error('API Error:', data);
      } else {
        setResult(data.output_text);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">OpenAI API Test</h1>
        <p className="text-gray-600 mb-8">Using Responses API with gpt-6-luna model</p>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter your prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="write a haiku about ai"
            />
          </div>

          <button
            onClick={testOpenAI}
            disabled={loading || !prompt.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {loading ? 'Generating...' : 'Test OpenAI API'}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold mb-2">Result:</p>
              <p className="text-gray-800 whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-semibold text-blue-900 mb-2">Quick Examples:</h2>
          <div className="space-y-2">
            <button
              onClick={() => setPrompt('write a haiku about ai')}
              className="block w-full text-left px-3 py-2 bg-white rounded hover:bg-blue-100 text-sm"
            >
              🎋 Write a haiku about AI
            </button>
            <button
              onClick={() => setPrompt('Explain quantum computing in simple terms')}
              className="block w-full text-left px-3 py-2 bg-white rounded hover:bg-blue-100 text-sm"
            >
              🔬 Explain quantum computing
            </button>
            <button
              onClick={() => setPrompt('Give me 5 creative product names for a smart water bottle')}
              className="block w-full text-left px-3 py-2 bg-white rounded hover:bg-blue-100 text-sm"
            >
              💡 Generate product names
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
