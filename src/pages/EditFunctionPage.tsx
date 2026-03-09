import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import ScienceIcon from '@mui/icons-material/Science'
import { Button, Stack } from '@mui/material'
import Page from '../components/common/Page'
import TestChatDrawer from '../components/common/TestChatDrawer'
import FunctionForm from '../components/functions/FunctionForm'
import { functionDefinitions } from '../data/dashboard'

function EditFunctionPage() {
  const { functionId } = useParams<{ functionId: string }>()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)

  const functionDefinition = functionDefinitions.find((item) => item.id === functionId)

  if (!functionDefinition) {
    return <Navigate to="/ai-agent/functions" replace />
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
