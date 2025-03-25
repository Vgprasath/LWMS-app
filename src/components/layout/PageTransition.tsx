
import React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={location.pathname}
        classNames="page-transition"
        timeout={300}
        unmountOnExit
      >
        <div className="page-container h-full flex-1 overflow-auto">
          {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default PageTransition;
