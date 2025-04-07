
import React from 'react';
import AIAssistant from './AIAssistant';

// Provider component to make AIAssistant available on all pages
const AIAssistantProvider: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AIAssistant />
    </div>
  );
};

export default AIAssistantProvider;
