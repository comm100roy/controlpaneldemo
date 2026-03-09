import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'
import { Button, Grid } from '@mui/material'
import MetricCard from '../components/common/MetricCard'
import Page from '../components/common/Page'
import AgentOverviewCard from '../components/dashboard/AgentOverviewCard'
import InfoPanel from '../components/dashboard/InfoPanel'
import {
  agentProfile,
  dashboardMetrics,
  dashboardPanels,
} from '../data/dashboard'

function DashboardPage() {
  return (
    <Page
      title="Dashboard"
      description="Overview of your automation workspace, with quick visibility into adoption, health, and next actions."
      actions={<Button variant="contained">Create AI Agent</Button>}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <AgentOverviewCard
            badge={agentProfile.badge}
            name="Workspace spotlight"
            description="The live AI Agent remains the most active automation in the workspace and is ready for the next campaign release."
            capabilities={agentProfile.capabilities}
            profile={agentProfile.profile}
            status={agentProfile.status}
            action={<Button variant="outlined">View AI Agent</Button>}
          />
        </Grid>

        {dashboardMetrics.map((metric, index) => {
          const icons = [
            <AutoAwesomeOutlinedIcon color="primary" key="spark" />,
            <MessageOutlinedIcon color="primary" key="message" />,
            <TimelineOutlinedIcon color="primary" key="timeline" />,
            <InsightsOutlinedIcon color="primary" key="insight" />,
          ]

          return (
            <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={metric.title}>
              <MetricCard {...metric} icon={icons[index]} />
            </Grid>
          )
        })}

        <Grid size={{ xs: 12, lg: 6 }}>
          <InfoPanel
            title="Quick Actions"
            description="Prioritized work to improve the quality and performance of the automation experience."
            items={dashboardPanels.quickActions}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <InfoPanel
            title="Recent Activity"
            description="The most recent changes made across the AI product suite."
            items={dashboardPanels.activity}
          />
        </Grid>
      </Grid>
    </Page>
  )
}

export default DashboardPage
