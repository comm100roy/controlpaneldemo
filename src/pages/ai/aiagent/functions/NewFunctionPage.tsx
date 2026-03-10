import { useState } from 'react'
import ScienceIcon from '@mui/icons-material/Science'
import { Button, Stack } from '@mui/material'
import Page from '../../../../components/common/Page'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import FunctionForm from '../../../../components/functions/FunctionForm'
import { emptyFunctionFormValues } from '../../../../data/dashboard'

function NewFunctionPage() {
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)

  return (
    <>
      <Page
        title="New Function"
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
        <FunctionForm initialValues={emptyFunctionFormValues} />
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default NewFunctionPage
