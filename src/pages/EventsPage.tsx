import ScienceIcon from '@mui/icons-material/Science'
import { Button, Stack } from '@mui/material'
import Page from '../components/common/Page'
import TestChatDrawer from '../components/common/TestChatDrawer'
import InstructionTable, {
  type InstructionRow,
} from '../components/dashboard/InstructionTable'
import { useState } from 'react'
import { overviewPanels } from '../data/dashboard'

function EventsPage() {
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const eventRows: InstructionRow[] = overviewPanels[2].items.map((item, index) => ({
    id: `event-${index}`,
    content: item.title,
  }))

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
