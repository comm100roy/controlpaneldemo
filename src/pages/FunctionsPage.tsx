import { useState } from 'react'
import ScienceIcon from '@mui/icons-material/Science'
import { Box, Button, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Page from '../components/common/Page'
import TestChatDrawer from '../components/common/TestChatDrawer'
import InstructionTable from '../components/dashboard/InstructionTable'
import { functionRows } from '../data/dashboard'

function FunctionsPage() {
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const navigate = useNavigate()

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

        <Box sx={{ mt: -1 }}>
          <Button component={RouterLink} to="/ai-agent/functions/new" variant="contained">
            New Function
          </Button>
        </Box>

        <Box sx={{ mt: -1.5 }}>
          <InstructionTable
            rows={functionRows}
            nameHeader="Name"
            secondaryHeader="Used in Topics"
            onEdit={(row) => navigate(`/ai-agent/functions/${row.id}/edit`)}
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
                  Rows per page: 50&nbsp;&nbsp;&nbsp; 1-1 of 1
                </Typography>
              </Box>
            }
          />
        </Box>
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default FunctionsPage
