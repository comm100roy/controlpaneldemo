import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined'
import { Box, Button, Stack, Typography } from '@mui/material'
import SideDrawer from '../common/SideDrawer'

type NewFileContentDrawerProps = {
  open: boolean
  onClose: () => void
}

function NewFileContentDrawer({ open, onClose }: NewFileContentDrawerProps) {
  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="New Content - File"
      width={{ xs: '100%', sm: 540 }}
    >
      <Stack spacing={3}>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 470, lineHeight: 1.5 }}>
          Content is the information resources AI Agent fetches and utilizes to interact with
          your visitors. Upload data files to enable the AI Agent to access relevant and up-to-date
          content.
        </Typography>

        <Box
          sx={{
            border: '1px dashed',
            borderColor: '#d5dadd',
            borderRadius: 1,
            bgcolor: '#fafafa',
            px: 3,
            py: 5.5,
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
            <Box sx={{ position: 'relative', width: 92, height: 78, flexShrink: 0 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 20,
                  width: 44,
                  height: 34,
                  border: '1px solid',
                  borderColor: '#e1e5e8',
                  borderRadius: 1,
                  bgcolor: 'common.white',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: 18,
                  top: 0,
                  width: 54,
                  height: 66,
                  border: '1px solid',
                  borderColor: '#9e9e9e',
                  borderRadius: 1.25,
                  bgcolor: 'common.white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DescriptionOutlinedIcon sx={{ fontSize: 42, color: '#9e9e9e' }} />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  right: 4,
                  bottom: 4,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: '1px solid',
                  borderColor: '#202124',
                  bgcolor: '#a6d65a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UploadOutlinedIcon sx={{ fontSize: 18, color: '#202124' }} />
              </Box>
            </Box>

            <Stack spacing={0.75} sx={{ maxWidth: 290 }}>
              <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 700, color: '#263238' }}>
                Drag &amp; drop files here or browse files
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.45 }}>
                Supported formats: docx, html, md, pdf, txt
                <br />
                Maximum file size: 20.00 MB
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </Stack>
    </SideDrawer>
  )
}

export default NewFileContentDrawer
