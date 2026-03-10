import { useEffect, useMemo, useState } from 'react'
import { Alert } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getSpotlight, updateSpotlight } from '../../../../api/spotlights'
import Page from '../../../../components/common/Page'
import SpotlightForm from '../../../../components/insights/SpotlightForm'
import type { SpotlightDefinition } from '../../../../data/aiInsights'
import { appRoutes, getSiteIdFromPathname, resolveSiteId } from '../../../../data/routes'

function EditSpotlightPage() {
  const { spotlightId } = useParams<{ spotlightId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [spotlightDefinition, setSpotlightDefinition] = useState<SpotlightDefinition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const siteId = useMemo(
    () => resolveSiteId(getSiteIdFromPathname(location.pathname)),
    [location.pathname],
  )

  useEffect(() => {
    if (!spotlightId) {
      setSpotlightDefinition(null)
      setLoading(false)
      setError('Spotlight id is missing.')
      return
    }

    let cancelled = false

    const loadSpotlight = async () => {
      setLoading(true)
      setError(null)

      try {
        const nextSpotlight = await getSpotlight(siteId, spotlightId)

        if (!cancelled) {
          setSpotlightDefinition(nextSpotlight)
        }
      } catch (nextError) {
        if (!cancelled) {
          setSpotlightDefinition(null)
          setError(nextError instanceof Error ? nextError.message : 'Failed to load spotlight.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadSpotlight()

    return () => {
      cancelled = true
    }
  }, [siteId, spotlightId])

  return (
    <Page title="Edit Spotlight">
      {error ? <Alert severity="error">{error}</Alert> : null}
      {loading ? (
        <Alert severity="info">Loading spotlight...</Alert>
      ) : spotlightDefinition ? (
        <SpotlightForm
          key={spotlightDefinition.id}
          initialValues={{
            name: spotlightDefinition.name,
            description: spotlightDefinition.description,
          }}
          cancelTo={appRoutes.ai.aiInsightsSpotlights}
          submitting={submitting}
          onSave={async (values) => {
            setSubmitting(true)
            setError(null)

            try {
              await updateSpotlight(siteId, spotlightDefinition.id, values)
              navigate(appRoutes.ai.aiInsightsSpotlights, {
                state: { successMessage: 'Spotlight saved successfully.' },
              })
            } catch (nextError) {
              setError(nextError instanceof Error ? nextError.message : 'Failed to update spotlight.')
            } finally {
              setSubmitting(false)
            }
          }}
        />
      ) : (
        <Alert severity="warning">This spotlight could not be found.</Alert>
      )}
    </Page>
  )
}

export default EditSpotlightPage
