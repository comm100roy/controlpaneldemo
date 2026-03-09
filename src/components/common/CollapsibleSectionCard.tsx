import { useState, type ReactNode } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Card, CardContent, Collapse, IconButton, Stack, Typography } from '@mui/material'

type CollapsibleSectionCardProps = {
  title: string
  children: ReactNode
  defaultExpanded?: boolean
}

function CollapsibleSectionCard({
  title,
  children,
  defaultExpanded = true,
}: CollapsibleSectionCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack spacing={expanded ? 2 : 0}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontSize: 18, fontWeight: 700 }}>
              {title}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setExpanded((current) => !current)}
              sx={{ color: 'text.secondary' }}
            >
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Stack>
          <Collapse in={expanded}>{children}</Collapse>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default CollapsibleSectionCard
