import React, { useState } from 'react';
import { Copy, Check, Edit3 } from 'lucide-react';

interface CopyableOutputProps {
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
  rawContent: string;
}

const CopyableOutput: React.FC<CopyableOutputProps> = ({ title, icon: Icon, content, rawContent }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(rawContent);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you might want to save changes to a backend
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon className="h-5 w-5 text-purple-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
              aria-label={isEditing ? 'Save changes' : 'Edit content'}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
              aria-label={isCopied ? 'Content copied' : 'Copy content to clipboard'}
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4">
        {isEditing ? (
          <div>
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              rows={Math.min(Math.max(editableContent.split('\n').length, 5), 20)}
              aria-label={`Edit ${title} content`}
            />
            <div className="mt-3 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded hover:from-purple-700 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none" role="region" aria-label={`${title} content`}>
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default CopyableOutput;