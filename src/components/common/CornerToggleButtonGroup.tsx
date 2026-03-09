import CheckIcon from '@mui/icons-material/Check'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import type { Theme } from '@mui/material/styles'

type CornerToggleButtonOption<T extends string> = {
  value: T
  label: string
}

type CornerToggleButtonGroupProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: readonly CornerToggleButtonOption<T>[]
  buttonMinWidth?: number | string
  fullWidth?: boolean
  sx?: SystemStyleObject<Theme>
  buttonSx?: SystemStyleObject<Theme>
}

function CornerToggleButtonGroup<T extends string>({
  value,
  onChange,
  options,
  buttonMinWidth,
  fullWidth = false,
  sx,
  buttonSx,
}: CornerToggleButtonGroupProps<T>) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={(_, nextValue: T | null) => {
        if (nextValue) {
          onChange(nextValue)
        }
      }}
      size="small"
      sx={
        sx
          ? [
              {
                borderRadius: 1,
                overflow: 'visible',
                width: fullWidth ? '100%' : 'auto',
                '& .MuiToggleButton-root': {
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 0,
                },
                '& .MuiToggleButtonGroup-firstButton': {
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                },
                '& .MuiToggleButtonGroup-lastButton': {
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                },
                '& .MuiToggleButton-root.Mui-selected::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 0,
                  height: 0,
                  borderTop: '22px solid',
                  borderLeft: '22px solid transparent',
                  borderColor: 'primary.main transparent transparent transparent',
                },
                '& .MuiToggleButton-root.Mui-selected .corner-toggle-check': {
                  opacity: 1,
                },
              },
              sx,
            ]
          : {
              borderRadius: 1,
              overflow: 'visible',
              width: fullWidth ? '100%' : 'auto',
              '& .MuiToggleButton-root': {
                position: 'relative',
                overflow: 'hidden',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 0,
              },
              '& .MuiToggleButtonGroup-firstButton': {
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 6,
              },
              '& .MuiToggleButtonGroup-lastButton': {
                borderTopRightRadius: 6,
                borderBottomRightRadius: 6,
              },
              '& .MuiToggleButton-root.Mui-selected::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: 0,
                height: 0,
                borderTop: '22px solid',
                borderLeft: '22px solid transparent',
                borderColor: 'primary.main transparent transparent transparent',
              },
              '& .MuiToggleButton-root.Mui-selected .corner-toggle-check': {
                opacity: 1,
              },
            }
      }
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          sx={
            buttonSx
              ? [
                  {
                    minWidth: buttonMinWidth,
                    flex: fullWidth ? 1 : undefined,
                  },
                  buttonSx,
                ]
              : {
                  minWidth: buttonMinWidth,
                  flex: fullWidth ? 1 : undefined,
                }
          }
        >
          {option.label}
          <CheckIcon
            className="corner-toggle-check"
            sx={{
              position: 'absolute',
              top: 1,
              right: 1,
              fontSize: 12,
              color: 'common.white',
              opacity: 0,
              transition: 'opacity 0.2s ease',
            }}
          />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default CornerToggleButtonGroup
