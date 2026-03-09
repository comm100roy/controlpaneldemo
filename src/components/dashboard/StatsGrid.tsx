import type { ReactNode } from 'react'
import { Grid, Typography } from '@mui/material'
import DashboardCard from '../common/DashboardCard'

export type StatItem = {
  label: string
  value: string | number
  caption?: string
}

type StatsGridProps = {
  title: string
  description?: string
  stats: StatItem[]
  actions?: ReactNode
}

function StatsGrid({ title, description, stats, actions }: StatsGridProps) {
  return (
    <DashboardCard title={title} description={description} actions={actions}>
      <Grid
        container
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {stats.map((stat, index) => (
          <Grid
            size={{ xs: 6, md: 12 / stats.length }}
            key={stat.label}
            sx={{
              textAlign: 'center',
              px: 2,
              py: 3,
              borderRight:
                index < stats.length - 1 ? '1px solid' : 'none',
              borderBottom: {
                xs: index < stats.length - 2 ? '1px solid' : 'none',
                md: 'none',
              },
              borderColor: 'divider',
            }}
          >
            <Typography variant="h4" color="text.primary">
              {stat.value}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              {stat.label}
            </Typography>
            {stat.caption ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: 'block' }}
              >
                {stat.caption}
              </Typography>
            ) : null}
          </Grid>
        ))}
      </Grid>
    </DashboardCard>
  )
}

export default StatsGrid
