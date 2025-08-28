import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface EditableMessageProps {
  content: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}

export const EditableMessage: React.FC<EditableMessageProps> = ({
  content,
  onSave,
  onCancel
}) => {
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    if (editedContent.trim()) {
      onSave(editedContent.trim());
    }
  };

  return (
    <Card className="p-3 bg-primary/10 border-primary/20">
      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="mb-3 min-h-[80px]"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            handleSave();
          } else if (e.key === 'Escape') {
            onCancel();
          }
        }}
      />
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Check className="w-4 h-4 mr-1" />
          Save & Send
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Press Ctrl+Enter to save, Esc to cancel
      </p>
    </Card>
  );
};