import { useMemo, useState } from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined'
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined'
import {
  alpha,
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SideDrawer from '../common/SideDrawer'

type AddFunctionsViaMcpDrawerProps = {
  open: boolean
  onClose: () => void
  onSuccess?: (message: string) => void
}

type DrawerMode = 'browse' | 'custom'

type MappedServer = {
  id: string
  name: string
  description: string
  color: string
  icon: typeof CloudOutlinedIcon
}

const mappedServers: MappedServer[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    description:
      'Access customer CRM profiles, manage Opportunities, and create support Cases directly from the agent conversation.',
    color: '#1b96ff',
    icon: CloudOutlinedIcon,
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    description:
      'Retrieve Knowledge Base articles, check Incident status, and create IT service requests for seamless support automation.',
    color: '#5ac84f',
    icon: SupportAgentOutlinedIcon,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description:
      'Sync contact details, track deal stages, and manage support tickets to align your sales and support efforts.',
    color: '#ff7a59',
    icon: HubOutlinedIcon,
  },
  {
    id: 'jira',
    name: 'Jira',
    description:
      'Search for existing issues, create bug reports, and update project statuses to bridge the gap between support and engineering.',
    color: '#2684ff',
    icon: TaskOutlinedIcon,
  },
  {
    id: 'dynamics-365',
    name: 'Dynamics 365',
    description:
      'Access enterprise ERP and CRM data, including sales orders, customer service records, and account activities.',
    color: '#163a7a',
    icon: SellOutlinedIcon,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description:
      'Retrieve real-time order status, check product inventory, and access customer purchase history for e-commerce support.',
    color: '#8db543',
    icon: ShoppingBagOutlinedIcon,
  },
]

function AddFunctionsViaMcpDrawer({
  open,
  onClose,
  onSuccess,
}: AddFunctionsViaMcpDrawerProps) {
  const [mode, setMode] = useState<DrawerMode>('browse')
  const [serverName, setServerName] = useState('My Custom MCP Server')
  const [sseUrl, setSseUrl] = useState('')
  const [authenticationKey, setAuthenticationKey] = useState('')

  const resetState = () => {
    setMode('browse')
    setServerName('My Custom MCP Server')
    setSseUrl('')
    setAuthenticationKey('')
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const canConnectCustomServer = useMemo(
    () => serverName.trim().length > 0 && sseUrl.trim().length > 0,
    [serverName, sseUrl],
  )

  const handleConnectMappedServer = (server: MappedServer) => {
    onSuccess?.(`${server.name} MCP server connected.`)
    handleClose()
  }

  const handleConnectCustomServer = () => {
    if (!canConnectCustomServer) {
      return
    }

    onSuccess?.(`${serverName.trim()} connected successfully.`)
    handleClose()
  }

  return (
    <SideDrawer
      open={open}
      onClose={handleClose}
      width={{ xs: '100%', lg: 960 }}
      title="Add Functions via MCP"
      titleDescription={
        <Typography variant="caption" sx={{ color: '#546E7A', lineHeight: '16px' }}>
          Connect to MCP servers to import functions into your AI Agent
        </Typography>
      }
    >
      {mode === 'browse' ? (
        <Stack spacing={1.5}>
          <Box
            role="button"
            tabIndex={0}
            onClick={() => setMode('custom')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setMode('custom')
              }
            }}
            sx={{
              border: '1px dashed',
              borderColor: alpha('#546E7A', 0.4),
              borderRadius: 1,
              px: 3,
              py: 3,
              bgcolor: '#fff',
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                variant="rounded"
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'transparent',
                  color: '#546E7A',
                }}
              >
                <AddOutlinedIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#263238', mb: 0.25 }}>
                  Custom MCP Server
                </Typography>
                <Typography variant="caption" sx={{ color: '#546E7A', lineHeight: '16px' }}>
                  Connect to any MCP-compliant server via URL. Use this to add third-party
                  public MCP servers or your own self-hosted tools.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 1.5,
            }}
          >
            {mappedServers.map((server) => {
              const ServerIcon = server.icon

              return (
                <Box
                  key={server.id}
                  sx={{
                    border: '1px solid #DEDEDE',
                    borderRadius: 1,
                    bgcolor: '#fff',
                    px: 3,
                    py: 3,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: alpha(server.color, 0.12),
                        color: server.color,
                      }}
                    >
                      <ServerIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ color: '#263238', mb: 0.25 }}>
                        {server.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#546E7A', lineHeight: '16px' }}>
                        {server.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="text"
                      color="inherit"
                      startIcon={<ArrowOutwardOutlinedIcon sx={{ fontSize: 18 }} />}
                      onClick={() => handleConnectMappedServer(server)}
                      sx={{
                        flexShrink: 0,
                        minWidth: 0,
                        px: 0,
                        color: '#546E7A',
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: '#263238',
                        },
                      }}
                    >
                      Connect
                    </Button>
                  </Stack>
                </Box>
              )
            })}
          </Box>
        </Stack>
      ) : (
        <Stack spacing={5}>
          <Stack spacing={0.75}>
            <TextField
              fullWidth
              required
              label="Server Name"
              value={serverName}
              onChange={(event) => setServerName(event.target.value)}
            />
            <TextField
              fullWidth
              required
              label="SSE URL"
              value={sseUrl}
              onChange={(event) => setSseUrl(event.target.value)}
            />
            <TextField
              fullWidth
              label="Authentication Key (Optional)"
              value={authenticationKey}
              onChange={(event) => setAuthenticationKey(event.target.value)}
            />
          </Stack>

          <Stack direction="row" spacing={3}>
            <Button
              variant="contained"
              onClick={handleConnectCustomServer}
              disabled={!canConnectCustomServer}
            >
              Connect Custom Server
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      )}
    </SideDrawer>
  )
}

export default AddFunctionsViaMcpDrawer
