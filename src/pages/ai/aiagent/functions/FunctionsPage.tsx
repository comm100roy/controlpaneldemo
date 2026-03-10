import { useEffect, useMemo, useState } from 'react'
import ScienceIcon from '@mui/icons-material/Science'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { deleteFunction, getFunctions } from '../../../../api/functions'
import Page from '../../../../components/common/Page'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import DataTable, { type InstructionRow } from '../../../../components/common/DataTable'
import type { FunctionFormValues } from '../../../../data/dashboard'
import {
  appRoutes,
  getSiteIdFromPathname,
  resolveAiAgentId,
  resolveSiteId,
} from '../../../../data/routes'

function FunctionsPage() {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()
  const location = useLocation()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [functions, setFunctions] = useState<FunctionFormValues[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [pendingDeleteFunction, setPendingDeleteFunction] = useState<InstructionRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)
  const siteId = useMemo(
    () => resolveSiteId(getSiteIdFromPathname(location.pathname)),
    [location.pathname],
  )
  const locationState = location.state as { successMessage?: string } | null

  useEffect(() => {
    let cancelled = false

    const loadFunctions = async () => {
      setLoading(true)
      setError(null)

      try {
        const nextFunctions = await getFunctions(siteId, resolvedAiAgentId)

        if (!cancelled) {
          setFunctions(nextFunctions)
        }
      } catch (nextError) {
        if (!cancelled) {
          setFunctions([])
          setError(nextError instanceof Error ? nextError.message : 'Failed to load functions.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadFunctions()

    return () => {
      cancelled = true
    }
  }, [resolvedAiAgentId, siteId])

  useEffect(() => {
    if (!locationState?.successMessage) {
      return
    }

    setSuccessMessage(locationState.successMessage)
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
  }, [location.pathname, location.search, locationState?.successMessage, navigate])

  const functionRows = useMemo(
    () =>
      functions.map((definition) => ({
        id: definition.id,
        content: definition.name,
        secondaryValue: definition.usedInTopics,
      })),
    [functions],
  )

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return
    }

    setPendingDeleteFunction(null)
  }

  const handleConfirmDelete = async () => {
    if (!pendingDeleteFunction) {
      return
    }

    try {
      setDeleting(true)
      setError(null)
      await deleteFunction(siteId, resolvedAiAgentId, pendingDeleteFunction.id)
      setFunctions((current) =>
        current.filter((definition) => definition.id !== pendingDeleteFunction.id),
      )
      setSuccessMessage('Function deleted successfully.')
      setPendingDeleteFunction(null)
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to delete function.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Page
        title="Functions"
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
        <Box>
          <Typography variant="body2" color="text.secondary">
            Functions that the AI Agent executes to complete specific tasks.{' '}
            <Link href="#" underline="hover" color="primary.main">
              How to Use AI Agent Functions?
            </Link>
          </Typography>
        </Box>

        <Stack spacing={1.5} sx={{ mt: -1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Box>
            <Button
              component={RouterLink}
              to={appRoutes.ai.aiAgentFunctionNew(resolvedAiAgentId)}
              variant="contained"
            >
              New Function
            </Button>
          </Box>

          <DataTable
            rows={functionRows}
            nameHeader="Name"
            secondaryHeader="Used in Topics"
            showDelete={!loading}
            onEdit={(row) =>
              navigate(appRoutes.ai.aiAgentFunctionEdit(row.id, resolvedAiAgentId))
            }
            onDelete={(row) => setPendingDeleteFunction(row)}
            emptyStateMessage={
              loading ? 'Loading functions...' : 'No functions are available for this AI agent.'
            }
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
                  Rows per page: 50&nbsp;&nbsp;&nbsp; {functionRows.length === 0 ? '0-0' : `1-${functionRows.length}`} of {functionRows.length}
                </Typography>
              </Box>
            }
          />
        </Stack>
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage(null)}
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={Boolean(pendingDeleteFunction)}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Function?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {pendingDeleteFunction ? (
              <>
                Are you sure you want to delete <strong>{pendingDeleteFunction.content}</strong>?
                This action cannot be undone.
              </>
            ) : null}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={handleCloseDeleteDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FunctionsPage
