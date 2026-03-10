import { useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import { Stack, Typography } from '@mui/material'
import dayjs, { type Dayjs } from 'dayjs'
import SideDrawer from '../common/SideDrawer'
import DataTable, {
  type InstructionRow,
  type InstructionTableColumn,
} from '../common/DataTable'

type DateRangeValue = [Dayjs | null, Dayjs | null]

type BookedMeetingRow = InstructionRow & {
  meetingStartTime: string
  duration: string
  calendlyAccount: string
  eventType: string
  meetingBookedTime: string
}

const bookedMeetingColumns: InstructionTableColumn<BookedMeetingRow>[] = [
  {
    key: 'meetingStartTime',
    header: 'Meeting Start Time',
    sortAccessor: (row) => row.meetingStartTime,
    render: (row) => <Typography variant="body2">{row.meetingStartTime}</Typography>,
  },
  {
    key: 'duration',
    header: 'Duration (min)',
    render: (row) => <Typography variant="body2">{row.duration}</Typography>,
  },
  {
    key: 'calendlyAccount',
    header: 'Calendly Account',
    render: (row) => <Typography variant="body2">{row.calendlyAccount}</Typography>,
  },
  {
    key: 'eventType',
    header: 'Event Type',
    render: (row) => <Typography variant="body2">{row.eventType}</Typography>,
  },
  {
    key: 'meetingBookedTime',
    header: 'Meeting Booked Time',
    render: (row) => <Typography variant="body2">{row.meetingBookedTime}</Typography>,
  },
]

const bookedMeetingRows: BookedMeetingRow[] = []

type BookedMeetingsDrawerProps = {
  open: boolean
  onClose: () => void
}

function BookedMeetingsDrawer({ open, onClose }: BookedMeetingsDrawerProps) {
  const [dateRange, setDateRange] = useState<DateRangeValue>([
    dayjs('2026-02-09'),
    dayjs('2026-03-10'),
  ])

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="Booked Meetings"
      width={{ xs: '100%', lg: 1024 }}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="flex-end">
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
                    minWidth: { xs: '100%', md: 240 },
                    '& .MuiPickersInputBase-root': {
                      bgcolor: 'common.white',
                      borderRadius: 1,
                    },
                    '& .MuiPickersOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 1,
                      height: 44,
                    },
                    '& .MuiPickersSectionList-root': {
                      fontSize: 13,
                      minHeight: 44,
                      alignItems: 'center',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Stack>

        <DataTable
          rows={bookedMeetingRows}
          columns={bookedMeetingColumns}
          emptyStateMinHeight={380}
          showDelete={false}
        />
      </Stack>
    </SideDrawer>
  )
}

export default BookedMeetingsDrawer
