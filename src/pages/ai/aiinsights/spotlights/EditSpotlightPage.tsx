import { Navigate, useParams } from 'react-router-dom'
import Page from '../../../../components/common/Page'
import SpotlightForm from '../../../../components/insights/SpotlightForm'
import { spotlightDefinitions } from '../../../../data/aiInsights'
import { appRoutes } from '../../../../data/routes'

function EditSpotlightPage() {
  const { spotlightId } = useParams<{ spotlightId: string }>()
  const spotlightDefinition = spotlightDefinitions.find((item) => item.id === spotlightId)

  if (!spotlightDefinition) {
    return <Navigate to={appRoutes.ai.aiInsightsSpotlights} replace />
  }

  return (
    <Page title="Edit Spotlight">
      <SpotlightForm
        key={spotlightDefinition.id}
        initialValues={{
          name: spotlightDefinition.name,
          description: spotlightDefinition.description,
        }}
        cancelTo={appRoutes.ai.aiInsightsSpotlights}
      />
    </Page>
  )
}

export default EditSpotlightPage
