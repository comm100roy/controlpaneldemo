import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import { Button, Grid } from '@mui/material'
import MetricCard from '../components/common/MetricCard'
import Page from '../components/common/Page'
import InfoPanel from '../components/dashboard/InfoPanel'

type ProductPageProps = {
  title: string
  description: string
}

function ProductPage({ title, description }: ProductPageProps) {
  return (
    <Page
      title={title}
      description={description}
      actions={<Button variant="contained">Configure</Button>}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Adoption"
            value="84%"
            caption="Usage remains healthy across the current rollout group."
            icon={<AutoGraphOutlinedIcon color="primary" />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Automation Coverage"
            value="12"
            caption="Key workflows are already mapped for launch readiness."
            icon={<LayersOutlinedIcon color="primary" />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Connected Systems"
            value="5"
            caption="Connected across chat, CRM, notifications, and analytics."
            icon={<HubOutlinedIcon color="primary" />}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <InfoPanel
            title="Current Focus"
            items={[
              {
                title: 'Improve launch confidence',
                description: 'Validate prompts, routing, and fallback experiences before scaling usage.',
              },
              {
                title: 'Keep feedback loops short',
                description: 'Measure user outcomes and refine the experience continuously.',
              },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <InfoPanel
            title="Suggested Next Steps"
            items={[
              {
                title: 'Finalize success metrics',
                description: 'Decide what resolution, conversion, or efficiency improvements matter most.',
              },
              {
                title: 'Align ownership',
                description: 'Define who will maintain prompts, knowledge, analytics, and escalation paths.',
              },
            ]}
          />
        </Grid>
      </Grid>
    </Page>
  )
}

export default ProductPage
