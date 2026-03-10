import { useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'
import CircleRoundedIcon from '@mui/icons-material/CircleRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import {
  alpha,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import AiAgentManagementDrawer from './AiAgentManagementDrawer'
import {
  defaultAiAgentId,
  type AiAgentRecord,
} from '../../data/aiAgents'
import {
  avatarMenuActions,
  getLevel1Navigation,
  sidebarLogo,
} from '../../data/navigation'
import {
  getAppRoutes,
  getSiteIdFromPathname,
  level1Segments,
  resolveAiAgentId,
  stripSitePrefix,
} from '../../data/routes'

type SidebarNavProps = {
  onNavigate?: () => void
  aiAgents: AiAgentRecord[]
  aiAgentsLoading: boolean
  aiAgentsError: string | null
  onCreateAiAgent: (agent: AiAgentRecord) => Promise<AiAgentRecord>
  onUpdateAiAgent: (agent: AiAgentRecord) => Promise<AiAgentRecord>
  onDeleteAiAgent: (agentId: string) => Promise<void>
}

const channelAccentColors = [
  '#1d9bf0',
  '#1877f2',
  '#34b7f1',
  '#25d366',
  '#26a5e4',
  '#5f6aff',
]

function SidebarNav({
  onNavigate,
  aiAgents,
  aiAgentsLoading,
  aiAgentsError,
  onCreateAiAgent,
  onUpdateAiAgent,
  onDeleteAiAgent,
}: SidebarNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const siteId = useMemo(() => getSiteIdFromPathname(location.pathname), [location.pathname])
  const appRoutes = useMemo(() => getAppRoutes(siteId), [siteId])
  const level1Navigation = useMemo(() => getLevel1Navigation(siteId), [siteId])
  const [avatarAnchor, setAvatarAnchor] = useState<null | HTMLElement>(null)
  const [aiAgentAnchor, setAiAgentAnchor] = useState<null | HTMLElement>(null)
  const [isAiAgentManagementDrawerOpen, setIsAiAgentManagementDrawerOpen] = useState(false)
  const [aiAgentManagementDrawerSession, setAiAgentManagementDrawerSession] = useState(0)
  const pathSegments = useMemo(
    () => stripSitePrefix(location.pathname).split('/').filter(Boolean),
    [location.pathname],
  )
  const primaryRailItems = useMemo(
    () => level1Navigation.filter((item) => item.railSection !== 'secondary'),
    [level1Navigation],
  )
  const secondaryRailItems = useMemo(
    () => level1Navigation.filter((item) => item.railSection === 'secondary'),
    [level1Navigation],
  )
  const activeLevel1 =
    level1Navigation.find((item) => item.segment === pathSegments[0]) ??
    level1Navigation.find((item) => item.segment === level1Segments.ai) ??
    level1Navigation[0]
  const activeLevel2 =
    activeLevel1.items.find((item) => item.segment === pathSegments[1]) ??
    activeLevel1.items[0]
  const activeLevel3Segment =
    activeLevel1.segment === level1Segments.ai && activeLevel2.segment === 'aiagent'
      ? pathSegments[3] === 'learning'
        ? pathSegments[4]
        : pathSegments[3] === 'overview' && pathSegments[4] === 'instructions'
          ? 'overview'
          : pathSegments[3]
      : pathSegments[2]
  const aiAgentIdFromPath =
    activeLevel1.segment === level1Segments.ai && activeLevel2.segment === 'aiagent'
      ? resolveAiAgentId(pathSegments[2])
      : defaultAiAgentId
  const currentAiAgent = aiAgents.find((agent) => agent.id === aiAgentIdFromPath) ?? aiAgents[0] ?? null
  const currentAiAgentRouteId = currentAiAgent?.id ?? defaultAiAgentId
  const currentAiAgentLabel = aiAgentsLoading
    ? 'Loading AI Agents'
    : aiAgentsError
      ? 'AI Agents Unavailable'
      : currentAiAgent?.name ?? 'No AI Agents'

  const resolveAiAgentChildPath = (segment: string) => {
    switch (segment) {
      case 'overview':
        return appRoutes.ai.aiAgentOverview(currentAiAgentRouteId)
      case 'knowledge':
        return appRoutes.ai.aiAgentKnowledge(currentAiAgentRouteId)
      case 'topics':
        return appRoutes.ai.aiAgentTopics(currentAiAgentRouteId)
      case 'events':
        return appRoutes.ai.aiAgentEvents(currentAiAgentRouteId)
      case 'functions':
        return appRoutes.ai.aiAgentFunctions(currentAiAgentRouteId)
      case 'learning':
        return appRoutes.ai.aiAgentLearning(currentAiAgentRouteId)
      case 'unanswered-questions':
        return appRoutes.ai.aiAgentLearningUnansweredQuestions(currentAiAgentRouteId)
      case 'thumbs-down-answers':
        return appRoutes.ai.aiAgentLearningThumbsDownAnswers(currentAiAgentRouteId)
      case 'instructions':
        return appRoutes.ai.aiAgentInstructions(currentAiAgentRouteId)
      default:
        return appRoutes.ai.aiAgentOverview(currentAiAgentRouteId)
    }
  }

  const handleOpenAvatarMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarAnchor(event.currentTarget)
  }

  const handleCloseAvatarMenu = () => {
    setAvatarAnchor(null)
  }

  const handleOpenAiAgentPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAiAgentAnchor(event.currentTarget)
  }

  const handleCloseAiAgentPopover = () => {
    setAiAgentAnchor(null)
  }

  const handleOpenAiAgentManagementDrawer = () => {
    handleCloseAiAgentPopover()
    setAiAgentManagementDrawerSession((current) => current + 1)
    setIsAiAgentManagementDrawerOpen(true)
  }

  const handleCloseAiAgentManagementDrawer = () => {
    setIsAiAgentManagementDrawerOpen(false)
  }

  const handleCreateAiAgent = async (agent: AiAgentRecord) => {
    const createdAgent = await onCreateAiAgent(agent)
    navigate(appRoutes.ai.aiAgentOverview(createdAgent.id))
    return createdAgent
  }

  const handleUpdateAiAgent = async (agent: AiAgentRecord) => {
    return onUpdateAiAgent(agent)
  }

  const handleDeleteAiAgent = async (agentId: string) => {
    if (aiAgents.length <= 1) {
      return
    }

    const remaining = aiAgents.filter((agent) => agent.id !== agentId)
    await onDeleteAiAgent(agentId)

    if (currentAiAgentRouteId === agentId && remaining[0]) {
      navigate(appRoutes.ai.aiAgentOverview(remaining[0].id))
    }
  }

  return (
    <Box
      sx={{
        height: '100%',
        color: '#d9e9ff',
        background:
          'linear-gradient(180deg, #082d53 0%, #062244 45%, #03172f 100%)',
      }}
    >
      <Stack direction="row" sx={{ height: '100%' }}>
        <Stack
          justifyContent="space-between"
          sx={{
            width: 60,
            px: 1,
            py: 1.25,
            borderRight: `1px solid ${alpha('#ffffff', 0.08)}`,
          }}
        >
          <Stack spacing={1.5} alignItems="center">
            <Tooltip title={sidebarLogo.label} placement="right">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha('#56c1ff', 0.14),
                  color: '#7ad2ff',
                }}
              >
                {sidebarLogo.icon}
              </Box>
            </Tooltip>

            <List disablePadding sx={{ width: '100%' }}>
              {primaryRailItems.map((item) => {
                const selected = item.segment === activeLevel1.segment

                return (
                  <Tooltip key={item.segment} title={item.label} placement="right">
                    <ListItemButton
                      component={NavLink}
                      to={item.path}
                      onClick={onNavigate}
                      sx={{
                        width: 46,
                        minWidth: 46,
                        height: 46,
                        mb: 0.75,
                        mx: 'auto',
                        borderRadius: '50%',
                        justifyContent: 'center',
                        px: 0,
                        color: selected ? 'common.white' : alpha('#d9e9ff', 0.84),
                        backgroundColor: selected
                          ? alpha('#2f84ff', 0.28)
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: alpha('#ffffff', 0.08),
                          borderRadius: '50%',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          color: 'inherit',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                )
              })}
            </List>
          </Stack>

          <Stack spacing={1} alignItems="center">
            <List disablePadding sx={{ width: '100%' }}>
              {secondaryRailItems.map((item) => {
                const selected = item.segment === activeLevel1.segment

                return (
                  <Tooltip key={item.segment} title={item.label} placement="right">
                    <ListItemButton
                      component={NavLink}
                      to={item.path}
                      onClick={onNavigate}
                      sx={{
                        width: 46,
                        minWidth: 46,
                        height: 46,
                        mb: 0.75,
                        mx: 'auto',
                        borderRadius: '50%',
                        justifyContent: 'center',
                        px: 0,
                        color: selected ? 'common.white' : alpha('#d9e9ff', 0.84),
                        backgroundColor: selected
                          ? alpha('#2f84ff', 0.28)
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: alpha('#ffffff', 0.08),
                          borderRadius: '50%',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          color: 'inherit',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                )
              })}
            </List>

            <Tooltip title="Agent avatar" placement="right">
              <IconButton
                onClick={handleOpenAvatarMenu}
                sx={{
                  width: 44,
                  height: 44,
                  color: 'common.white',
                  bgcolor: alpha('#ffffff', 0.12),
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.18),
                  },
                }}
              >
                <Avatar sx={{ width: 34, height: 34, bgcolor: alpha('#ffffff', 0.18) }}>
                  A
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box
            sx={{
              px: 2.5,
              py: 2.25,
              borderBottom: `1px solid ${alpha('#ffffff', 0.08)}`,
            }}
          >
            <Typography variant="subtitle1" color="common.white">
              {activeLevel1.menuTitle ?? activeLevel1.label}
            </Typography>
            {activeLevel1.menuSubtitle ? (
              <Typography variant="caption" sx={{ color: alpha('#d9e9ff', 0.72) }}>
                {activeLevel1.menuSubtitle}
              </Typography>
            ) : null}
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              minHeight: 0,
              px: 1.25,
              py: 1.5,
              overflowY: 'auto',
            }}
          >
            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {activeLevel1.items.map((item) => {
                const selected = item.segment === activeLevel2.segment
                const hasChildren = Boolean(item.children?.length)
                const showLevel2Highlight = selected && !hasChildren
                const itemPath =
                  item.segment === 'aiagent'
                    ? appRoutes.ai.aiAgentOverview(currentAiAgentRouteId)
                    : item.path

                return (
                  <Box key={item.segment}>
                    <ListItemButton
                      component={NavLink}
                      to={itemPath}
                      onClick={onNavigate}
                      sx={{
                        minHeight: 42,
                        borderRadius: 2,
                        color: selected ? 'common.white' : '#d9e9ff',
                        backgroundColor: showLevel2Highlight
                          ? alpha('#ffffff', 0.1)
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: alpha('#ffffff', 0.08),
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: showLevel2Highlight ? 700 : 500,
                        }}
                      />
                      {hasChildren ? (
                        <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                          <ChevronRightOutlinedIcon
                            fontSize="small"
                            sx={{
                              transform: selected ? 'rotate(-90deg)' : 'rotate(90deg)',
                              transition: 'transform 0.2s ease',
                            }}
                          />
                        </Box>
                      ) : null}
                    </ListItemButton>

                    <Collapse
                      in={selected && hasChildren}
                      timeout={220}
                      easing={{
                        enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      unmountOnExit
                    >
                      <Box sx={{ mt: 0.75, mb: 0.5, ml: 1.5, mr: 0.25 }}>
                        {item.segment === 'aiagent' ? (
                          <ButtonBase
                            onClick={handleOpenAiAgentPopover}
                            aria-haspopup="dialog"
                            aria-expanded={Boolean(aiAgentAnchor)}
                            sx={{
                              width: '100%',
                              mb: 1,
                              px: 1.25,
                              py: 1,
                              borderRadius: 1.5,
                              backgroundColor: alpha('#ffffff', 0.08),
                              border: `1px solid ${alpha('#ffffff', 0.08)}`,
                              textAlign: 'left',
                              justifyContent: 'stretch',
                              '&:hover': {
                                backgroundColor: alpha('#ffffff', 0.12),
                              },
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1.25}
                              alignItems="center"
                              justifyContent="space-between"
                              sx={{ width: '100%' }}
                            >
                              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                                <Avatar
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    bgcolor: alpha('#7ad2ff', 0.18),
                                    color: '#7ad2ff',
                                  }}
                                >
                                  <SmartToyOutlinedIcon fontSize="small" />
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography
                                    variant="subtitle2"
                                    color="common.white"
                                    noWrap
                                  >
                                    {currentAiAgentLabel}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Avatar
                                sx={{
                                  width: 22,
                                  height: 22,
                                  bgcolor: 'transparent',
                                  color: alpha('#d9e9ff', 0.9),
                                }}
                              >
                                <KeyboardArrowDownRoundedIcon
                                  fontSize="small"
                                  sx={{
                                    transform: aiAgentAnchor ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.2s ease',
                                  }}
                                />
                              </Avatar>
                            </Stack>
                          </ButtonBase>
                        ) : null}

                        <List disablePadding>
                          {item.children?.map((child) => {
                            if (child.kind === 'section') {
                              return (
                                <Typography
                                  key={child.segment}
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    mt: 1,
                                    mb: 0.5,
                                    px: 1.5,
                                    color: alpha('#d9e9ff', 0.58),
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {child.label}
                                </Typography>
                              )
                            }

                            const childSelected = child.segment === activeLevel3Segment
                            const childPath =
                              item.segment === 'aiagent'
                                ? resolveAiAgentChildPath(child.segment)
                                : child.path ?? '#'

                            return (
                              <ListItemButton
                                component={NavLink}
                                to={childPath}
                                key={child.segment}
                                onClick={onNavigate}
                                sx={{
                                  minHeight: 38,
                                  mb: 0.25,
                                  borderRadius: 2,
                                  color: childSelected
                                    ? 'common.white'
                                    : alpha('#d9e9ff', 0.82),
                                  backgroundColor: childSelected
                                    ? alpha('#2f84ff', 0.25)
                                    : 'transparent',
                                  '&:hover': {
                                    backgroundColor: alpha('#ffffff', 0.08),
                                  },
                                  '&::before': childSelected
                                    ? {
                                        content: '""',
                                        width: 3,
                                        height: 22,
                                        borderRadius: 3,
                                        backgroundColor: '#85dbff',
                                        position: 'absolute',
                                        left: 6,
                                      }
                                    : undefined,
                                }}
                              >
                                <ListItemText
                                  primary={child.label}
                                  primaryTypographyProps={{
                                    fontSize: 14,
                                    fontWeight: childSelected ? 700 : 500,
                                  }}
                                />
                              </ListItemButton>
                            )
                          })}
                        </List>
                      </Box>
                    </Collapse>
                  </Box>
                )
              })}
            </List>
          </Box>
        </Stack>
      </Stack>

      <Menu
        anchorEl={avatarAnchor}
        open={Boolean(avatarAnchor)}
        onClose={handleCloseAvatarMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 280,
              borderRadius: 2,
              mt: 0.875,
              ml: 1,
              boxShadow: '0 16px 36px rgba(15, 23, 42, 0.2)',
            },
          },
        }}
      >
        <Box sx={{ px: 2.25, py: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 42, height: 42 }}>A</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                agent2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                agent2@e2e.com
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Divider />
        {avatarMenuActions.map((action) => (
          <MenuItem key={action.label} onClick={handleCloseAvatarMenu} sx={{ py: 1.5 }}>
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText>{action.label}</ListItemText>
            {action.external ? (
              <OpenInNewOutlinedIcon fontSize="small" color="disabled" />
            ) : null}
          </MenuItem>
        ))}
      </Menu>

      <Popover
        open={Boolean(aiAgentAnchor)}
        anchorEl={aiAgentAnchor}
        onClose={handleCloseAiAgentPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              ml: 0.5,
              width: { xs: 'calc(100vw - 32px)', md: 780 },
              maxWidth: 'calc(100vw - 32px)',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 22px 44px rgba(15, 23, 42, 0.18)',
            },
          },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: 'divider', display: { xs: 'none', md: 'block' } }}
            />
          }
        >
          <Box sx={{ flex: 1, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Select your current AI Agent
            </Typography>

            <Box
              sx={{
                mt: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                overflow: 'hidden',
                backgroundColor: 'background.paper',
              }}
            >
              {aiAgentsLoading ? (
                <Box sx={{ px: 2, py: 2.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading AI agents...
                  </Typography>
                </Box>
              ) : aiAgentsError ? (
                <Box sx={{ px: 2, py: 2.5 }}>
                  <Typography variant="body2" color="error.main">
                    {aiAgentsError}
                  </Typography>
                </Box>
              ) : aiAgents.length === 0 ? (
                <Box sx={{ px: 2, py: 2.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    No AI agents are available for this site.
                  </Typography>
                </Box>
              ) : (
                aiAgents.map((agent, index) => {
                  const selectedAgent = agent.id === currentAiAgent?.id

                  return (
                    <Box key={agent.id}>
                      <ButtonBase
                        onClick={() => {
                          handleCloseAiAgentPopover()
                          navigate(appRoutes.ai.aiAgentOverview(agent.id))
                          onNavigate?.()
                        }}
                        sx={{
                          width: '100%',
                          px: 2,
                          py: 1.5,
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          backgroundColor: selectedAgent
                            ? alpha('#1976d2', 0.06)
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: alpha('#1976d2', 0.05),
                          },
                        }}
                      >
                        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 22,
                              height: 22,
                              fontSize: 11,
                              bgcolor: selectedAgent ? '#0d7bdc' : '#607d8b',
                            }}
                          >
                            {agent.name.slice(0, 1)}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: selectedAgent ? 700 : 500,
                              color: selectedAgent ? 'primary.main' : 'text.primary',
                            }}
                          >
                            {agent.name}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={0.4} alignItems="center">
                          {agent.channelKinds.map((kind, channelIndex) =>
                            kind === 'chat' ? (
                              <ChatBubbleOutlineOutlinedIcon
                                key={`${agent.id}-chat-${channelIndex}`}
                                sx={{
                                  fontSize: 16,
                                  color: selectedAgent ? '#9ccc65' : '#1d9bf0',
                                }}
                              />
                            ) : (
                              <CircleRoundedIcon
                                key={`${agent.id}-dot-${channelIndex}`}
                                sx={{
                                  fontSize: 12,
                                  color:
                                    channelAccentColors[
                                      channelIndex % channelAccentColors.length
                                    ],
                                }}
                              />
                            ),
                          )}
                        </Stack>
                      </ButtonBase>
                      {index < aiAgents.length - 1 ? <Divider /> : null}
                    </Box>
                  )
                })
              )}
            </Box>
          </Box>

          <Box
            sx={{
              width: { xs: '100%', md: 260 },
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              textAlign: 'center',
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, fontWeight: 700 }}
            >
              Manage AI Agents
            </Typography>
            <Avatar
              variant="rounded"
              sx={{
                width: 96,
                height: 96,
                bgcolor: alpha('#0f172a', 0.04),
                color: alpha('#0f172a', 0.35),
              }}
            >
              <ManageAccountsOutlinedIcon sx={{ fontSize: 54 }} />
            </Avatar>
            <Button variant="outlined" onClick={handleOpenAiAgentManagementDrawer}>
              Manage
            </Button>
          </Box>
        </Stack>
      </Popover>
      <AiAgentManagementDrawer
        key={aiAgentManagementDrawerSession}
        open={isAiAgentManagementDrawerOpen}
        onClose={handleCloseAiAgentManagementDrawer}
        agents={aiAgents}
        loading={aiAgentsLoading}
        error={aiAgentsError}
        onCreateAgent={handleCreateAiAgent}
        onUpdateAgent={handleUpdateAiAgent}
        onDeleteAgent={handleDeleteAiAgent}
      />
    </Box>
  )
}

export default SidebarNav
