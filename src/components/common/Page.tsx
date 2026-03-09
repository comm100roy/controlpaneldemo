import type { ReactNode } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Box, Stack, Typography } from '@mui/material'

type PageLayoutContext = {
  showMobileNavigationToggle?: boolean
  mobileNavigationButton?: ReactNode
}

type PageProps = {
  title: string
  description?: string
  actions?: ReactNode
  titleSuffix?: ReactNode
  belowDescription?: ReactNode
  children: ReactNode
}

function Page({
  title,
  description,
  actions,
  titleSuffix,
  belowDescription,
  children,
}: PageProps) {
  const layoutContext = useOutletContext<PageLayoutContext | undefined>()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="flex-start"
        gap={2}
      >
        <Stack spacing={1.5} sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            {layoutContext?.showMobileNavigationToggle
              ? layoutContext.mobileNavigationButton
              : null}
            <Typography variant="h4" color="text.primary">
              {title}
            </Typography>
            {titleSuffix}
          </Stack>
          {(description || belowDescription) ? (
            <Stack spacing={1.5} alignItems="flex-start">
              {description ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 760 }}
                >
                  {description}
                </Typography>
              ) : null}
              {belowDescription}
            </Stack>
          ) : null}
        </Stack>
        {actions ? <Box sx={{ alignSelf: { xs: 'flex-start', md: 'flex-start' } }}>{actions}</Box> : null}
      </Stack>
      {children}
    </Box>
  )
}

export default Page
