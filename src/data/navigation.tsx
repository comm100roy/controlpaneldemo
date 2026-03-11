import type { ReactNode } from 'react'
import AllInclusiveOutlinedIcon from '@mui/icons-material/AllInclusiveOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import BookOutlinedIcon from '@mui/icons-material/BookOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { Box } from '@mui/material'
import type { Level1Segment } from './routes'
import { getAppRoutes, level1Segments, productDashboardPath } from './routes'

export type Level3NavItem = {
  label: string
  segment: string
  path?: string
  kind?: 'item' | 'section'
}

export type Level2NavItem = {
  label: string
  segment: string
  path: string
  children?: Level3NavItem[]
}

export type Level1NavItem = {
  label: string
  segment: Level1Segment
  path: string
  icon: ReactNode
  menuTitle?: string
  menuSubtitle?: string
  railSection?: 'primary' | 'secondary'
  items: Level2NavItem[]
}

export type AvatarMenuAction = {
  label: string
  icon: ReactNode
  external?: boolean
}

const createDashboardItem = (segment: Level1Segment, siteId?: string): Level2NavItem => ({
  label: 'Dashboard',
  segment: 'dashboard',
  path: productDashboardPath(segment, siteId),
})

export const sidebarLogo = {
  icon: <AllInclusiveOutlinedIcon fontSize="small" />,
  label: 'AI & Automation',
}

const ticketingMessagingIcon = (
  <Box
    sx={{
      position: 'relative',
      width: 20,
      height: 20,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'inherit',
    }}
  >
    <MailOutlineOutlinedIcon
      sx={{
        fontSize: 18,
        color: 'inherit',
      }}
    />
    <ChatBubbleOutlineOutlinedIcon
      sx={{
        position: 'absolute',
        right: -2,
        bottom: -1,
        fontSize: 11,
        color: 'inherit',
        bgcolor: '#062244',
        borderRadius: '50%',
      }}
    />
  </Box>
)

export const getLevel1Navigation = (siteId?: string): Level1NavItem[] => {
  const appRoutes = getAppRoutes(siteId)

  return [
    {
      label: 'Live Chat',
      segment: level1Segments.livechat,
      path: productDashboardPath(level1Segments.livechat, siteId),
      icon: <ChatBubbleOutlineOutlinedIcon fontSize="small" />,
      items: [createDashboardItem(level1Segments.livechat, siteId)],
    },
    {
      label: 'Ticketing & Messaging',
      segment: level1Segments.ticketing,
      path: productDashboardPath(level1Segments.ticketing, siteId),
      icon: ticketingMessagingIcon,
      items: [createDashboardItem(level1Segments.ticketing, siteId)],
    },
    {
      label: 'Voice',
      segment: level1Segments.voice,
      path: productDashboardPath(level1Segments.voice, siteId),
      icon: <KeyboardVoiceOutlinedIcon fontSize="small" />,
      items: [createDashboardItem(level1Segments.voice, siteId)],
    },
    {
      label: 'AI',
      segment: level1Segments.ai,
      path: appRoutes.ai.dashboard,
      icon: <SmartToyOutlinedIcon fontSize="small" />,
      menuTitle: 'AI & Automation',
      items: [
        {
          label: 'Dashboard',
          segment: 'dashboard',
          path: appRoutes.ai.dashboard,
        },
        {
          label: 'AI Agent',
          segment: 'aiagent',
          path: appRoutes.ai.aiAgentOverview(),
          children: [
            { label: 'Overview', segment: 'overview', path: appRoutes.ai.aiAgentOverview() },
            { label: 'Knowledge', segment: 'knowledge', path: appRoutes.ai.aiAgentKnowledge() },
            { label: 'Topics', segment: 'topics', path: appRoutes.ai.aiAgentTopics() },
            { label: 'Events', segment: 'events', path: appRoutes.ai.aiAgentEvents() },
            {
              label: 'Functions & MCP',
              segment: 'functions',
              path: appRoutes.ai.aiAgentFunctions(),
            },
            { label: 'Learning', segment: 'learning-section', kind: 'section' },
            {
              label: 'Unanswered Questions',
              segment: 'unanswered-questions',
              path: appRoutes.ai.aiAgentLearningUnansweredQuestions(),
            },
            {
              label: 'Thumbs Down Answers',
              segment: 'thumbs-down-answers',
              path: appRoutes.ai.aiAgentLearningThumbsDownAnswers(),
            },
          ],
        },
        {
          label: 'AI Copilot',
          segment: 'aicopilot',
          path: appRoutes.ai.aiCopilot,
        },
        {
          label: 'AI Insights',
          segment: 'aiinsights',
          path: appRoutes.ai.aiInsightsSentimentAnalysis,
          children: [
            {
              label: 'Sentiment Analysis',
              segment: 'sentiment-analysis',
              path: appRoutes.ai.aiInsightsSentimentAnalysis,
            },
            {
              label: 'Spotlights',
              segment: 'spotlights',
              path: appRoutes.ai.aiInsightsSpotlights,
            },
            {
              label: 'Chat Resolution Status',
              segment: 'chat-resolution-status',
              path: appRoutes.ai.aiInsightsChatResolutionStatus,
            },
          ],
        },
        {
          label: 'Task Bot',
          segment: 'taskbot',
          path: appRoutes.ai.taskBot,
        },
        {
          label: 'Voice Bot',
          segment: 'voicebot',
          path: appRoutes.ai.voiceBot,
        },
      ],
    },
    {
      label: 'Outreach',
      segment: level1Segments.outreach,
      path: productDashboardPath(level1Segments.outreach, siteId),
      icon: <CampaignOutlinedIcon fontSize="small" />,
      items: [createDashboardItem(level1Segments.outreach, siteId)],
    },
    {
      label: 'Queue',
      segment: level1Segments.queue,
      path: productDashboardPath(level1Segments.queue, siteId),
      icon: <GroupsOutlinedIcon fontSize="small" />,
      items: [createDashboardItem(level1Segments.queue, siteId)],
    },
    {
      label: 'Booking',
      segment: level1Segments.booking,
      path: productDashboardPath(level1Segments.booking, siteId),
      icon: <CalendarMonthOutlinedIcon fontSize="small" />,
      items: [createDashboardItem(level1Segments.booking, siteId)],
    },
    {
      label: 'Knowledge Base',
      segment: level1Segments.knowledgebase,
      path: productDashboardPath(level1Segments.knowledgebase, siteId),
      icon: <BookOutlinedIcon fontSize="small" />,
      items: [createDashboardItem(level1Segments.knowledgebase, siteId)],
    },
    {
      label: 'Contact',
      segment: level1Segments.contact,
      path: productDashboardPath(level1Segments.contact, siteId),
      icon: <ManageAccountsOutlinedIcon fontSize="small" />,
      items: [createDashboardItem(level1Segments.contact, siteId)],
    },
    {
      label: 'Report',
      segment: level1Segments.report,
      path: productDashboardPath(level1Segments.report, siteId),
      icon: <BarChartOutlinedIcon fontSize="small" />,
      items: [createDashboardItem(level1Segments.report, siteId)],
    },
    {
      label: 'Global Settings',
      segment: level1Segments.globalsettings,
      path: productDashboardPath(level1Segments.globalsettings, siteId),
      icon: <TuneOutlinedIcon fontSize="small" />,
      items: [createDashboardItem(level1Segments.globalsettings, siteId)],
    },
    {
      label: 'Integrations',
      segment: level1Segments.integrations,
      path: productDashboardPath(level1Segments.integrations, siteId),
      icon: <ExtensionOutlinedIcon fontSize="small" />,
      railSection: 'secondary',
      items: [createDashboardItem(level1Segments.integrations, siteId)],
    },
  ]
}

export const avatarMenuActions: AvatarMenuAction[] = [
  {
    label: 'Change Password',
    icon: <KeyOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Download Agent Apps',
    icon: <DownloadOutlinedIcon fontSize="small" />,
    external: true,
  },
  {
    label: 'Log Out',
    icon: <LogoutOutlinedIcon fontSize="small" />,
  },
]
