"use client";

import { useContext } from 'react';
import { MatchContext } from '@/context/match-provider';

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
