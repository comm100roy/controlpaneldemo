import { Button, Grid } from '@mui/material'
import Page from '../components/common/Page'
import InfoPanel from '../components/dashboard/InfoPanel'
import { learningItems } from '../data/dashboard'

function LearningPage() {
  return (
    <Page
      title="Learning"
      description="Review unresolved questions and close knowledge gaps so the AI Agent keeps improving over time."
      actions={<Button variant="contained">Review Queue</Button>}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <InfoPanel
            title="Unanswered Questions"
            description="These questions should be reviewed and turned into improved instructions, topics, or knowledge."
            count={learningItems.length}
            items={learningItems}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <InfoPanel
            title="Workflow"
            items={[
              {
                title: 'Detect gaps',
                description: 'Flag low-confidence or unresolved conversations automatically.',
              },
              {
                title: 'Refine content',
                description: 'Update knowledge and instructions based on the root cause of each missed answer.',
              },
              {
                title: 'Monitor impact',
                description: 'Confirm that new content improves resolution rate and visitor satisfaction.',
              },
            ]}
          />
        </Grid>
      </Grid>
    </Page>
  )
}

export default LearningPage
