import type { ReactNode } from 'react'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  alpha,
} from '@mui/material'
import AgentAvatar from '../common/AgentAvatar'

type AgentDetail = {
  label: string
  value: string
}

type AgentOverviewCardProps = {
  badge: string
  name: string
  description: string
  capabilities: string[]
  profile: AgentDetail[]
  status: AgentDetail[]
  action?: ReactNode
}

function AgentOverviewCard({
  badge,
  name,
  description,
  capabilities,
  profile,
  status,
  action,
}: AgentOverviewCardProps) {
  const nameDetail = profile[0]
  const languageDetail = profile[1]
  const channelDetail = status[0]
  const publishStatusDetail = status[1]

  const renderDetail = (label: string, value: string) => (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, color: 'text.primary' }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        color="text.primary"
        sx={{ mt: 0.4, fontWeight: 400 }}
      >
        {value}
      </Typography>
    </Box>
  )

  const renderCapability = (capability: string) => {
    const [prefix, ...rest] = capability.split(':')
    const description = rest.join(':').trim()

    return (
      <Typography variant="body2" color="text.secondary">
        • <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{prefix}:</Box>{' '}
        {description}
      </Typography>
    )
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5">{name}</Typography>
              <Chip color="success" label={badge} size="small" />
            </Stack>
            {action ?? (
              <Button variant="outlined" color="primary">
                Edit
              </Button>
            )}
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <AgentAvatar />
                {renderDetail(nameDetail?.label ?? 'Name', nameDetail?.value ?? '')}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDetail(languageDetail?.label ?? 'Language', languageDetail?.value ?? '')}
            </Grid>
          </Grid>

          {renderDetail('Description', description)}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDetail(channelDetail?.label ?? 'Channel', channelDetail?.value ?? '')}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDetail(
                publishStatusDetail?.label ?? 'Publish Status',
                publishStatusDetail?.value ?? '',
              )}
            </Grid>
          </Grid>

          <Box
            sx={{
              px: 2,
              py: 1.75,
              borderRadius: 2,
              backgroundColor: alpha('#16324f', 0.03),
              border: '1px solid',
              borderColor: alpha('#16324f', 0.08),
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LightbulbOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  These capabilities are built-in and always active. No configuration is needed.
                </Typography>
              </Stack>

              <Grid container spacing={1.5}>
                {capabilities.map((capability) => (
                  <Grid size={{ xs: 12, md: 6 }} key={capability}>
                    {renderCapability(capability)}
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AgentOverviewCard
