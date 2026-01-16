import React, { useState } from 'react';
import {
  Modal,
  Fade,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PushPinIcon from '@mui/icons-material/PushPin';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

interface SpcNode {
  id: string;
  code: string;
  visibleCode: string;
  name: string;
  parentId: string | null;
  path: string;
  children?: SpcNode[];
}

interface SpcTreeBrowserProps {
  open: boolean;
  onClose: () => void;
  onSelect: (spcId: string, spcName: string, spcPath: string) => void;
  primarySpcPath: string;
  currentSelection: string;
}

const mockSpcTree: SpcNode[] = [
  {
    id: 'SPC_100',
    code: '100',
    visibleCode: '100',
    name: 'Finance',
    parentId: null,
    path: 'Finance',
    children: [
      {
        id: 'SPC_101',
        code: '100.001',
        visibleCode: '101',
        name: 'Accounts Payable',
        parentId: 'SPC_100',
        path: 'Finance > Accounts Payable',
        children: [
          {
            id: 'SPC_101_001',
            code: '100.001.001',
            visibleCode: '101.001',
            name: 'Vendor Setup',
            parentId: 'SPC_101',
            path: 'Finance > Accounts Payable > Vendor Setup',
          },
          {
            id: 'SPC_101_002',
            code: '100.001.002',
            visibleCode: '101.002',
            name: 'Invoice Processing',
            parentId: 'SPC_101',
            path: 'Finance > Accounts Payable > Invoice Processing',
          },
          {
            id: 'SPC_101_003',
            code: '100.001.003',
            visibleCode: '101.003',
            name: 'Payment Execution',
            parentId: 'SPC_101',
            path: 'Finance > Accounts Payable > Payment Execution',
          },
        ],
      },
      {
        id: 'SPC_102',
        code: '100.002',
        visibleCode: '102',
        name: 'Accounts Receivable',
        parentId: 'SPC_100',
        path: 'Finance > Accounts Receivable',
      },
      {
        id: 'SPC_103',
        code: '100.003',
        visibleCode: '103',
        name: 'General Ledger',
        parentId: 'SPC_100',
        path: 'Finance > General Ledger',
      },
    ],
  },
  {
    id: 'SPC_200',
    code: '200',
    visibleCode: '200',
    name: 'Human Resources',
    parentId: null,
    path: 'Human Resources',
    children: [
      {
        id: 'SPC_201',
        code: '200.001',
        visibleCode: '201',
        name: 'Recruiting',
        parentId: 'SPC_200',
        path: 'Human Resources > Recruiting',
      },
      {
        id: 'SPC_202',
        code: '200.002',
        visibleCode: '202',
        name: 'Onboarding',
        parentId: 'SPC_200',
        path: 'Human Resources > Onboarding',
      },
    ],
  },
  {
    id: 'SPC_300',
    code: '300',
    visibleCode: '300',
    name: 'Operations',
    parentId: null,
    path: 'Operations',
    children: [
      {
        id: 'SPC_305',
        code: '300.005',
        visibleCode: '305',
        name: 'Compliance & Risk Management',
        parentId: 'SPC_300',
        path: 'Operations > Compliance & Risk Management',
        children: [
          {
            id: 'SPC_305_002',
            code: '300.005.002',
            visibleCode: '305.002',
            name: 'Vendor Due Diligence',
            parentId: 'SPC_305',
            path: 'Operations > Compliance & Risk Management > Vendor Due Diligence',
          },
          {
            id: 'SPC_305_003',
            code: '300.005.003',
            visibleCode: '305.003',
            name: 'Audit Preparation',
            parentId: 'SPC_305',
            path: 'Operations > Compliance & Risk Management > Audit Preparation',
          },
        ],
      },
      {
        id: 'SPC_306',
        code: '300.006',
        visibleCode: '306',
        name: 'Legal & Contracts',
        parentId: 'SPC_300',
        path: 'Operations > Legal & Contracts',
        children: [
          {
            id: 'SPC_306_001',
            code: '300.006.001',
            visibleCode: '306.001',
            name: 'Contract Management',
            parentId: 'SPC_306',
            path: 'Operations > Legal & Contracts > Contract Management',
          },
        ],
      },
    ],
  },
  {
    id: 'SPC_400',
    code: '400',
    visibleCode: '400',
    name: 'IT & Technology',
    parentId: null,
    path: 'IT & Technology',
  },
  {
    id: 'SPC_500',
    code: '500',
    visibleCode: '500',
    name: 'Sales & Marketing',
    parentId: null,
    path: 'Sales & Marketing',
  },
];

const SpcTreeBrowser: React.FC<SpcTreeBrowserProps> = ({
  open,
  onClose,
  onSelect,
  primarySpcPath,
  currentSelection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['SPC_100', 'SPC_101', 'SPC_300', 'SPC_305']));
  const [selectedId, setSelectedId] = useState(currentSelection);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleSelect = (node: SpcNode) => {
    setSelectedId(node.id);
  };

  const handleConfirm = () => {
    const findNode = (nodes: SpcNode[]): SpcNode | null => {
      for (const node of nodes) {
        if (node.id === selectedId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const selected = findNode(mockSpcTree);
    if (selected) {
      onSelect(selected.id, selected.name, selected.path);
    }
  };

  const renderTree = (nodes: SpcNode[], level: number = 0) => {
    return nodes
      .filter(node =>
        !searchQuery ||
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.path.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((node) => (
        <React.Fragment key={node.id}>
          <ListItemButton
            sx={{ pl: 2 + level * 3 }}
            onClick={() => {
              if (node.children && node.children.length > 0) {
                toggleNode(node.id);
              }
              handleSelect(node);
            }}
            selected={selectedId === node.id}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
              {node.children && node.children.length > 0 ? (
                expandedNodes.has(node.id) ? (
                  <ExpandMoreIcon fontSize="small" />
                ) : (
                  <ChevronRightIcon fontSize="small" />
                )
              ) : (
                <Box sx={{ width: 20 }} />
              )}

              {node.children && node.children.length > 0 ? (
                <FolderIcon fontSize="small" color="action" />
              ) : (
                <DescriptionIcon fontSize="small" color="action" />
              )}

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {node.name} ({node.visibleCode})
                    </Typography>
                    {selectedId === node.id && (
                      <RadioButtonCheckedIcon fontSize="small" color="primary" />
                    )}
                  </Box>
                }
              />
            </Box>
          </ListItemButton>

          {node.children && node.children.length > 0 && (
            <Collapse in={expandedNodes.has(node.id)} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderTree(node.children, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ));
  };

  const selectedNode = (() => {
    const findNode = (nodes: SpcNode[]): SpcNode | null => {
      for (const node of nodes) {
        if (node.id === selectedId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findNode(mockSpcTree);
  })();

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
            minWidth: 700,
            maxWidth: 800,
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Modal Header */}
          <Box sx={{ p: '30px 40px' }}>
            <Typography sx={{ fontSize: 28, fontWeight: 400 }}>
              Select Process Category
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Choose which business area this belongs to
            </Typography>
          </Box>

          <Divider />

          {/* Modal Content */}
          <Box sx={{ p: '10px 40px', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, overflow: 'hidden' }}>
            {/* Primary Reference */}
            <Alert severity="info" icon={<PushPinIcon />}>
              <Typography variant="subtitle2" gutterBottom>
                Primary Process Category (for reference):
              </Typography>
              <Typography variant="body2">
                {primarySpcPath}
              </Typography>
            </Alert>

            {/* Search */}
            <TextField
              size="small"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '50px',
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                }
              }}
            />

          {/* Tree */}
          <Paper variant="outlined" sx={{ flex: 1, overflow: 'auto' }}>
            <List dense>
              {renderTree(mockSpcTree)}
            </List>
          </Paper>

          {/* Selected */}
          {selectedNode && (
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {selectedNode.path}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({selectedNode.name})
              </Typography>

              {selectedNode.path !== primarySpcPath && (
                <Alert severity="info" sx={{ mt: 1 }} icon={<LightbulbIcon />}>
                  This step will be categorized under {selectedNode.name}, even though the overall process is categorized under a different category.
                </Alert>
              )}
            </Paper>
          )}
          </Box>

          <Divider />

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
              onClick={handleConfirm}
              disabled={!selectedId}
              sx={{
                borderRadius: '50px',
                minHeight: 46,
                fontWeight: 700,
                fontSize: 14,
                minWidth: 160,
              }}
            >
              Use This Category
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SpcTreeBrowser;
