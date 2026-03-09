import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import {
  alpha,
  Avatar,
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { navigationItems } from '../../data/navigation'

type SidebarNavProps = {
  onNavigate?: () => void
}

function SidebarNav({ onNavigate }: SidebarNavProps) {
  const location = useLocation()
  const isAiAgentRoute = useMemo(
    () => location.pathname.startsWith('/ai-agent'),
    [location.pathname],
  )
  const [agentMenuExpanded, setAgentMenuExpanded] = useState(isAiAgentRoute)
  const openAgentMenu = isAiAgentRoute || agentMenuExpanded

  return (
    <Box
      sx={{
        height: '100%',
        color: '#d9e9ff',
        background:
          'linear-gradient(180deg, #082d53 0%, #062244 45%, #03172f 100%)',
      }}
    >
      <Stack spacing={3} sx={{ p: 2.5, height: '100%' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              bgcolor: alpha('#56c1ff', 0.14),
              color: '#7ad2ff',
              width: 42,
              height: 42,
            }}
          >
            AI
          </Avatar>
          <Box>
            <Typography variant="subtitle1" color="common.white">
              AI & Automation
            </Typography>
            <Typography variant="caption" sx={{ color: alpha('#d9e9ff', 0.72) }}>
              Demo control panel
            </Typography>
          </Box>
        </Stack>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navigationItems.map((item) => {
            if (item.children) {
              return (
                <Box key={item.label}>
                  <ListItemButton
                    onClick={() => setAgentMenuExpanded((current) => !current)}
                    sx={{
                      borderRadius: 2,
                      color: '#d9e9ff',
                      '&:hover': {
                        backgroundColor: alpha('#ffffff', 0.08),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    {openAgentMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemButton>

                  <Collapse in={openAgentMenu} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        my: 1.5,
                        ml: 1.25,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: alpha('#ffffff', 0.08),
                        border: `1px solid ${alpha('#ffffff', 0.08)}`,
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            bgcolor: alpha('#7ad2ff', 0.18),
                            color: '#7ad2ff',
                          }}
                        >
                          <SmartToyOutlinedIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" color="common.white">
                            Eddy
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: alpha('#d9e9ff', 0.72) }}
                          >
                            Primary live chat agent
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <List disablePadding sx={{ ml: 1.5 }}>
                      {item.children.map((child) => {
                        const selected = child.to === location.pathname

                        return (
                          <ListItemButton
                            component={NavLink}
                            to={child.to ?? '/dashboard'}
                            key={child.label}
                            onClick={onNavigate}
                            sx={{
                              minHeight: 40,
                              mb: 0.5,
                              borderRadius: 2,
                              color: selected ? 'common.white' : alpha('#d9e9ff', 0.8),
                              backgroundColor: selected
                                ? alpha('#2f84ff', 0.25)
                                : 'transparent',
                              '&:hover': {
                                backgroundColor: alpha('#ffffff', 0.08),
                              },
                              '&::before': selected
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
                                fontWeight: selected ? 700 : 500,
                                pl: selected ? 1.5 : 0,
                              }}
                            />
                          </ListItemButton>
                        )
                      })}
                    </List>
                  </Collapse>
                </Box>
              )
            }

            const selected = item.to === location.pathname

            return (
              <ListItemButton
                component={NavLink}
                to={item.to ?? '/dashboard'}
                key={item.label}
                onClick={onNavigate}
                sx={{
                  borderRadius: 2,
                  color: selected ? 'common.white' : '#d9e9ff',
                  backgroundColor: selected ? alpha('#ffffff', 0.1) : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.08),
                  },
                }}
              >
                {item.icon ? (
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                ) : null}
                <ListItemText primary={item.label} />
              </ListItemButton>
            )
          })}
        </List>
      </Stack>
    </Box>
  )
}

export default SidebarNav
