import AiAgentForm from './AiAgentForm'
import SideDrawer from '../common/SideDrawer'

type EditAiAgentDrawerProps = {
  open: boolean
  onClose: () => void
  initialName: string
  initialLanguage: string
  initialChannel: string
  initialDescription: string
}

function EditAiAgentDrawer({
  open,
  onClose,
  initialName,
  initialLanguage,
  initialChannel,
  initialDescription,
}: EditAiAgentDrawerProps) {
  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="Edit AI Agent"
      width={{ xs: '100%', lg: 1000 }}
    >
      <AiAgentForm
        initialName={initialName}
        initialLanguage={initialLanguage}
        initialChannel={initialChannel}
        initialDescription={initialDescription}
        onSubmit={onClose}
        onCancel={onClose}
      />
    </SideDrawer>
  )
}

export default EditAiAgentDrawer
