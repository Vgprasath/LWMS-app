
import React from 'react';
import AIAssistant from './AIAssistant';

// Provider component to make AIAssistant available on all pages
const AIAssistantProvider: React.FC = () => {
  return <AIAssistant />;
};

export default AIAssistantProvider;
