import { useMemo, useState } from 'react'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import {
  alpha,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import AiAgentForm, { type AiAgentFormValues } from '../dashboard/AiAgentForm'
import InstructionTable, {
  type InstructionRow,
  type InstructionTableColumn,
} from '../dashboard/InstructionTable'
import SideDrawer from '../common/SideDrawer'
import {
  additionalPaidAiAgentsCount,
  paidAiAgentsLimit,
  type AiAgentRecord,
} from '../../data/aiAgents'

type AiAgentManagementDrawerProps = {
  open: boolean
  onClose: () => void
  agents: AiAgentRecord[]
  onCreateAgent: (agent: AiAgentRecord) => void
  onUpdateAgent: (agent: AiAgentRecord) => void
  onDeleteAgent: (agentId: string) => void
}

type AiAgentTableRow = InstructionRow & AiAgentRecord

type DrawerView = 'list' | 'new' | 'edit'

const createAgentId = (name: string, existingIds: string[]) => {
  const baseId =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'new-ai-agent'

  let nextId = baseId
  let counter = 2

  while (existingIds.includes(nextId)) {
    nextId = `${baseId}-${counter}`
    counter += 1
  }

  return nextId
}

function AiAgentManagementDrawer({
  open,
  onClose,
  agents,
  onCreateAgent,
  onUpdateAgent,
  onDeleteAgent,
}: AiAgentManagementDrawerProps) {
  const [view, setView] = useState<DrawerView>('list')
  const [formMode, setFormMode] = useState<'form' | 'avatar'>('form')
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null)
  const [operationsAnchor, setOperationsAnchor] = useState<null | HTMLElement>(null)
  const [operationsAgentId, setOperationsAgentId] = useState<string | null>(null)
  const [deleteConfirmationAgentId, setDeleteConfirmationAgentId] = useState<string | null>(
    null,
  )

  const paidCount = agents.filter((agent) => agent.paymentStatus === 'Paid').length
  const displayedPaidCount = paidCount + additionalPaidAiAgentsCount
  const editingAgent = agents.find((agent) => agent.id === editingAgentId) ?? null
  const operationAgent = agents.find((agent) => agent.id === operationsAgentId) ?? null
  const deleteConfirmationAgent =
    agents.find((agent) => agent.id === deleteConfirmationAgentId) ?? null

  const rows = useMemo<AiAgentTableRow[]>(
    () =>
      agents.map((agent) => ({
        ...agent,
        content: agent.name,
      })),
    [agents],
  )

  const handleOpenOperationsMenu = (
    event: React.MouseEvent<HTMLElement>,
    agentId: string,
  ) => {
    setOperationsAnchor(event.currentTarget)
    setOperationsAgentId(agentId)
  }

  const handleCloseOperationsMenu = () => {
    setOperationsAnchor(null)
    setOperationsAgentId(null)
  }

  const handleShowNewForm = () => {
    handleCloseOperationsMenu()
    setEditingAgentId(null)
    setFormMode('form')
    setView('new')
  }

  const handleShowEditForm = (agentId: string) => {
    handleCloseOperationsMenu()
    setEditingAgentId(agentId)
    setFormMode('form')
    setView('edit')
  }

  const handleOpenDeleteConfirmation = () => {
    if (operationAgent && agents.length > 1) {
      setDeleteConfirmationAgentId(operationAgent.id)
    }
    handleCloseOperationsMenu()
  }

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationAgentId(null)
  }

  const handleConfirmDeleteAgent = () => {
    if (deleteConfirmationAgent && agents.length > 1) {
      onDeleteAgent(deleteConfirmationAgent.id)
    }
    handleCloseDeleteConfirmation()
  }

  const handleCancelForm = () => {
    setEditingAgentId(null)
    setFormMode('form')
    setView('list')
  }

  const handleSubmitForm = (values: AiAgentFormValues) => {
    const nextAgent: AiAgentRecord = {
      id:
        view === 'edit' && editingAgent
          ? editingAgent.id
          : createAgentId(
              values.name,
              agents.map((agent) => agent.id),
            ),
      name: values.name,
      subtitle: values.description || 'AI Agent configuration draft',
      type: view === 'edit' && editingAgent ? editingAgent.type : 'AI Agent',
      language: values.language,
      channelLabel: values.channel,
      channelCount: values.channel === 'Messaging' ? 0 : 1,
      channelKinds:
        view === 'edit' && editingAgent ? editingAgent.channelKinds : ['chat'],
      paymentStatus: values.paymentStatus,
    }

    if (view === 'edit') {
      onUpdateAgent(nextAgent)
    } else {
      onCreateAgent(nextAgent)
    }

    handleCancelForm()
  }

  const columns: InstructionTableColumn<AiAgentTableRow>[] = [
      {
        key: 'name',
        header: 'Name',
        width: '28%',
        sortAccessor: (row) => row.name,
        render: (row) => (
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: alpha('#0d47a1', 0.12),
                color: '#0d47a1',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {row.name.slice(0, 1).toUpperCase()}
            </Avatar>
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={() => handleShowEditForm(row.id)}
              sx={{
                p: 0,
                border: 0,
                background: 'transparent',
                fontSize: 14,
                fontWeight: 500,
                color: 'primary.main',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {row.name}
            </Link>
          </Stack>
        ),
      },
      {
        key: 'type',
        header: 'Type',
        width: '16%',
        sortAccessor: (row) => row.type,
        render: (row) => (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                width: 20,
                height: 20,
                bgcolor: alpha('#1976d2', 0.12),
                color: 'primary.main',
              }}
            >
              <SmartToyOutlinedIcon sx={{ fontSize: 14 }} />
            </Avatar>
            <Typography variant="body2">{row.type}</Typography>
          </Stack>
        ),
      },
      {
        key: 'language',
        header: 'Language',
        width: '18%',
        sortAccessor: (row) => row.language,
        render: (row) => <Typography variant="body2">{row.language}</Typography>,
      },
      {
        key: 'channel',
        header: 'Channel',
        width: '14%',
        align: 'center',
        sortAccessor: (row) => row.channelCount,
        render: (row) => (
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 18, color: '#1d9bf0' }} />
            <Typography variant="body2">{row.channelCount}</Typography>
          </Stack>
        ),
      },
      {
        key: 'paymentStatus',
        header: 'Payment Status',
        width: '18%',
        sortAccessor: (row) => row.paymentStatus,
        render: (row) => (
          <Typography variant="body2" sx={{ color: '#2e9b32', fontWeight: 500 }}>
            {row.paymentStatus}
          </Typography>
        ),
      },
      {
        key: 'operations',
        header: 'Operations',
        width: 100,
        align: 'right',
        render: (row) => (
          <IconButton
            size="small"
            color="inherit"
            onClick={(event) => handleOpenOperationsMenu(event, row.id)}
          >
            <MoreVertOutlinedIcon fontSize="small" />
          </IconButton>
        ),
      },
    ]

  return (
    <>
      <SideDrawer
        open={open}
        onClose={onClose}
        title={
          view === 'list' ? (
            'AI Agent'
          ) : formMode === 'avatar' ? (
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Change Avatar
              </Typography>
              <HelpOutlineRoundedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
            </Stack>
          ) : view === 'new' ? (
            'New AI Agent'
          ) : (
            'Edit AI Agent'
          )
        }
        width={{ xs: '100%', lg: 1000 }}
      >
        {view === 'list' ? (
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 840 }}>
              AI Agent is an autonomous, intelligent assistant that can streamline your
              customer service experience. It operates 24/7, responds to inquiries in
              real-time, and provides accurate, friendly guidance.
              <Box
                component="span"
                sx={{ ml: 0.5, color: 'primary.main', display: 'inline-flex', alignItems: 'center' }}
              >
                How does an AI Agent work?
                <OpenInNewOutlinedIcon sx={{ fontSize: 15, ml: 0.25 }} />
              </Box>
            </Typography>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Button variant="contained" onClick={handleShowNewForm}>
                New AI Agent
              </Button>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#607d8b',
                  whiteSpace: 'nowrap',
                }}
              >
                Paid AI Agents:{' '}
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {displayedPaidCount} / {paidAiAgentsLimit}
                </Box>
              </Typography>
            </Stack>

            <InstructionTable
              rows={rows}
              columns={columns}
              showOperations={false}
              footer={
                <Box
                  sx={{
                    px: 2,
                    py: 1.25,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Rows per page: 50&nbsp;&nbsp;&nbsp; 1-{rows.length} of {rows.length}
                  </Typography>
                </Box>
              }
            />
          </Stack>
        ) : (
          <AiAgentForm
            key={`${view}-${editingAgent?.id ?? 'new'}`}
            initialName={editingAgent?.name ?? ''}
            initialLanguage={editingAgent?.language && editingAgent.language !== '-' ? editingAgent.language : 'English'}
            initialChannel={editingAgent?.channelLabel ?? 'Live Chat'}
            initialDescription={editingAgent?.subtitle ?? ''}
            initialPaymentStatus={editingAgent?.paymentStatus ?? 'Paid'}
            paidAgentCount={displayedPaidCount}
            paidAgentLimit={paidAiAgentsLimit}
            submitLabel={view === 'new' ? 'Create' : 'Save'}
            cancelLabel="Back"
            onModeChange={setFormMode}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
          />
        )}
      </SideDrawer>

      <Menu
        anchorEl={operationsAnchor}
        open={Boolean(operationsAnchor)}
        onClose={handleCloseOperationsMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            if (operationAgent) {
              handleShowEditForm(operationAgent.id)
            }
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleCloseOperationsMenu}>AI Agent Import</MenuItem>
        <MenuItem onClick={handleCloseOperationsMenu}>AI Agent Export</MenuItem>
        <MenuItem
          onClick={handleOpenDeleteConfirmation}
          disabled={agents.length <= 1}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>
      <Dialog
        open={Boolean(deleteConfirmationAgent)}
        onClose={handleCloseDeleteConfirmation}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete AI Agent?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {deleteConfirmationAgent ? (
              <>
                Are you sure you want to delete <strong>{deleteConfirmationAgent.name}</strong>?
                This action cannot be undone.
              </>
            ) : null}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={handleCloseDeleteConfirmation}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleConfirmDeleteAgent}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AiAgentManagementDrawer
