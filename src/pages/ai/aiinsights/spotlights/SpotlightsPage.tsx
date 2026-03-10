import { useEffect, useMemo, useState } from 'react'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
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
  Tooltip,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { deleteSpotlight, getSpotlights } from '../../../../api/spotlights'
import { AiInsightsInfoBanner } from '../../../../components/common/AiInsightsElements'
import DataTable, {
  type InstructionRow,
  type InstructionTableColumn,
} from '../../../../components/common/DataTable'
import Page from '../../../../components/common/Page'
import { type SpotlightCampaign, type SpotlightDefinition } from '../../../../data/aiInsights'
import { appRoutes, getSiteIdFromPathname, resolveSiteId } from '../../../../data/routes'

type SpotlightRow = InstructionRow & {
  description: string
  campaigns: SpotlightCampaign[]
  updatedBy: string
}

const spotlightColumns: InstructionTableColumn<SpotlightRow>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '20%',
    sortAccessor: (row) => row.content,
    render: (row) => <Typography variant="body2">{row.content}</Typography>,
  },
  {
    key: 'description',
    header: 'Description',
    width: '52%',
    sortAccessor: (row) => row.description,
    render: (row) => (
      <Typography variant="body2" sx={{ color: '#455a64' }}>
        {row.description}
      </Typography>
    ),
  },
  {
    key: 'channels',
    header: 'Channels',
    width: '12%',
    sortAccessor: (row) => row.campaigns.length,
    render: (row) => (
      <Tooltip
        placement="right"
        arrow
        enterDelay={150}
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: 'common.white',
              color: 'text.primary',
              borderRadius: 2.5,
              boxShadow: '0 10px 28px rgba(15, 23, 42, 0.22)',
              px: 2.5,
              py: 1.75,
              maxWidth: 320,
              '& .MuiTooltip-arrow': {
                color: 'common.white',
              },
            },
          },
        }}
        title={
          <Stack spacing={1.2}>
            {row.campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                component="button"
                type="button"
                underline="hover"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  color: 'primary.main',
                  justifyContent: 'flex-start',
                }}
              >
                {campaign.name}
                <OpenInNewOutlinedIcon sx={{ fontSize: 15 }} />
              </Link>
            ))}
          </Stack>
        }
      >
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ width: 'fit-content', cursor: 'default' }}
        >
          <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 16, color: '#1d9bf0' }} />
          <Typography variant="body2" sx={{ color: 'primary.main' }}>
            {row.campaigns.length}
          </Typography>
        </Stack>
      </Tooltip>
    ),
  },
  {
    key: 'updatedBy',
    header: 'Updated By',
    width: '16%',
    sortAccessor: (row) => row.updatedBy,
    render: (row) => <Typography variant="body2">{row.updatedBy}</Typography>,
  },
]

function SpotlightsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [spotlights, setSpotlights] = useState<SpotlightDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [pendingDeleteRow, setPendingDeleteRow] = useState<SpotlightRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const siteId = useMemo(
    () => resolveSiteId(getSiteIdFromPathname(location.pathname)),
    [location.pathname],
  )
  const locationState = location.state as { successMessage?: string } | null

  useEffect(() => {
    let cancelled = false

    const loadSpotlights = async () => {
      setLoading(true)
      setError(null)

      try {
        const nextSpotlights = await getSpotlights(siteId)

        if (!cancelled) {
          setSpotlights(nextSpotlights)
        }
      } catch (nextError) {
        if (!cancelled) {
          setSpotlights([])
          setError(nextError instanceof Error ? nextError.message : 'Failed to load spotlights.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadSpotlights()

    return () => {
      cancelled = true
    }
  }, [siteId])

  useEffect(() => {
    if (!locationState?.successMessage) {
      return
    }

    setSuccessMessage(locationState.successMessage)
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
  }, [location.pathname, location.search, locationState?.successMessage, navigate])

  const rows = useMemo<SpotlightRow[]>(
    () =>
      spotlights.map((spotlight) => ({
        id: spotlight.id,
        content: spotlight.name,
        description: spotlight.description,
        campaigns: spotlight.campaigns,
        updatedBy: spotlight.updatedBy,
      })),
    [spotlights],
  )

  const handleRequestDelete = (row: SpotlightRow) => {
    setPendingDeleteRow(row)
  }

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return
    }

    setPendingDeleteRow(null)
  }

  const handleConfirmDelete = async () => {
    if (!pendingDeleteRow) {
      return
    }

    try {
      setDeleting(true)
      setError(null)
      await deleteSpotlight(siteId, pendingDeleteRow.id)
      setSpotlights((currentRows) =>
        currentRows.filter((row) => row.id !== pendingDeleteRow.id),
      )
      setSuccessMessage('Spotlight deleted successfully.')
      setPendingDeleteRow(null)
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to delete spotlight.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Page
        title="Spotlights"
        belowDescription={
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 1100 }}>
            Tags for key behaviors and intents (e.g. Churn Risk, Sales Opportunity, and
            Recurring Support Issues) help prioritize important matters. Assign Spotlights to{' '}
            <Link
              component="span"
              underline="hover"
              sx={{ display: 'inline', verticalAlign: 'baseline', cursor: 'pointer' }}
            >
              Live Chat Campaigns
              <OpenInNewOutlinedIcon
                sx={{ display: 'inline', fontSize: 15, ml: 0.35, verticalAlign: 'text-bottom' }}
              />
            </Link>{' '}
          </Typography>
        }
      >
        <Stack spacing={2}>
          <AiInsightsInfoBanner>
            Spotlights feature consumes 1 AI Reply for each chat.
          </AiInsightsInfoBanner>

          <Stack spacing={1.5}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Box>
              <Button
                component={RouterLink}
                to={appRoutes.ai.aiInsightsSpotlightNew}
                variant="contained"
                sx={{ minWidth: 132 }}
              >
                New Spotlight
              </Button>
            </Box>

            <DataTable
              rows={rows}
              columns={spotlightColumns}
              showDelete={!loading}
              onEdit={(row) => navigate(appRoutes.ai.aiInsightsSpotlightEdit(row.id))}
              onDelete={handleRequestDelete}
              emptyStateMessage={
                loading ? 'Loading spotlights...' : 'No spotlights are available for this site.'
              }
              footer={
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Rows per page: 50&nbsp;&nbsp;&nbsp; {rows.length === 0 ? '0-0' : `1-${rows.length}`} of {rows.length}
                  </Typography>
                </Box>
              }
            />
          </Stack>
        </Stack>
      </Page>

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
      <Dialog open={Boolean(pendingDeleteRow)} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete spotlight?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {pendingDeleteRow ? (
              <>
                Are you sure you want to delete <strong>{pendingDeleteRow.content}</strong>?
                This action cannot be undone.
              </>
            ) : null}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={handleCloseDeleteDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={() => void handleConfirmDelete()} disabled={deleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SpotlightsPage
