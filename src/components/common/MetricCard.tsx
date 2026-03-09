import type { ReactNode } from 'react'
import { Card, CardContent, Stack, Typography } from '@mui/material'

type MetricCardProps = {
  title: string
  value: string | number
  caption?: string
  icon?: ReactNode
}

function MetricCard({ title, value, caption, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={1}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            {icon}
          </Stack>
          <Typography variant="h4" color="primary.main">
            {value}
          </Typography>
          {caption ? (
            <Typography variant="body2" color="text.secondary">
              {caption}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default MetricCard
