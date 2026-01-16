import React, { useState } from 'react';
import AddProcessDialog from './AddProcessDialog';
import SpcTreeBrowser from './SpcTreeBrowser';
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
  Drawer,
  IconButton,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Checkbox,
  ListItemIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  CloudDownload as CloudDownloadIcon,
  Science as ScienceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Link as LinkIcon,
  NewReleases as NewReleasesIcon,
  Delete as DeleteIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  CompareArrows as CompareArrowsIcon,
  FolderOpen as FolderOpenIcon,
} from '@mui/icons-material';

// ============================================================================
// MOCK DATA
// ============================================================================

interface SpcNode {
  id: string;
  code: string;
  visibleCode: string;
  name: string;
  parentId: string | null;
  children?: SpcNode[];
  processCount?: number;
}

interface FutureStateProcess {
  id: string;
  futureProcessName: string;
  status: 'Completed' | 'InProgress' | 'NotStarted';
  projectSpcId: string;
  spcName: string;
  spcPath: string;
  mappedCurrentProcesses: string[]; // IDs of current processes this replaces
  mappedCurrentProcessCount: number;
  isNewProcess: boolean; // True if no current equivalent
  testingStatus: 'NotStarted' | 'InProgress' | 'Completed' | null;
  trainingStatus: 'NotStarted' | 'InProgress' | 'Completed' | null;
  presentationCount: number;
  createdAt: string;
  updatedAt: string;
}

const mockSpcTree: SpcNode[] = [
  {
    id: 'SPC_100',
    code: '100',
    visibleCode: '100',
    name: 'Finance',
    parentId: null,
    processCount: 5,
    children: [
      {
        id: 'SPC_101',
        code: '100.001',
        visibleCode: '101',
        name: 'Accounts Payable',
        parentId: 'SPC_100',
        processCount: 5,
        children: [
          {
            id: 'SPC_101_001',
            code: '100.001.001',
            visibleCode: '101.001',
            name: 'Vendor Setup',
            parentId: 'SPC_101',
            processCount: 1,
          },
          {
            id: 'SPC_101_002',
            code: '100.001.002',
            visibleCode: '101.002',
            name: 'Invoice Processing',
            parentId: 'SPC_101',
            processCount: 2,
          },
          {
            id: 'SPC_101_003',
            code: '100.001.003',
            visibleCode: '101.003',
            name: 'Payment Execution',
            parentId: 'SPC_101',
            processCount: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'SPC_200',
    code: '200',
    visibleCode: '200',
    name: 'Human Resources',
    parentId: null,
    processCount: 2,
    children: [
      {
        id: 'SPC_201',
        code: '200.001',
        visibleCode: '201',
        name: 'Recruiting',
        parentId: 'SPC_200',
        processCount: 2,
        children: [
          {
            id: 'SPC_201_001',
            code: '200.001.001',
            visibleCode: '201.001',
            name: 'Job Posting',
            parentId: 'SPC_201',
            processCount: 1,
          },
          {
            id: 'SPC_201_002',
            code: '200.001.002',
            visibleCode: '201.002',
            name: 'Candidate Screening',
            parentId: 'SPC_201',
            processCount: 1,
          },
        ],
      },
    ],
  },
];

const mockFutureProcesses: FutureStateProcess[] = [
  {
    id: 'FSP_001',
    futureProcessName: 'Create vendor in Oracle Cloud',
    status: 'Completed',
    projectSpcId: 'SPC_101_001',
    spcName: 'Vendor Setup',
    spcPath: 'Finance > Accounts Payable > Vendor Setup',
    mappedCurrentProcesses: ['CSP_001', 'CSP_002', 'CSP_003'],
    mappedCurrentProcessCount: 3,
    isNewProcess: false,
    testingStatus: 'Completed',
    trainingStatus: 'InProgress',
    presentationCount: 1,
    createdAt: '2025-12-17',
    updatedAt: '2026-01-15',
  },
  {
    id: 'FSP_002',
    futureProcessName: 'Match invoice to PO automatically',
    status: 'Completed',
    projectSpcId: 'SPC_101_002',
    spcName: 'Invoice Processing',
    spcPath: 'Finance > Accounts Payable > Invoice Processing',
    mappedCurrentProcesses: ['CSP_004'],
    mappedCurrentProcessCount: 1,
    isNewProcess: false,
    testingStatus: 'Completed',
    trainingStatus: 'Completed',
    presentationCount: 1,
    createdAt: '2025-12-22',
    updatedAt: '2026-01-09',
  },
  {
    id: 'FSP_003',
    futureProcessName: 'Approve invoice via workflow',
    status: 'InProgress',
    projectSpcId: 'SPC_101_002',
    spcName: 'Invoice Processing',
    spcPath: 'Finance > Accounts Payable > Invoice Processing',
    mappedCurrentProcesses: [],
    mappedCurrentProcessCount: 0,
    isNewProcess: false,
    testingStatus: 'InProgress',
    trainingStatus: 'NotStarted',
    presentationCount: 1,
    createdAt: '2025-12-27',
    updatedAt: '2026-01-11',
  },
  {
    id: 'FSP_004',
    futureProcessName: 'Auto schedule payments',
    status: 'Completed',
    projectSpcId: 'SPC_101_003',
    spcName: 'Payment Execution',
    spcPath: 'Finance > Accounts Payable > Payment Execution',
    mappedCurrentProcesses: [],
    mappedCurrentProcessCount: 0,
    isNewProcess: true,
    testingStatus: 'Completed',
    trainingStatus: 'InProgress',
    presentationCount: 1,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-14',
  },
  {
    id: 'FSP_005',
    futureProcessName: 'Process payment electronically',
    status: 'Completed',
    projectSpcId: 'SPC_101_003',
    spcName: 'Payment Execution',
    spcPath: 'Finance > Accounts Payable > Payment Execution',
    mappedCurrentProcesses: ['CSP_006'],
    mappedCurrentProcessCount: 1,
    isNewProcess: false,
    testingStatus: 'Completed',
    trainingStatus: 'Completed',
    presentationCount: 1,
    createdAt: '2026-01-06',
    updatedAt: '2026-01-15',
  },
  {
    id: 'FSP_006',
    futureProcessName: 'Post job via ATS to multiple boards',
    status: 'Completed',
    projectSpcId: 'SPC_201_001',
    spcName: 'Job Posting',
    spcPath: 'Human Resources > Recruiting > Job Posting',
    mappedCurrentProcesses: ['CSP_007'],
    mappedCurrentProcessCount: 1,
    isNewProcess: false,
    testingStatus: 'Completed',
    trainingStatus: 'Completed',
    presentationCount: 1,
    createdAt: '2025-12-07',
    updatedAt: '2025-12-26',
  },
  {
    id: 'FSP_007',
    futureProcessName: 'AI-assisted resume screening',
    status: 'NotStarted',
    projectSpcId: 'SPC_201_002',
    spcName: 'Candidate Screening',
    spcPath: 'Human Resources > Recruiting > Candidate Screening',
    mappedCurrentProcesses: ['CSP_008'],
    mappedCurrentProcessCount: 1,
    isNewProcess: false,
    testingStatus: null,
    trainingStatus: null,
    presentationCount: 0,
    createdAt: '2026-01-11',
    updatedAt: '2026-01-11',
  },
];

// ============================================================================
// TREE COMPONENT (Same as CurrentStateProcessLibrary)
// ============================================================================

interface SpcTreeItemProps {
  node: SpcNode;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  expandedNodes: Set<string>;
  onToggleNode: (nodeId: string) => void;
  level: number;
}

const SpcTreeItem: React.FC<SpcTreeItemProps> = ({
  node,
  selectedNodeId,
  onSelectNode,
  expandedNodes,
  onToggleNode,
  level,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodeId === node.id;

  return (
    <>
      <ListItem disablePadding sx={{ pl: level * 2 }}>
        <ListItemButton
          selected={isSelected}
          onClick={() => onSelectNode(node.id)}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'primary.light',
              '&:hover': { bgcolor: 'primary.light' },
            },
          }}
        >
          {hasChildren && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleNode(node.id);
              }}
              sx={{ mr: 0.5 }}
            >
              {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </IconButton>
          )}
          {!hasChildren && <Box sx={{ width: 32 }} />}
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight={hasChildren ? 600 : 400}>
                  {node.name}
                </Typography>
                {node.processCount !== undefined && node.processCount > 0 && (
                  <Chip
                    label={node.processCount}
                    size="small"
                    color="primary"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                )}
              </Box>
            }
            secondary={node.visibleCode}
          />
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List disablePadding>
            {node.children!.map((child) => (
              <SpcTreeItem
                key={child.id}
                node={child}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                expandedNodes={expandedNodes}
                onToggleNode={onToggleNode}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

// ============================================================================
// ENTRY PATH DIALOG (Enhanced with Template Import)
// ============================================================================

interface EntryPathDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectPath: (path: 'template' | 'capture' | 'direct') => void;
}

const EntryPathDialog: React.FC<EntryPathDialogProps> = ({ open, onClose, onSelectPath }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Add Future State Process
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose how you want to add future state processes:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '2px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                height: '100%',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
              }}
              onClick={() => onSelectPath('template')}
            >
              <CloudDownloadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Import Template
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Import pre-built processes from Oracle Cloud, SAP, Workday, or other systems
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Select Template</InputLabel>
                <Select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MenuItem value="oracle-cloud-ap">Oracle Cloud - Accounts Payable</MenuItem>
                  <MenuItem value="oracle-cloud-ar">Oracle Cloud - Accounts Receivable</MenuItem>
                  <MenuItem value="sap-fi">SAP - Finance</MenuItem>
                  <MenuItem value="workday-hcm">Workday - HCM</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '2px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                height: '100%',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
              }}
              onClick={() => onSelectPath('capture')}
            >
              <ScienceIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Sandbox Capture
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Capture processes from a sandbox or test environment of your new system
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '2px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                height: '100%',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
              }}
              onClick={() => onSelectPath('direct')}
            >
              <EditIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Direct Entry
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manually enter future process details
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

// ============================================================================
// MOCK CURRENT PROCESSES FOR MAPPING
// ============================================================================

const mockCurrentProcessesForMapping = [
  { id: 'CSP_001', name: 'Identify vendor in spreadsheet', path: 'Finance > Accounts Payable > Vendor Setup' },
  { id: 'CSP_002', name: 'Email finance for vendor approval', path: 'Finance > Accounts Payable > Vendor Setup' },
  { id: 'CSP_003', name: 'Track vendor IDs manually', path: 'Finance > Accounts Payable > Vendor Setup' },
  { id: 'CSP_004', name: 'Enter invoice into LegacyERP', path: 'Finance > Accounts Payable > Invoice Processing' },
  { id: 'CSP_005', name: 'Manual invoice matching', path: 'Finance > Accounts Payable > Invoice Processing' },
  { id: 'CSP_006', name: 'Print checks weekly', path: 'Finance > Accounts Payable > Payment Execution' },
  { id: 'CSP_007', name: 'Post job on company website', path: 'Human Resources > Recruiting > Job Posting' },
  { id: 'CSP_008', name: 'Screen resumes manually', path: 'Human Resources > Recruiting > Candidate Screening' },
];

// ============================================================================
// CHANGE MAPPING DIALOG
// ============================================================================

interface ChangeMappingDialogProps {
  open: boolean;
  onClose: () => void;
  process: FutureStateProcess | null;
}

const ChangeMappingDialog: React.FC<ChangeMappingDialogProps> = ({ open, onClose, process }) => {
  const [mappedProcesses, setMappedProcesses] = useState<string[]>([]);
  const [showAddProcess, setShowAddProcess] = useState(false);
  const [viewMode, setViewMode] = useState<'suggested' | 'parent' | 'all'>('suggested');

  React.useEffect(() => {
    if (process) {
      setMappedProcesses(process.mappedCurrentProcesses);
    }
  }, [process]);

  if (!process) return null;

  const handleAddProcess = (processId: string) => {
    setMappedProcesses([...mappedProcesses, processId]);
    setShowAddProcess(false);
    setViewMode('suggested');
  };

  const handleRemoveProcess = (processId: string) => {
    setMappedProcesses(mappedProcesses.filter(id => id !== processId));
  };

  const handleSave = () => {
    console.log('Save mappings:', mappedProcesses);
    // In real app, update the mappings
    onClose();
  };

  const getParentCategory = (path: string) => {
    const parts = path.split(' > ');
    return parts.slice(0, -1).join(' > ');
  };

  const parentCategory = getParentCategory(process.spcPath);

  const suggestedProcesses = mockCurrentProcessesForMapping.filter(
    csp => csp.path === process.spcPath && !mappedProcesses.includes(csp.id)
  );

  const parentCategoryProcesses = parentCategory ? mockCurrentProcessesForMapping.filter(
    csp => csp.path.startsWith(parentCategory) && csp.path !== process.spcPath && !mappedProcesses.includes(csp.id)
  ) : [];

  const allProcesses = mockCurrentProcessesForMapping.filter(
    csp => !mappedProcesses.includes(csp.id)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareArrowsIcon />
          Change Mapping
        </Box>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Future Process */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Future Process
          </Typography>
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50', border: 1, borderColor: 'divider' }}>
            <Typography variant="h6">{process.futureProcessName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {process.spcPath}
            </Typography>
          </Paper>

          {/* Current Mappings */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Current Process(es) This Replaces
          </Typography>
          {mappedProcesses.length === 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No current processes mapped yet. Add mappings below.
            </Alert>
          ) : (
            <List sx={{ mb: 2 }}>
              {mappedProcesses.map((processId) => {
                const csp = mockCurrentProcessesForMapping.find(p => p.id === processId);
                if (!csp) return null;
                return (
                  <ListItem
                    key={processId}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: '8px',
                      mb: 1,
                      bgcolor: 'grey.50'
                    }}
                    secondaryAction={
                      <IconButton edge="end" color="error" onClick={() => handleRemoveProcess(processId)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={csp.name} secondary={csp.path} />
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* Add Process */}
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
              {/* View Mode Buttons */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  size="small"
                  variant={viewMode === 'suggested' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('suggested')}
                >
                  Suggested ({suggestedProcesses.length})
                </Button>
                {parentCategory && (
                  <Button
                    size="small"
                    variant={viewMode === 'parent' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('parent')}
                  >
                    Parent Category ({parentCategoryProcesses.length})
                  </Button>
                )}
                <Button
                  size="small"
                  variant={viewMode === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('all')}
                >
                  Browse All ({allProcesses.length})
                </Button>
              </Box>

              {/* Suggested View */}
              {viewMode === 'suggested' && (
                <>
                  {suggestedProcesses.length > 0 ? (
                    <>
                      <Alert severity="info" sx={{ mb: 2 }} icon={<TipsAndUpdatesIcon />}>
                        <Typography variant="body2">
                          <strong>Suggested matches</strong> based on the same category: <em>{process.spcPath}</em>
                        </Typography>
                      </Alert>
                      <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                        {suggestedProcesses.map((csp) => (
                          <ListItem
                            key={csp.id}
                            button
                            onClick={() => handleAddProcess(csp.id)}
                            sx={{
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: '8px',
                              mb: 1,
                              '&:hover': { bgcolor: 'grey.50' }
                            }}
                          >
                            <ListItemText primary={csp.name} secondary={csp.path} />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      No suggested processes in the same category. Try browsing the parent category or all processes.
                    </Alert>
                  )}
                </>
              )}

              {/* Parent Category View */}
              {viewMode === 'parent' && parentCategory && (
                <>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Parent category:</strong> <em>{parentCategory}</em>
                    </Typography>
                  </Alert>
                  <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                    {parentCategoryProcesses.map((csp) => (
                      <ListItem
                        key={csp.id}
                        button
                        onClick={() => handleAddProcess(csp.id)}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: '8px',
                          mb: 1,
                          '&:hover': { bgcolor: 'grey.50' }
                        }}
                      >
                        <ListItemText primary={csp.name} secondary={csp.path} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {/* All Processes View */}
              {viewMode === 'all' && (
                <>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>All current processes</strong> - Choose any process to map
                    </Typography>
                  </Alert>
                  <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                    {allProcesses.map((csp) => (
                      <ListItem
                        key={csp.id}
                        button
                        onClick={() => handleAddProcess(csp.id)}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: '8px',
                          mb: 1,
                          '&:hover': { bgcolor: 'grey.50' }
                        }}
                      >
                        <ListItemText primary={csp.name} secondary={csp.path} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Button size="small" onClick={() => { setShowAddProcess(false); setViewMode('suggested'); }}>Cancel</Button>
            </Box>
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
          onClick={handleSave}
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
      </DialogActions>
    </Dialog>
  );
};

// ============================================================================
// CATEGORY SELECTION DIALOG
// ============================================================================

// Get unique categories from all future processes
const getExistingFutureCategories = () => {
  const categoriesSet = new Set(mockFutureProcesses.map(p => p.spcPath));
  return Array.from(categoriesSet).sort();
};

interface CategorySelectionDialogProps {
  open: boolean;
  onClose: () => void;
  currentCategories: string[];
  onSave: (categories: string[]) => void;
}

const CategorySelectionDialog: React.FC<CategorySelectionDialogProps> = ({
  open,
  onClose,
  currentCategories,
  onSave
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentCategories);
  const [showTreeBrowser, setShowTreeBrowser] = useState(false);
  const existingCategories = getExistingFutureCategories();

  const handleToggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = () => {
    onSave(selectedCategories);
    onClose();
  };

  const handleTreeSelect = (spcId: string, spcName: string, spcPath: string) => {
    setSelectedCategories(prev =>
      prev.includes(spcPath) ? prev : [...prev, spcPath]
    );
    setShowTreeBrowser(false);
  };

  const handleSelectAll = () => {
    setSelectedCategories(existingCategories);
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
  };

  return (
    <>
      <Dialog open={open && !showTreeBrowser} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Select Process Categories
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Select one or more categories that this process belongs to
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" onClick={handleSelectAll}>Select All</Button>
              <Button size="small" onClick={handleDeselectAll}>Deselect All</Button>
            </Box>
          </Box>
          <List>
            {existingCategories.map((category) => (
              <ListItem
                key={category}
                disablePadding
                sx={{
                  border: 1,
                  borderColor: selectedCategories.includes(category) ? 'primary.main' : 'divider',
                  borderRadius: '8px',
                  mb: 1,
                  bgcolor: selectedCategories.includes(category) ? 'primary.50' : 'transparent',
                }}
              >
                <ListItemButton onClick={() => handleToggleCategory(category)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedCategories.includes(category)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={category}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FolderOpenIcon />}
            onClick={() => setShowTreeBrowser(true)}
            sx={{ mt: 2 }}
          >
            Can't find what you're looking for? Browse all categories
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {showTreeBrowser && (
        <SpcTreeBrowser
          open={showTreeBrowser}
          onClose={() => setShowTreeBrowser(false)}
          onSelect={handleTreeSelect}
          primarySpcPath={selectedCategories[0] || ''}
          currentSelection={''}
        />
      )}
    </>
  );
};

// ============================================================================
// PROCESS DETAIL DRAWER
// ============================================================================

interface ProcessDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  process: FutureStateProcess | null;
  onNavigateToMapping?: () => void;
}

const ProcessDetailDrawer: React.FC<ProcessDetailDrawerProps> = ({ open, onClose, process, onNavigateToMapping }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showMappingDialog, setShowMappingDialog] = useState(false);

  const handleSaveCategories = (categories: string[]) => {
    console.log('Save categories:', categories);
    // In real app, update the process categories via API
  };

  if (!process) return null;

  return (
    <>
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { width: 480 } }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Process Details</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          {process.futureProcessName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={process.status} size="small" color={process.status === 'Completed' ? 'success' : 'default'} />
          {process.isNewProcess && (
            <Chip label="New Process" size="small" color="info" />
          )}
          {process.mappedCurrentProcessCount === 0 && !process.isNewProcess && (
            <Chip label="Not Mapped" size="small" color="warning" icon={<WarningIcon />} />
          )}
        </Box>

        {process.mappedCurrentProcessCount === 0 && !process.isNewProcess && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This future process is not yet mapped to any current processes. Visit "Connect Old to New" to create mappings.
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Overview" />
          <Tab label="Mapping" />
          <Tab label="Testing & Training" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Process Category</Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowCategoryDialog(true)}
              >
                Change
              </Button>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {process.spcPath}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">Presentations</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {process.presentationCount} presentation{process.presentationCount !== 1 ? 's' : ''}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">Created</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {new Date(process.createdAt).toLocaleDateString()}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
            <Typography variant="body1">
              {new Date(process.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Mapping Status</Typography>
            {process.isNewProcess ? (
              <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
                <Typography variant="body2">
                  This is a new process with no current equivalent. No mapping needed.
                </Typography>
              </Paper>
            ) : process.mappedCurrentProcessCount === 0 ? (
              <Paper sx={{ p: 2, bgcolor: 'warning.light' }}>
                <Typography variant="body2" gutterBottom>
                  Not yet mapped to current processes.
                </Typography>
                <Button size="small" startIcon={<LinkIcon />} sx={{ mt: 1 }}>
                  Create Mapping
                </Button>
              </Paper>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Replaces {process.mappedCurrentProcessCount} current process{process.mappedCurrentProcessCount !== 1 ? 'es' : ''}:
                </Typography>
                <Paper sx={{ p: 2 }}>
                  <List dense>
                    {process.mappedCurrentProcesses.map((id) => (
                      <ListItem key={id}>
                        <ListItemText primary={`Current Process ${id}`} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
                <Button size="small" sx={{ mt: 1 }}>
                  View in Connect Old to New
                </Button>
              </>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Testing Status</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              {process.testingStatus ? (
                <>
                  {process.testingStatus === 'Completed' && <CheckCircleIcon color="success" />}
                  {process.testingStatus === 'InProgress' && <WarningIcon color="warning" />}
                  <Chip
                    label={process.testingStatus}
                    size="small"
                    color={
                      process.testingStatus === 'Completed' ? 'success' :
                      process.testingStatus === 'InProgress' ? 'warning' : 'default'
                    }
                  />
                </>
              ) : (
                <Chip label="Not Started" size="small" />
              )}
            </Box>

            <Typography variant="subtitle2" gutterBottom>Training Status</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {process.trainingStatus ? (
                <>
                  {process.trainingStatus === 'Completed' && <CheckCircleIcon color="success" />}
                  {process.trainingStatus === 'InProgress' && <WarningIcon color="warning" />}
                  <Chip
                    label={process.trainingStatus}
                    size="small"
                    color={
                      process.trainingStatus === 'Completed' ? 'success' :
                      process.trainingStatus === 'InProgress' ? 'warning' : 'default'
                    }
                  />
                </>
              ) : (
                <Chip label="Not Started" size="small" />
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
        {!process.isNewProcess && process.mappedCurrentProcessCount === 0 && onNavigateToMapping && (
          <Button
            variant="contained"
            color="warning"
            fullWidth
            sx={{ mb: 1 }}
            startIcon={<LinkIcon />}
            onClick={() => {
              onNavigateToMapping();
              onClose();
            }}
          >
            Map to Current Process
          </Button>
        )}
        {process.mappedCurrentProcessCount > 0 && (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ mb: 1 }}
            startIcon={<CompareArrowsIcon />}
            onClick={() => setShowMappingDialog(true)}
          >
            Change Mapping
          </Button>
        )}
        <Button variant="contained" fullWidth sx={{ mb: 1 }}>
          Edit Process
        </Button>
        <Button variant="outlined" fullWidth>
          View Presentations
        </Button>
      </Box>
    </Drawer>

    {/* Category Selection Dialog */}
    <CategorySelectionDialog
      open={showCategoryDialog}
      onClose={() => setShowCategoryDialog(false)}
      currentCategories={[process.spcPath]}
      onSave={handleSaveCategories}
    />

    {/* Change Mapping Dialog */}
    <ChangeMappingDialog
      open={showMappingDialog}
      onClose={() => setShowMappingDialog(false)}
      process={process}
    />
    </>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface FutureStateProcessLibraryProps {
  onStartCapture?: (processName: string, spcPath: string) => void;
  onNavigateToMapping?: () => void;
}

export const FutureStateProcessLibrary: React.FC<FutureStateProcessLibraryProps> = ({ onStartCapture, onNavigateToMapping }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('SPC_101');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['SPC_100', 'SPC_101', 'SPC_200', 'SPC_201'])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<FutureStateProcess | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleToggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleSelectPath = (path: 'template' | 'capture' | 'direct') => {
    setEntryDialogOpen(false);
    console.log('Selected path:', path);
  };

  const handleProcessClick = (process: FutureStateProcess) => {
    setSelectedProcess(process);
    setDrawerOpen(true);
  };

  // Filter processes
  const filteredProcesses = mockFutureProcesses.filter((p) => {
    const matchesNode = !selectedNodeId || p.projectSpcId === selectedNodeId || p.projectSpcId.startsWith(selectedNodeId);
    const matchesSearch = !searchQuery || p.futureProcessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'unmapped' && p.mappedCurrentProcessCount === 0 && !p.isNewProcess) ||
      (filterStatus === 'new' && p.isNewProcess);
    return matchesNode && matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left Panel: SPC Tree Navigation */}
      <Paper sx={{ width: 320, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }} elevation={0}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Process Categories
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Browse by business area
          </Typography>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <List>
            {mockSpcTree.map((node) => (
              <SpcTreeItem
                key={node.id}
                node={node}
                selectedNodeId={selectedNodeId}
                onSelectNode={handleSelectNode}
                expandedNodes={expandedNodes}
                onToggleNode={handleToggleNode}
                level={0}
              />
            ))}
          </List>
        </Box>
      </Paper>

      {/* Right Panel: Process Library */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Future State Process Library</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setEntryDialogOpen(true)}
            >
              Add Process
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search processes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter"
              >
                <MenuItem value="all">All Processes</MenuItem>
                <MenuItem value="unmapped">Unmapped Only</MenuItem>
                <MenuItem value="new">New Processes</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Process Cards */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filteredProcesses.length} process{filteredProcesses.length !== 1 ? 'es' : ''} found
          </Typography>
          <Grid container spacing={2}>
            {filteredProcesses.map((process) => (
              <Grid item xs={12} md={6} key={process.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 },
                    border: 1,
                    borderColor: process.mappedCurrentProcessCount === 0 && !process.isNewProcess ? 'warning.main' : 'divider',
                  }}
                  onClick={() => handleProcessClick(process)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {process.futureProcessName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {process.isNewProcess && (
                          <Chip label="New" size="small" color="info" />
                        )}
                        {!process.isNewProcess && process.mappedCurrentProcessCount === 0 && (
                          <Chip
                            icon={<WarningIcon />}
                            label="Not Mapped"
                            size="small"
                            color="warning"
                          />
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {process.spcPath}
                    </Typography>
                    {process.isNewProcess ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <NewReleasesIcon fontSize="small" color="info" />
                        <Typography variant="body2" color="info.main" sx={{ fontWeight: 600 }}>
                          New process (no current equivalent)
                        </Typography>
                      </Box>
                    ) : process.mappedCurrentProcessCount > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                          Replaces {process.mappedCurrentProcessCount} current process{process.mappedCurrentProcessCount !== 1 ? 'es' : ''}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <WarningIcon fontSize="small" color="warning" />
                        <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                          Not yet mapped to current process
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={process.status} size="small" color={process.status === 'Completed' ? 'success' : 'default'} />
                      {process.testingStatus && (
                        <Chip label={`Test: ${process.testingStatus}`} size="small" variant="outlined" />
                      )}
                      {process.trainingStatus && (
                        <Chip label={`Train: ${process.trainingStatus}`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Dialogs and Drawers */}
      <AddProcessDialog
        open={entryDialogOpen}
        onClose={() => setEntryDialogOpen(false)}
        type="future"
        onCreateAndCapture={(process) => {
          setEntryDialogOpen(false);
          if (onStartCapture) {
            onStartCapture(process.name, process.spcPath || 'Finance > Accounts Payable > Vendor Setup');
          }
        }}
      />
      <ProcessDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        process={selectedProcess}
        onNavigateToMapping={onNavigateToMapping}
      />
    </Box>
  );
};

export default FutureStateProcessLibrary;
