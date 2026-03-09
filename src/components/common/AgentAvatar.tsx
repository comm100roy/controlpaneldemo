import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { Avatar } from '@mui/material'

type AgentAvatarProps = {
  size?: number
}

function AgentAvatar({ size = 52 }: AgentAvatarProps) {
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: 'rgba(25, 118, 210, 0.12)',
        color: 'primary.main',
      }}
    >
      <SmartToyOutlinedIcon sx={{ fontSize: size * 0.5 }} />
    </Avatar>
  )
}

export default AgentAvatar
