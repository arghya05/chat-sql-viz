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
    <div className="p-4 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border-t border-white/40">
      <h3 className="text-sm font-semibold text-foreground mb-3">Popular Questions:</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
        {questions.slice(0, 4).map((question, index) => (
          <div
            key={index}
            className="group p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg border border-white/50 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onQuestionSelect(question)}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-foreground group-hover:text-primary transition-colors pr-2 leading-relaxed">
                {question}
              </p>
              <div className="flex items-center gap-1 flex-shrink-0">
                {hoveredIndex === index && (
                  <>
                    <TrendingUp className="w-3 h-3 text-primary animate-in slide-in-from-right-2 duration-200" />
                    <ArrowRight className="w-3 h-3 text-primary animate-in slide-in-from-right-1 duration-200" />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask about cars, financing, or trade-ins..."
          className="flex-1 px-3 py-2 text-sm border-0 rounded-lg bg-white/90 backdrop-blur-sm shadow-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 border border-white/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              onQuestionSelect(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
        <Button variant="outline" size="sm" className="rounded-lg bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg border-white/50">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};