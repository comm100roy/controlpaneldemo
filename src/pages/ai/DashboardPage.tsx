import { useState } from 'react'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import DashboardCard from '../../components/common/DashboardCard'
import Page from '../../components/common/Page'
import { appRoutes } from '../../data/routes'

type UsageItem = {
  title: string
  used: number
  total: number
  color: string
  icon: React.ReactNode
  manageTo?: string
}

type ChatMetric = {
  label: string
  value: string
}

type ChatTrendPoint = {
  label: string
  aiAgentOnlyChats: number
  chatsToHumanOrOffline: number
  percentageAiOnly: number
}

type ChartSeriesDataKey =
  | 'aiAgentOnlyChats'
  | 'chatsToHumanOrOffline'
  | 'percentageAiOnly'

type LegendSeriesKey = 'primaryBar' | 'secondaryBar' | 'percentageLine'

type LegendItem = {
  key: LegendSeriesKey
  label: string
  color: string
  indicator: 'filled' | 'outlined'
}

type ChartTooltipPayloadItem = {
  dataKey?: string | number
  value?: string | number
}

const chartSeriesMeta: Record<
  ChartSeriesDataKey,
  { label: string; color: string; indicator: 'filled' | 'outlined' }
> = {
  aiAgentOnlyChats: {
    label: 'AI Agent Only Chats',
    color: '#0b72b9',
    indicator: 'filled',
  },
  chatsToHumanOrOffline: {
    label: 'Chats from AI Agent to Human Agent or Offline Message',
    color: '#64b5f6',
    indicator: 'filled',
  },
  percentageAiOnly: {
    label: 'Percentage of AI Agent Only Chats',
    color: '#4caf50',
    indicator: 'outlined',
  },
}

const usageItems: UsageItem[] = [
  {
    title: 'AI Replies',
    used: 6138,
    total: 5000,
    color: '#f44336',
    icon: <MessageOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    title: 'AI Agents',
    used: 80,
    total: 101,
    color: '#f4a340',
    icon: <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />,
    manageTo: appRoutes.ai.aiAgentOverview(),
  },
  {
    title: 'AI Copilots',
    used: 32,
    total: 100,
    color: '#1f8ed8',
    icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 18 }} />,
    manageTo: appRoutes.ai.aiCopilot,
  },
  {
    title: 'Task Bots',
    used: 100,
    total: 101,
    color: '#f44336',
    icon: <TaskAltOutlinedIcon sx={{ fontSize: 18 }} />,
    manageTo: appRoutes.ai.taskBot,
  },
  {
    title: 'Voice Bot Minutes',
    used: 0,
    total: 6300,
    color: '#c7cbd3',
    icon: <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    title: 'Voice Bots',
    used: 9,
    total: 21,
    color: '#1f8ed8',
    icon: <KeyboardVoiceOutlinedIcon sx={{ fontSize: 18 }} />,
    manageTo: appRoutes.ai.voiceBot,
  },
]

const aiAgentLiveChatMetrics: ChatMetric[] = [
  { label: 'AI Agent Only Chats', value: '13' },
  { label: 'Avg. Rating of AI Agent Only Chats', value: '0' },
  { label: '% of AI Agent Only Chats', value: '72.22 %' },
  { label: 'AI Agent Answers', value: '2' },
  { label: 'Total Time of AI Agent Only Chats', value: '288 min' },
  { label: 'Chats from AI Agent to Human Agent or Offline Message', value: '5' },
  { label: '% of High Confidence Answers', value: '0 %' },
]

const aiAgentTicketingMetrics: ChatMetric[] = [
  { label: 'AI Agent Only Tickets', value: '9' },
  { label: 'Avg. Resolution Rating', value: '4.8' },
  { label: '% of AI Agent Only Tickets', value: '72 %' },
  { label: 'AI Agent Responses', value: '31' },
  { label: 'Total Resolution Time', value: '184 min' },
  { label: 'Escalations to Human Agents', value: '4' },
  { label: '% of High Confidence Responses', value: '79.20 %' },
]

const voiceBotMetrics: ChatMetric[] = [
  { label: 'Voice Bot Sessions', value: '18' },
  { label: 'Avg. Call Rating', value: '4.6' },
  { label: '% Contained by Voice Bot', value: '61 %' },
  { label: 'Voice Bot Actions', value: '14' },
  { label: 'Total Minutes', value: '92 min' },
  { label: 'Transfers to Human', value: '3' },
  { label: '% of High Confidence Calls', value: '76.40 %' },
]

const newsItems = [
  '13 Types of AI Agents to Use in Customer Support',
  'What is AI Knowledge Management? Overview, Features, Challenges, and Benefits',
  'How AI is Transforming the Employee Onboarding Process for Support Teams',
]

const aiAgentLiveChatTrend: ChatTrendPoint[] = [
  { label: '03/03', aiAgentOnlyChats: 12, chatsToHumanOrOffline: 0, percentageAiOnly: 100 },
  { label: '03/04', aiAgentOnlyChats: 0, chatsToHumanOrOffline: 0, percentageAiOnly: 0 },
  { label: '03/05', aiAgentOnlyChats: 1, chatsToHumanOrOffline: 0, percentageAiOnly: 100 },
  { label: '03/06', aiAgentOnlyChats: 0, chatsToHumanOrOffline: 0, percentageAiOnly: 0 },
  { label: '03/07', aiAgentOnlyChats: 0, chatsToHumanOrOffline: 0, percentageAiOnly: 0 },
  { label: 'Yesterday', aiAgentOnlyChats: 0, chatsToHumanOrOffline: 0, percentageAiOnly: 0 },
  { label: 'Today', aiAgentOnlyChats: 0, chatsToHumanOrOffline: 0, percentageAiOnly: 0 },
]

const aiAgentTicketingTrend: ChatTrendPoint[] = [
  { label: '03/03', aiAgentOnlyChats: 4, chatsToHumanOrOffline: 1, percentageAiOnly: 80 },
  { label: '03/04', aiAgentOnlyChats: 1, chatsToHumanOrOffline: 1, percentageAiOnly: 50 },
  { label: '03/05', aiAgentOnlyChats: 2, chatsToHumanOrOffline: 0, percentageAiOnly: 100 },
  { label: '03/06', aiAgentOnlyChats: 1, chatsToHumanOrOffline: 0, percentageAiOnly: 100 },
  { label: '03/07', aiAgentOnlyChats: 1, chatsToHumanOrOffline: 1, percentageAiOnly: 50 },
  { label: 'Yesterday', aiAgentOnlyChats: 0, chatsToHumanOrOffline: 0, percentageAiOnly: 0 },
  { label: 'Today', aiAgentOnlyChats: 0, chatsToHumanOrOffline: 0, percentageAiOnly: 0 },
]

const voiceBotTrend: ChatTrendPoint[] = [
  { label: '03/03', aiAgentOnlyChats: 6, chatsToHumanOrOffline: 1, percentageAiOnly: 86 },
  { label: '03/04', aiAgentOnlyChats: 2, chatsToHumanOrOffline: 0, percentageAiOnly: 100 },
  { label: '03/05', aiAgentOnlyChats: 4, chatsToHumanOrOffline: 1, percentageAiOnly: 80 },
  { label: '03/06', aiAgentOnlyChats: 0, chatsToHumanOrOffline: 1, percentageAiOnly: 0 },
  { label: '03/07', aiAgentOnlyChats: 3, chatsToHumanOrOffline: 0, percentageAiOnly: 100 },
  { label: 'Yesterday', aiAgentOnlyChats: 1, chatsToHumanOrOffline: 0, percentageAiOnly: 100 },
  { label: 'Today', aiAgentOnlyChats: 2, chatsToHumanOrOffline: 0, percentageAiOnly: 100 },
]

function UsageCardItem({ item }: { item: UsageItem }) {
  const progressValue = item.total === 0 ? 0 : Math.min((item.used / item.total) * 100, 100)

  return (
    <Box
      sx={{
        minWidth: 0,
        pr: { xs: 0, md: 2 },
        borderRight: {
          xs: 'none',
          md: '1px solid rgba(15, 23, 42, 0.08)',
        },
        '&:nth-of-type(4n)': {
          borderRight: { md: 'none' },
          pr: { md: 0 },
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
          <Box sx={{ color: '#607d8b', display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#455a64' }}>
            {item.title}
          </Typography>
          <InfoOutlinedIcon sx={{ fontSize: 14, color: '#b0b7c3' }} />
        </Stack>
        {item.manageTo ? (
          <Link
            component={RouterLink}
            to={item.manageTo}
            underline="hover"
            sx={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}
          >
            Manage
          </Link>
        ) : null}
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1.5, mb: 0.75 }}
      >
        <Typography sx={{ fontSize: 12, color: '#455a64' }}>{item.used} used</Typography>
        <Typography sx={{ fontSize: 12, color: '#455a64' }}>{item.total} total</Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progressValue}
        sx={{
          height: 6,
          borderRadius: 999,
          bgcolor: '#d8dce3',
          '& .MuiLinearProgress-bar': {
            borderRadius: 999,
            bgcolor: item.color,
          },
        }}
      />
    </Box>
  )
}

function ChatMetricGrid({ metrics }: { metrics: ChatMetric[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, minmax(0, 1fr))',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
        columnGap: 0,
        rowGap: { xs: 0, lg: 3 },
      }}
    >
      {metrics.map((metric, index) => (
        <Box
          key={metric.label}
          sx={{
            minHeight: 122,
            px: 4,
            py: 2.5,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid rgba(15, 23, 42, 0.08)',
            borderRight: {
              xs: '1px solid rgba(15, 23, 42, 0.08)',
              sm: index % 2 === 1 ? '1px solid rgba(15, 23, 42, 0.08)' : 'none',
              lg:
                (index + 1) % 4 === 0 || index === metrics.length - 1
                  ? '1px solid rgba(15, 23, 42, 0.08)'
                  : 'none',
            },
          }}
        >
          <Typography sx={{ fontSize: 12, color: '#6e7d88', lineHeight: 1.45, maxWidth: 220 }}>
            {metric.label}
          </Typography>
          <Typography
            sx={{ mt: 'auto', pt: 1.75, fontSize: 18, fontWeight: 600, color: '#37474f' }}
          >
            {metric.value}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

function LegendPill({
  label,
  color,
  indicator,
  active,
  onToggle,
}: {
  label: string
  color: string
  indicator: 'filled' | 'outlined'
  active: boolean
  onToggle: () => void
}) {
  return (
    <ButtonBase
      onClick={onToggle}
      aria-pressed={active}
      sx={{
        px: 1.2,
        py: 0.45,
        borderRadius: 999,
        border: '1px solid rgba(69, 90, 100, 0.55)',
        bgcolor: active ? 'common.white' : 'rgba(236, 239, 241, 0.55)',
        minHeight: 28,
        justifyContent: 'flex-start',
        transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease',
        opacity: active ? 1 : 0.6,
      }}
    >
      <Stack direction="row" spacing={0.8} alignItems="center">
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            flexShrink: 0,
            bgcolor:
              indicator === 'filled'
                ? active
                  ? color
                  : '#c7cbd3'
                : 'common.white',
            border:
              indicator === 'outlined'
                ? `2px solid ${active ? color : '#c7cbd3'}`
                : 'none',
          }}
        />
        <Typography
          sx={{
            fontSize: 12,
            color: active ? '#607d8b' : '#9aa4af',
            lineHeight: 1.15,
            textAlign: 'left',
          }}
        >
          {label}
        </Typography>
      </Stack>
    </ButtonBase>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: ChartTooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload?.length) {
    return null
  }

  const orderedItems = (
    ['aiAgentOnlyChats', 'chatsToHumanOrOffline', 'percentageAiOnly'] as ChartSeriesDataKey[]
  )
    .map((dataKey) => {
      const item = payload.find((entry) => entry.dataKey === dataKey)
      if (!item) {
        return null
      }

      return {
        ...chartSeriesMeta[dataKey],
        value:
          dataKey === 'percentageAiOnly'
            ? `${item.value ?? 0}%`
            : `${item.value ?? 0}`,
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <Box
      sx={{
        minWidth: 440,
        px: 2.5,
        py: 2,
        borderRadius: 1.5,
        bgcolor: 'common.white',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)',
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#607d8b' }}>{label}</Typography>
      <Stack spacing={0.85} sx={{ mt: 1.2 }}>
        {orderedItems.map((item) => (
          <Stack key={item.label} direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                flexShrink: 0,
                bgcolor: item.indicator === 'filled' ? item.color : 'common.white',
                border:
                  item.indicator === 'outlined' ? `2px solid ${item.color}` : 'none',
              }}
            />
            <Typography sx={{ fontSize: 14, color: '#455a64', lineHeight: 1.3 }}>
              {item.label}: {item.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

function ChatTrendChart({
  data,
  visibleSeries,
}: {
  data: ChatTrendPoint[]
  visibleSeries: Record<LegendSeriesKey, boolean>
}) {
  const showLeftAxis = visibleSeries.primaryBar || visibleSeries.secondaryBar
  const showRightAxis = visibleSeries.percentageLine
  const maxChats = Math.max(
    12,
    ...data.map((point) => {
      const aiAgentOnlyChats = visibleSeries.primaryBar ? point.aiAgentOnlyChats : 0
      const chatsToHumanOrOffline = visibleSeries.secondaryBar
        ? point.chatsToHumanOrOffline
        : 0

      return aiAgentOnlyChats + chatsToHumanOrOffline
    }),
  )
  const backgroundGuideValues = showRightAxis
    ? [25, 50, 75]
    : showLeftAxis
      ? [3, 6, 9]
      : []
  const backgroundGuideDomainMax = showRightAxis ? 100 : maxChats

  return (
    <Box sx={{ pt: 2.5, height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 22, bottom: 20, left: 0 }}
          barCategoryGap="28%"
        >
          <CartesianGrid
            horizontal
            vertical={false}
            stroke="#d2d8e0"
            strokeDasharray="4 4"
            strokeWidth={1}
            strokeOpacity={1}
            horizontalCoordinatesGenerator={({ offset }) =>
              backgroundGuideValues.map(
                (value) =>
                  offset.top + offset.height * (1 - value / backgroundGuideDomainMax),
              )
            }
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#7b8794', fontSize: 11 }}
          />
          {showLeftAxis ? (
            <YAxis
              yAxisId="left"
              domain={[0, maxChats]}
              ticks={[0, 3, 6, 9, 12]}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#7b8794', fontSize: 11 }}
            />
          ) : null}
          {showRightAxis ? (
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4caf50', fontSize: 11 }}
            />
          ) : null}
          <RechartsTooltip
            content={<ChartTooltip />}
            cursor={{ stroke: '#c4cbd4', strokeDasharray: '4 4', strokeWidth: 1 }}
          />
          {visibleSeries.primaryBar ? (
            <Bar
              yAxisId="left"
              dataKey="aiAgentOnlyChats"
              stackId="chats"
              fill="#0b72b9"
              radius={[2, 2, 0, 0]}
              barSize={32}
            />
          ) : null}
          {visibleSeries.secondaryBar ? (
            <Bar
              yAxisId="left"
              dataKey="chatsToHumanOrOffline"
              stackId="chats"
              fill="#64b5f6"
              radius={[2, 2, 0, 0]}
              barSize={32}
            />
          ) : null}
          {visibleSeries.percentageLine ? (
            <Line
              yAxisId="right"
              type="linear"
              dataKey="percentageAiOnly"
              stroke="#4caf50"
              strokeWidth={2}
              dot={{ r: 4.5, stroke: '#4caf50', strokeWidth: 2, fill: '#ffffff' }}
              activeDot={{ r: 5 }}
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  )
}

function ChatTrendTable({ data }: { data: ChatTrendPoint[] }) {
  const rows = [...data].reverse()

  return (
    <Table sx={{ mt: 2.5 }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 700, color: '#37474f' }}>Date</TableCell>
          <TableCell sx={{ fontWeight: 700, color: '#37474f' }}>AI Agent Only Chats</TableCell>
          <TableCell sx={{ fontWeight: 700, color: '#37474f' }}>
            Chats from AI Agent to Human Agent or Offline Message
          </TableCell>
          <TableCell sx={{ fontWeight: 700, color: '#37474f' }}>AI Agent Chats</TableCell>
          <TableCell sx={{ fontWeight: 700, color: '#37474f' }}>
            Percentage of AI Agent Only Chats
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => {
          const totalChats = row.aiAgentOnlyChats + row.chatsToHumanOrOffline

          return (
            <TableRow key={row.label}>
              <TableCell>{row.label}</TableCell>
              <TableCell>{row.aiAgentOnlyChats}</TableCell>
              <TableCell>{row.chatsToHumanOrOffline}</TableCell>
              <TableCell>{totalChats}</TableCell>
              <TableCell>{row.percentageAiOnly}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function DashboardPage() {
  const [statsView, setStatsView] = useState<'ai-agent' | 'voice-bot'>('ai-agent')
  const [usageChannel, setUsageChannel] = useState<'live-chat' | 'ticketing'>('live-chat')
  const [visibleSeries, setVisibleSeries] = useState<Record<LegendSeriesKey, boolean>>({
    primaryBar: true,
    secondaryBar: true,
    percentageLine: true,
  })

  const statisticsTitle = statsView === 'ai-agent' ? 'AI Agent Chats' : 'Voice Bot Sessions'
  const statisticsMetrics =
    statsView === 'voice-bot'
      ? voiceBotMetrics
      : usageChannel === 'live-chat'
        ? aiAgentLiveChatMetrics
        : aiAgentTicketingMetrics
  const trendData =
    statsView === 'voice-bot'
      ? voiceBotTrend
      : usageChannel === 'live-chat'
        ? aiAgentLiveChatTrend
        : aiAgentTicketingTrend
  const legendItems: LegendItem[] =
    statsView === 'voice-bot'
      ? [
          { key: 'primaryBar', label: 'Voice Bot Sessions', color: '#0b72b9', indicator: 'filled' },
          { key: 'secondaryBar', label: 'Transfers to Human', color: '#64b5f6', indicator: 'filled' },
          { key: 'percentageLine', label: 'Containment Rate', color: '#4caf50', indicator: 'outlined' },
        ]
      : [
          { key: 'primaryBar', label: 'AI Agent Only Chats', color: '#0b72b9', indicator: 'filled' },
          {
            key: 'secondaryBar',
            label: 'Chats from AI Agent to Human Agent or Offline Message',
            color: '#64b5f6',
            indicator: 'filled',
          },
          {
            key: 'percentageLine',
            label: 'Percentage of AI Agent Only Chats',
            color: '#4caf50',
            indicator: 'outlined',
          },
        ]

  const handleToggleSeries = (key: LegendSeriesKey) => {
    setVisibleSeries((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return (
    <Page title="Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#37474f' }}>
                  Usage
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#9aa4af' }}>
                  (resets in -141 days)
                </Typography>
                <InfoOutlinedIcon sx={{ fontSize: 15, color: '#c0c7d0' }} />
                <IconButton size="small" sx={{ ml: 0.25 }}>
                  <RefreshRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>

              <Box
                sx={{
                  mt: 2.5,
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: {
                    xs: 'repeat(1, minmax(0, 1fr))',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    lg: 'repeat(4, minmax(0, 1fr))',
                  },
                }}
              >
                {usageItems.map((item) => (
                  <UsageCardItem key={item.title} item={item} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 7.5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 2.5, pt: 1.25 }}>
                <Tabs
                  value={statsView}
                  onChange={(_, value: 'ai-agent' | 'voice-bot') => setStatsView(value)}
                  sx={{
                    minHeight: 0,
                    '& .MuiTab-root': {
                      minHeight: 48,
                      px: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    },
                  }}
                >
                  <Tab value="ai-agent" label="AI Agent" />
                  <Tab value="voice-bot" label="Voice Bot" />
                </Tabs>
              </Box>

              <Divider />

              <Box sx={{ px: 2.5, py: 2.5 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#37474f' }}>
                  Last 7 Days
                </Typography>

                {statsView === 'ai-agent' ? (
                  <Box sx={{ mt: 2 }}>
                    <Tabs
                      value={usageChannel}
                      onChange={(_, value: 'live-chat' | 'ticketing') => setUsageChannel(value)}
                      sx={{
                        minHeight: 0,
                        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                        '& .MuiTab-root': {
                          minHeight: 42,
                          px: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                        },
                      }}
                    >
                      <Tab value="live-chat" label="AI Agent Usage in Live Chat" />
                      <Tab
                        value="ticketing"
                        label="AI Agent Usage in Ticketing & Messaging"
                      />
                    </Tabs>
                  </Box>
                ) : null}

                <Box sx={{ mt: 2.5 }}>
                  <ChatMetricGrid metrics={statisticsMetrics} />
                </Box>

                <Typography
                  sx={{ mt: 3, fontSize: 18, fontWeight: 600, color: '#37474f' }}
                >
                  {statisticsTitle}
                </Typography>

                <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 2 }}>
                  {legendItems.map((item) => (
                    <LegendPill
                      key={item.key}
                      label={item.label}
                      color={item.color}
                      indicator={item.indicator}
                      active={visibleSeries[item.key]}
                      onToggle={() => handleToggleSeries(item.key)}
                    />
                  ))}
                </Stack>

                <ChatTrendChart data={trendData} visibleSeries={visibleSeries} />
                <ChatTrendTable data={trendData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4.5 }} sx={{ alignSelf: 'flex-start' }}>
          <DashboardCard title="News & Tips" contentSx={{ p: 2.5 }}>
            <Stack spacing={2.5}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#1f8ed8',
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#37474f' }}>
                    What Does It Really Mean to Have an AI-Powered Customer Experience
                    Ecosystem?
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    mt: 1.5,
                    ml: 2,
                    p: 2,
                    borderRadius: 1,
                    minHeight: 128,
                    bgcolor: '#e7f2ef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 34,
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      color: '#2d4a8a',
                    }}
                  >
                    CX
                  </Typography>
                  <Typography
                    sx={{
                      mx: 2,
                      fontSize: 34,
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      color: '#2ca58d',
                    }}
                  >
                    AI
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 34,
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      color: '#3457b1',
                    }}
                  >
                    Ecosystem
                  </Typography>
                </Box>

                <Typography
                  sx={{ mt: 1.5, ml: 2, fontSize: 14, lineHeight: 1.65, color: '#607d8b' }}
                >
                  To help teams unify tools and deliver seamless, intelligent support
                  across every touchpoint, here&apos;s a quick look at what an
                  AI-powered customer experience ecosystem really means.{' '}
                  <Link underline="hover" component="button" type="button">
                    Read more
                  </Link>
                </Typography>
              </Box>

              {newsItems.map((item) => (
                <Stack key={item} direction="row" spacing={1} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#1f8ed8',
                      mt: 1.45,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: 14, lineHeight: 1.55, color: '#37474f' }}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </DashboardCard>
        </Grid>
      </Grid>
    </Page>
  )
}

export default DashboardPage
