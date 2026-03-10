import { useMemo, useState } from 'react'
import ScienceIcon from '@mui/icons-material/Science'
import { Alert, Button, Stack } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createFunction } from '../../../../api/functions'
import Page from '../../../../components/common/Page'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import FunctionForm from '../../../../components/functions/FunctionForm'
import { emptyFunctionFormValues } from '../../../../data/dashboard'
import {
  appRoutes,
  getSiteIdFromPathname,
  resolveAiAgentId,
  resolveSiteId,
} from '../../../../data/routes'

function NewFunctionPage() {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)
  const siteId = useMemo(
    () => resolveSiteId(getSiteIdFromPathname(location.pathname)),
    [location.pathname],
  )

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
        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <FunctionForm
            initialValues={emptyFunctionFormValues}
            submitting={submitting}
            onSubmit={async (values) => {
              setSubmitting(true)
              setError(null)

              try {
                await createFunction(siteId, resolvedAiAgentId, values)
                navigate(appRoutes.ai.aiAgentFunctions(resolvedAiAgentId), {
                  state: { successMessage: 'Function saved successfully.' },
                })
              } catch (nextError) {
                setError(nextError instanceof Error ? nextError.message : 'Failed to create function.')
              } finally {
                setSubmitting(false)
              }
            }}
          />
        </Stack>
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default NewFunctionPage
