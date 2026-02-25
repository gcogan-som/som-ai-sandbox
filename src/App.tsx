import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { CssBaseline, ThemeProvider, Box, IconButton, Button, Tooltip, Typography } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { createFirmTheme, StandardLayout, StandardLogo } from '@som/ui';
import { themeModeAtom } from './atoms/layoutAtoms';
import { showAboutAtom, showSubmitAtom, showReqAtom, requestsAtom } from './atoms/modalAtoms';
import { AILibraryPage } from './pages/AILibraryPage';

function App() {
  const [mode, setMode] = useAtom(themeModeAtom);
  const [, setShowAbout] = useAtom(showAboutAtom);
  const [, setShowSubmit] = useAtom(showSubmitAtom);
  const [, setShowReq] = useAtom(showReqAtom);
  const requests = useAtomValue(requestsAtom);

  const theme = useMemo(() => createFirmTheme('browser', mode), [mode]);

  const toggleTheme = () => setMode(mode === 'dark' ? 'light' : 'dark');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StandardLayout
        mode={mode}
        headerProps={{
          title: (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StandardLogo variant={mode === 'dark' ? 'white' : 'black'} height={20} />
              <Box sx={{ width: '1px', height: 16, bgcolor: 'divider' }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', letterSpacing: '0.01em' }}>
                AI Library
              </Typography>
            </Box>
          ),
          environment: 'DEV',
          actions: (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                size="small"
                variant="text"
                onClick={() => setShowAbout(true)}
                sx={{ fontSize: '11px', color: 'text.secondary' }}
              >
                What's this?
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowReq(true)}
                sx={{ fontSize: '11px' }}
              >
                Requests{requests.length > 0 ? ` (${requests.length})` : ''}
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => setShowSubmit(true)}
                sx={{ fontSize: '11px' }}
              >
                + Contribute
              </Button>
              <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode`}>
                <IconButton size="small" onClick={toggleTheme} color="inherit">
                  {mode === 'dark'
                    ? <LightMode sx={{ fontSize: 18 }} />
                    : <DarkMode sx={{ fontSize: 18 }} />}
                </IconButton>
              </Tooltip>
            </Box>
          ),
        }}
      >
        <AILibraryPage />
      </StandardLayout>
    </ThemeProvider>
  );
}

export default App;
