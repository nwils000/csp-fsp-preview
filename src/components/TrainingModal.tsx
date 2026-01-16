import React, { useState } from 'react';
import {
  Modal,
  Fade,
  Box,
  Typography,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
  Divider,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LinkIcon from '@mui/icons-material/Link';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PushPinIcon from '@mui/icons-material/PushPin';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';

interface TrainingModalProps {
  open: boolean;
  onClose: () => void;
}

const TrainingModal: React.FC<TrainingModalProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Old vs New',
    'Process Categories',
    'Creating Current State',
    'Creating Future State',
    'Map Future to Current',
  ];

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: '30px',
            p: '10px',
            width: '90vw',
            maxWidth: 1000,
            height: '85vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box sx={{ p: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 28, fontWeight: 400 }}>
              CSP/FSP Training Guide
            </Typography>
            <CloseIcon sx={{ cursor: 'pointer', color: 'grey.600' }} onClick={onClose} />
          </Box>

          <Divider />

          {/* Stepper */}
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                '& .MuiStepLabel-root .Mui-completed': {
                  color: '#10B981', // success green
                },
                '& .MuiStepLabel-root .Mui-active': {
                  color: '#6366F1', // primary indigo
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label} onClick={() => handleStepClick(index)} sx={{ cursor: 'pointer' }}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Divider />

          {/* Content */}
          <Box sx={{ flex: 1, overflow: 'auto', p: '30px 40px' }}>
        {/* Step 0: Old vs New */}
        {activeStep === 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <CompareArrowsIcon sx={{ color: '#6366F1' }} fontSize="large" />
              <Typography variant="h5">What's Changed: Old vs New</Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3, bgcolor: '#E0F2FE', borderColor: '#06AED4', color: '#0C4A6E' }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                <AutoAwesomeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                New Feature: Cross-Functional Process Linking
              </Typography>
              <Typography variant="body2">
                The biggest change is that you can now link <strong>individual steps</strong> in a process to different categories,
                enabling proper representation of cross-functional processes.
              </Typography>
            </Alert>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Side-by-Side Comparison
            </Typography>

            <Table sx={{ mb: 3 }}>
              <TableBody>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 700, width: '50%' }}>OLD Way (Current Meta-SPA)</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: '50%' }}>NEW Way (Enhanced)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    <Typography variant="body2" paragraph fontWeight={600}>Process-Level Category Only</Typography>
                    <Typography variant="body2" paragraph>
                      • Create a process and link it to ONE category
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • Entire process belongs to that category
                    </Typography>
                    <Typography variant="body2">
                      • Can't represent processes that span multiple departments
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', bgcolor: '#ECFDF5' }}>
                    <Typography variant="body2" paragraph fontWeight={600}>Process + Step-Level Categories</Typography>
                    <Typography variant="body2" paragraph>
                      • Create a process with a PRIMARY category
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • Then capture a "Presentation" with detailed steps
                    </Typography>
                    <Typography variant="body2">
                      • Link EACH STEP to any category (even different departments!)
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    <Typography variant="body2" paragraph fontWeight={600}>Example:</Typography>
                    <Typography variant="body2" paragraph>
                      Process: "Vendor Setup"<br />
                      Category: Finance → AP → Vendor Setup
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      Problem: What if the process includes compliance checks done by the Operations team?
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', bgcolor: '#ECFDF5' }}>
                    <Typography variant="body2" paragraph fontWeight={600}>Example:</Typography>
                    <Typography variant="body2" paragraph>
                      Process: "Vendor Setup"<br />
                      Primary Category: Finance → AP → Vendor Setup<br /><br />
                      Step 1: "Submit vendor info" → Finance<br />
                      Step 2: "Enter into spreadsheet" → Finance<br />
                      <strong>Step 3: "Check compliance" → Operations → Compliance</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontStyle: 'italic' }}>
                      <CheckCircleIcon fontSize="small" sx={{ color: '#047857' }} />
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#047857' }}>
                        Compliance team gets notified for their part!
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    <Typography variant="body2" paragraph fontWeight={600}>Training Assignment:</Typography>
                    <Typography variant="body2">
                      Only people in the Finance team get assigned training for the entire process
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', bgcolor: '#ECFDF5' }}>
                    <Typography variant="body2" paragraph fontWeight={600}>Training Assignment:</Typography>
                    <Typography variant="body2">
                      Finance team gets training for Steps 1-2, Compliance team gets training for Step 3.
                      Each team only sees what's relevant to them!
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    <Typography variant="body2" paragraph fontWeight={600}>Workflow:</Typography>
                    <Typography variant="body2">
                      1. Click "Add Process"<br />
                      2. Fill in details<br />
                      3. Select ONE category<br />
                      4. Save<br />
                      5. Done
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', bgcolor: '#ECFDF5' }}>
                    <Typography variant="body2" paragraph fontWeight={600}>Workflow:</Typography>
                    <Typography variant="body2">
                      1. Click "Add Process"<br />
                      2. Fill in details<br />
                      3. Select PRIMARY category<br />
                      4. Click "Create & Start Capturing"<br />
                      5. Add steps to your presentation<br />
                      6. For each step, link to any category<br />
                      7. Save presentation
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Paper sx={{ p: 2, bgcolor: '#FEF3C7', border: 1, borderColor: '#F59E0B', mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <PushPinIcon fontSize="small" sx={{ color: '#F59E0B' }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Key Takeaway
                </Typography>
              </Box>
              <Typography variant="body2">
                The old way is still available (just click "Create" without capturing).
                But for complex cross-functional processes, use <strong>"Create & Start Capturing"</strong> to enable per-step category linking.
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Step 1: Process Categories */}
        {activeStep === 1 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AccountTreeIcon sx={{ color: '#6366F1' }} fontSize="large" />
              <Typography variant="h5">Process Categories</Typography>
            </Box>

            <Typography variant="body1" paragraph>
              <strong>Process Categories</strong> are a pre-built taxonomy of standard business processes organized by department and function.
            </Typography>

            <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Example Structure:</Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2">▸ Finance (100)</Typography>
                <Box sx={{ pl: 3 }}>
                  <Typography variant="body2">▸ Accounts Payable (101)</Typography>
                  <Box sx={{ pl: 3 }}>
                    <Typography variant="body2">• Vendor Setup (101.001)</Typography>
                    <Typography variant="body2">• Invoice Processing (101.002)</Typography>
                    <Typography variant="body2">• Payment Execution (101.003)</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>▸ Operations (300)</Typography>
                <Box sx={{ pl: 3 }}>
                  <Typography variant="body2">▸ Compliance & Risk (305)</Typography>
                  <Box sx={{ pl: 3 }}>
                    <Typography variant="body2">• Vendor Due Diligence (305.002)</Typography>
                    <Typography variant="body2">• Audit Preparation (305.003)</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" gutterBottom>Why Use It?</Typography>
            <Box component="ul" sx={{ pl: 3, mb: 3 }}>
              <Typography component="li" variant="body2" paragraph>
                <strong>Consistency:</strong> Everyone uses the same categories and naming
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                <strong>Quick Start:</strong> Don't start from scratch - link to existing categories
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                <strong>Cross-Functional:</strong> Link different steps to different departments
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                <strong>Training Assignment:</strong> Automatically notify the right teams based on category links
              </Typography>
            </Box>

            <Paper sx={{ p: 2, bgcolor: '#06AED4', color: 'white', mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <LightbulbIcon fontSize="small" />
                <Typography variant="subtitle2">Two-Level Linking</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Process Level:</strong> When you create a process, link it to a PRIMARY category (e.g., "Vendor Setup" in Finance)
              </Typography>
              <Typography variant="body2">
                <strong>Step Level (NEW!):</strong> When you capture a presentation, link EACH STEP to any category, even if it's in a different department (e.g., Step 3 links to "Compliance" in Operations)
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Step 2: Creating Current State */}
        {activeStep === 2 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AddCircleIcon sx={{ color: '#6366F1' }} fontSize="large" />
              <Typography variant="h5">Creating Current State Processes (CSP)</Typography>
            </Box>

            <Typography variant="body1" paragraph>
              Current State Processes represent <strong>how you work today</strong> - your actual, as-is processes before any changes.
            </Typography>

            <Alert severity="warning" sx={{ mb: 3, bgcolor: '#FEF3C7', borderColor: '#F59E0B', color: '#92400E' }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Recommended: Use "Create & Start Capturing"
              </Typography>
              <Typography variant="body2">
                For complex processes, especially those spanning multiple departments, use the presentation capture workflow to link individual steps to different categories.
              </Typography>
            </Alert>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Detailed Step-by-Step Workflow:
            </Typography>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#6366F1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 1" size="small" sx={{ bgcolor: '#6366F1', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Click "Add Process" → Current State</Typography>
              </Box>
              <Typography variant="body2" sx={{ pl: 4 }}>
                Navigate to the Current State Process Library tab and click the "Add Process" button.
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#6366F1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 2" size="small" sx={{ bgcolor: '#6366F1', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Fill in Process Details</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph fontWeight={600}>Required Fields:</Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Title:</strong> Descriptive name (e.g., "Vendor Setup Process")<br />
                  • <strong>Process Category:</strong> Select PRIMARY category from the tree
                </Typography>
                <Typography variant="body2" paragraph fontWeight={600}>Optional Fields:</Typography>
                <Typography variant="body2">
                  • <strong>Parent Process:</strong> Link to parent CSP if this is a subprocess
                </Typography>
                <Paper sx={{ p: 1.5, bgcolor: 'info.light', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LightbulbIcon fontSize="small" color="info" />
                    <Typography variant="caption" fontWeight={600}>Tip: "Update title from SPC"</Typography>
                  </Box>
                  <Typography variant="caption" display="block">
                    After selecting an SPC, click the blue link "Do you want to update the title with the SPC name?" to auto-fill the title.
                  </Typography>
                </Paper>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#6366F1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 3" size="small" sx={{ bgcolor: '#6366F1', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Choose Your Path</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph fontWeight={600}>Option A: Create (Simple)</Typography>
                <Typography variant="body2" paragraph>
                  Click "Create" to save the process without capturing details yet.
                  Use this for simple processes or when you'll add details later.
                </Typography>
                <Typography variant="body2" paragraph fontWeight={600} sx={{ color: '#047857' }}>
                  Option B: Create & Start Capturing (Recommended)
                </Typography>
                <Typography variant="body2" paragraph>
                  Click "Create & Start Capturing" to immediately launch the presentation capture interface.
                  Use this for complex or cross-functional processes.
                </Typography>
              </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ color: '#047857' }}>
              Presentation Capture Workflow (When you click "Create & Start Capturing"):
            </Typography>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#10B981', bgcolor: '#ECFDF5' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 4" size="small" sx={{ bgcolor: '#10B981', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Presentation Overview</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph>
                  You'll see a form to capture presentation metadata:
                </Typography>
                <Typography variant="body2">
                  • <strong>Presentation Name:</strong> Auto-filled as "Process Name - As-Is Month Year"<br />
                  • <strong>Description:</strong> Brief overview of what this presentation captures
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#10B981', bgcolor: '#ECFDF5' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 5" size="small" sx={{ bgcolor: '#10B981', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Add Process Steps</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph>
                  Click "Add Step" to create each step in your process. For each step, you'll enter:
                </Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Step Description:</strong> Brief title (e.g., "Submit W-9 form")<br />
                  • <strong>Detailed Instructions:</strong> Step-by-step details<br />
                  • <strong>Attachments:</strong> Upload forms, templates, screenshots
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, mb: 1 }}>
                  <GpsFixedIcon fontSize="small" sx={{ color: '#6366F1' }} />
                  <Typography variant="body2" fontWeight={600} sx={{ color: '#6366F1' }}>
                    KEY FEATURE: Link to Process Category
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Each step shows the currently selected category (defaults to the process PRIMARY category).
                  Click "Change" to link this specific step to a DIFFERENT category.
                </Typography>
                <Paper sx={{ p: 1.5, bgcolor: 'warning.light', mt: 2 }}>
                  <Typography variant="caption" fontWeight={600}>Example: Cross-Functional Process</Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Process "Vendor Setup" (Primary: Finance → AP → Vendor Setup)<br />
                    • Step 1: "Submit W-9" → Finance<br />
                    • Step 2: "Enter spreadsheet" → Finance<br />
                    • Step 3: "Check compliance" → <strong>Operations → Compliance</strong> (Different!)
                  </Typography>
                </Paper>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#10B981', bgcolor: '#ECFDF5' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 6" size="small" sx={{ bgcolor: '#10B981', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Review Category Recommendations</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph>
                  When editing a step, the system shows AI-powered category recommendations based on:
                </Typography>
                <Typography variant="body2">
                  • Keywords in the step description<br />
                  • Primary process category<br />
                  • Related categories commonly used together
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Click a recommendation to quickly assign that category, or click "Change" to browse the full tree.
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#10B981', bgcolor: '#ECFDF5' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 7" size="small" sx={{ bgcolor: '#10B981', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Explain Cross-Category Links (Optional)</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph>
                  If you link a step to a category different from the primary, you'll see a warning and a notes field.
                </Typography>
                <Typography variant="body2">
                  <strong>Best Practice:</strong> Add a note explaining why this step belongs to a different category.
                  Example: "Compliance check crosses departments - Operations team handles vendor due diligence"
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#10B981', bgcolor: '#ECFDF5' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 8" size="small" sx={{ bgcolor: '#10B981', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Save or Publish</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph>
                  • <strong>Save as Draft:</strong> Save your work and come back later<br />
                  • <strong>Publish Presentation:</strong> Finalize and make visible to stakeholders
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  Published presentations are used for training assignment based on the category links you created!
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, bgcolor: '#6366F1', color: 'white', mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <CheckCircleIcon fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Result: Proper Training Assignment
                </Typography>
              </Box>
              <Typography variant="body2">
                With per-step category linking, when you assign training for this process:
                Finance team gets notified about Steps 1-2, and Compliance team gets notified about Step 3.
                Each team only sees the steps relevant to their department!
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Step 3: Creating Future State */}
        {activeStep === 3 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AddCircleIcon sx={{ color: '#4058a7' }} fontSize="large" />
              <Typography variant="h5">Creating Future State Processes (FSP)</Typography>
            </Box>

            <Typography variant="body1" paragraph>
              Future State Processes represent <strong>how you'll work after the change</strong> - your to-be processes after implementing new software or procedures.
            </Typography>

            <Alert severity="info" sx={{ mb: 3, bgcolor: '#E0F2FE', borderColor: '#06AED4', color: '#0C4A6E' }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                FSP Workflow is Similar to CSP
              </Typography>
              <Typography variant="body2">
                Creating FSPs follows the same presentation capture workflow as CSPs, with additional fields for testing/training status and optional template selection.
              </Typography>
            </Alert>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Detailed Step-by-Step Workflow:
            </Typography>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#4058a7' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 1" size="small" sx={{ bgcolor: '#4058a7', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Click "Add Process" → Future State</Typography>
              </Box>
              <Typography variant="body2" sx={{ pl: 4 }}>
                Navigate to the Future State Process Library tab and click the "Add Process" button.
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#4058a7' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 2" size="small" sx={{ bgcolor: '#4058a7', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Choose Template (Optional)</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph>
                  FSPs offer an optional template feature:
                </Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Start from Template:</strong> Select ERP system (Oracle Cloud, SAP, Workday) and choose a pre-built process template with pre-defined steps
                </Typography>
                <Typography variant="body2">
                  • <strong>Direct Entry (No Template):</strong> Create from scratch like CSPs
                </Typography>
                <Paper sx={{ p: 1.5, bgcolor: 'info.light', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LightbulbIcon fontSize="small" color="info" />
                    <Typography variant="caption" fontWeight={600}>Template Benefit</Typography>
                  </Box>
                  <Typography variant="caption" display="block">
                    Templates auto-populate process details and suggest relevant categories based on common ERP configurations.
                  </Typography>
                </Paper>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#4058a7' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 3" size="small" sx={{ bgcolor: '#4058a7', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Fill in Process Details</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph fontWeight={600}>Required Fields:</Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Title:</strong> Descriptive name (e.g., "Create vendor in Oracle Cloud")<br />
                  • <strong>Process Category:</strong> Select PRIMARY category from the tree<br />
                  • <strong>Process Code:</strong> Unique identifier (e.g., "FSP-001")
                </Typography>
                <Typography variant="body2" paragraph fontWeight={600}>Optional Fields:</Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Parent Process:</strong> Link to parent FSP if this is a subprocess<br />
                  • <strong>Testing Status:</strong> Not Started / In Progress / Completed<br />
                  • <strong>Training Status:</strong> Not Started / In Progress / Completed
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#4058a7' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label="STEP 4" size="small" sx={{ bgcolor: '#4058a7', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Choose Your Path</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph fontWeight={600}>Option A: Create (Simple)</Typography>
                <Typography variant="body2" paragraph>
                  Click "Create" to save the process without capturing details yet.
                </Typography>
                <Typography variant="body2" paragraph fontWeight={600} sx={{ color: '#047857' }}>
                  Option B: Create & Start Capturing (Recommended for Templates)
                </Typography>
                <Typography variant="body2" paragraph>
                  If you selected a template, click "Create & Review Template" to launch presentation capture with pre-populated steps.
                  Otherwise, click "Create & Start Capturing" to start from scratch.
                </Typography>
              </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ color: '#047857' }}>
              Presentation Capture Workflow (Steps 5-8)
            </Typography>

            <Paper sx={{ p: 2, bgcolor: '#ECFDF5', border: 1, borderColor: '#10B981', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <AssignmentIcon fontSize="small" sx={{ color: '#10B981' }} />
                <Typography variant="body2" fontWeight={600}>
                  Same as CSP Workflow!
                </Typography>
              </Box>
              <Typography variant="body2">
                The presentation capture process for FSPs is identical to CSPs:
                <br /><br />
                • Add steps with descriptions and instructions<br />
                • Link each step to any category (cross-functional support)<br />
                • Upload attachments<br />
                • Review category recommendations<br />
                • Add notes for cross-category links<br />
                • Save as draft or publish
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, bgcolor: '#FEF3C7', border: 1, borderColor: '#F59E0B', mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <WarningIcon fontSize="small" sx={{ color: '#F59E0B' }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Important: Don't Link FSP to CSP Yet!
                </Typography>
              </Box>
              <Typography variant="body2">
                When creating an FSP, do NOT map it to Current State Processes.
                That mapping happens in the next step: "Map Future to Current".
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, bgcolor: '#06AED4', color: 'white', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <LightbulbIcon fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Link FSP and CSP to Same Categories
                </Typography>
              </Box>
              <Typography variant="body2">
                Link your FSPs to the same process categories as your CSPs whenever possible.
                This makes it easier to map them together in the "Map Future to Current" step,
                as the system will suggest mappings based on shared categories.
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Step 4: Map Future to Current */}
        {activeStep === 4 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LinkIcon sx={{ color: '#6366F1' }} fontSize="large" />
              <Typography variant="h5">Map Future to Current</Typography>
            </Box>

            <Typography variant="body1" paragraph>
              After creating both Current and Future State processes, you map them together to show <strong>which future processes replace which current processes</strong>.
            </Typography>

            <Typography variant="h6" gutterBottom>Step-by-Step Flow:</Typography>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#6366F1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label="1" size="small" sx={{ bgcolor: '#6366F1', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Go to "Map Future to Current" Tab</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2">
                  This is the third tab at the top of the page.
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#6366F1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label="2" size="small" sx={{ bgcolor: '#6366F1', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Review Smart Suggestions</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph>
                  The system suggests mappings based on:
                </Typography>
                <Typography variant="body2">• Process names similarity</Typography>
                <Typography variant="body2">• Linked process categories</Typography>
                <Typography variant="body2">• Keywords and descriptions</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Suggestions show confidence scores (e.g., "85% match")
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, border: 2, borderColor: '#6366F1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label="3" size="small" sx={{ bgcolor: '#6366F1', color: 'white', fontWeight: 700 }} />
                <Typography variant="subtitle1" fontWeight={600}>Create or Edit Mappings</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" paragraph>Click "Edit" on any mapping to:</Typography>
                <Typography variant="body2">• Confirm or reject suggested mappings</Typography>
                <Typography variant="body2">• Add multiple current processes to one future (consolidation)</Typography>
                <Typography variant="body2">• Add notes explaining the mapping</Typography>
                <Typography variant="body2">• Mark new processes that have no current equivalent</Typography>
              </Box>
            </Paper>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Common Mapping Scenarios:</Typography>

            <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>1:1 Mapping</Typography>
                <Typography variant="body2">
                  One future process replaces one current process
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Example: "Process payment electronically" → "Print checks weekly"
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>1:Many (Consolidation)</Typography>
                <Typography variant="body2">
                  One future process replaces multiple current processes
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Example: "Create vendor in Oracle Cloud" → "Identify vendor in spreadsheet" + "Email finance for approval" + "Track vendor IDs manually"
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>New Process</Typography>
                <Typography variant="body2">
                  Future process with no current equivalent (brand new capability)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Example: "Auto schedule payments" (didn't exist before)
                </Typography>
              </Paper>
            </Box>
            <Paper sx={{ p: 2, bgcolor: '#10B981', color: 'white', mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <GpsFixedIcon fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Category Links Help Mapping
                </Typography>
              </Box>
              <Typography variant="body2">
                Because both CSPs and FSPs are linked to the same process categories, the system can intelligently suggest mappings.
                For example, if CSP "Vendor approval email" and FSP "Create vendor in Oracle" both link to "Vendor Setup (101.001)",
                the system will suggest they might be related with a high confidence score.
              </Typography>
            </Paper>
          </Box>
        )}
          </Box>

          <Divider />

          {/* Footer Actions */}
          <Box sx={{ p: '15px 40px', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: '50px',
                minHeight: 46,
                fontWeight: 700,
                fontSize: 14,
                minWidth: 100,
                color: '#888',
                '&:disabled': {
                  color: '#ccc',
                },
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? onClose : handleNext}
              endIcon={activeStep === steps.length - 1 ? undefined : <ArrowForwardIcon />}
              sx={{
                borderRadius: '50px',
                minHeight: 46,
                fontWeight: 700,
                fontSize: 14,
                minWidth: 160,
                bgcolor: '#6366F1',
                color: 'white',
                '&:hover': {
                  bgcolor: '#4F46E5',
                },
              }}
            >
              {activeStep === steps.length - 1 ? 'Got It!' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TrainingModal;
