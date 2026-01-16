import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Tabs, Tab, CssBaseline, IconButton, Tooltip } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CurrentStateProcessLibrary from './components/CurrentStateProcessLibrary';
import FutureStateProcessLibrary from './components/FutureStateProcessLibrary';
import ConnectOldToNew from './components/ConnectOldToNew';
import TrainingModal from './components/TrainingModal';
import PresentationCapture from './components/PresentationCapture';
import { metaSpaTheme } from './theme';

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [trainingModalOpen, setTrainingModalOpen] = useState(false);
  const [capturingProcess, setCapturingProcess] = useState<{ name: string; spcPath: string } | null>(null);

  return (
    <ThemeProvider theme={metaSpaTheme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0}>
          <Tabs
            value={currentTab}
            onChange={(e, v) => setCurrentTab(v)}
            textColor="inherit"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#FFFFFF',
              },
            }}
            sx={{
              bgcolor: 'primary.main'
            }}
          >
            <Tab label="Current State Process Library" />
            <Tab label="Future State Process Library" />
            <Tab label="Map Future to Current" />
          </Tabs>
        </AppBar>

        <Box sx={{ flex: 1, overflow: 'hidden', bgcolor: 'grey.50' }}>
          {capturingProcess ? (
            <PresentationCapture
              processName={capturingProcess.name}
              primarySpcPath={capturingProcess.spcPath}
              onBack={() => setCapturingProcess(null)}
            />
          ) : (
            <>
              {currentTab === 0 && (
                <CurrentStateProcessLibrary
                  onStartCapture={(name, spcPath) => setCapturingProcess({ name, spcPath })}
                  onNavigateToMapping={() => setCurrentTab(2)}
                />
              )}
              {currentTab === 1 && (
                <FutureStateProcessLibrary
                  onStartCapture={(name, spcPath) => setCapturingProcess({ name, spcPath })}
                  onNavigateToMapping={() => setCurrentTab(2)}
                />
              )}
              {currentTab === 2 && <ConnectOldToNew />}
            </>
          )}
        </Box>

        <TrainingModal
          open={trainingModalOpen}
          onClose={() => setTrainingModalOpen(false)}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
