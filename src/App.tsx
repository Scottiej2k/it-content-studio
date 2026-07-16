/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { WorldSetup } from './pages/WorldSetup';
import { Generate } from './pages/Generate';
import { Library } from './pages/Library';
import { ChapterEditor } from './pages/ChapterEditor';
import { Export } from './pages/Export';
import { TTS } from './pages/TTS';
import { Settings } from './pages/Settings';
import { AuthProvider } from './AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="world-setup" element={<WorldSetup />} />
              <Route path="generate" element={<Generate />} />
              <Route path="library" element={<Library />} />
              <Route path="library/:id" element={<ChapterEditor />} />
              <Route path="export" element={<Export />} />
              <Route path="tts" element={<TTS />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
