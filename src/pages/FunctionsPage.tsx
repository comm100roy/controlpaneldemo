import { useState } from 'react'
import ScienceIcon from '@mui/icons-material/Science'
import { Box, Button, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import Page from '../components/common/Page'
import TestChatDrawer from '../components/common/TestChatDrawer'
import DataTable from '../components/dashboard/DataTable'
import { functionRows } from '../data/dashboard'
import { appRoutes, resolveAiAgentId } from '../data/routes'

function FunctionsPage() {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)

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
          <Button
            component={RouterLink}
            to={appRoutes.ai.aiAgentFunctionNew(resolvedAiAgentId)}
            variant="contained"
          >
            New Function
          </Button>
        </Box>

        <Box sx={{ mt: -1.5 }}>
          <DataTable
            rows={functionRows}
            nameHeader="Name"
            secondaryHeader="Used in Topics"
            onEdit={(row) =>
              navigate(appRoutes.ai.aiAgentFunctionEdit(row.id, resolvedAiAgentId))
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
