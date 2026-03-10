import { Box } from '@mui/material'

export type AgentAvatarVariantId =
  | 'classic'
  | 'mist'
  | 'silver'
  | 'midnight'
  | 'lime'
  | 'mint'
  | 'care'
  | 'wave'
  | 'bubble'
  | 'teal'
  | 'heart'
  | 'galaxy'

type AgentAvatarPreset = {
  id: AgentAvatarVariantId
  background: string
  faceOutline: string
  chestAccent: string
  shadow?: string
}

export const agentAvatarPresets: AgentAvatarPreset[] = [
  {
    id: 'classic',
    background: 'linear-gradient(180deg, #c6d6de 0%, #e9eff3 100%)',
    faceOutline: '#87ddff',
    chestAccent: '#b7ecff',
  },
  {
    id: 'mist',
    background: 'linear-gradient(180deg, #d7e3ea 0%, #f5f8fa 100%)',
    faceOutline: '#8fd3f4',
    chestAccent: '#d4f1ff',
  },
  {
    id: 'silver',
    background: 'linear-gradient(180deg, #d9dbde 0%, #f2f3f5 100%)',
    faceOutline: '#a8dbff',
    chestAccent: '#d7f0ff',
  },
  {
    id: 'midnight',
    background: 'linear-gradient(180deg, #2f333b 0%, #11141a 100%)',
    faceOutline: '#d8f35d',
    chestAccent: '#7ee0ff',
    shadow: '0 8px 22px rgba(17, 20, 26, 0.22)',
  },
  {
    id: 'lime',
    background: 'linear-gradient(180deg, #f1f2ec 0%, #e3e7d6 100%)',
    faceOutline: '#d8f35d',
    chestAccent: '#bde48a',
  },
  {
    id: 'mint',
    background: 'linear-gradient(180deg, #eef4ea 0%, #f7faf5 100%)',
    faceOutline: '#c6ef62',
    chestAccent: '#bae4cf',
  },
  {
    id: 'care',
    background: 'linear-gradient(180deg, #f1f1f1 0%, #fbfbfb 100%)',
    faceOutline: '#d5ef6f',
    chestAccent: '#ffd2df',
  },
  {
    id: 'wave',
    background: 'linear-gradient(180deg, #0184d0 0%, #34b2ff 100%)',
    faceOutline: '#d9f45d',
    chestAccent: '#bce7ff',
    shadow: '0 8px 22px rgba(1, 132, 208, 0.2)',
  },
  {
    id: 'bubble',
    background: 'linear-gradient(180deg, #10a3f0 0%, #6ad0ff 100%)',
    faceOutline: '#d8f35d',
    chestAccent: '#bce7ff',
    shadow: '0 8px 22px rgba(16, 163, 240, 0.2)',
  },
  {
    id: 'teal',
    background: 'linear-gradient(180deg, #0f96c6 0%, #57c0e6 100%)',
    faceOutline: '#d7f15d',
    chestAccent: '#c7ecf8',
    shadow: '0 8px 22px rgba(15, 150, 198, 0.2)',
  },
  {
    id: 'heart',
    background: 'linear-gradient(180deg, #0ea0ed 0%, #5fc8ff 100%)',
    faceOutline: '#d8f35d',
    chestAccent: '#ffd9e3',
    shadow: '0 8px 22px rgba(14, 160, 237, 0.2)',
  },
  {
    id: 'galaxy',
    background:
      'radial-gradient(circle at 35% 30%, #4bd2ff 0%, #2d6bff 30%, #2f28b6 58%, #08174f 100%)',
    faceOutline: '#72ff61',
    chestAccent: '#93dcff',
    shadow: '0 10px 28px rgba(26, 48, 142, 0.28)',
  },
]

const defaultAvatarPreset = agentAvatarPresets[0]

export const getAgentAvatarPreset = (variantId?: AgentAvatarVariantId) =>
  agentAvatarPresets.find((preset) => preset.id === variantId) ?? defaultAvatarPreset

type AgentAvatarProps = {
  size?: number
  variantId?: AgentAvatarVariantId
}

function AgentAvatar({ size = 52, variantId = defaultAvatarPreset.id }: AgentAvatarProps) {
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
