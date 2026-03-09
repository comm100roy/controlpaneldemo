import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import SidebarNav from '../sidebar/SidebarNav'

const drawerWidth = 280

function AppShell() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const drawerContent = <SidebarNav onNavigate={() => setMobileOpen(false)} />

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
