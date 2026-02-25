
import { useAtom, useAtomValue } from 'jotai';
import { CssBaseline, ThemeProvider, createTheme, Box, IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { themeModeAtom } from './atoms/layoutAtoms';
import { showAboutAtom, showSubmitAtom, showReqAtom, requestsAtom } from './atoms/modalAtoms';
import { AILibraryPage } from './pages/AILibraryPage';

function App() {
  const [mode, setMode] = useAtom(themeModeAtom);
  const [, setShowAbout] = useAtom(showAboutAtom);
  const [, setShowSubmit] = useAtom(showSubmitAtom);
  const [, setShowReq] = useAtom(showReqAtom);
  const requests = useAtomValue(requestsAtom);

  const theme = createTheme({
    palette: { mode },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: '#0b0b0b',
          color: '#f0f0f0',
          fontFamily: 'var(--sans)',
        }}
      >
        {/* Nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
            height: 52,
            borderBottom: '1px solid #1a1a1a',
            position: 'sticky',
            top: 0,
            background: 'rgba(11,11,11,0.85)',
            backdropFilter: 'blur(22px)',
            zIndex: 100,
          }}
        >
          {/* Left: Logo + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {['#D4845A', '#6AADCF', '#CBAA5E'].map((c) => (
                <div key={c} style={{ width: 3, height: 16, borderRadius: 1, background: c }} />
              ))}
            </div>
            <span
              style={{
                fontSize: 14.5,
                fontWeight: 300,
                color: '#ccc',
                fontFamily: 'var(--serif)',
                letterSpacing: '-0.01em',
              }}
            >
              AI Library
            </span>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setShowAbout(true)}
              style={{
                background: 'transparent',
                border: '1px solid #262626',
                borderRadius: 7,
                padding: '4px 10px',
                color: '#555',
                fontSize: 10.5,
                fontFamily: 'var(--sans)',
                cursor: 'pointer',
                transition: 'border-color 0.12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#444')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#262626')}
            >
              What's this?
            </button>
            <button
              onClick={() => setShowReq(true)}
              style={{
                background: 'transparent',
                border: '1px solid #262626',
                borderRadius: 7,
                padding: '4px 10px',
                color: '#555',
                fontSize: 10.5,
                fontFamily: 'var(--sans)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'border-color 0.12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#444')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#262626')}
            >
              <span
                style={{
                  fontSize: 9,
                  background: 'rgba(106,173,207,0.12)',
                  color: '#6AADCF',
                  padding: '1px 6px',
                  borderRadius: 100,
                  fontFamily: 'var(--mono)',
                }}
              >
                {requests.length}
              </span>
              Requests
            </button>
            <button
              onClick={() => setShowSubmit(true)}
              style={{
                background: '#D4845A',
                border: 'none',
                borderRadius: 7,
                padding: '5px 12px',
                color: '#111',
                fontSize: 11,
                fontWeight: 600,
                fontFamily: 'var(--sans)',
                cursor: 'pointer',
                transition: 'opacity 0.12s',
              }}
            >
              + Contribute
            </button>
            <IconButton
              size="small"
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              sx={{ color: '#555', ml: 0.5 }}
            >
              {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
          </div>
        </nav>

        <AILibraryPage />
      </Box>
    </ThemeProvider>
  );
}

export default App;
