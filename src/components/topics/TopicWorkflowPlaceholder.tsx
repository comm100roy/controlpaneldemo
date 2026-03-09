import { Box, Typography } from '@mui/material'

function TopicWorkflowPlaceholder() {
  return (
    <Box
      sx={{
        minHeight: 480,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: '#fbfcfd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Workflow editor placeholder. The node-based workflow builder will be added here next.
      </Typography>
    </Box>
  )
}

export default TopicWorkflowPlaceholder
