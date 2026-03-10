import LearningReviewTablePage from '../../../../components/learning/LearningReviewTablePage'

function ThumbsDownAnswersPage() {
  return (
    <LearningReviewTablePage
      title="Thumbs Down Answers"
      description="Answers marked thumbs down by customers appear here. You can review these cases to understand why they were unhelpful and improve future responses."
      searchPlaceholder="Search question"
      columns={[
        { key: 'question', label: 'Question' },
        { key: 'answer', label: 'Answer' },
        { key: 'channel', label: 'Channel', width: 110 },
        { key: 'origin', label: 'Origin', width: 110 },
        { key: 'createdTime', label: 'Created Time', width: 180 },
        { key: 'operations', label: 'Operations', width: 120, align: 'right' },
      ]}
    />
  )
}

export default ThumbsDownAnswersPage
