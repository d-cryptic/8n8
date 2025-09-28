import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Send } from 'lucide-react'
import React from 'react'

const TelegramNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${
      selected ? 'border-blue-500' : 'border-gray-300'
    }`}>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center">
          <Send className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="font-bold text-sm">{String(data.label)}</div>
          <div className="text-xs text-gray-500">Send Telegram</div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-cyan-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-cyan-500"
      />
    </div>
  )
}

export default TelegramNode
