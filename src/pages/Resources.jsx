import ResourcesView from './more/ResourcesView'
export default function Resources({ resources, isAdmin, editRes, onEdit, onCloseEdit, onSaveEdit }) { return <ResourcesView resources={resources} isAdmin={isAdmin} editRes={editRes} onEdit={onEdit} onCloseEdit={onCloseEdit} onSaveEdit={onSaveEdit} /> }
