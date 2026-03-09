import { useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import {
  Box,
  Button,
  Drawer,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Radio,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

type DynamicInfoDrawerProps = {
  open: boolean
  onClose: () => void
  onInsert: (value: string) => void
}

type DynamicInfoOption = {
  domain: string
  value: string
}

const domainOptions = [
  'Bot',
  'Variable',
  'Input',
  'CustomVariable',
  'Visitor',
  'PreChat',
]

const dynamicInfoOptions: DynamicInfoOption[] = [
  { domain: 'Bot', value: '{!Bot.Name}' },
  { domain: 'Bot', value: '{!Bot.Visitor Message}' },
  { domain: 'Variable', value: '{!Variable.Name}' },
  { domain: 'Variable', value: '{!Variable.Email}' },
  { domain: 'Variable', value: '{!Variable.PhoneNumber}' },
  { domain: 'Variable', value: '{!Variable.CompanyName}' },
  { domain: 'Variable', value: '{!Variable.Comment}' },
  { domain: 'Variable', value: '{!Variable.FileURL}' },
  { domain: 'Input', value: '{!Input.}' },
  { domain: 'CustomVariable', value: '{!CustomVariable.Name}' },
  { domain: 'Visitor', value: '{!Visitor.Name}' },
  { domain: 'PreChat', value: '{!PreChat.Department}' },
]

function DynamicInfoDrawer({
  open,
  onClose,
  onInsert,
}: DynamicInfoDrawerProps) {
  const [domain, setDomain] = useState('')
  const [search, setSearch] = useState('')
  const [selectedValue, setSelectedValue] = useState('')

  const filteredOptions = useMemo(() => {
    return dynamicInfoOptions.filter((option) => {
      const matchesDomain = !domain || option.domain === domain
      const matchesSearch =
        !search ||
        option.value.toLowerCase().includes(search.toLowerCase()) ||
        option.domain.toLowerCase().includes(search.toLowerCase())

      return matchesDomain && matchesSearch
    })
  }, [domain, search])

  const activeValue =
    filteredOptions.some((option) => option.value === selectedValue)
      ? selectedValue
      : filteredOptions[0]?.value ?? ''

  const handleClose = () => {
    setDomain('')
    setSearch('')
    setSelectedValue('')
    onClose()
  }

  const handleInsert = () => {
    if (!activeValue) {
      return
    }

    onInsert(activeValue)
    handleClose()
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500 },
          borderRadius: 0,
          border: 0,
          boxShadow: '0 18px 60px rgba(15, 23, 42, 0.16)',
          px: 3,
          py: 2.5,
        },
      }}
    >
      <Stack spacing={3}>
        <Button
          variant="text"
          color="inherit"
          onClick={handleClose}
          startIcon={<CloseIcon />}
          sx={{
            justifyContent: 'flex-start',
            px: 0,
            minWidth: 0,
            width: 'fit-content',
            color: 'text.primary',
            fontSize: 16,
            textTransform: 'none',
          }}
        >
          Close
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Insert dynamic info
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Domain</InputLabel>
            <Select
              value={domain}
              label="Domain"
              onChange={(event) => setDomain(event.target.value)}
            >
              {domainOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            placeholder="Search dynamic info"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Box sx={{ minHeight: 0, flexGrow: 1 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.125 }}>
            {filteredOptions.map((option) => (
              <ListItemButton
                key={option.value}
                selected={activeValue === option.value}
                onClick={() => setSelectedValue(option.value)}
                sx={{
                  borderRadius: 2,
                  minHeight: 42,
                  py: 0.375,
                  px: 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <Radio
                    size="small"
                    edge="start"
                    checked={activeValue === option.value}
                    tabIndex={-1}
                    disableRipple
                    sx={{ p: 0.5 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={option.value}
                  primaryTypographyProps={{
                    fontSize: 14,
                    color: 'text.primary',
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleInsert} disabled={!activeValue}>
            OK
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  )
}

export default DynamicInfoDrawer
