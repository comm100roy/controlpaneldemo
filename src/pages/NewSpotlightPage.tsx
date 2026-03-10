import Page from '../components/common/Page'
import SpotlightForm from '../components/insights/SpotlightForm'
import { emptySpotlightFormValues } from '../data/aiInsights'
import { appRoutes } from '../data/routes'

function NewSpotlightPage() {
  return (
    <Page title="New Spotlight">
      <SpotlightForm
        initialValues={emptySpotlightFormValues}
        cancelTo={appRoutes.ai.aiInsightsSpotlights}
      />
    </Page>
  )
}

export default NewSpotlightPage
