import type { ReactNode } from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { Alert, Card, CardContent, Link, Typography } from '@mui/material'

export function AiInsightsHelpLink({ label }: { label: string }) {
  return (
    <Link
      component="button"
      type="button"
      underline="hover"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.4,
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {label}
      <OpenInNewOutlinedIcon sx={{ fontSize: 15 }} />
    </Link>
  )
}

export function AiInsightsInfoBanner({ children }: { children: ReactNode }) {
  return (
    <Alert
      icon={<InfoOutlinedIcon fontSize="inherit" />}
      severity="info"
      sx={{
        alignItems: 'center',
        bgcolor: '#eef3f6',
        color: '#6b7c88',
        '& .MuiAlert-icon': {
          color: '#7e8b96',
          opacity: 1,
        },
        '& .MuiAlert-message': {
          py: 0,
          width: '100%',
        },
      }}
    >
      <Typography sx={{ fontSize: 14, color: 'inherit' }}>{children}</Typography>
    </Alert>
  )
}

export function AiInsightsPanel({ children }: { children: ReactNode }) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>{children}</CardContent>
    </Card>
  )
}
