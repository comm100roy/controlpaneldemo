import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ScienceIcon from '@mui/icons-material/Science'
import { Alert, Button, Stack } from '@mui/material'
import { getFunction, updateFunction } from '../../../../api/functions'
import Page from '../../../../components/common/Page'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import FunctionForm from '../../../../components/functions/FunctionForm'
import type { FunctionFormValues } from '../../../../data/dashboard'
import {
  appRoutes,
  getSiteIdFromPathname,
  resolveAiAgentId,
  resolveSiteId,
} from '../../../../data/routes'

function EditFunctionPage() {
  const { aiAgentId, functionId } = useParams<{ aiAgentId: string; functionId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [functionDefinition, setFunctionDefinition] = useState<FunctionFormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)
  const siteId = useMemo(
    () => resolveSiteId(getSiteIdFromPathname(location.pathname)),
    [location.pathname],
  )

  useEffect(() => {
    if (!functionId) {
      setFunctionDefinition(null)
      setLoading(false)
      setError('Function id is missing.')
      return
    }

    let cancelled = false

    const loadFunction = async () => {
      setLoading(true)
      setError(null)

      try {
        const nextDefinition = await getFunction(siteId, resolvedAiAgentId, functionId)

        if (!cancelled) {
          setFunctionDefinition(nextDefinition)
        }
      } catch (nextError) {
        if (!cancelled) {
          setFunctionDefinition(null)
          setError(nextError instanceof Error ? nextError.message : 'Failed to load function.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadFunction()

    return () => {
      cancelled = true
    }
  }, [functionId, resolvedAiAgentId, siteId])

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
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <Alert severity="info">Loading function...</Alert>
        ) : functionDefinition ? (
          <FunctionForm
            key={functionDefinition.id}
            initialValues={functionDefinition}
            submitting={submitting}
            onSubmit={async (values) => {
              setSubmitting(true)
              setError(null)

              try {
                await updateFunction(siteId, resolvedAiAgentId, values)
                navigate(appRoutes.ai.aiAgentFunctions(resolvedAiAgentId), {
                  state: { successMessage: 'Function saved successfully.' },
                })
              } catch (nextError) {
                setError(nextError instanceof Error ? nextError.message : 'Failed to update function.')
              } finally {
                setSubmitting(false)
              }
            }}
          />
        ) : (
          <Alert severity="warning">This function could not be found.</Alert>
        )}
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default EditFunctionPage
