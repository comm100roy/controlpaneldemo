import { useState } from 'react'
import ScienceIcon from '@mui/icons-material/Science'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Stack } from '@mui/material'
import Page from '../components/common/Page'
import TestChatDrawer from '../components/common/TestChatDrawer'
import InstructionTable from '../components/dashboard/InstructionTable'
import { eventRows } from '../data/dashboard'
import { appRoutes, resolveAiAgentId } from '../data/routes'

function EventsPage() {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()
  const navigate = useNavigate()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)

  return (
    <>
      <Page
        title="Events"
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
        <InstructionTable
          rows={eventRows}
          nameHeader="Name"
          onEdit={(row) =>
            navigate(appRoutes.ai.aiAgentEventEdit(row.id, resolvedAiAgentId))
          }
          showDelete={false}
        />
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default EventsPage
