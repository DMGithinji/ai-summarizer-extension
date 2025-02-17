import { CSSProperties } from 'react';

interface Styles {
  container: CSSProperties;
  mainButton: CSSProperties;
  sparklesIcon: CSSProperties;
  floatingButton: CSSProperties;
  settingsButton: CSSProperties;
  closeButton: CSSProperties;
  icon: CSSProperties;
}

export const styles: Styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '36px',
    zIndex: 999999,
  },

  mainButton: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    backgroundColor: 'rgba(255, 255, 255)',
    border: '1px solid rgba(229, 231, 235, 1)',
    borderRadius: '9999px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backdropFilter: 'blur(4px)',
  },

  sparklesIcon: {
    width: '20px',
    height: '20px',
    color: '#3b82f6',
  },

  floatingButton: {
    position: 'absolute',
    width: '16px',
    height: '16px',
    backgroundColor: 'rgba(243, 244, 246, 0.5)',
    border: '1px solid #f1f1f170',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.5s ease-in-out',
    padding: '1px',
    opacity: 0,
  },

  settingsButton: {
    bottom: '-8px',
    right: '-8px',
  },

  closeButton: {
    top: '-8px',
    right: '-8px',
  },

  icon: {
    width: '12px',
    height: '12px',
  }
};
