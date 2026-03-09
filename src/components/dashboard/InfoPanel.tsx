import type { ReactNode } from 'react'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

export type InfoPanelItem = {
  title: string
  description: string
  meta?: string
}

type InfoPanelProps = {
  title: string
  description?: string
  count?: number
  items: InfoPanelItem[]
  footer?: ReactNode
}

function InfoPanel({
  title,
  description,
  count,
  items,
  footer,
}: InfoPanelProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: '100%' }}>
        <Stack spacing={2.5} sx={{ height: '100%' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={1}
          >
            <Box>
              <Typography variant="h6">{title}</Typography>
              {description ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
            {count !== undefined ? <Chip label={count} size="small" /> : null}
          </Stack>

          <Stack spacing={2}>
            {items.map((item, index) => (
              <Box key={`${item.title}-${index}`}>
                <Typography variant="subtitle2">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {item.description}
                </Typography>
                {item.meta ? (
                  <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block' }}>
                    {item.meta}
                  </Typography>
                ) : null}
                {index < items.length - 1 ? <Divider sx={{ mt: 2 }} /> : null}
              </Box>
            ))}
          </Stack>

          {footer ? <Box sx={{ mt: 'auto' }}>{footer}</Box> : null}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default InfoPanel
