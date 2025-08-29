import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowRight, TrendingUp, ChevronDown } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionSelect: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onQuestionSelect 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-t border-border bg-gradient-to-r from-accent/30 to-accent/10 rounded-t-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full p-4 flex items-center justify-between hover:bg-accent/20 rounded-t-lg"
          >
            <h3 className="text-sm font-medium text-foreground">Suggested Questions</h3>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-4 pb-4">
          <div className="grid gap-2">
            {questions.map((question, index) => (
              <Card
                key={index}
                className="p-3 cursor-pointer hover:shadow-[var(--shadow-soft)] transition-all duration-200 border hover:border-primary/30 group bg-[var(--gradient-card)] rounded-xl"
                style={{ boxShadow: 'var(--shadow-soft)' }}
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};