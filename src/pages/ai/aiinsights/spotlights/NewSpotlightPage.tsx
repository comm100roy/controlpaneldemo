import { useMemo, useState } from 'react'
import { Alert, Stack } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { createSpotlight } from '../../../../api/spotlights'
import Page from '../../../../components/common/Page'
import SpotlightForm from '../../../../components/insights/SpotlightForm'
import { emptySpotlightFormValues } from '../../../../data/aiInsights'
import { appRoutes, getSiteIdFromPathname, resolveSiteId } from '../../../../data/routes'

function NewSpotlightPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const siteId = useMemo(
    () => resolveSiteId(getSiteIdFromPathname(location.pathname)),
    [location.pathname],
  )

  return (
    <Page title="New Spotlight">
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <SpotlightForm
          initialValues={emptySpotlightFormValues}
          cancelTo={appRoutes.ai.aiInsightsSpotlights}
          submitting={submitting}
          onSave={async (values) => {
            setSubmitting(true)
            setError(null)

            try {
              await createSpotlight(siteId, values)
              navigate(appRoutes.ai.aiInsightsSpotlights, {
                state: { successMessage: 'Spotlight saved successfully.' },
              })
            } catch (nextError) {
              setError(nextError instanceof Error ? nextError.message : 'Failed to create spotlight.')
            } finally {
              setSubmitting(false)
            }
          }}
        />
      </Stack>
    </Page>
  )
}

export default NewSpotlightPage
