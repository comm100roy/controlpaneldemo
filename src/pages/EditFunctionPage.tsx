import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import ScienceIcon from '@mui/icons-material/Science'
import { Button, Stack } from '@mui/material'
import Page from '../components/common/Page'
import TestChatDrawer from '../components/common/TestChatDrawer'
import FunctionForm from '../components/functions/FunctionForm'
import { functionDefinitions } from '../data/dashboard'
import { appRoutes, resolveAiAgentId } from '../data/routes'

function EditFunctionPage() {
  const { aiAgentId, functionId } = useParams<{ aiAgentId: string; functionId: string }>()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)

  const functionDefinition = functionDefinitions.find((item) => item.id === functionId)

  if (!functionDefinition) {
    return <Navigate to={appRoutes.ai.aiAgentFunctions(resolvedAiAgentId)} replace />
  }

  return (
    <>
      <Page
        title="Edit Function"
        description="Functions can be reused across topics and triggered when the AI Agent needs structured external actions."
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
        <FunctionForm key={functionDefinition.id} initialValues={functionDefinition} />
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default EditFunctionPage
