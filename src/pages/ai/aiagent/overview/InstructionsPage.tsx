import { useCallback, useEffect, useMemo, useState } from 'react'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import ScienceIcon from '@mui/icons-material/Science'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom'
import Page from '../../../../components/common/Page'
import SideDrawer from '../../../../components/common/SideDrawer'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import DataTable from '../../../../components/common/DataTable'
import {
  instructionTemplates,
  type InstructionTemplate,
} from '../../../../data/dashboard'
import { appRoutes, getSiteIdFromPathname, resolveAiAgentId, resolveSiteId } from '../../../../data/routes'
import type { InstructionRow } from '../../../../components/common/DataTable'
import {
  getInstructions,
  createInstruction,
  updateInstruction,
  deleteInstruction,
  type InstructionRecord,
} from '../../../../api/instructions'

type DrawerView = 'templates' | 'form' | null
const maxInstructions = 20

function InstructionsPage() {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()
  const location = useLocation()
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)
  const siteId = useMemo(
    () => resolveSiteId(getSiteIdFromPathname(location.pathname)),
    [location.pathname],
  )

  const [rows, setRows] = useState<InstructionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [drawerView, setDrawerView] = useState<DrawerView>(null)
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [draftInstruction, setDraftInstruction] = useState('')
  const [editingInstructionId, setEditingInstructionId] = useState<string | null>(null)
  const [instructionPendingDelete, setInstructionPendingDelete] =
    useState<InstructionRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isMenuOpen = Boolean(menuAnchor)
  const isDrawerOpen = drawerView !== null
  const isAtInstructionLimit = rows.length >= maxInstructions
  const isEditingInstruction = editingInstructionId !== null
  const isSaveDisabled =
    saving ||
    draftInstruction.trim().length === 0 ||
    draftInstruction.trim().length > 500 ||
    (!isEditingInstruction && isAtInstructionLimit)

  const toRow = (record: InstructionRecord): InstructionRow => ({
    id: record.id,
    content: record.content,
  })

  const fetchInstructions = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const records = await getInstructions(siteId, resolvedAiAgentId)
      setRows(records.map(toRow))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load instructions.')
    } finally {
      setLoading(false)
    }
  }, [siteId, resolvedAiAgentId])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const records = await getInstructions(siteId, resolvedAiAgentId)
        if (!cancelled) {
          setRows(records.map(toRow))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load instructions.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [siteId, resolvedAiAgentId, fetchInstructions])

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setMenuAnchor(null)
  }

  const handleOpenTemplateDrawer = () => {
    handleCloseMenu()
    setDrawerView('templates')
  }

  const handleOpenScratchDrawer = () => {
    handleCloseMenu()
    setEditingInstructionId(null)
    setDraftInstruction('')
    setDrawerView('form')
  }

  const handleSelectTemplate = (template: InstructionTemplate) => {
    setEditingInstructionId(null)
    setDraftInstruction(template.description)
    setDrawerView('form')
  }

  const handleEditInstruction = (row: InstructionRow) => {
    setEditingInstructionId(row.id)
    setDraftInstruction(row.content)
    setDrawerView('form')
  }

  const handleCloseDrawer = () => {
    setDrawerView(null)
    setEditingInstructionId(null)
  }

  const handleRequestDeleteInstruction = (row: InstructionRow) => {
    setInstructionPendingDelete(row)
  }

  const handleCloseDeleteDialog = () => {
    setInstructionPendingDelete(null)
  }

  const handleConfirmDeleteInstruction = async () => {
    if (!instructionPendingDelete) {
      return
    }

    try {
      setDeleting(true)
      setError(null)
      await deleteInstruction(siteId, resolvedAiAgentId, instructionPendingDelete.id)
      setRows((current) =>
        current.filter((row) => row.id !== instructionPendingDelete.id),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete instruction.')
    } finally {
      setDeleting(false)
      setInstructionPendingDelete(null)
    }
  }

  const handleSaveInstruction = async () => {
    if (isSaveDisabled) {
      return
    }

    const content = draftInstruction.trim()

    try {
      setSaving(true)
      setError(null)

      if (editingInstructionId) {
        const updated = await updateInstruction(siteId, resolvedAiAgentId, editingInstructionId, content)
        setRows((current) =>
          current.map((row) =>
            row.id === editingInstructionId ? toRow(updated) : row,
          ),
        )
      } else {
        const created = await createInstruction(siteId, resolvedAiAgentId, content)
        setRows((current) => [toRow(created), ...current])
      }

      handleCloseDrawer()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save instruction.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Page
        title="Instructions"
        description="Business-wide rules guiding your AI Agent on how to communicate with customers across all conversations."
        titleSuffix={
          <Button
            component={RouterLink}
            to={appRoutes.ai.aiAgentOverview(resolvedAiAgentId)}
            variant="text"
            startIcon={<ArrowBackOutlinedIcon />}
          >
            Back
          </Button>
        }
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<ScienceIcon />}
              onClick={() => setIsTestDrawerOpen(true)}
            >
              Test
            </Button>
          </Stack>
        }
      >
        <Stack spacing={1.5} sx={{ mt: -1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button
              variant="contained"
              onClick={handleOpenMenu}
              disabled={isAtInstructionLimit}
            >
              New Instruction
            </Button>
            <Typography variant="caption" color="text.secondary">
              {rows.length} of {maxInstructions} used
            </Typography>
          </Stack>

          {error ? (
            <Typography variant="body2" color="error.main">
              {error}
            </Typography>
          ) : null}

          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading instructions...
            </Typography>
          ) : (
            <DataTable
              rows={rows}
              onEdit={handleEditInstruction}
              onDelete={handleRequestDeleteInstruction}
            />
          )}
        </Stack>
      </Page>

      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              minWidth: 248,
              borderRadius: 1.5,
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.14)',
            },
          },
          list: {
            sx: {
              p: 0.5,
            },
          },
        }}
      >
        <MenuItem
          onClick={handleOpenTemplateDrawer}
          sx={{ px: 2, py: 1.5, fontSize: 16, fontWeight: 500, borderRadius: 1 }}
        >
          From Template
        </MenuItem>
        <MenuItem
          onClick={handleOpenScratchDrawer}
          sx={{
            px: 2,
            py: 1.5,
            fontSize: 16,
            fontWeight: 500,
            borderTop: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          From Scratch
        </MenuItem>
      </Menu>

      <SideDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          drawerView === 'templates'
            ? 'Choose a Template'
            : isEditingInstruction
              ? 'Edit Instruction'
              : 'New Instruction'
        }
      >
        {drawerView === 'templates' ? (
          <Grid container spacing={1.5}>
            {instructionTemplates.map((template) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    borderRadius: 1,
                    boxShadow: 'none',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(25, 118, 210, 0.03)',
                    },
                  }}
                >
                  <CardActionArea
                    sx={{ height: '100%', alignItems: 'stretch' }}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <Box sx={{ p: 1.75 }}>
                      <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
                        {template.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ lineHeight: 1.5 }}
                      >
                        {template.description}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={3}>
            <Alert
              icon={<LightbulbOutlinedIcon fontSize="inherit" />}
              severity="info"
              sx={{
                alignItems: 'flex-start',
                bgcolor: '#f4f6f8',
                color: 'text.secondary',
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              <Typography variant="body2" sx={{ mb: 1.25 }}>
                Use Instructions to define business-wide rules that apply across all conversations.
              </Typography>
              <Stack spacing={0.35}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CancelOutlinedIcon color="error" sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Not for:
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ pl: 3, lineHeight: 1.45 }}>
                  • Transfer rules. Configure in Topics.
                </Typography>
                <Typography variant="body2" sx={{ pl: 3, lineHeight: 1.45 }}>
                  • Topic-specific rules. Configure in Topics.
                </Typography>
                <Typography variant="body2" sx={{ pl: 3, lineHeight: 1.45 }}>
                  • Scenario-specific styles. Configure in Events or Topics.
                </Typography>
                <Typography variant="body2" sx={{ pl: 3, lineHeight: 1.45 }}>
                  • Built-in capabilities. No configuration needed.
                </Typography>
              </Stack>
            </Alert>

            <Box>
              <TextField
                fullWidth
                multiline
                minRows={5}
                label="Instruction"
                value={draftInstruction}
                onChange={(event) => setDraftInstruction(event.target.value)}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
                Up to 500 characters
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                disabled={isSaveDisabled}
                onClick={handleSaveInstruction}
              >
                {saving ? 'Saving...' : 'Validate & Save'}
              </Button>
              <Button variant="outlined" onClick={handleCloseDrawer} disabled={saving}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
      </SideDrawer>

      <Dialog
        open={Boolean(instructionPendingDelete)}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Instruction?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This action will permanently remove the selected instruction from the list.
          </Typography>
          {instructionPendingDelete ? (
            <Typography
              variant="body2"
              sx={{ mt: 1.5, color: 'text.primary', fontWeight: 500 }}
            >
              {instructionPendingDelete.content}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={handleCloseDeleteDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteInstruction}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default InstructionsPage
