import React, { useState } from 'react';
import {
  Modal,
  Fade,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Chip,
  IconButton,
  FormLabel,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import SpcTreeBrowser from './SpcTreeBrowser';

interface ProcessStep {
  id: string;
  stepNumber: number;
  description: string;
  detailedInstructions: string;
  spcId: string;
  spcName: string;
  spcPath: string;
  attachments: string[];
  notes: string;
}

interface EditStepDialogProps {
  step: ProcessStep;
  primarySpcPath: string;
  onSave: (step: ProcessStep) => void;
  onClose: () => void;
}

const EditStepDialog: React.FC<EditStepDialogProps> = ({ step, primarySpcPath, onSave, onClose }) => {
  const [description, setDescription] = useState(step.description);
  const [detailedInstructions, setDetailedInstructions] = useState(step.detailedInstructions);
  const [selectedSpcId, setSelectedSpcId] = useState(step.spcId);
  const [selectedSpcName, setSelectedSpcName] = useState(step.spcName);
  const [selectedSpcPath, setSelectedSpcPath] = useState(step.spcPath);
  const [notes, setNotes] = useState(step.notes);
  const [showSpcBrowser, setShowSpcBrowser] = useState(false);

  const matchesPrimary = selectedSpcPath === primarySpcPath;

  const handleSpcChange = (spcId: string, spcName: string, spcPath: string) => {
    setSelectedSpcId(spcId);
    setSelectedSpcName(spcName);
    setSelectedSpcPath(spcPath);
    setShowSpcBrowser(false);
  };

  const handleSave = () => {
    onSave({
      ...step,
      description,
      detailedInstructions,
      spcId: selectedSpcId,
      spcName: selectedSpcName,
      spcPath: selectedSpcPath,
      notes,
    });
  };

  const recommendations = [
    { id: 'SPC_305_002', name: 'Vendor Due Diligence', path: 'Operations > Compliance & Risk Management > Vendor Due Diligence', reason: 'Based on keywords: "compliance", "check"' },
    { id: 'SPC_101_001', name: 'Vendor Setup', path: 'Finance > Accounts Payable > Vendor Setup', reason: 'Primary process category' },
    { id: 'SPC_306_001', name: 'Legal & Contracts', path: 'Operations > Legal & Contracts', reason: 'Also related to vendor approval' },
  ];

  return (
    <>
      <Modal
        open={!showSpcBrowser}
        onClose={onClose}
        closeAfterTransition
      >
        <Fade in={!showSpcBrowser}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              borderRadius: '30px',
              p: '10px',
              minWidth: 700,
              maxWidth: 800,
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            {/* Modal Header */}
            <Box sx={{ p: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 28, fontWeight: 400 }}>
                Edit Step {step.stepNumber}
              </Typography>
              <CloseIcon sx={{ cursor: 'pointer', color: 'grey.600' }} onClick={onClose} />
            </Box>

            <Divider />

            {/* Modal Content */}
            <Box sx={{ p: '10px 40px 40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Step Description */}
              <Box>
                <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>
                  Step Description *
                </FormLabel>
                <TextField
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this step..."
                  InputProps={{
                    sx: {
                      minHeight: 46,
                      borderRadius: '50px',
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      fontSize: 14,
                      fontWeight: 500,
                    }
                  }}
                />
              </Box>

              {/* Detailed Instructions */}
              <Box>
                <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>
                  Detailed Instructions
                </FormLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={detailedInstructions}
                  onChange={(e) => setDetailedInstructions(e.target.value)}
                  placeholder="Step-by-step instructions..."
                  InputProps={{
                    sx: {
                      borderRadius: '20px',
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      fontSize: 14,
                      fontWeight: 500,
                    }
                  }}
                />
              </Box>

            {/* Attachments Section */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Attachments
              </Typography>
              {step.attachments.map((file, index) => (
                <Chip
                  key={index}
                  icon={<AttachFileIcon fontSize="small" />}
                  label={file}
                  onDelete={() => {}}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
              <Button size="small" variant="outlined">
                + Upload File
              </Button>
            </Box>

            {/* Category Linking Section */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Process Category
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                <LightbulbIcon fontSize="small" color="info" />
                <Typography variant="caption" color="text.secondary">
                  This determines which business area this step belongs to
                </Typography>
              </Box>

              <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">Current Selection:</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {selectedSpcPath}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({selectedSpcName})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ChangeCircleIcon />}
                      onClick={() => setShowSpcBrowser(true)}
                    >
                      Change
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ fontSize: 12 }}
                      onClick={() => {
                        setSelectedSpcId('');
                        setSelectedSpcName('Not categorized');
                        setSelectedSpcPath('No category selected');
                        setNotes('Could not find appropriate category');
                      }}
                    >
                      Can't find it
                    </Button>
                  </Box>
                </Box>
              </Paper>

              {!matchesPrimary && (
                <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
                  <Typography variant="subtitle2" gutterBottom>
                    Note: This is different from the process primary category
                  </Typography>
                  <Typography variant="body2">
                    Primary category: {primarySpcPath}
                  </Typography>
                </Alert>
              )}

              {!matchesPrimary && (
                <Box>
                  <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>
                    Why link to a different category?
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Explain why this step belongs to a different category..."
                    InputProps={{
                      sx: {
                        borderRadius: '20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        fontSize: 14,
                        fontWeight: 500,
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', ml: 1 }}>
                    This helps others understand cross-functional processes
                  </Typography>
                </Box>
              )}

              {/* Recommendations */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Recommendations (Based on keywords and process):
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recommendations.map((rec) => (
                    <Paper
                      key={rec.id}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        border: 1,
                        borderColor: rec.id === selectedSpcId ? 'primary.main' : 'divider',
                        bgcolor: rec.id === selectedSpcId ? 'primary.50' : 'transparent',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
                      }}
                      onClick={() => handleSpcChange(rec.id, rec.name, rec.path)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {rec.id === selectedSpcId && <CheckIcon fontSize="small" color="success" />}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={rec.id === selectedSpcId ? 600 : 400}>
                            • {rec.path}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {rec.reason}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Box>
            </Box>

            <Divider sx={{ mt: 2 }} />

            {/* Actions */}
            <Box sx={{ p: '15px 40px', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px' }}>
              <Button
                onClick={onClose}
                size="large"
                sx={{
                  borderRadius: '50px',
                  minHeight: 46,
                  fontWeight: 700,
                  fontSize: 14,
                  minWidth: 100,
                  color: 'error.main',
                  backgroundColor: 'error.50',
                  '&:hover': {
                    backgroundColor: 'error.main',
                    color: 'white',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                disabled={!description}
                sx={{
                  borderRadius: '50px',
                  minHeight: 46,
                  fontWeight: 700,
                  fontSize: 14,
                  minWidth: 160,
                }}
              >
                Save Step
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* SPC Tree Browser */}
      {showSpcBrowser && (
        <SpcTreeBrowser
          open={showSpcBrowser}
          onClose={() => setShowSpcBrowser(false)}
          onSelect={handleSpcChange}
          primarySpcPath={primarySpcPath}
          currentSelection={selectedSpcId}
        />
      )}
    </>
  );
};

export default EditStepDialog;
