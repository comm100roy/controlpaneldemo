import { useState } from 'react'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import dayjs, { type Dayjs } from 'dayjs'
import Page from '../common/Page'

type LearningReviewColumn = {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: number | string
}

type LearningReviewTablePageProps = {
  title: string
  description: string
  columns: LearningReviewColumn[]
  searchPlaceholder: string
  footerLinkText?: string
}

type DateRangeValue = [Dayjs | null, Dayjs | null]

function LearningReviewTablePage({
  title,
  description,
  columns,
  searchPlaceholder,
  footerLinkText,
}: LearningReviewTablePageProps) {
  const [searchValue, setSearchValue] = useState('')
  const [dateRange, setDateRange] = useState<DateRangeValue>([
    dayjs('2026-02-08'),
    dayjs('2026-03-09'),
  ])

  return (
    <Page title={title} description={description}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', lg: 'center' }}
        spacing={2}
        sx={{ mt: -1 }}
      >
        <Button
          variant="outlined"
          startIcon={<DownloadOutlinedIcon />}
          sx={{ alignSelf: { xs: 'flex-start', lg: 'center' } }}
        >
          Export
        </Button>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              format="YYYY/MM/DD"
              slotProps={{
                field: {
                  dateSeparator: ' — ',
                },
                textField: {
                  size: 'small',
                  sx: {
                    minWidth: { xs: '100%', md: 260 },
                    '& .MuiPickersOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 1,
                      height: 40,
                    },
                    '& .MuiPickersSectionList-root': {
                      fontSize: 13,
                      minHeight: 40,
                      alignItems: 'center',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            sx={{
              minWidth: { xs: '100%', md: 240 },
              '& .MuiOutlinedInput-root': {
                bgcolor: 'common.white',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Table>
            <colgroup>
              {columns.map((column) => (
                <col
                  key={column.key}
                  style={column.width ? { width: column.width } : undefined}
                />
              ))}
            </colgroup>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align} sx={{ fontWeight: 700 }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ py: 9 }}>
                  <Stack spacing={1.5} alignItems="center" justifyContent="center">
                    <Inventory2OutlinedIcon
                      sx={{ fontSize: 56, color: 'rgba(15, 23, 42, 0.22)' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No records found.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {footerLinkText ? (
        <Link component="button" type="button" underline="hover" sx={{ alignSelf: 'flex-start' }}>
          {footerLinkText}
        </Link>
      ) : null}
    </Page>
  )
}

export default LearningReviewTablePage
