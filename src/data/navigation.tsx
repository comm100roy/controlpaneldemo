import type { ReactNode } from 'react'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined'

export type NavItem = {
  label: string
  to?: string
  icon?: ReactNode
  children?: NavItem[]
}

export const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    label: 'AI Agent',
    icon: <SmartToyOutlinedIcon fontSize="small" />,
    children: [
      { label: 'Overview', to: '/ai-agent/overview' },
      { label: 'Knowledge', to: '/ai-agent/knowledge' },
      { label: 'Topics', to: '/ai-agent/topics' },
      { label: 'Events', to: '/ai-agent/events' },
      { label: 'Functions', to: '/ai-agent/functions' },
      { label: 'Learning', to: '/ai-agent/learning' },
    ],
  },
  {
    label: 'AI Copilot',
    to: '/ai-copilot',
    icon: <TipsAndUpdatesOutlinedIcon fontSize="small" />,
  },
  {
    label: 'AI Insights',
    to: '/ai-insights',
    icon: <InsightsOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Task Bot',
    to: '/task-bot',
    icon: <TaskAltOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Voice Bot',
    to: '/voice-bot',
    icon: <KeyboardVoiceOutlinedIcon fontSize="small" />,
  },
]
