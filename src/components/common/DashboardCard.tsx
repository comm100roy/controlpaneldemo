import type { ReactNode } from 'react'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

type DashboardCardProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  contentSx?: object
  headerSx?: object
}

function DashboardCard({
  title,
  description,
  actions,
  children,
  contentSx,
  headerSx,
}: DashboardCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent
        sx={{
          p: { xs: 2.5, md: 3 },
          height: '100%',
          ...contentSx,
        }}
      >
        <Stack spacing={2.5} sx={{ height: '100%' }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            gap={2}
          >
            <Box sx={headerSx}>
              <Typography variant="h6">{title}</Typography>
              {description ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
            {actions ? <Box>{actions}</Box> : null}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default DashboardCard
