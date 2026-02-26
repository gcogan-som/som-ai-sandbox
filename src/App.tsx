import { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  CssBaseline,
  ThemeProvider,
  IconButton,
  Tooltip,
  Stack,
  Box,
  Typography,
  Button
} from '@mui/material';
import { DarkMode, LightMode, ChatBubble } from '@mui/icons-material';
import {
  createFirmTheme,
  StandardLayout,
  HeaderTitleGroup,
  StandardChip,
  StandardAuthGate,
  StandardLogo,
  StandardIconButton
} from '@som/ui';
import { themeModeAtom } from './atoms/layoutAtoms';
import { showAboutAtom, showSubmitAtom, showReqAtom, showFeedbackAtom } from './atoms/modalAtoms';
import { isDevModeAtom, refreshAtom } from './atoms/appAtoms';
import { AILibraryPage } from './pages/AILibraryPage';
import { FirebaseSync } from './components/FirebaseSync';
import { AuthProvider, useAuth } from './lib/auth/AuthContext';
import { FirebaseAuthProvider } from './lib/auth/FirebaseAuthProvider';
import { AuthButton } from './components/shared/AuthButton';
import { AboutPanel } from './components/modals/AboutPanel';
import { ContributeModal } from './components/modals/ContributeModal';
import { RequestModal } from './components/modals/RequestModal';
import { FeedbackModal } from './components/modals/FeedbackModal';

function AppContent() {
  const [mode, setMode] = useAtom(themeModeAtom);
  const [showAbout, setShowAbout] = useAtom(showAboutAtom);
  const [showSubmit, setShowSubmit] = useAtom(showSubmitAtom);
  const [showReq] = useAtom(showReqAtom);
  const [, setShowFeedback] = useAtom(showFeedbackAtom);
  const [, setRefresh] = useAtom(refreshAtom);
  const [devMode, setDevMode] = useAtom(isDevModeAtom);
  const { isAuthenticated, login, loading: authLoading } = useAuth();
  const [showTimeout, setShowTimeout] = useState(false);

  // Connection timeout for Mainland China/Hong Kong where Firebase is blocked
  useEffect(() => {
    let timer: number;
    if (authLoading) {
      timer = window.setTimeout(() => setShowTimeout(true), 5000);
    }
    return () => clearTimeout(timer);
  }, [authLoading]);

  const loading = authLoading && !devMode;

  const theme = useMemo(() => createFirmTheme('browser', mode), [mode]);

  const TitleArea = (
    <HeaderTitleGroup
      title="AI Sandbox"
      variant="som"
      logo={
        <Box
          component="img"
          src="/som-logo.png"
          sx={{
            height: 28,
            filter: mode === 'dark' ? 'invert(1)' : 'none',
            cursor: 'pointer'
          }}
        />
      }
      searchSlot={
        <Box
          onClick={() => setDevMode(!devMode)}
          sx={{ cursor: 'pointer' }}
        >
          <StandardChip
            label="DEV"
            size="small"
            color={devMode ? "info" : "default"}
            variant={devMode ? "filled" : "outlined"}
            sx={{
              height: 18,
              fontSize: '9px',
              fontWeight: 700,
              borderRadius: '4px',
              opacity: devMode ? 1 : 0.4,
              transition: 'all 0.2s',
              '&:hover': { opacity: 1, bgcolor: devMode ? undefined : 'action.hover' },
              '& .MuiChip-label': { px: 0.8 }
            }}
          />
        </Box>
      }
    />
  );

  const toggleTheme = () => setMode(mode === 'dark' ? 'light' : 'dark');

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            gap: 3,
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          <StandardLogo height={48} variant={mode === 'dark' ? 'white' : 'black'} />
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: '0.2em', opacity: 0.6 }}
          >
            Initializing Sandbox
          </Typography>

          {showTimeout && (
            <Stack spacing={2} alignItems="center" sx={{ mt: 4, animation: 'fadeIn 0.5s ease-out' }}>
              <Typography variant="caption" color="text.disabled" sx={{ maxWidth: 240, textAlign: 'center' }}>
                Connection taking longer than usual. If you are in the Shanghai office, you may need to enter offline mode.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setDevMode(true)}
                sx={{ borderColor: 'divider', color: 'text.secondary' }}
              >
                Enter Offline Mode
              </Button>
            </Stack>
          )}
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FirebaseSync />
      <StandardLayout
        mode={mode}
        headerProps={{
          title: TitleArea,
          variant: 'som',
          actions: (
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <StandardIconButton
                name="refresh"
                label="Refresh Content"
                onClick={() => setRefresh(prev => prev + 1)}
                variant="small"
                sx={{
                  color: mode === 'light' ? '#000000' : 'inherit',
                  width: 28,
                  height: 28,
                  '& .MuiSvgIcon-root': { fontSize: 18 }
                }}
              />
              <Tooltip title="Submit Feedback">
                <IconButton
                  size="small"
                  onClick={() => setShowFeedback(true)}
                  color="inherit"
                  sx={{
                    width: 28,
                    height: 28,
                    color: mode === 'light' ? '#000000' : 'inherit'
                  }}
                >
                  <ChatBubble sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode`}>
                <IconButton
                  size="small"
                  onClick={toggleTheme}
                  color="inherit"
                  sx={{
                    width: 28,
                    height: 28,
                    color: mode === 'light' ? '#000000' : 'inherit'
                  }}
                >
                  {mode === 'dark'
                    ? <LightMode sx={{ fontSize: 18 }} />
                    : <DarkMode sx={{ fontSize: 18 }} />}
                </IconButton>
              </Tooltip>
              <AuthButton />
            </Stack>
          ),
        }}
      >
        <StandardAuthGate
          isAuthenticated={isAuthenticated}
          onLogin={login}
          isLoading={authLoading}
          title="AI SANDBOX"
          category="Digital Design Research"
          description="Please sign in with your SOM account to access the AI component library and resources."
        >
          <AILibraryPage />
        </StandardAuthGate>
      </StandardLayout>
      <AboutPanel open={showAbout} onClose={() => setShowAbout(false)} />
      <ContributeModal open={showSubmit} onClose={() => setShowSubmit(false)} />
      <RequestModal open={showReq} />
      <FeedbackModal />
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider provider={FirebaseAuthProvider}>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
