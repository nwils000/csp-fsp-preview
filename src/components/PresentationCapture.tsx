import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Card,
  CardContent,
  Alert,
  FormLabel,
  Divider,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LabelIcon from '@mui/icons-material/Label';
import CommentIcon from '@mui/icons-material/Comment';
import EditStepDialog from './EditStepDialog';

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

interface PresentationCaptureProps {
  processName: string;
  primarySpcPath: string;
  onBack: () => void;
}

const PresentationCapture: React.FC<PresentationCaptureProps> = ({
  processName,
  primarySpcPath,
  onBack,
}) => {
  const [presentationName, setPresentationName] = useState(`${processName} - As-Is ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`);
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<ProcessStep[]>([
    {
      id: 'step1',
      stepNumber: 1,
      description: 'Vendor submits W-9 and company info via email',
      detailedInstructions: '1. Receive email from vendor\n2. Download W-9 form\n3. Verify all required fields',
      spcId: 'SPC_101_001',
      spcName: 'Vendor Setup',
      spcPath: 'Finance > Accounts Payable > Vendor Setup',
      attachments: ['w9-template.pdf', 'vendor-form.xlsx'],
      notes: '',
    },
    {
      id: 'step2',
      stepNumber: 2,
      description: 'Finance coordinator enters vendor info into spreadsheet',
      detailedInstructions: '1. Open vendor tracking spreadsheet\n2. Add new row\n3. Enter vendor details',
      spcId: 'SPC_101_001',
      spcName: 'Vendor Setup',
      spcPath: 'Finance > Accounts Payable > Vendor Setup',
      attachments: ['vendor-tracking-sheet.xlsx'],
      notes: '',
    },
    {
      id: 'step3',
      stepNumber: 3,
      description: 'Check vendor against compliance blacklist',
      detailedInstructions: '1. Open compliance database\n2. Search for vendor name and tax ID\n3. Check OFAC, EU sanctions lists\n4. Document findings',
      spcId: 'SPC_305_002',
      spcName: 'Vendor Due Diligence',
      spcPath: 'Operations > Compliance & Risk Management > Vendor Due Diligence',
      attachments: ['compliance-checklist.pdf'],
      notes: 'Compliance check crosses departments',
    },
  ]);
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);

  const addNewStep = () => {
    const newStep: ProcessStep = {
      id: `step${steps.length + 1}`,
      stepNumber: steps.length + 1,
      description: '',
      detailedInstructions: '',
      spcId: 'SPC_101_001', // Default to primary
      spcName: 'Vendor Setup',
      spcPath: primarySpcPath,
      attachments: [],
      notes: '',
    };
    setSteps([...steps, newStep]);
    setEditingStep(newStep);
  };

  const handleEditStep = (step: ProcessStep) => {
    setEditingStep(step);
  };

  const handleSaveStep = (updatedStep: ProcessStep) => {
    setSteps(steps.map(s => s.id === updatedStep.id ? updatedStep : s));
    setEditingStep(null);
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId).map((s, index) => ({ ...s, stepNumber: index + 1 })));
  };

  const matchesPrimary = (step: ProcessStep) => {
    return step.spcPath === primarySpcPath;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            Capture: {processName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Primary Category: {primarySpcPath}
          </Typography>
        </Box>
      </Box>

      {/* Presentation Overview */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '20px' }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: 20, fontWeight: 600, mb: 2 }}>
          Presentation Overview
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Box>
            <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>
              Presentation Name
            </FormLabel>
            <TextField
              fullWidth
              value={presentationName}
              onChange={(e) => setPresentationName(e.target.value)}
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
          <Box>
            <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>
              Description
            </FormLabel>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of this process capture..."
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
        </Box>
      </Paper>

      {/* Process Steps */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 600 }}>Process Steps</Typography>
          <Button
            startIcon={<AddCircleIcon />}
            variant="outlined"
            onClick={addNewStep}
            sx={{
              borderRadius: '50px',
              minHeight: 46,
              fontWeight: 700,
              fontSize: 14,
              minWidth: 120,
            }}
          >
            Add Step
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {steps.map((step) => (
            <Card key={step.id} variant="outlined" sx={{ borderRadius: '20px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {step.stepNumber}. {step.description || 'Untitled Step'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleEditStep(step)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteStep(step.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {step.detailedInstructions && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, whiteSpace: 'pre-line' }}>
                    {step.detailedInstructions}
                  </Typography>
                )}

                {step.attachments.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <AttachFileIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Attachments: {step.attachments.join(', ')}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<LabelIcon fontSize="small" />}
                    label={step.spcPath}
                    size="small"
                    color={matchesPrimary(step) ? 'primary' : 'warning'}
                    variant={matchesPrimary(step) ? 'outlined' : 'filled'}
                  />
                  {!matchesPrimary(step) && (
                    <Chip
                      label="Different from primary category"
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </Box>

                {step.notes && (
                  <Alert severity="info" sx={{ mt: 1 }} icon={<CommentIcon />}>
                    Note: {step.notes}
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}

          {steps.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary">
                No steps added yet. Click "Add Step" to start capturing your process.
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: '30px', justifyContent: 'center', p: '15px 0' }}>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={() => alert('Saved as draft')}
          size="large"
          sx={{
            borderRadius: '50px',
            minHeight: 46,
            fontWeight: 700,
            fontSize: 14,
            minWidth: 160,
          }}
        >
          Save as Draft
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PublishIcon />}
          size="large"
          onClick={() => alert('Published presentation')}
          sx={{
            borderRadius: '50px',
            minHeight: 46,
            fontWeight: 700,
            fontSize: 14,
            minWidth: 160,
          }}
          disabled={steps.length === 0}
        >
          Publish Presentation
        </Button>
      </Box>

      {/* Edit Step Dialog */}
      {editingStep && (
        <EditStepDialog
          step={editingStep}
          primarySpcPath={primarySpcPath}
          onSave={handleSaveStep}
          onClose={() => setEditingStep(null)}
        />
      )}
    </Box>
  );
};

export default PresentationCapture;
