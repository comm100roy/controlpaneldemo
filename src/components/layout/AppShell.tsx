import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { getAiAgents } from '../../api/aiAgents'
import SidebarNav from '../sidebar/SidebarNav'
import type { AiAgentRecord } from '../../data/aiAgents'
import { getSiteIdFromPathname, resolveSiteId } from '../../data/routes'

const drawerWidth = 320

function AppShell() {
  const theme = useTheme()
  const location = useLocation()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aiAgents, setAiAgents] = useState<AiAgentRecord[]>([])
  const [aiAgentsLoading, setAiAgentsLoading] = useState(true)
  const [aiAgentsError, setAiAgentsError] = useState<string | null>(null)
  const siteId = useMemo(
    () => resolveSiteId(getSiteIdFromPathname(location.pathname)),
    [location.pathname],
  )

  useEffect(() => {
    let cancelled = false

    const loadAiAgents = async () => {
      setAiAgentsLoading(true)
      setAiAgentsError(null)

      try {
        const nextAiAgents = await getAiAgents(siteId)

        if (!cancelled) {
          setAiAgents(nextAiAgents)
        }
      } catch (error) {
        if (!cancelled) {
          setAiAgents([])
          setAiAgentsError(error instanceof Error ? error.message : 'Failed to load AI agents.')
        }
      } finally {
        if (!cancelled) {
          setAiAgentsLoading(false)
        }
      }
    }

    void loadAiAgents()

    return () => {
      cancelled = true
    }
  }, [siteId])

  const drawerContent = (
    <SidebarNav
      onNavigate={() => setMobileOpen(false)}
      aiAgents={aiAgents}
      aiAgentsLoading={aiAgentsLoading}
      aiAgentsError={aiAgentsError}
      onCreateAiAgent={(agent) => setAiAgents((current) => [agent, ...current])}
      onUpdateAiAgent={(agent) =>
        setAiAgents((current) =>
          current.map((currentAgent) => (currentAgent.id === agent.id ? agent : currentAgent)),
        )
      }
      onDeleteAiAgent={(agentId) =>
        setAiAgents((current) => current.filter((agent) => agent.id !== agentId))
      }
    />
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="nav"
        sx={{
          width: { lg: drawerWidth },
          flexShrink: { lg: 0 },
        }}
      >
        {isDesktop ? (
          <Drawer
            variant="permanent"
            open
            PaperProps={{
              sx: {
                width: drawerWidth,
                border: 0,
                borderRadius: 0,
                boxShadow: 'none',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
              sx: {
                width: drawerWidth,
                border: 0,
                borderRadius: 0,
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet
            context={{
              showMobileNavigationToggle: !isDesktop,
              openMobileNavigation: () => setMobileOpen(true),
              aiAgents,
              aiAgentsLoading,
              aiAgentsError,
              mobileNavigationButton: (
                <IconButton color="primary" onClick={() => setMobileOpen(true)}>
                  <MenuIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default AppShell
