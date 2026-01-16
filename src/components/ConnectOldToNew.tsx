import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ViewList as ViewListIcon,
  AccountTree as AccountTreeIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  CompareArrows as CompareArrowsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// ============================================================================
// MOCK DATA
// ============================================================================

interface Mapping {
  id: string;
  futureProcessId: string;
  futureProcessName: string;
  futureSpcPath: string;
  currentProcessIds: string[];
  currentProcessNames: string[];
  currentSpcPath: string;
  mappingType: '1:1' | '1:many' | 'many:1' | 'new' | 'removed';
  confidence?: number; // For suggested matches (0-100)
  status: 'confirmed' | 'suggested' | 'needs-review';
  notes?: string;
}

const mockMappings: Mapping[] = [
  {
    id: 'MAP_001',
    futureProcessId: 'FSP_001',
    futureProcessName: 'Create vendor in Oracle Cloud',
    futureSpcPath: 'Finance > Accounts Payable > Vendor Setup',
    currentProcessIds: ['CSP_001', 'CSP_002', 'CSP_003'],
    currentProcessNames: [
      'Identify vendor in spreadsheet',
      'Email finance for vendor approval',
      'Track vendor IDs manually',
    ],
    currentSpcPath: 'Finance > Accounts Payable > Vendor Setup',
    mappingType: '1:many',
    status: 'confirmed',
    notes: 'Oracle Cloud consolidates 3 manual steps into one automated process',
  },
  {
    id: 'MAP_002',
    futureProcessId: 'FSP_002',
    futureProcessName: 'Match invoice to PO automatically',
    futureSpcPath: 'Finance > Accounts Payable > Invoice Processing',
    currentProcessIds: ['CSP_004'],
    currentProcessNames: ['Enter invoice into LegacyERP'],
    currentSpcPath: 'Finance > Accounts Payable > Invoice Processing',
    mappingType: '1:1',
    status: 'confirmed',
  },
  {
    id: 'MAP_003',
    futureProcessId: 'FSP_003',
    futureProcessName: 'Approve invoice via workflow',
    futureSpcPath: 'Finance > Accounts Payable > Invoice Processing',
    currentProcessIds: [],
    currentProcessNames: [],
    currentSpcPath: '',
    mappingType: '1:1',
    confidence: 85,
    status: 'suggested',
    notes: 'System suggests mapping to "Manual invoice matching" (CSP_005)',
  },
  {
    id: 'MAP_004',
    futureProcessId: 'FSP_004',
    futureProcessName: 'Auto schedule payments',
    futureSpcPath: 'Finance > Accounts Payable > Payment Execution',
    currentProcessIds: [],
    currentProcessNames: [],
    currentSpcPath: '',
    mappingType: 'new',
    status: 'confirmed',
    notes: 'New capability - no current equivalent',
  },
  {
    id: 'MAP_005',
    futureProcessId: 'FSP_005',
    futureProcessName: 'Process payment electronically',
    futureSpcPath: 'Finance > Accounts Payable > Payment Execution',
    currentProcessIds: ['CSP_006'],
    currentProcessNames: ['Print checks weekly'],
    currentSpcPath: 'Finance > Accounts Payable > Payment Execution',
    mappingType: '1:1',
    status: 'confirmed',
  },
  {
    id: 'MAP_006',
    futureProcessId: 'FSP_006',
    futureProcessName: 'Post job via ATS to multiple boards',
    futureSpcPath: 'Human Resources > Recruiting > Job Posting',
    currentProcessIds: ['CSP_007'],
    currentProcessNames: ['Post job on company website'],
    currentSpcPath: 'Human Resources > Recruiting > Job Posting',
    mappingType: '1:1',
    status: 'confirmed',
  },
  {
    id: 'MAP_007',
    futureProcessId: 'FSP_007',
    futureProcessName: 'AI-assisted resume screening',
    futureSpcPath: 'Human Resources > Recruiting > Candidate Screening',
    currentProcessIds: ['CSP_008'],
    currentProcessNames: ['Screen resumes manually'],
    currentSpcPath: 'Human Resources > Recruiting > Candidate Screening',
    mappingType: '1:1',
    confidence: 95,
    status: 'suggested',
  },
];

// ============================================================================
// TABLE VIEW
// ============================================================================

interface TableViewProps {
  mappings: Mapping[];
  onEditMapping: (mapping: Mapping) => void;
  onDeleteMapping: (mappingId: string) => void;
}

const TableView: React.FC<TableViewProps> = ({ mappings, onEditMapping, onDeleteMapping }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell>Future Process</TableCell>
            <TableCell>Current Process(es)</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mappings.map((mapping) => (
            <TableRow
              key={mapping.id}
              hover
              sx={{
                bgcolor: 'inherit',
                borderLeft: 3,
                borderColor: mapping.status === 'suggested' ? 'warning.main' : 'transparent',
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {mapping.futureProcessName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {mapping.futureSpcPath}
                </Typography>
              </TableCell>
              <TableCell>
                {mapping.mappingType === 'new' ? (
                  <Chip label="New Process" size="small" color="info" />
                ) : mapping.currentProcessNames.length === 0 ? (
                  <Typography variant="body2" color="warning.main">
                    Not yet mapped
                  </Typography>
                ) : (
                  <Box>
                    {mapping.currentProcessNames.map((name, idx) => (
                      <Typography key={idx} variant="body2">
                        {name}
                      </Typography>
                    ))}
                    <Typography variant="caption" color="text.secondary">
                      {mapping.currentSpcPath}
                    </Typography>
                  </Box>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={mapping.mappingType}
                  size="small"
                  color={
                    mapping.mappingType === 'new' ? 'info' :
                    mapping.mappingType === '1:many' ? 'success' :
                    'default'
                  }
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {mapping.status === 'confirmed' && (
                    <CheckCircleIcon color="success" fontSize="small" />
                  )}
                  {mapping.status === 'suggested' && (
                    <TipsAndUpdatesIcon color="info" fontSize="small" />
                  )}
                  <Chip
                    label={mapping.status}
                    size="small"
                    color={
                      mapping.status === 'confirmed' ? 'success' :
                      mapping.status === 'suggested' ? 'info' :
                      'warning'
                    }
                  />
                  {mapping.confidence && (
                    <Typography variant="caption" color="text.secondary">
                      {mapping.confidence}% match
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEditMapping(mapping)}>
                  <CompareArrowsIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onDeleteMapping(mapping.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// ============================================================================
// VISUAL VIEW
// ============================================================================

interface VisualViewProps {
  mappings: Mapping[];
  onEditMapping: (mapping: Mapping) => void;
}

const VisualView: React.FC<VisualViewProps> = ({ mappings, onEditMapping }) => {
  return (
    <Box sx={{ p: 2 }}>
      {mappings.map((mapping) => (
        <Paper
          key={mapping.id}
          sx={{
            p: 3,
            mb: 2,
            border: 1,
            borderColor: mapping.status === 'suggested' ? 'warning.main' : 'divider',
            cursor: 'pointer',
            '&:hover': { boxShadow: 3 },
          }}
          onClick={() => onEditMapping(mapping)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Current Process(es) */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" color="text.secondary">
                Current State
              </Typography>
              {mapping.mappingType === 'new' ? (
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100', textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No current equivalent
                  </Typography>
                </Paper>
              ) : mapping.currentProcessNames.length === 0 ? (
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.light', textAlign: 'center' }}>
                  <Typography variant="body2" color="warning.dark">
                    Not yet mapped
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {mapping.currentProcessNames.map((name, idx) => (
                    <Paper key={idx} elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {name}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>

            {/* Arrow */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ArrowForwardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Chip
                label={mapping.mappingType}
                size="small"
                color={
                  mapping.mappingType === 'new' ? 'info' :
                  mapping.mappingType === '1:many' ? 'success' :
                  'default'
                }
                sx={{ mt: 1 }}
              />
              {mapping.confidence && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {mapping.confidence}% match
                </Typography>
              )}
            </Box>

            {/* Future Process */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" color="text.secondary">
                Future State
              </Typography>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'secondary.50', border: 1, borderColor: 'divider' }}>
                <Typography variant="body2" fontWeight={600}>
                  {mapping.futureProcessName}
                </Typography>
                {mapping.status === 'suggested' && (
                  <Chip
                    label="Suggested"
                    size="small"
                    color="warning"
                    icon={<TipsAndUpdatesIcon />}
                    sx={{ mt: 1 }}
                  />
                )}
              </Paper>
            </Box>
          </Box>

          {mapping.notes && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {mapping.notes}
            </Alert>
          )}
        </Paper>
      ))}
    </Box>
  );
};

// ============================================================================
// SHARED MOCKS
// ============================================================================

const mockCurrentProcesses = [
  { id: 'CSP_005', name: 'Manual invoice matching', path: 'Finance > Accounts Payable > Invoice Processing' },
  { id: 'CSP_009', name: 'Email approval requests', path: 'Finance > Accounts Payable > Invoice Processing' },
  { id: 'CSP_010', name: 'Track approvals in spreadsheet', path: 'Finance > Accounts Payable > Invoice Processing' },
];

const mockFutureProcesses = [
  { id: 'FSP_003', name: 'Approve invoice via workflow', path: 'Finance > Accounts Payable > Invoice Processing' },
  { id: 'FSP_004', name: 'Auto schedule payments', path: 'Finance > Accounts Payable > Payment Execution' },
  { id: 'FSP_008', name: 'Screen resumes with automation', path: 'Human Resources > Recruiting > Candidate Screening' },
];

// ============================================================================
// EDIT MAPPING DIALOG
// ============================================================================

interface EditMappingDialogProps {
  open: boolean;
  onClose: () => void;
  mapping: Mapping | null;
}

const EditMappingDialog: React.FC<EditMappingDialogProps> = ({ open, onClose, mapping }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCurrentProcesses, setSelectedCurrentProcesses] = useState<string[]>([]);
  const [showAddProcess, setShowAddProcess] = useState(false);

  if (!mapping) return null;

  const handleAddCurrentProcess = (processId: string) => {
    setSelectedCurrentProcesses([...selectedCurrentProcesses, processId]);
    setShowAddProcess(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Mapping
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{ mb: 2 }}
          TabIndicatorProps={{
            style: {
              backgroundColor: '#6366F1',
            },
          }}
        >
          <Tab label="Mapping Details" />
          <Tab label="Comparison" />
          <Tab label="Suggestions" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            {/* Future Process */}
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Future Process
            </Typography>
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50', border: 1, borderColor: 'divider' }}>
              <Typography variant="h6">{mapping.futureProcessName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {mapping.futureSpcPath}
              </Typography>
            </Paper>

            {/* Current Processes */}
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Current Process(es) Replaced
            </Typography>
            {mapping.mappingType === 'new' ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                This is a new process with no current equivalent. No mapping needed.
              </Alert>
            ) : mapping.currentProcessNames.length === 0 ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  No current processes mapped yet. Add mappings below.
                </Alert>
                {!showAddProcess ? (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setShowAddProcess(true)}
                    sx={{
                      borderRadius: '50px',
                      fontWeight: 700,
                    }}
                  >
                    Add Current Process
                  </Button>
                ) : (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }} icon={<TipsAndUpdatesIcon />}>
                      <Typography variant="body2">
                        <strong>Suggested matches</strong> based on the same category: <em>{mapping.futureSpcPath}</em>
                      </Typography>
                    </Alert>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Select a suggested current process:</Typography>
                    <List>
                      {mockCurrentProcesses.map((proc) => (
                        <ListItem
                          key={proc.id}
                          button
                          onClick={() => handleAddCurrentProcess(proc.id)}
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: '8px',
                            mb: 1,
                            '&:hover': { bgcolor: 'grey.50' }
                          }}
                        >
                          <ListItemText primary={proc.name} secondary={proc.path} />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<SearchIcon />}
                        onClick={() => {
                          // TODO: Open broader search or all CSPs
                          console.log('Browse all processes');
                        }}
                      >
                        Browse All Current Processes
                      </Button>
                      <Button size="small" onClick={() => setShowAddProcess(false)}>Cancel</Button>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <List>
                  {mapping.currentProcessNames.map((name, idx) => (
                    <ListItem
                      key={idx}
                      secondaryAction={
                        <IconButton edge="end" color="error">
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={name} secondary={mapping.currentSpcPath} />
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" startIcon={<AddIcon />} size="small">
                  Add Another
                </Button>
              </Box>
            )}

            {/* Notes */}
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              defaultValue={mapping.notes || ''}
              placeholder="Add notes about this mapping..."
              InputProps={{
                sx: {
                  borderRadius: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                }
              }}
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Side-by-side comparison helps verify this mapping makes sense.
            </Alert>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Current */}
              <Paper sx={{ flex: 1, p: 2 }} variant="outlined">
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Current Process
                </Typography>
                {mapping.currentProcessNames.map((name, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Manual, paper-based, error-prone
                    </Typography>
                  </Box>
                ))}
              </Paper>

              {/* Future */}
              <Paper sx={{ flex: 1, p: 2, bgcolor: 'grey.50' }} variant="outlined">
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Future Process
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {mapping.futureProcessName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Automated, integrated, real-time
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            {mapping.status === 'suggested' ? (
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  This mapping was suggested with {mapping.confidence}% confidence based on process names, categories, and descriptions.
                </Alert>
                <Typography variant="subtitle2" gutterBottom>
                  Why this suggestion?
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Similar terminology"
                      secondary="Both processes relate to invoice approval workflows"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Same category"
                      secondary="Both under Invoice Processing"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Process flow similarity"
                      secondary="Sequential steps match"
                    />
                  </ListItem>
                </List>
              </>
            ) : (
              <Alert severity="success">
                This mapping has been confirmed. No additional suggestions available.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
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
        {mapping.status === 'suggested' && (
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '50px',
              minHeight: 46,
              fontWeight: 700,
              fontSize: 14,
              minWidth: 160,
            }}
          >
            Confirm Mapping
          </Button>
        )}
        {mapping.status === 'confirmed' && (
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '50px',
              minHeight: 46,
              fontWeight: 700,
              fontSize: 14,
              minWidth: 160,
            }}
          >
            Save Changes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// ============================================================================
// CREATE MAPPING DIALOG
// ============================================================================

interface CreateMappingDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateMappingDialog: React.FC<CreateMappingDialogProps> = ({ open, onClose }) => {
  const [selectedFsp, setSelectedFsp] = useState<string>('');
  const [selectedCsp, setSelectedCsp] = useState<string>('');

  const handleCreate = () => {
    console.log('Create mapping:', selectedFsp, '->', selectedCsp);
    // In real app, create the mapping
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Create New Mapping
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Future State Process
          </Typography>
          <List sx={{ mb: 3 }}>
            {mockFutureProcesses.map((fsp) => (
              <ListItem
                key={fsp.id}
                button
                selected={selectedFsp === fsp.id}
                onClick={() => setSelectedFsp(fsp.id)}
                sx={{
                  border: 1,
                  borderColor: selectedFsp === fsp.id ? 'primary.main' : 'divider',
                  borderRadius: '8px',
                  mb: 1,
                  bgcolor: selectedFsp === fsp.id ? 'primary.50' : 'transparent',
                  '&:hover': { bgcolor: selectedFsp === fsp.id ? 'primary.50' : 'grey.50' }
                }}
              >
                <ListItemText primary={fsp.name} secondary={fsp.path} />
              </ListItem>
            ))}
          </List>

          {selectedFsp && (
            <>
              <Alert severity="info" sx={{ mb: 2 }} icon={<TipsAndUpdatesIcon />}>
                <Typography variant="body2">
                  Select which current process(es) this future process will replace
                </Typography>
              </Alert>
              <Typography variant="subtitle2" gutterBottom>
                Select Current State Process
              </Typography>
              <List>
                {mockCurrentProcesses.map((csp) => (
                  <ListItem
                    key={csp.id}
                    button
                    selected={selectedCsp === csp.id}
                    onClick={() => setSelectedCsp(csp.id)}
                    sx={{
                      border: 1,
                      borderColor: selectedCsp === csp.id ? 'primary.main' : 'divider',
                      borderRadius: '8px',
                      mb: 1,
                      bgcolor: selectedCsp === csp.id ? 'primary.50' : 'transparent',
                      '&:hover': { bgcolor: selectedCsp === csp.id ? 'primary.50' : 'grey.50' }
                    }}
                  >
                    <ListItemText primary={csp.name} secondary={csp.path} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
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
          onClick={handleCreate}
          disabled={!selectedFsp || !selectedCsp}
          sx={{
            borderRadius: '50px',
            minHeight: 46,
            fontWeight: 700,
            fontSize: 14,
            minWidth: 160,
          }}
        >
          Create Mapping
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ConnectOldToNew: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'visual'>('table');
  const [selectedMapping, setSelectedMapping] = useState<Mapping | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'suggested'>('all');

  const handleEditMapping = (mapping: Mapping) => {
    setSelectedMapping(mapping);
    setDialogOpen(true);
  };

  const handleDeleteMapping = (mappingId: string) => {
    console.log('Delete mapping:', mappingId);
    // In real app, would show confirmation dialog
  };

  const filteredMappings = mockMappings.filter((m) => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const stats = {
    total: mockMappings.length,
    confirmed: mockMappings.filter((m) => m.status === 'confirmed').length,
    suggested: mockMappings.filter((m) => m.status === 'suggested').length,
    unmapped: mockMappings.filter((m) => m.currentProcessIds.length === 0 && m.mappingType !== 'new').length,
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CompareArrowsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
                Map Future to Current
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Link future state processes to the current processes they replace
              </Typography>
            </Box>
          </Box>
        </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1, border: 2, borderColor: 'primary.main' }}>
          <CardContent>
            <Typography variant="h3" color="primary.main">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Total Future Processes
            </Typography>
            <Typography variant="caption" color="text.secondary">
              All FSPs in your project
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, border: 2, borderColor: 'success.main' }}>
          <CardContent>
            <Typography variant="h3" color="success.main">
              {stats.confirmed}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon fontSize="small" color="success" />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Confirmed Mappings
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Linked and verified
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, border: 2, borderColor: 'info.main' }}>
          <CardContent>
            <Typography variant="h3" color="info.main">
              {stats.suggested}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TipsAndUpdatesIcon fontSize="small" color="info" />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Suggested Mappings
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              AI recommendations to review
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, border: 2, borderColor: 'warning.main' }}>
          <CardContent>
            <Typography variant="h3" color="warning.main">
              {stats.unmapped}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WarningIcon fontSize="small" color="warning" />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Needs Mapping
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Not yet linked to CSP
            </Typography>
          </CardContent>
        </Card>
      </Box>


      {/* Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, v) => v && setViewMode(v)}
          size="small"
        >
          <ToggleButton value="table">
            <ViewListIcon sx={{ mr: 1 }} />
            Table
          </ToggleButton>
          <ToggleButton value="visual">
            <AccountTreeIcon sx={{ mr: 1 }} />
            Visual
          </ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={filterStatus}
            exclusive
            onChange={(e, v) => v && setFilterStatus(v)}
            size="small"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="confirmed">Confirmed</ToggleButton>
            <ToggleButton value="suggested">Suggested</ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Mapping
          </Button>
        </Box>
      </Box>

      {/* Content */}
      {viewMode === 'table' ? (
        <TableView
          mappings={filteredMappings}
          onEditMapping={handleEditMapping}
          onDeleteMapping={handleDeleteMapping}
        />
      ) : (
        <VisualView mappings={filteredMappings} onEditMapping={handleEditMapping} />
      )}

      {/* Edit Dialog */}
      <EditMappingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mapping={selectedMapping}
      />

      {/* Create Mapping Dialog */}
      <CreateMappingDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
      </Box>
    </Box>
  );
};

export default ConnectOldToNew;
