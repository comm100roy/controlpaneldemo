import { useState } from 'react'
import ScienceIcon from '@mui/icons-material/Science'
import { Alert, Button, Grid, Stack } from '@mui/material'
import { Link as RouterLink, useOutletContext, useParams } from 'react-router-dom'
import BookedMeetingsDrawer from '../../../../components/dashboard/BookedMeetingsDrawer'
import CollectedLeadsDrawer from '../../../../components/dashboard/CollectedLeadsDrawer'
import EditAiAgentDrawer from '../../../../components/dashboard/EditAiAgentDrawer'
import Page from '../../../../components/common/Page'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import AgentOverviewCard from '../../../../components/dashboard/AgentOverviewCard'
import OverviewHighlightPanel from '../../../../components/dashboard/OverviewHighlightPanel'
import StatsGrid from '../../../../components/dashboard/StatsGrid'
import type { AiAgentRecord } from '../../../../data/aiAgents'
import {
  agentProfile,
  knowledgeStats,
  lowerMetrics,
  overviewPanels,
} from '../../../../data/dashboard'
import { appRoutes, resolveAiAgentId } from '../../../../data/routes'

type OverviewPageLayoutContext = {
  aiAgents?: AiAgentRecord[]
  aiAgentsLoading?: boolean
  aiAgentsError?: string | null
  onUpdateAiAgent?: (agent: AiAgentRecord) => Promise<AiAgentRecord>
}

function OverviewPage() {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()
  const layoutContext = useOutletContext<OverviewPageLayoutContext | undefined>()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isCollectedLeadsDrawerOpen, setIsCollectedLeadsDrawerOpen] = useState(false)
  const [isBookedMeetingsDrawerOpen, setIsBookedMeetingsDrawerOpen] = useState(false)
  const [editDrawerSession, setEditDrawerSession] = useState(0)
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)
  const aiAgents = layoutContext?.aiAgents ?? []
  const selectedAiAgent = aiAgents.find((agent) => agent.id === resolvedAiAgentId) ?? null

  if (layoutContext?.aiAgentsLoading) {
    return (
      <Page title="Overview">
        <Alert severity="info">Loading AI agents...</Alert>
      </Page>
    )
  }

  if (layoutContext?.aiAgentsError) {
    return (
      <Page title="Overview">
        <Alert severity="error">{layoutContext.aiAgentsError}</Alert>
      </Page>
    )
  }

  if (!selectedAiAgent) {
    return (
      <Page title="Overview">
        <Alert severity="warning">No AI agents are available for this site.</Alert>
      </Page>
    )
  }

  const resolvedAgentProfile = {
    ...agentProfile,
    description:
      selectedAiAgent.subtitle || agentProfile.description,
    profile: [
      { label: 'Name', value: selectedAiAgent.name },
      { label: 'Language', value: selectedAiAgent.language },
      { label: 'Description', value: selectedAiAgent.subtitle },
    ],
    status: [
      { label: 'Channel', value: selectedAiAgent.channelLabel },
      {
        label: 'Publish Status',
        value:
          selectedAiAgent.channelCount > 0
            ? `Published in ${selectedAiAgent.channelCount} ${selectedAiAgent.channelLabel} Campaigns`
            : 'Not published yet',
      },
      agentProfile.status[2],
    ],
  }

  const resolvedLowerMetrics = lowerMetrics.map((metric) =>
    metric.title === 'Functions'
      ? { ...metric, countHref: appRoutes.ai.aiAgentFunctions(resolvedAiAgentId) }
      : metric.title === 'Learning'
        ? {
            ...metric,
            countHref: appRoutes.ai.aiAgentLearningUnansweredQuestions(resolvedAiAgentId),
          }
        : metric,
  )

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
            <AgentOverviewCard
              {...resolvedAgentProfile}
              action={
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditDrawerSession((current) => current + 1)
                    setIsEditDrawerOpen(true)
                  }}
                >
                  Edit
                </Button>
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <StatsGrid
              title="Knowledge"
              description="Data sources used to train your AI Agent for accurate and relevant responses."
              stats={knowledgeStats}
              actions={
                <Button
                  component={RouterLink}
                  to={appRoutes.ai.aiAgentKnowledge(resolvedAiAgentId)}
                  variant="outlined"
                >
                  Manage
                </Button>
              }
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <OverviewHighlightPanel
              title={overviewPanels[0].title}
              description={overviewPanels[0].description}
              alertMessage={overviewPanels[0].items[0]?.description}
              count={overviewPanels[0].count}
              countLabel="Topics"
              countHref={appRoutes.ai.aiAgentTopics(resolvedAiAgentId)}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <OverviewHighlightPanel
              title={overviewPanels[1].title}
              description={overviewPanels[1].description}
              alertMessage={overviewPanels[1].items[0]?.description}
              count={overviewPanels[1].count}
              countLabel="Instructions"
              countHref={appRoutes.ai.aiAgentInstructions(resolvedAiAgentId)}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <OverviewHighlightPanel
              title={overviewPanels[2].title}
              description={overviewPanels[2].description}
              links={overviewPanels[2].items.map((item) => item.title)}
            />
          </Grid>

          {resolvedLowerMetrics.map((metric) => (
            <Grid size={{ xs: 12, md: 3 }} key={metric.title}>
              <OverviewHighlightPanel
                title={metric.title}
                description={metric.description}
                count={metric.value}
                countLabel={metric.countLabel}
                countHref={metric.countHref}
                countOnClick={
                  metric.title === 'Collected Leads'
                    ? () => setIsCollectedLeadsDrawerOpen(true)
                    : metric.title === 'Booked Meetings'
                      ? () => setIsBookedMeetingsDrawerOpen(true)
                    : undefined
                }
                headerMinHeight={104}
                bodySpacing={2}
                contentSx={{ p: { xs: 2.25, md: 2.5 } }}
              />
            </Grid>
          ))}
        </Grid>
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
      <EditAiAgentDrawer
        key={editDrawerSession}
        open={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        agent={selectedAiAgent}
        onSubmitAgent={async (agent) => {
          if (!layoutContext?.onUpdateAiAgent) {
            throw new Error('AI agent update is unavailable.')
          }

          return layoutContext.onUpdateAiAgent(agent)
        }}
      />
      <CollectedLeadsDrawer
        open={isCollectedLeadsDrawerOpen}
        onClose={() => setIsCollectedLeadsDrawerOpen(false)}
      />
      <BookedMeetingsDrawer
        open={isBookedMeetingsDrawerOpen}
        onClose={() => setIsBookedMeetingsDrawerOpen(false)}
      />
    </>
  )
}

export default OverviewPage
