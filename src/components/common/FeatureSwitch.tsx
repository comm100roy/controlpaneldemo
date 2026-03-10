import { styled } from '@mui/material/styles'
import Switch, { type SwitchProps } from '@mui/material/Switch'

type FeatureSwitchProps = Omit<SwitchProps, 'color'>

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 24,
  padding: 0,
  display: 'inline-flex',
  '& .MuiSwitch-switchBase': {
    padding: 2,
    margin: 0,
    transitionDuration: '200ms',
    '&.Mui-checked': {
      transform: 'translateX(26px)',
      color: '#ffffff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#25a51a',
        opacity: 1,
      },
      '& + .MuiSwitch-track::before': {
        opacity: 1,
      },
      '& + .MuiSwitch-track::after': {
        opacity: 0,
      },
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.45,
    },
  },
  '& .MuiSwitch-thumb': {
    width: 20,
    height: 20,
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.18)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 12,
    backgroundColor: '#b9bec4',
    opacity: 1,
    position: 'relative',
    transition: theme.transitions.create(['background-color'], {
      duration: 200,
    }),
    '&::before, &::after': {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: 10,
      fontWeight: 700,
      lineHeight: 1,
      color: '#ffffff',
      fontFamily: theme.typography.fontFamily,
      transition: 'opacity 160ms ease',
      pointerEvents: 'none',
    },
    '&::before': {
      content: '"ON"',
      left: 7,
      opacity: 0,
    },
    '&::after': {
      content: '"OFF"',
      right: 4,
      opacity: 1,
    },
  },
}))

function FeatureSwitch(props: FeatureSwitchProps) {
  return <StyledSwitch {...props} />
}

export default FeatureSwitch
