import { Mic, Play, Settings2 } from 'lucide-react';

export function TTS() {
  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="text-3xl font-semibold text-stone-900">Text-to-Speech</h1>
        <p className="text-stone-500 mt-2">Manage audio generation for your Italian curriculum.</p>
      </header>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
        <p className="font-medium flex items-center gap-2"><Mic className="w-4 h-4" /> TTS Backend Deferred</p>
        <p className="mt-1">The QWEN3TTS backend integration is planned for a future phase. This UI is a placeholder.</p>
      </div>

      <section className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden opacity-75">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-stone-500" />
            <h2 className="font-semibold text-stone-800">Bulk Audio Export Queue</h2>
          </div>
          <span className="text-xs font-medium bg-stone-200 text-stone-600 px-2 py-1 rounded">Coming Soon</span>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Voice Selection</label>
              <select disabled className="w-full border-stone-300 rounded-md shadow-sm bg-stone-50 sm:text-sm p-2 border">
                <option>Isabella (Standard Italian, Female)</option>
                <option>Marco (Standard Italian, Male)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Reading Speed</label>
              <div className="flex items-center gap-4">
                <input type="range" min="0.75" max="1.5" step="0.05" defaultValue="0.9" disabled className="flex-1" />
                <span className="text-sm font-medium text-stone-700 w-12 text-right">0.9x</span>
              </div>
            </div>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    <input type="checkbox" disabled className="rounded text-indigo-600" />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Chapter</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Duration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-200">
                {[1, 2, 3].map((num) => (
                  <tr key={num}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" disabled className="rounded text-indigo-600" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">Chapter {num}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-stone-100 text-stone-800">Queued</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">~45m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
            <p className="text-sm text-stone-500">Estimated total duration: ~135m</p>
            <button disabled className="flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-400 cursor-not-allowed">
              <Play className="w-4 h-4" />
              Start Audio Generation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
