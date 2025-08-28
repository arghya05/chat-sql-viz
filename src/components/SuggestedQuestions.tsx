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
    <div className="p-6 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm border-t border-white/20">
      <h3 className="text-sm font-semibold text-foreground mb-4">Popular Questions:</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {questions.slice(0, 4).map((question, index) => (
          <div
            key={index}
            className="group p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] border border-white/20 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
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
      
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ask about cars, financing, or trade-ins..."
          className="flex-1 px-4 py-3 text-sm border-0 rounded-xl bg-white/80 backdrop-blur-sm shadow-[var(--shadow-card)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              onQuestionSelect(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
        <Button variant="outline" size="sm" className="rounded-xl bg-white/80 backdrop-blur-sm shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] border-white/20">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};