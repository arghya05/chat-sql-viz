import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionSelect: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onQuestionSelect 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="p-4 border-t border-border bg-muted/30">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular Questions:</h3>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <Card
            key={index}
            className="p-3 cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-primary/20 group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onQuestionSelect(question)}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground group-hover:text-primary transition-colors pr-2">
                {question}
              </p>
              <div className="flex items-center gap-1 flex-shrink-0">
                {hoveredIndex === index && (
                  <>
                    <TrendingUp className="w-4 h-4 text-primary animate-in slide-in-from-right-2 duration-200" />
                    <ArrowRight className="w-4 h-4 text-primary animate-in slide-in-from-right-1 duration-200" />
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Ask about cars, financing, or trade-ins..."
          className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              onQuestionSelect(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
        <Button variant="outline" size="sm">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};