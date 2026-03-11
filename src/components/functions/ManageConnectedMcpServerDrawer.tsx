import { useMemo, useState } from 'react'
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import LinkOffOutlinedIcon from '@mui/icons-material/LinkOffOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
import {
  alpha,
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import SideDrawer from '../common/SideDrawer'
import FeatureSwitch from '../common/FeatureSwitch'
import type { ConnectedMcpServer } from '../../data/dashboard'

type ManageConnectedMcpServerDrawerProps = {
  open: boolean
  servers: ConnectedMcpServer[]
  initialServerId?: string | null
  onClose: () => void
  onSuccess?: (message: string) => void
}

const serverVisuals: Record<
  string,
  { color: string; icon: typeof CloudOutlinedIcon }
> = {
  salesforce: {
    color: '#1b96ff',
    icon: CloudOutlinedIcon,
  },
  servicenow: {
    color: '#5ac84f',
    icon: SupportAgentOutlinedIcon,
  },
  hubspot: {
    color: '#ff7a59',
    icon: HubOutlinedIcon,
  },
}

function ManageConnectedMcpServerDrawer({
  open,
  servers,
  initialServerId = null,
  onClose,
  onSuccess,
}: ManageConnectedMcpServerDrawerProps) {
  const [activeServerId, setActiveServerId] = useState<string | null>(initialServerId)
  const [enabledByServerId, setEnabledByServerId] = useState<
    Record<string, Record<string, boolean>>
  >(
    () =>
      Object.fromEntries(
        servers.map((server) => [
          server.id,
          Object.fromEntries(server.functions.map((definition) => [definition.id, definition.enabled])),
        ]),
      ),
  )

  const activeServer = useMemo(
    () => servers.find((server) => server.id === activeServerId) ?? null,
    [activeServerId, servers],
  )

  const getEnabledFunctionCount = (serverId: string) =>
    Object.values(enabledByServerId[serverId] ?? {}).filter(Boolean).length

  const getVisibleFunctionCount = (server: ConnectedMcpServer) => server.functions.length

  const handleOpenServer = (serverId: string) => {
    setActiveServerId(serverId)
  }

  const handleToggleFunction = (functionId: string, enabled: boolean) => {
    if (!activeServer) {
      return
    }

    setEnabledByServerId((current) => ({
      ...current,
      [activeServer.id]: {
        ...current[activeServer.id],
        [functionId]: enabled,
      },
    }))
  }

  const handleSave = () => {
    if (!activeServer) {
      return
    }

    onSuccess?.(`${activeServer.name} re-synced successfully.`)
    onClose()
  }

  const handleDisconnect = () => {
    if (!activeServer) {
      return
    }

    onSuccess?.(`${activeServer.name} disconnected successfully.`)
    onClose()
  }

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      width={{ xs: '100%', lg: 960 }}
      title={activeServer ? activeServer.name : 'Manage Connected MCP Servers'}
      titleDescription={
        activeServer
          ? 'Manage MCP server and functions'
          : 'Manage connected Model Context Protocol servers'
      }
      titleActions={
        activeServer ? (
          <Button
            variant="text"
            color="inherit"
            startIcon={<LinkOffOutlinedIcon fontSize="small" />}
            onClick={handleDisconnect}
            sx={{
              color: '#F44336',
              whiteSpace: 'nowrap',
              px: 1,
              alignSelf: 'flex-start',
              '&:hover': {
                bgcolor: alpha('#F44336', 0.08),
                color: '#D32F2F',
              },
            }}
          >
            Disconnect Server
          </Button>
        ) : null
      }
    >
      {activeServer ? (
        <Stack spacing={5}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
              gap: 1.5,
            }}
          >
            {[
              { label: 'Status', value: activeServer.status },
              { label: 'Authentication', value: activeServer.authentication },
              {
                label: 'Total Functions',
                value: String(getVisibleFunctionCount(activeServer)),
              },
              {
                label: 'Enabled Functions',
                value: String(getEnabledFunctionCount(activeServer.id)),
              },
            ].map((item) => (
              <Box key={item.label}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: '#263238', mb: 0.5 }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      item.label === 'Status' && item.value === 'Connected'
                        ? '#25A51A'
                        : 'text.secondary',
                    fontWeight: item.label === 'Status' ? 600 : 400,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Stack spacing={1.5}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#263238' }}>
                Functions
              </Typography>
              <Typography variant="caption" sx={{ color: '#546E7A', lineHeight: '16px' }}>
                Enable or disable specific functions from this MCP server for the current
                AI Agent
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                gap: 1.5,
              }}
            >
              {activeServer.functions.map((definition) => (
                <Box
                  key={definition.id}
                  sx={{
                    border: '1px solid #DEDEDE',
                    borderRadius: 1,
                    bgcolor: '#fff',
                    px: 1.5,
                    py: 1.5,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: '#263238', mb: 0.25 }}
                      >
                        {definition.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: '#546E7A', lineHeight: '16px' }}
                      >
                        {definition.description}
                      </Typography>
                    </Box>
                    <FeatureSwitch
                      checked={enabledByServerId[activeServer.id]?.[definition.id] ?? false}
                      onChange={(event) =>
                        handleToggleFunction(definition.id, event.target.checked)
                      }
                    />
                  </Stack>
                </Box>
              ))}
            </Box>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Button variant="outlined" onClick={handleSave}>
              Re-sync
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 1.5,
          }}
        >
          {servers.map((server) => {
            const visual = serverVisuals[server.id] ?? serverVisuals.servicenow
            const ServerIcon = visual.icon

            return (
              <Box
                key={server.id}
                sx={{
                  border: '1px solid #DEDEDE',
                  borderRadius: 1,
                  bgcolor: '#fff',
                  px: 3,
                  py: 2.5,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: alpha(visual.color, 0.12),
                      color: visual.color,
                    }}
                  >
                    <ServerIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ color: '#263238' }}>
                      {server.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#546E7A', lineHeight: '16px' }}>
                      {getEnabledFunctionCount(server.id)}/{getVisibleFunctionCount(server)} functions enabled
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenServer(server.id)}
                    aria-label={`Manage ${server.name}`}
                  >
                    <SettingsOutlinedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            )
          })}
        </Box>
      )}
    </SideDrawer>
  )
}

export default ManageConnectedMcpServerDrawer
