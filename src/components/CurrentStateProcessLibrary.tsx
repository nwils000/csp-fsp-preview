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
  Checkbox,
  ListItemIcon,
} from '@mui/material';
import AddProcessDialog from './AddProcessDialog';
import SpcTreeBrowser from './SpcTreeBrowser';
import Alert from '@mui/material/Alert';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Link as LinkIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  CompareArrows as CompareArrowsIcon,
  Visibility as VisibilityIcon,
  FolderOpen as FolderOpenIcon,
} from '@mui/icons-material';

// ============================================================================
// MOCK DATA - In real app, this would come from API
// ============================================================================

interface SpcNode {
  id: string;
  code: string;
  visibleCode: string;
  name: string;
  parentId: string | null;
  children?: SpcNode[];
  processCount?: number; // Number of current processes at this node
}

interface CurrentStateProcess {
  id: string;
  name: string;
  status: 'Completed' | 'InProgress' | 'NotStarted';
  associatedSpcId: string;
  spcName: string;
  spcPath: string; // e.g., "Finance > Accounts Payable > Vendor Setup"
  mappedStatus: 'Mapped' | 'Unmapped' | null;
  mappedBy: string | null;
  refinementLevel: 'Initial' | 'Refined'; // Initial link = high level, Refined = specific node
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
    processCount: 6,
    children: [
      {
        id: 'SPC_101',
        code: '100.001',
        visibleCode: '101',
        name: 'Accounts Payable',
        parentId: 'SPC_100',
        processCount: 6,
        children: [
          {
            id: 'SPC_101_001',
            code: '100.001.001',
            visibleCode: '101.001',
            name: 'Vendor Setup',
            parentId: 'SPC_101',
            processCount: 3,
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
            processCount: 1,
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

const mockCurrentProcesses: CurrentStateProcess[] = [
  {
    id: 'CSP_001',
    name: 'Identify vendor in spreadsheet',
    status: 'Completed',
    associatedSpcId: 'SPC_101_001',
    spcName: 'Vendor Setup',
    spcPath: 'Finance > Accounts Payable > Vendor Setup',
    mappedStatus: 'Mapped',
    mappedBy: 'Jane Smith',
    refinementLevel: 'Refined',
    presentationCount: 2,
    createdAt: '2025-11-17',
    updatedAt: '2026-01-09',
  },
  {
    id: 'CSP_002',
    name: 'Email finance for vendor approval',
    status: 'Completed',
    associatedSpcId: 'SPC_101_001',
    spcName: 'Vendor Setup',
    spcPath: 'Finance > Accounts Payable > Vendor Setup',
    mappedStatus: 'Mapped',
    mappedBy: 'Jane Smith',
    refinementLevel: 'Refined',
    presentationCount: 1,
    createdAt: '2025-12-02',
    updatedAt: '2026-01-02',
  },
  {
    id: 'CSP_003',
    name: 'Track vendor IDs manually',
    status: 'Completed',
    associatedSpcId: 'SPC_101_001',
    spcName: 'Vendor Setup',
    spcPath: 'Finance > Accounts Payable > Vendor Setup',
    mappedStatus: 'Mapped',
    mappedBy: 'Jane Smith',
    refinementLevel: 'Refined',
    presentationCount: 1,
    createdAt: '2025-12-17',
    updatedAt: '2025-12-26',
  },
  {
    id: 'CSP_004',
    name: 'Enter invoice into LegacyERP',
    status: 'Completed',
    associatedSpcId: 'SPC_101_002',
    spcName: 'Invoice Processing',
    spcPath: 'Finance > Accounts Payable > Invoice Processing',
    mappedStatus: 'Mapped',
    mappedBy: 'John Doe',
    refinementLevel: 'Refined',
    presentationCount: 1,
    createdAt: '2025-11-27',
    updatedAt: '2026-01-06',
  },
  {
    id: 'CSP_005',
    name: 'Manual invoice matching',
    status: 'NotStarted',
    associatedSpcId: 'SPC_101_002',
    spcName: 'Invoice Processing',
    spcPath: 'Finance > Accounts Payable > Invoice Processing',
    mappedStatus: null,
    mappedBy: null,
    refinementLevel: 'Initial',
    presentationCount: 0,
    createdAt: '2026-01-11',
    updatedAt: '2026-01-11',
  },
  {
    id: 'CSP_006',
    name: 'Print checks weekly',
    status: 'InProgress',
    associatedSpcId: 'SPC_101_003',
    spcName: 'Payment Execution',
    spcPath: 'Finance > Accounts Payable > Payment Execution',
    mappedStatus: 'Mapped',
    mappedBy: 'Sarah Johnson',
    refinementLevel: 'Refined',
    presentationCount: 1,
    createdAt: '2025-12-07',
    updatedAt: '2026-01-13',
  },
  {
    id: 'CSP_007',
    name: 'Post job on company website',
    status: 'Completed',
    associatedSpcId: 'SPC_201_001',
    spcName: 'Job Posting',
    spcPath: 'Human Resources > Recruiting > Job Posting',
    mappedStatus: null,
    mappedBy: null,
    refinementLevel: 'Initial',
    presentationCount: 1,
    createdAt: '2025-10-18',
    updatedAt: '2025-12-16',
  },
  {
    id: 'CSP_008',
    name: 'Screen resumes manually',
    status: 'Completed',
    associatedSpcId: 'SPC_201_002',
    spcName: 'Candidate Screening',
    spcPath: 'Human Resources > Recruiting > Candidate Screening',
    mappedStatus: null,
    mappedBy: null,
    refinementLevel: 'Initial',
    presentationCount: 1,
    createdAt: '2025-10-28',
    updatedAt: '2025-12-21',
  },
];

// ============================================================================
// TREE COMPONENT
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
// ENTRY PATH DIALOG
// ============================================================================

interface EntryPathDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectPath: (path: 'capture' | 'direct') => void;
}

const EntryPathDialog: React.FC<EntryPathDialogProps> = ({ open, onClose, onSelectPath }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add Current State Process
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose how you want to add this process:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '2px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
              }}
              onClick={() => onSelectPath('capture')}
            >
              <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Capture from System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Import existing process data from your current system or documentation
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '2px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
              }}
              onClick={() => onSelectPath('direct')}
            >
              <EditIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Direct Entry
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manually enter process details and link to the industry starting point
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
// MOCK FUTURE PROCESSES FOR MAPPING
// ============================================================================

const mockFutureProcessesForMapping = [
  { id: 'FSP_001', name: 'Create vendor in Oracle Cloud', path: 'Finance > Accounts Payable > Vendor Setup' },
  { id: 'FSP_002', name: 'Match invoice to PO automatically', path: 'Finance > Accounts Payable > Invoice Processing' },
  { id: 'FSP_003', name: 'Approve invoice via workflow', path: 'Finance > Accounts Payable > Invoice Processing' },
  { id: 'FSP_004', name: 'Auto schedule payments', path: 'Finance > Accounts Payable > Payment Execution' },
  { id: 'FSP_005', name: 'Process payment electronically', path: 'Finance > Accounts Payable > Payment Execution' },
  { id: 'FSP_006', name: 'Post job via ATS to multiple boards', path: 'Human Resources > Recruiting > Job Posting' },
  { id: 'FSP_007', name: 'Screen resumes with automation', path: 'Human Resources > Recruiting > Candidate Screening' },
];

// ============================================================================
// VIEW FUTURE MAPPING DIALOG
// ============================================================================

interface ViewFutureMappingDialogProps {
  open: boolean;
  onClose: () => void;
  process: CurrentStateProcess | null;
}

const ViewFutureMappingDialog: React.FC<ViewFutureMappingDialogProps> = ({ open, onClose, process }) => {
  const [mappedProcesses, setMappedProcesses] = useState<string[]>([]);
  const [showAddProcess, setShowAddProcess] = useState(false);
  const [viewMode, setViewMode] = useState<'suggested' | 'parent' | 'all'>('suggested');

  React.useEffect(() => {
    if (process) {
      // In real app, fetch the actual mappings
      // For demo, show FSP_001 as already mapped for certain processes
      if (process.mappedStatus === 'Mapped') {
        setMappedProcesses(['FSP_001']);
      } else {
        setMappedProcesses([]);
      }
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
    console.log('Save future mappings:', mappedProcesses);
    // In real app, update the mappings
    onClose();
  };

  const getParentCategory = (path: string) => {
    const parts = path.split(' > ');
    return parts.slice(0, -1).join(' > ');
  };

  const parentCategory = getParentCategory(process.spcPath);

  const suggestedProcesses = mockFutureProcessesForMapping.filter(
    fsp => fsp.path === process.spcPath && !mappedProcesses.includes(fsp.id)
  );

  const parentCategoryProcesses = parentCategory ? mockFutureProcessesForMapping.filter(
    fsp => fsp.path.startsWith(parentCategory) && fsp.path !== process.spcPath && !mappedProcesses.includes(fsp.id)
  ) : [];

  const allProcesses = mockFutureProcessesForMapping.filter(
    fsp => !mappedProcesses.includes(fsp.id)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareArrowsIcon />
          View Future Mapping
        </Box>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Current Process */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Current Process
          </Typography>
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50', border: 1, borderColor: 'divider' }}>
            <Typography variant="h6">{process.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {process.spcPath}
            </Typography>
          </Paper>

          {/* Future Mappings */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Replaced By Future Process(es)
          </Typography>
          {mappedProcesses.length === 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Not yet mapped to any future processes. Add mappings below.
            </Alert>
          ) : (
            <List sx={{ mb: 2 }}>
              {mappedProcesses.map((processId) => {
                const fsp = mockFutureProcessesForMapping.find(p => p.id === processId);
                if (!fsp) return null;
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
                    <ListItemText primary={fsp.name} secondary={fsp.path} />
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
              Add Future Process
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
                        {suggestedProcesses.map((fsp) => (
                          <ListItem
                            key={fsp.id}
                            button
                            onClick={() => handleAddProcess(fsp.id)}
                            sx={{
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: '8px',
                              mb: 1,
                              '&:hover': { bgcolor: 'grey.50' }
                            }}
                          >
                            <ListItemText primary={fsp.name} secondary={fsp.path} />
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
                    {parentCategoryProcesses.map((fsp) => (
                      <ListItem
                        key={fsp.id}
                        button
                        onClick={() => handleAddProcess(fsp.id)}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: '8px',
                          mb: 1,
                          '&:hover': { bgcolor: 'grey.50' }
                        }}
                      >
                        <ListItemText primary={fsp.name} secondary={fsp.path} />
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
                      <strong>All future processes</strong> - Choose any process to map
                    </Typography>
                  </Alert>
                  <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                    {allProcesses.map((fsp) => (
                      <ListItem
                        key={fsp.id}
                        button
                        onClick={() => handleAddProcess(fsp.id)}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: '8px',
                          mb: 1,
                          '&:hover': { bgcolor: 'grey.50' }
                        }}
                      >
                        <ListItemText primary={fsp.name} secondary={fsp.path} />
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

// Get unique categories from all current processes
const getExistingCategories = () => {
  const categoriesSet = new Set(mockCurrentProcesses.map(p => p.spcPath));
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
  const existingCategories = getExistingCategories();

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
  process: CurrentStateProcess | null;
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
          {process.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={process.status} size="small" color={process.status === 'Completed' ? 'success' : 'default'} />
          {process.mappedStatus && (
            <Chip label={process.mappedStatus} size="small" color={process.mappedStatus === 'Mapped' ? 'info' : 'default'} />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Overview" />
          <Tab label="Link Details" />
          <Tab label="History" />
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

            <Typography variant="subtitle2" color="text.secondary">Refinement Level</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {process.refinementLevel === 'Refined' ? (
                <CheckCircleIcon color="success" fontSize="small" />
              ) : (
                <RadioButtonUncheckedIcon color="warning" fontSize="small" />
              )}
              <Typography variant="body1">
                {process.refinementLevel === 'Refined' ? 'Refined Link' : 'Initial Link'}
              </Typography>
            </Box>
            {process.refinementLevel === 'Initial' && (
              <Paper sx={{ p: 2, bgcolor: 'warning.light', mb: 2 }}>
                <Typography variant="body2">
                  This process is linked at a high level. Consider refining to a more specific node in the industry starting point.
                </Typography>
                <Button size="small" startIcon={<LinkIcon />} sx={{ mt: 1 }}>
                  Refine Link
                </Button>
              </Paper>
            )}

            <Typography variant="subtitle2" color="text.secondary">Presentations</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {process.presentationCount} presentation{process.presentationCount !== 1 ? 's' : ''}
            </Typography>

            {process.mappedBy && (
              <>
                <Typography variant="subtitle2" color="text.secondary">Mapped By</Typography>
                <Typography variant="body1">{process.mappedBy}</Typography>
              </>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Link History</Typography>
            <Paper sx={{ p: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Current Link</Typography>
              <Typography variant="body1" fontWeight={600}>{process.spcName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {process.spcPath}
              </Typography>
            </Paper>
            {process.refinementLevel === 'Refined' && (
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">Previous Link</Typography>
                <Typography variant="body1">Accounts Payable (101)</Typography>
                <Typography variant="caption" color="text.secondary">
                  Finance &gt; Accounts Payable
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created: {new Date(process.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last Updated: {new Date(process.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
        <Button
          variant={process.mappedStatus === 'Mapped' ? 'outlined' : 'contained'}
          color={process.mappedStatus === 'Mapped' ? 'primary' : 'warning'}
          fullWidth
          sx={{ mb: 1 }}
          startIcon={process.mappedStatus === 'Mapped' ? <VisibilityIcon /> : <LinkIcon />}
          onClick={() => setShowMappingDialog(true)}
        >
          {process.mappedStatus === 'Mapped' ? 'View Future Mapping' : 'Link to Future Process'}
        </Button>
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

    {/* View Future Mapping Dialog */}
    <ViewFutureMappingDialog
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

interface CurrentStateProcessLibraryProps {
  onStartCapture?: (processName: string, spcPath: string) => void;
  onNavigateToMapping?: () => void;
}

export const CurrentStateProcessLibrary: React.FC<CurrentStateProcessLibraryProps> = ({ onStartCapture, onNavigateToMapping }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('SPC_101');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['SPC_100', 'SPC_101', 'SPC_200', 'SPC_201'])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<CurrentStateProcess | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const handleSelectPath = (path: 'capture' | 'direct') => {
    setEntryDialogOpen(false);
    // In real app, would navigate to capture wizard or direct entry form
    console.log('Selected path:', path);
  };

  const handleProcessClick = (process: CurrentStateProcess) => {
    setSelectedProcess(process);
    setDrawerOpen(true);
  };

  // Filter processes by selected node and search query
  const filteredProcesses = mockCurrentProcesses.filter((p) => {
    const matchesNode = !selectedNodeId || p.associatedSpcId === selectedNodeId || p.associatedSpcId.startsWith(selectedNodeId);
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNode && matchesSearch;
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
            <Typography variant="h5">Current State Process Library</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setEntryDialogOpen(true)}
            >
              Add Process
            </Button>
          </Box>
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
                    borderColor: process.refinementLevel === 'Initial' ? 'warning.main' : 'divider',
                  }}
                  onClick={() => handleProcessClick(process)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {process.name}
                      </Typography>
                      {process.refinementLevel === 'Initial' && (
                        <Chip label="Initial Link" size="small" color="warning" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {process.spcPath}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={process.status} size="small" color={process.status === 'Completed' ? 'success' : 'default'} />
                      {process.mappedStatus && (
                        <Chip label={process.mappedStatus} size="small" color={process.mappedStatus === 'Mapped' ? 'info' : 'default'} />
                      )}
                      <Chip label={`${process.presentationCount} presentations`} size="small" variant="outlined" />
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
        type="current"
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

export default CurrentStateProcessLibrary;
