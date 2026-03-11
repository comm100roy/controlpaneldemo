import type { ReactNode } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Drawer, Stack, Typography } from '@mui/material'

type SideDrawerProps = {
  open: boolean
  title: ReactNode
  onClose: () => void
  children: ReactNode
  width?: number | string | { xs?: string | number; sm?: string | number; md?: string | number; lg?: string | number; xl?: string | number }
  titleActions?: ReactNode
  titleDescription?: ReactNode
}

function SideDrawer({
  open,
  title,
  onClose,
  children,
  width,
  titleActions,
  titleDescription,
}: SideDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      transitionDuration={{ enter: 360, exit: 240 }}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        transition: {
          appear: true,
        },
      }}
      PaperProps={{
        sx: {
          width: width ?? { xs: '100%', lg: 960 },
          borderRadius: 0,
          border: 0,
          boxShadow: 'none',
          p: 2.5,
        },
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Button
            variant="text"
            color="inherit"
            onClick={onClose}
            startIcon={<CloseIcon fontSize="small" />}
            sx={{
              px: 0,
              minWidth: 0,
              fontSize: 10,
              color: 'text.secondary',
              letterSpacing: '0.08em',
            }}
          >
            CLOSE
          </Button>
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            {typeof title === 'string' ? (
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
            ) : (
              title
            )}
            {titleDescription ? (
              typeof titleDescription === 'string' ? (
                <Typography variant="body2" color="text.secondary">
                  {titleDescription}
                </Typography>
              ) : (
                titleDescription
              )
            ) : null}
          </Stack>
          {titleActions}
        </Stack>

        {children}
      </Stack>
    </Drawer>
  )
}

export default SideDrawer
