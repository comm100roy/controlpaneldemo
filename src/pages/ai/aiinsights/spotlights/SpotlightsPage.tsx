import { useState } from 'react'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { AiInsightsInfoBanner } from '../../../../components/common/AiInsightsElements'
import DataTable, {
  type InstructionRow,
  type InstructionTableColumn,
} from '../../../../components/common/DataTable'
import Page from '../../../../components/common/Page'
import { spotlightDefinitions, type SpotlightCampaign } from '../../../../data/aiInsights'
import { appRoutes } from '../../../../data/routes'

type SpotlightRow = InstructionRow & {
  description: string
  campaigns: SpotlightCampaign[]
  updatedBy: string
}

const initialSpotlightRows: SpotlightRow[] = spotlightDefinitions.map((spotlight) => ({
  id: spotlight.id,
  content: spotlight.name,
  description: spotlight.description,
  campaigns: spotlight.campaigns,
  updatedBy: spotlight.updatedBy,
}))

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
  const [rows, setRows] = useState<SpotlightRow[]>(initialSpotlightRows)
  const [pendingDeleteRow, setPendingDeleteRow] = useState<SpotlightRow | null>(null)

  const handleRequestDelete = (row: SpotlightRow) => {
    setPendingDeleteRow(row)
  }

  const handleCloseDeleteDialog = () => {
    setPendingDeleteRow(null)
  }

  const handleConfirmDelete = () => {
    if (pendingDeleteRow) {
      setRows((currentRows) => currentRows.filter((row) => row.id !== pendingDeleteRow.id))
    }
    setPendingDeleteRow(null)
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
              onEdit={(row) => navigate(appRoutes.ai.aiInsightsSpotlightEdit(row.id))}
              onDelete={handleRequestDelete}
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
                    Rows per page: 50&nbsp;&nbsp;&nbsp; 1-{rows.length} of {rows.length}
                  </Typography>
                </Box>
              }
            />
          </Stack>
        </Stack>
      </Page>

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
          <Button variant="outlined" onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SpotlightsPage
