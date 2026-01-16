import React, { useState } from 'react';
import {
  Modal,
  Fade,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Autocomplete,
  Divider,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import SpcTreeBrowser from './SpcTreeBrowser';

interface SpcNode {
  id: string;
  code: string;
  visibleCode: string;
  name: string;
  parentId: string | null;
  path: string;
}

interface AddProcessDialogProps {
  open: boolean;
  onClose: () => void;
  type: 'current' | 'future';
  onCreateAndCapture?: (process: any) => void;
}

const mockSpcOptions: SpcNode[] = [
  { id: 'SPC_100', code: '100', visibleCode: '100', name: 'Finance', parentId: null, path: 'Finance' },
  { id: 'SPC_101', code: '100.001', visibleCode: '101', name: 'Accounts Payable', parentId: 'SPC_100', path: 'Finance > Accounts Payable' },
  { id: 'SPC_101_001', code: '100.001.001', visibleCode: '101.001', name: 'Vendor Setup', parentId: 'SPC_101', path: 'Finance > Accounts Payable > Vendor Setup' },
  { id: 'SPC_101_002', code: '100.001.002', visibleCode: '101.002', name: 'Invoice Processing', parentId: 'SPC_101', path: 'Finance > Accounts Payable > Invoice Processing' },
  { id: 'SPC_101_003', code: '100.001.003', visibleCode: '101.003', name: 'Payment Execution', parentId: 'SPC_101', path: 'Finance > Accounts Payable > Payment Execution' },
  { id: 'SPC_200', code: '200', visibleCode: '200', name: 'Human Resources', parentId: null, path: 'Human Resources' },
  { id: 'SPC_201', code: '200.001', visibleCode: '201', name: 'Recruiting', parentId: 'SPC_200', path: 'Human Resources > Recruiting' },
  { id: 'SPC_300', code: '300', visibleCode: '300', name: 'Operations', parentId: null, path: 'Operations' },
  { id: 'SPC_305', code: '300.005', visibleCode: '305', name: 'Compliance & Risk Management', parentId: 'SPC_300', path: 'Operations > Compliance & Risk Management' },
  { id: 'SPC_305_002', code: '300.005.002', visibleCode: '305.002', name: 'Vendor Due Diligence', parentId: 'SPC_305', path: 'Operations > Compliance & Risk Management > Vendor Due Diligence' },
];

const mockTemplates = [
  { system: 'Oracle Cloud - Finance', templates: ['AP - Create Vendor Master', 'AP - Invoice Processing', 'AP - Payment Processing'] },
  { system: 'SAP - Finance', templates: ['Vendor Master Data', 'Invoice Entry', 'Payment Run'] },
  { system: 'Workday - HCM', templates: ['Recruit to Hire', 'Onboarding', 'Performance Management'] },
];

const AddProcessDialog: React.FC<AddProcessDialogProps> = ({ open, onClose, type, onCreateAndCapture }) => {
  const [processName, setProcessName] = useState('');
  const [selectedSpc, setSelectedSpc] = useState<SpcNode | null>(null);
  const [parentProcess, setParentProcess] = useState<any | null>(null);
  const [code, setCode] = useState(''); // FSP only
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSpcBrowser, setShowSpcBrowser] = useState(false);

  // FSP specific
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [testingStatus, setTestingStatus] = useState<'NotStarted' | 'InProgress' | 'Completed'>('NotStarted');
  const [trainingStatus, setTrainingStatus] = useState<'NotStarted' | 'InProgress' | 'Completed'>('NotStarted');

  const handleSpcChange = (event: any, value: SpcNode | null) => {
    setSelectedSpc(value);
  };

  const handleSpcBrowserSelect = (spcId: string, spcName: string, spcPath: string) => {
    // Create a new SpcNode from the selection
    const newSpc: SpcNode = {
      id: spcId,
      code: spcId.replace('SPC_', ''),
      visibleCode: spcId.replace('SPC_', ''),
      name: spcName,
      parentId: null,
      path: spcPath,
    };
    setSelectedSpc(newSpc);
    setShowSpcBrowser(false);
  };

  const handleUpdateTitleFromSpc = () => {
    if (selectedSpc) {
      setProcessName(selectedSpc.name);
    }
  };

  const handleTemplateSystemChange = (event: any, value: string | null) => {
    setSelectedSystem(value || '');
    setSelectedTemplate('');
  };

  const handleTemplateChange = (event: any, value: string | null) => {
    setSelectedTemplate(value || '');
    if (value) {
      // Auto-populate based on template
      setProcessName(value);
      // Suggest SPC based on template
      if (value.includes('Vendor')) {
        const vendorSetup = mockSpcOptions.find(s => s.id === 'SPC_101_001');
        setSelectedSpc(vendorSetup || null);
      }
    }
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    const newProcess = {
      name: processName,
      spcId: selectedSpc?.id,
      spcPath: selectedSpc?.path,
      parentProcess: parentProcess?.id,
      status: 'NotStarted', // No presentation yet
      ...(type === 'future' && { code, testingStatus, trainingStatus }),
    };
    // In real app, would save to backend via API
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleCreateAndCapture = async () => {
    setIsSubmitting(true);
    const newProcess = {
      name: processName,
      spcId: selectedSpc?.id,
      spcPath: selectedSpc?.path,
      parentProcess: parentProcess?.id,
      status: 'InProgress', // Starting to capture presentation
      ...(type === 'future' && { code }),
    };
    // In real app, would save to backend via API
    setTimeout(() => {
      setIsSubmitting(false);
      if (onCreateAndCapture) {
        onCreateAndCapture(newProcess);
      }
    }, 500);
  };

  const systemOptions = mockTemplates.map(t => t.system);
  const templateOptions = mockTemplates.find(t => t.system === selectedSystem)?.templates || [];

  const mockParentProcesses = [
    { id: 1, name: 'Vendor Management', path: 'Finance > Accounts Payable' },
    { id: 2, name: 'Invoice Management', path: 'Finance > Accounts Payable' },
  ];

  return (
    <>
      <Modal
        open={open && !showSpcBrowser}
        onClose={onClose}
        closeAfterTransition
      >
        <Fade in={open && !showSpcBrowser}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: '30px',
            p: '10px',
            minWidth: 600,
            maxWidth: 700,
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          {/* Modal Header */}
          <Box sx={{ p: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 28, fontWeight: 400 }}>
              New {type === 'current' ? 'Current State' : 'Future State'} Process
            </Typography>
            <CloseIcon sx={{ cursor: 'pointer', color: 'grey.600' }} onClick={onClose} />
          </Box>

          <Divider />

          {/* Modal Content */}
          <Box sx={{ p: '10px 40px 40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

          {/* FSP Template Option */}
          {type === 'future' && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                How do you want to create this process?
              </Typography>
              <RadioGroup
                value={useTemplate ? 'template' : 'direct'}
                onChange={(e) => setUseTemplate(e.target.value === 'template')}
              >
                <FormControlLabel value="template" control={<Radio />} label="Start from Template" />
                <FormControlLabel value="direct" control={<Radio />} label="Direct Entry (No Template)" />
              </RadioGroup>

              {useTemplate && (
                <Box sx={{ mt: 2, pl: 4 }}>
                  <Autocomplete
                    options={systemOptions}
                    value={selectedSystem}
                    onChange={handleTemplateSystemChange}
                    renderInput={(params) => <TextField {...params} label="Select ERP System" size="small" />}
                    sx={{ mb: 2 }}
                  />

                  {selectedSystem && (
                    <Autocomplete
                      options={templateOptions}
                      value={selectedTemplate}
                      onChange={handleTemplateChange}
                      renderInput={(params) => <TextField {...params} label="Select Process Template" size="small" />}
                    />
                  )}

                  {selectedTemplate && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <DescriptionIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        This template includes pre-defined steps
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* Process Name/Title */}
          <Box>
            <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>
              Title *
            </FormLabel>
            <TextField
              fullWidth
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder={type === 'current' ? 'e.g., Identify vendor in spreadsheet' : 'e.g., Create vendor in Oracle Cloud'}
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

          {/* Category Selection */}
          <Box>
            <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>
              Process Category *
            </FormLabel>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Choose which business area this process belongs to
            </Typography>
            <Autocomplete
              options={mockSpcOptions}
              getOptionLabel={(option) => `${option.path} (${option.visibleCode})`}
              value={selectedSpc}
              onChange={handleSpcChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select category..."
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      minHeight: 46,
                      borderRadius: '50px',
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      fontSize: 14,
                      fontWeight: 500,
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body2">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.path}
                    </Typography>
                  </Box>
                </li>
              )}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Button
                size="small"
                startIcon={<SearchIcon />}
                onClick={() => setShowSpcBrowser(true)}
                sx={{ fontSize: 12, textTransform: 'none' }}
              >
                Can't find it? Browse all categories
              </Button>
              {selectedSpc && (
                <Typography
                  onClick={handleUpdateTitleFromSpc}
                  sx={{
                    color: 'secondary.main',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Update title from category
                </Typography>
              )}
            </Box>
          </Box>

          {/* Parent Process (CSP: optional, FSP: optional) */}
          <Box>
            <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>
              Parent {type === 'current' ? 'Current State' : 'Future State'} Process (optional)
            </FormLabel>
            <Autocomplete
              options={mockParentProcesses}
              getOptionLabel={(option) => `${option.name} - ${option.path}`}
              value={parentProcess}
              onChange={(e, value) => setParentProcess(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select parent process..."
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      minHeight: 46,
                      borderRadius: '50px',
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      fontSize: 14,
                      fontWeight: 500,
                    }
                  }}
                />
              )}
            />
          </Box>

          {/* Code (FSP only) */}
          {type === 'future' && (
            <Box>
              <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>
                Process Code *
              </FormLabel>
              <TextField
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., FSP-001"
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
          )}

          {/* FSP Specific Fields */}
          {type === 'future' && (
            <>
              <Box>
                <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>Testing Status</FormLabel>
                <RadioGroup row value={testingStatus} onChange={(e) => setTestingStatus(e.target.value as any)}>
                  <FormControlLabel value="NotStarted" control={<Radio />} label="Not Started" />
                  <FormControlLabel value="InProgress" control={<Radio />} label="In Progress" />
                  <FormControlLabel value="Completed" control={<Radio />} label="Completed" />
                </RadioGroup>
              </Box>

              <Box>
                <FormLabel sx={{ fontSize: 16, fontWeight: 700, mb: 1, display: 'block' }}>Training Status</FormLabel>
                <RadioGroup row value={trainingStatus} onChange={(e) => setTrainingStatus(e.target.value as any)}>
                  <FormControlLabel value="NotStarted" control={<Radio />} label="Not Started" />
                  <FormControlLabel value="InProgress" control={<Radio />} label="In Progress" />
                  <FormControlLabel value="Completed" control={<Radio />} label="Completed" />
                </RadioGroup>
              </Box>
            </>
          )}
          </Box>

          <Divider sx={{ mt: 2 }} />

          {/* Actions */}
          <Box sx={{ p: '15px 40px', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px' }}>
            {type === 'current' && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
                onClick={handleCreateAndCapture}
                disabled={!processName || !selectedSpc || isSubmitting}
                sx={{
                  borderRadius: '50px',
                  minHeight: 46,
                  fontWeight: 700,
                  fontSize: 14,
                  minWidth: 160,
                }}
              >
                Create & Start Capturing
              </Button>
            )}

            {type === 'future' && useTemplate && selectedTemplate && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
                onClick={handleCreateAndCapture}
                disabled={!processName || !selectedSpc || !code || isSubmitting}
                sx={{
                  borderRadius: '50px',
                  minHeight: 46,
                  fontWeight: 700,
                  fontSize: 14,
                  minWidth: 160,
                }}
              >
                Create & Review Template
              </Button>
            )}

            {(type === 'current' || !useTemplate || !selectedTemplate) && (
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleCreate}
                disabled={!processName || !selectedSpc || (type === 'future' && !code) || isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{
                  borderRadius: '50px',
                  minHeight: 46,
                  fontWeight: 700,
                  fontSize: 14,
                  minWidth: 160,
                }}
              >
                Create
              </Button>
            )}

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
          </Box>
        </Box>
      </Fade>
    </Modal>

    {/* Category Browser */}
    <SpcTreeBrowser
      open={showSpcBrowser}
      onClose={() => setShowSpcBrowser(false)}
      onSelect={handleSpcBrowserSelect}
      primarySpcPath={selectedSpc?.path || ''}
      currentSelection={selectedSpc?.id || ''}
    />
    </>
  );
};

export default AddProcessDialog;
