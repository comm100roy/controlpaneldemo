import { Box } from '@mui/material'
import {
  getAgentAvatarPreset,
  type AgentAvatarVariantId,
} from './agentAvatarPresets'

type AgentAvatarProps = {
  size?: number
  variantId?: AgentAvatarVariantId
}

function AgentAvatar({ size = 52, variantId = 'classic' }: AgentAvatarProps) {
  const preset = getAgentAvatarPreset(variantId)
  const outlineWidth = Math.max(1.5, size * 0.018)

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        background: preset.background,
        boxShadow: preset.shadow,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${size * 0.56}px`,
          height: `${size * 0.34}px`,
          borderRadius: '46% 46% 42% 42%',
          bgcolor: '#f7f7f8',
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '27%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${size * 0.34}px`,
          height: `${size * 0.15}px`,
          borderRadius: 999,
          bgcolor: '#080909',
          border: `${outlineWidth}px solid ${preset.faceOutline}`,
          zIndex: 3,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '24%',
            transform: 'translate(-50%, -50%)',
            width: `${size * 0.06}px`,
            height: `${size * 0.06}px`,
            borderRadius: '50%',
            bgcolor: '#ffffff',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '18%',
            transform: 'translate(50%, -50%)',
            width: `${size * 0.06}px`,
            height: `${size * 0.06}px`,
            borderRadius: '50%',
            bgcolor: '#ffffff',
          }}
        />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${size * 0.42}px`,
          height: `${size * 0.38}px`,
          borderRadius: '40% 40% 46% 46%',
          bgcolor: '#f7f7f8',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '22%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${size * 0.12}px`,
          height: `${size * 0.12}px`,
          borderRadius: '50%',
          border: `${Math.max(1.2, size * 0.012)}px solid ${preset.chestAccent}`,
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '26%',
          left: '16%',
          width: `${size * 0.08}px`,
          height: `${size * 0.16}px`,
          borderRadius: 999,
          bgcolor: '#e7ecef',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '26%',
          right: '16%',
          width: `${size * 0.08}px`,
          height: `${size * 0.16}px`,
          borderRadius: 999,
          bgcolor: '#e7ecef',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '16%',
          left: '24%',
          width: `${size * 0.08}px`,
          height: `${size * 0.18}px`,
          borderRadius: 999,
          bgcolor: '#edf0f2',
          transform: 'rotate(12deg)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '16%',
          right: '24%',
          width: `${size * 0.08}px`,
          height: `${size * 0.18}px`,
          borderRadius: 999,
          bgcolor: '#edf0f2',
          transform: 'rotate(-12deg)',
          zIndex: 0,
        }}
      />
    </Box>
  )
}

export default AgentAvatar
