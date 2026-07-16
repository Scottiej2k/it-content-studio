import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Save, Key, SlidersHorizontal, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

export function Settings() {
  const openRouterApiKey = useStore(state => state.openRouterApiKey);
  const googleGeminiApiKey = useStore(state => state.googleGeminiApiKey);
  const aiProvider = useStore(state => state.aiProvider);
  const selectedModel = useStore(state => state.selectedModel);
  const baseUrl = useStore(state => state.baseUrl);
  const maxTokens = useStore(state => state.maxTokens);
  const targetWordCount = useStore(state => state.targetWordCount);
  
  const setOpenRouterApiKey = useStore(state => state.setOpenRouterApiKey);
  const setGoogleGeminiApiKey = useStore(state => state.setGoogleGeminiApiKey);
  const setAiProvider = useStore(state => state.setAiProvider);
  const setSelectedModel = useStore(state => state.setSelectedModel);
  const setBaseUrl = useStore(state => state.setBaseUrl);
  const setMaxTokens = useStore(state => state.setMaxTokens);
  const setTargetWordCount = useStore(state => state.setTargetWordCount);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleProviderChange = (provider: 'openrouter' | 'google') => {
    setAiProvider(provider);
    if (provider === 'google') {
      setSelectedModel('gemini-1.5-flash');
    } else {
      setSelectedModel('google/gemini-pro');
    }
  };

  const testConnection = async () => {
    if (aiProvider === 'openrouter' && !openRouterApiKey) {
      setTestResult({ success: false, message: "Please enter an OpenRouter API key first." });
      return;
    }
    if (aiProvider === 'google' && !googleGeminiApiKey) {
      setTestResult({ success: false, message: "Please enter a Google Gemini API key first." });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      if (aiProvider === 'openrouter') {
        const openai = new OpenAI({
          baseURL: baseUrl.trim(),
          apiKey: openRouterApiKey.trim(),
          dangerouslyAllowBrowser: true,
          defaultHeaders: {
            "HTTP-Referer": window.location.origin,
            "X-Title": "Italian Content Studio",
          }
        });

        const response = await openai.chat.completions.create({
          model: selectedModel.trim(),
          messages: [{ role: "user", content: "Say 'Hello' if you receive this." }],
          max_tokens: 10,
        });

        if (response.choices && response.choices.length > 0) {
          setTestResult({ success: true, message: "Connection successful!" });
        } else {
          setTestResult({ success: false, message: "Received empty response from API." });
        }
      } else {
        const ai = new GoogleGenAI({ apiKey: googleGeminiApiKey.trim() });
        const response = await ai.models.generateContent({
          model: selectedModel.trim(),
          contents: "Say 'Hello' if you receive this.",
        });
        
        if (response.text) {
          setTestResult({ success: true, message: "Connection successful!" });
        } else {
          setTestResult({ success: false, message: "Received empty response from API." });
        }
      }
    } catch (error: any) {
      console.error("Connection test failed:", error);
      setTestResult({ success: false, message: error.message || "Connection failed." });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="text-3xl font-semibold text-stone-900">Settings</h1>
        <p className="text-stone-500 mt-2">Configure AI generation and application preferences.</p>
      </header>

      <section className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center gap-2">
          <Key className="w-5 h-5 text-stone-500" />
          <h2 className="font-semibold text-stone-800">API Configuration</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              AI Provider
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="aiProvider"
                  value="google"
                  checked={aiProvider === 'google'}
                  onChange={() => handleProviderChange('google')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-stone-800">Google AI Studio (Gemini)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="aiProvider"
                  value="openrouter"
                  checked={aiProvider === 'openrouter'}
                  onChange={() => handleProviderChange('openrouter')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-stone-800">OpenRouter</span>
              </label>
            </div>
          </div>

          {aiProvider === 'openrouter' && (
            <>
              <div>
                <label htmlFor="baseUrl" className="block text-sm font-medium text-stone-700 mb-1">
                  Base URL
                </label>
                <input
                  type="text"
                  id="baseUrl"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://openrouter.ai/api/v1"
                  className="w-full border-stone-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                <p className="mt-2 text-xs text-stone-500">Must be an HTTPS OpenAI-compatible endpoint.</p>
              </div>

              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-stone-700 mb-1">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={openRouterApiKey}
                  onChange={(e) => setOpenRouterApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full border-stone-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                <p className="mt-2 text-xs text-stone-500">Stored locally in your browser. Never sent to our servers.</p>
              </div>
            </>
          )}

          {aiProvider === 'google' && (
            <div>
              <label htmlFor="googleApiKey" className="block text-sm font-medium text-stone-700 mb-1">
                Google Gemini API Key
              </label>
              <input
                type="password"
                id="googleApiKey"
                value={googleGeminiApiKey}
                onChange={(e) => setGoogleGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full border-stone-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
              <p className="mt-2 text-xs text-stone-500">Stored locally in your browser. Get one from Google AI Studio.</p>
            </div>
          )}

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-stone-700 mb-1">
              Model Slug
            </label>
            <input
              type="text"
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              placeholder={aiProvider === 'google' ? "gemini-1.5-flash" : "e.g., anthropic/claude-3.5-sonnet"}
              className="w-full border-stone-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              list="model-suggestions"
            />
            <datalist id="model-suggestions">
              {aiProvider === 'google' ? (
                <>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
                </>
              ) : (
                <>
                  <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Recommended)</option>
                  <option value="openai/gpt-4o">GPT-4o</option>
                  <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</option>
                  <option value="google/gemini-pro">Gemini Pro</option>
                </>
              )}
            </datalist>
            <p className="mt-2 text-xs text-stone-500">Enter any valid model slug.</p>
          </div>

          <div>
            <label htmlFor="maxTokens" className="block text-sm font-medium text-stone-700 mb-1">
              Max Tokens (optional)
            </label>
            <input
              type="number"
              id="maxTokens"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value, 10) || 32000)}
              className="w-full border-stone-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
          </div>
          
          <div className="pt-4 flex items-center gap-4">
            <button 
              onClick={testConnection}
              disabled={isTesting}
              className="px-4 py-2 bg-stone-100 text-stone-700 rounded-md text-sm font-medium hover:bg-stone-200 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Test Connection
            </button>
            
            {testResult && (
              <div className={`flex items-center gap-2 text-sm font-medium ${testResult.success ? 'text-emerald-600' : 'text-red-600'}`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {testResult.message}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-stone-500" />
          <h2 className="font-semibold text-stone-800">Generation Preferences</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Default Story Tone
            </label>
            <select className="w-full border-stone-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
              <option>Warm / Humorous (Default)</option>
              <option>Dramatic</option>
              <option>Mixed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Target Word Count per Episode
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="4000" 
                max="12000" 
                step="500" 
                value={targetWordCount} 
                onChange={(e) => setTargetWordCount(parseInt(e.target.value, 10))}
                className="flex-1" 
              />
              <span className="text-sm font-medium text-stone-700 w-16 text-right">{targetWordCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
