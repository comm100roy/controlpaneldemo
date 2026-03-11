import { useEffect, useMemo, useState } from 'react'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined'
import ScienceIcon from '@mui/icons-material/Science'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { deleteFunction, getFunctions } from '../../../../api/functions'
import Page from '../../../../components/common/Page'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import AddFunctionsViaMcpDrawer from '../../../../components/functions/AddFunctionsViaMcpDrawer'
import ManageConnectedMcpServerDrawer from '../../../../components/functions/ManageConnectedMcpServerDrawer'
import {
  connectedMcpServers,
  type FunctionFormValues,
  type FunctionSourceType,
} from '../../../../data/dashboard'
import {
  appRoutes,
  getSiteIdFromPathname,
  resolveAiAgentId,
  resolveSiteId,
} from '../../../../data/routes'

const functionTypeMeta: Record<
  FunctionSourceType,
  { label: string; icon: typeof DataObjectOutlinedIcon }
> = {
  api: {
    label: 'API',
    icon: DataObjectOutlinedIcon,
  },
  mcp: {
    label: 'MCP',
    icon: ExtensionOutlinedIcon,
  },
  llm: {
    label: 'LLM',
    icon: AutoAwesomeOutlinedIcon,
  },
}

function FunctionsPage() {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()
  const location = useLocation()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [isAddMcpDrawerOpen, setIsAddMcpDrawerOpen] = useState(false)
  const [isManageMcpDrawerOpen, setIsManageMcpDrawerOpen] = useState(false)
  const [manageMcpDrawerSession, setManageMcpDrawerSession] = useState(0)
  const [selectedManagedMcpServerId, setSelectedManagedMcpServerId] = useState<string | null>(
    null,
  )
  const [searchValue, setSearchValue] = useState('')
  const [functions, setFunctions] = useState<FunctionFormValues[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [pendingDeleteFunction, setPendingDeleteFunction] = useState<FunctionFormValues | null>(
    null,
  )
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

  const filteredFunctions = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    if (!query) {
      return functions
    }

    return functions.filter((definition) =>
      [
        definition.name,
        definition.description,
        definition.sourceType,
        definition.mcpServerName ?? '',
      ].some((value) => value.toLowerCase().includes(query)),
    )
  }, [functions, searchValue])

  const handleOpenAddMcpDrawer = () => {
    setIsAddMcpDrawerOpen(true)
  }

  const handleOpenManageMcpDrawer = (serverName?: string) => {
    if (!serverName) {
      setSelectedManagedMcpServerId(null)
      setManageMcpDrawerSession((current) => current + 1)
      setIsManageMcpDrawerOpen(true)
      return
    }

    const normalizedServerName = serverName.trim().toLowerCase()
    const matchingServer =
      connectedMcpServers.find((server) => server.name.toLowerCase() === normalizedServerName) ??
      null

    setSelectedManagedMcpServerId(matchingServer?.id ?? null)
    setManageMcpDrawerSession((current) => current + 1)
    setIsManageMcpDrawerOpen(true)
  }

  const handleCloseManageMcpDrawer = () => {
    setIsManageMcpDrawerOpen(false)
    setSelectedManagedMcpServerId(null)
  }

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

  const resultRangeText =
    filteredFunctions.length === 0 ? '0-0' : `1-${Math.min(filteredFunctions.length, 10)}`

  return (
    <>
      <Page
        title="Functions & MCP"
        belowDescription={
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 980 }}>
            Functions are reusable building blocks that enable AI Agents to perform
            specific tasks, connect to external systems, or execute LLM-powered logic.
            You can create custom functions or connect to Model Context Protocol (MCP)
            servers to import standardized tools as functions. Functions are invoked by
            describing how they should be used through natural language in topic
            instructions.{' '}
            <Link
              component="button"
              type="button"
              underline="hover"
              color="primary.main"
              onClick={handleOpenAddMcpDrawer}
            >
              How to Use Functions?
            </Link>
          </Typography>
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
        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', lg: 'center' }}
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={1.5}
              useFlexGap
              flexWrap="wrap"
              alignItems="center"
              sx={{ flex: 1, minWidth: 0 }}
            >
              <Button
                component={RouterLink}
                to={appRoutes.ai.aiAgentFunctionNew(resolvedAiAgentId)}
                variant="contained"
              >
                New Function
              </Button>
              <Button variant="outlined" onClick={handleOpenAddMcpDrawer}>
                Add Functions via MCP
              </Button>
              {connectedMcpServers.length > 0 ? (
                <Button
                  variant="text"
                  startIcon={<ExtensionOutlinedIcon />}
                  onClick={() => handleOpenManageMcpDrawer()}
                  sx={{
                    px: 0.5,
                    minWidth: 0,
                    color: 'primary.main',
                  }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="body2" color="inherit">
                      Connected MCP Servers:
                    </Typography>
                    <Typography variant="body2" color="inherit" fontWeight={700}>
                      {connectedMcpServers.length}
                    </Typography>
                  </Stack>
                </Button>
              ) : null}
            </Stack>

            <TextField
              size="small"
              placeholder="Search Functions"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              sx={{
                width: { xs: '100%', sm: 320 },
                ml: { lg: 'auto' },
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#fff',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Card sx={{ borderRadius: 1 }}>
            <TableContainer>
              <Table>
                <colgroup>
                  <col style={{ width: '28%' }} />
                  <col style={{ width: '40%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: alpha('#16324f', 0.03),
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Used in Topics</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Operations
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFunctions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ py: 8 }}>
                        <Stack spacing={1} alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            {loading
                              ? 'Loading functions...'
                              : searchValue.trim()
                                ? 'No functions match your search.'
                                : 'No functions are available for this AI agent.'}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFunctions.map((definition) => {
                      const typeMeta = functionTypeMeta[definition.sourceType]
                      const TypeIcon = typeMeta.icon
                      const isMcpFunction = definition.sourceType === 'mcp'

                      return (
                        <TableRow key={definition.id} hover>
                          <TableCell>
                            <Link
                              component={RouterLink}
                              to={appRoutes.ai.aiAgentFunctionEdit(
                                definition.id,
                                resolvedAiAgentId,
                              )}
                              underline="hover"
                              color="primary.main"
                              sx={{ fontSize: 14 }}
                            >
                              {definition.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.primary"
                              noWrap
                              title={definition.description}
                              sx={{ display: 'block', maxWidth: 560 }}
                            >
                              {definition.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                              <TypeIcon
                                sx={{
                                  fontSize: 18,
                                  color:
                                    definition.sourceType === 'llm'
                                      ? '#8e5cf7'
                                      : definition.sourceType === 'mcp'
                                        ? 'primary.main'
                                        : 'text.secondary',
                                }}
                              />
                              <Typography variant="body2" color="text.primary">
                                {typeMeta.label}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.primary">
                              {definition.usedInTopics}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              {isMcpFunction ? (
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    handleOpenManageMcpDrawer(definition.mcpServerName)
                                  }
                                  aria-label={`Open MCP settings for ${definition.name}`}
                                >
                                  <SettingsOutlinedIcon fontSize="small" />
                                </IconButton>
                              ) : (
                                <>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      navigate(
                                        appRoutes.ai.aiAgentFunctionEdit(
                                          definition.id,
                                          resolvedAiAgentId,
                                        ),
                                      )
                                    }
                                    aria-label={`Edit ${definition.name}`}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="default"
                                    onClick={() => setPendingDeleteFunction(definition)}
                                    aria-label={`Delete ${definition.name}`}
                                  >
                                    <DeleteOutlineOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: 'flex',
                justifyContent: 'flex-end',
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Rows per page: 10&nbsp;&nbsp;&nbsp; {resultRangeText} of {filteredFunctions.length}
              </Typography>
            </Box>
          </Card>
        </Stack>
      </Page>

      <TestChatDrawer open={isTestDrawerOpen} onClose={() => setIsTestDrawerOpen(false)} />

      <AddFunctionsViaMcpDrawer
        open={isAddMcpDrawerOpen}
        onClose={() => setIsAddMcpDrawerOpen(false)}
        onSuccess={setSuccessMessage}
      />

      <ManageConnectedMcpServerDrawer
        key={`${selectedManagedMcpServerId ?? 'overview'}-${manageMcpDrawerSession}`}
        open={isManageMcpDrawerOpen}
        servers={connectedMcpServers}
        initialServerId={selectedManagedMcpServerId}
        onClose={handleCloseManageMcpDrawer}
        onSuccess={setSuccessMessage}
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
                Are you sure you want to delete{' '}
                <strong>{pendingDeleteFunction.name}</strong>? This action cannot be
                undone.
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
