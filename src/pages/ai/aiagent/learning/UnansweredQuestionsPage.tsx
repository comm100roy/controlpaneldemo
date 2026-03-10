import { Typography } from '@mui/material'
import {
  type InstructionTableColumn,
} from '../../../../components/common/DataTable'
import LearningReviewTablePage from '../../../../components/learning/LearningReviewTablePage'
import {
  unansweredQuestionGroupRows,
  type UnansweredQuestionGroupRow,
} from '../../../../data/dashboard'

const unansweredQuestionColumns: InstructionTableColumn<UnansweredQuestionGroupRow>[] = [
  {
    key: 'questionGroup',
    header: 'Question Group',
    sortAccessor: (row) => row.content,
    render: (row) => <Typography variant="body2">{row.content}</Typography>,
  },
  {
    key: 'questions',
    header: 'Questions',
    width: 140,
    sortAccessor: (row) => row.questionCount,
    render: (row) => <Typography variant="body2">{row.questionCount}</Typography>,
  },
  {
    key: 'createdTime',
    header: 'Created Time',
    width: 180,
    sortAccessor: (row) => row.createdAt,
    render: (row) => <Typography variant="body2">{row.createdTime}</Typography>,
  },
]

function UnansweredQuestionsPage() {
  return (
    <LearningReviewTablePage
      title="Unanswered Question Groups"
      description="Visitor questions that AI Agent didn't recognize are listed here. You can add these questions to topics or snippets to help extend the AI Agent's knowledge."
      rows={unansweredQuestionGroupRows}
      columns={unansweredQuestionColumns}
      searchPlaceholder="Search"
      getSearchText={(row) => row.content}
      getDateValue={(row) => row.createdAt}
      emptyStateMessage="No unanswered question groups found."
      footerLinkText='View unanswered question groups labeled as "Out of Scope."'
    />
  )
}

export default UnansweredQuestionsPage
