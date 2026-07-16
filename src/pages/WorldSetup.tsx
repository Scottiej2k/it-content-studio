import { useState } from 'react';
import { useStore } from '../store/useStore';

export function WorldSetup() {
  const worldBible = useStore(state => state.worldBible);
  const episodeOutlines = useStore(state => state.episodeOutlines);
  const [activeTab, setActiveTab] = useState<'bible' | 'outlines'>('bible');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-stone-900">World Setup</h1>
        <p className="text-stone-500 mt-2">Manage the Story World Bible and Episode Outlines.</p>
      </header>

      <div className="flex border-b border-stone-200">
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === 'bible'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-stone-500 hover:text-stone-700'
          }`}
          onClick={() => setActiveTab('bible')}
        >
          Story World Bible
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === 'outlines'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-stone-500 hover:text-stone-700'
          }`}
          onClick={() => setActiveTab('outlines')}
        >
          Episode Outlines
        </button>
      </div>

      {activeTab === 'bible' && (
        <section className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
            <h2 className="font-semibold text-stone-800">Story World Bible</h2>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Finalized</span>
          </div>
          <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Series Title</h3>
            <p className="text-stone-900 text-lg">{worldBible.seriesTitle}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Setting</h3>
            <p className="text-stone-800 whitespace-pre-wrap">{worldBible.setting}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Genre</h3>
              <p className="text-stone-800">{worldBible.genre}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Tone</h3>
              <p className="text-stone-800">{worldBible.tone}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Core Cast</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {worldBible.characters.map((char, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-stone-900">{char.name}</h4>
                    <span className="text-xs text-stone-500 bg-stone-200 px-2 py-0.5 rounded">{char.age}</span>
                  </div>
                  <p className="text-sm text-indigo-700 font-medium mb-2">{char.role}</p>
                  <p className="text-sm text-stone-600">{char.profile}</p>
                </div>
              ))}
            </div>
          </div>

          {worldBible.supportingCast && worldBible.supportingCast.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Supporting Cast</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {worldBible.supportingCast.map((char, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <h4 className="font-semibold text-stone-900 mb-2">{char.name}</h4>
                    <p className="text-sm text-indigo-700 font-medium mb-2">{char.role}</p>
                    <p className="text-sm text-stone-600">{char.profile}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {worldBible.relationships && worldBible.relationships.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Relationships</h3>
              <div className="space-y-3">
                {worldBible.relationships.map((rel, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <h4 className="font-semibold text-stone-900 mb-1">{rel.characters}</h4>
                    <p className="text-sm text-stone-600">{rel.dynamic}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Locations</h3>
            <ul className="space-y-3">
              {worldBible.locations.map((loc, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="font-medium text-stone-900 min-w-[150px]">{loc.name}:</span>
                  <span className="text-stone-600">{loc.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {worldBible.seasons && worldBible.seasons.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Season Architecture</h3>
              <div className="space-y-4">
                {worldBible.seasons.map((season, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-stone-900">Season {season.seasonNumber}: {season.title}</h4>
                      <span className="text-xs text-stone-500 bg-stone-200 px-2 py-0.5 rounded">{season.episodes} Episodes</span>
                    </div>
                    <p className="text-sm text-stone-600">{season.primaryArc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {worldBible.recurringStoryEngines && worldBible.recurringStoryEngines.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Recurring Story Engines</h3>
              <ul className="list-disc list-inside space-y-2 text-stone-600 text-sm">
                {worldBible.recurringStoryEngines.map((engine, idx) => (
                  <li key={idx}>{engine}</li>
                ))}
              </ul>
            </div>
          )}

          {worldBible.characterMovements && worldBible.characterMovements.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Long-Run Character Movement</h3>
              <ul className="space-y-3">
                {worldBible.characterMovements.map((movement, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="font-medium text-stone-900 min-w-[100px]">{movement.character}:</span>
                    <span className="text-stone-600 text-sm">{movement.movement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {worldBible.voiceStrategy && worldBible.voiceStrategy.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Character Voice Strategy</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-stone-600">
                  <thead className="text-xs text-stone-700 uppercase bg-stone-100">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Character</th>
                      <th className="px-4 py-3">Speech Pattern</th>
                      <th className="px-4 py-3 rounded-tr-lg">Best Uses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {worldBible.voiceStrategy.map((voice, idx) => (
                      <tr key={idx} className="border-b border-stone-100 last:border-0">
                        <td className="px-4 py-3 font-medium text-stone-900">{voice.character}</td>
                        <td className="px-4 py-3">{voice.speechPattern}</td>
                        <td className="px-4 py-3">{voice.bestUses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {worldBible.seasons && worldBible.seasons.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Seasons</h3>
              <div className="space-y-4">
                {worldBible.seasons.map((season, idx) => (
                  <div key={idx} className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                    <h4 className="font-medium text-stone-900 mb-1">Season {season.seasonNumber}: {season.title}</h4>
                    <p className="text-sm text-stone-600 mb-2">{season.episodes} Episodes</p>
                    <p className="text-sm text-stone-800">{season.primaryArc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      {activeTab === 'outlines' && (
      <section className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
          <h2 className="font-semibold text-stone-800">Episode Outlines</h2>
          <span className="text-sm text-stone-500">{episodeOutlines.length} Episodes</span>
        </div>
        <div className="divide-y divide-stone-200">
          {episodeOutlines.map((outline) => (
            <div key={outline.chapterNumber} className="p-6 hover:bg-stone-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-stone-900">
                  <span className="text-stone-400 mr-2">E{outline.chapterNumber.toString().padStart(2, '0')}</span>
                  {outline.title}
                </h3>
                <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">
                  {outline.cefrLevel}
                </span>
              </div>
              <p className="text-sm text-indigo-600 font-medium mb-3">{outline.grammarFocus}</p>
              <div className="space-y-2 text-sm text-stone-700">
                {outline.episodeJob && <p className="italic text-stone-600 mb-2">{outline.episodeJob}</p>}
                <p><span className="font-medium text-stone-900">Logline:</span> {outline.logline}</p>
                <p><span className="font-medium text-stone-900">A-Story:</span> {outline.aStory}</p>
                <p><span className="font-medium text-stone-900">B-Story:</span> {outline.bStory}</p>
                <p><span className="font-medium text-stone-900">C-Story:</span> {outline.cStory}</p>
                
                {outline.coreLanguageTarget && outline.coreLanguageTarget.length > 0 && (
                  <div className="mt-3">
                    <span className="font-medium text-stone-900">Core Language Target:</span>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {outline.coreLanguageTarget.map((target: string, i: number) => (
                        <li key={i}>{target}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {outline.storyBeats && outline.storyBeats.length > 0 && (
                  <div className="mt-3">
                    <span className="font-medium text-stone-900">Story Beats:</span>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {outline.storyBeats.map((beat: string, i: number) => (
                        <li key={i}>{beat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {outline.emotionalMovement && <p className="mt-3"><span className="font-medium text-stone-900">Emotional Movement:</span> {outline.emotionalMovement}</p>}
                
                {outline.writerNotes && outline.writerNotes.length > 0 && (
                  <div className="mt-3">
                    <span className="font-medium text-stone-900">Writer Notes:</span>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {outline.writerNotes.map((note: string, i: number) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}
    </div>
  );
}
