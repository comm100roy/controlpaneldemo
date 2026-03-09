import { useState } from 'react'
import ScienceIcon from '@mui/icons-material/Science'
import { Button, Grid, Stack } from '@mui/material'
import Page from '../components/common/Page'
import TestChatDrawer from '../components/common/TestChatDrawer'
import AgentOverviewCard from '../components/dashboard/AgentOverviewCard'
import OverviewHighlightPanel from '../components/dashboard/OverviewHighlightPanel'
import StatsGrid from '../components/dashboard/StatsGrid'
import {
  agentProfile,
  knowledgeStats,
  lowerMetrics,
  overviewPanels,
} from '../data/dashboard'

function OverviewPage() {
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)

  return (
    <>
      <Page
        title="Overview"
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
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <AgentOverviewCard {...agentProfile} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <StatsGrid
              title="Knowledge"
              description="Data sources used to train your AI Agent for accurate and relevant responses."
              stats={knowledgeStats}
              actions={<Button variant="outlined">Manage</Button>}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <OverviewHighlightPanel
              title={overviewPanels[0].title}
              description={overviewPanels[0].description}
              alertMessage={overviewPanels[0].items[0]?.description}
              count={overviewPanels[0].count}
              countLabel="Topics"
              countHref="/ai-agent/topics"
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <OverviewHighlightPanel
              title={overviewPanels[1].title}
              description={overviewPanels[1].description}
              alertMessage={overviewPanels[1].items[0]?.description}
              count={overviewPanels[1].count}
              countLabel="Instructions"
              countHref="/ai-agent/instructions"
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <OverviewHighlightPanel
              title={overviewPanels[2].title}
              description={overviewPanels[2].description}
              links={overviewPanels[2].items.map((item) => item.title)}
            />
          </Grid>

          {lowerMetrics.map((metric) => (
            <Grid size={{ xs: 12, md: 3 }} key={metric.title}>
              <OverviewHighlightPanel
                title={metric.title}
                description={metric.description}
                count={metric.value}
                countLabel={metric.countLabel}
                countHref={metric.countHref}
                headerMinHeight={132}
              />
            </Grid>
          ))}
        </Grid>
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default OverviewPage
