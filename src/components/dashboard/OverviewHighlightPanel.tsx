import type { ReactNode } from 'react'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Link,
  Stack,
  Typography,
  alpha,
} from '@mui/material'
import DashboardCard from '../common/DashboardCard'

type OverviewHighlightPanelProps = {
  title: string
  description: string
  alertMessage?: string
  count?: number
  countLabel?: string
  countHref?: string
  countOnClick?: () => void
  links?: string[]
  footer?: ReactNode
  headerMinHeight?: number
}

function OverviewHighlightPanel({
  title,
  description,
  alertMessage,
  count,
  countLabel,
  countHref,
  countOnClick,
  links,
  footer,
  headerMinHeight,
}: OverviewHighlightPanelProps) {
  const countNode = countHref ? (
    <Link
      component={RouterLink}
      to={countHref}
      underline="none"
      color="primary.main"
      sx={{ fontSize: 40, fontWeight: 700, lineHeight: 1 }}
    >
      {count}
    </Link>
  ) : countOnClick ? (
    <Link
      component="button"
      type="button"
      onClick={countOnClick}
      underline="none"
      color="primary.main"
      sx={{
        p: 0,
        border: 0,
        background: 'transparent',
        fontSize: 40,
        fontWeight: 700,
        lineHeight: 1,
        cursor: 'pointer',
      }}
    >
      {count}
    </Link>
  ) : (
    <Typography sx={{ fontSize: 40, fontWeight: 700, lineHeight: 1, color: 'primary.main' }}>
      {count}
    </Typography>
  )

  return (
    <DashboardCard
      title={title}
      description={description}
      headerSx={headerMinHeight ? { minHeight: headerMinHeight } : undefined}
    >
      <Stack spacing={3} sx={{ height: '100%' }}>
        {alertMessage ? (
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderRadius: 2,
              backgroundColor: alpha('#16324f', 0.04),
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <LightbulbOutlinedIcon
                sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                {alertMessage}
              </Typography>
            </Stack>
          </Box>
        ) : null}

        {links ? (
          <Stack spacing={1.25} sx={{ pt: 0.5 }}>
            {links.map((item) => (
              <Typography
                key={item}
                component="div"
                sx={{
                  color: 'primary.main',
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                • {item}
              </Typography>
            ))}
          </Stack>
        ) : null}

        {count !== undefined && countLabel ? (
          <Box sx={{ mt: 'auto', pt: 1 }}>
            {countNode}
            <Typography
              variant="body2"
              sx={{
                mt: 1.25,
                fontWeight: 400,
                color: 'text.secondary',
              }}
            >
              {countLabel}
            </Typography>
          </Box>
        ) : null}

        {footer ? <Box sx={{ mt: 'auto' }}>{footer}</Box> : null}
      </Stack>
    </DashboardCard>
  )
}

export default OverviewHighlightPanel
