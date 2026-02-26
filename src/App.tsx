import { useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  CssBaseline,
  ThemeProvider,
  Box
} from '@mui/material';
import { DarkMode, LightMode, ChatBubble, Refresh } from '@mui/icons-material';
import {
  createFirmTheme,
  StandardLayout,
  HeaderTitleGroup,
  StandardChip,
  StandardAuthGate,
  StandardIconButton,
  StandardAppLoader,
  StandardActionGroup
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StandardAppLoader
        loading={authLoading && !devMode}
        appName="AI Sandbox"
        appSub="Digital Design Research"
        mode={mode}
        onBypass={() => setDevMode(true)}
      >
        <FirebaseSync />
        <StandardLayout
          mode={mode}
          headerProps={{
            title: TitleArea,
            variant: 'som',
            actions: (
              <StandardActionGroup spacing={1.5}>
                <StandardIconButton
                  icon={Refresh}
                  label="Refresh Content"
                  onClick={() => setRefresh(prev => prev + 1)}
                  variant="small"
                  sx={{
                    color: mode === 'light' ? '#000000' : 'inherit',
                    width: 28,
                    height: 28
                  }}
                />
                <StandardIconButton
                  icon={ChatBubble}
                  label="Submit Feedback"
                  onClick={() => setShowFeedback(true)}
                  variant="small"
                  sx={{
                    color: mode === 'light' ? '#000000' : 'inherit',
                    width: 28,
                    height: 28
                  }}
                />
                <StandardIconButton
                  icon={mode === 'dark' ? LightMode : DarkMode}
                  label={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode`}
                  onClick={toggleTheme}
                  variant="small"
                  sx={{
                    color: mode === 'light' ? '#000000' : 'inherit',
                    width: 28,
                    height: 28
                  }}
                />
                <AuthButton />
              </StandardActionGroup>
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
      </StandardAppLoader>
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
