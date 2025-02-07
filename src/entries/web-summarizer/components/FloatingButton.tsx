import { Sparkles, X } from 'lucide-react';

interface FloatingButtonProps {
  onCapture: () => void;
  onClose: () => void;
  aiUrlName: string;
  onGetAiName: () => Promise<void>;
}

export function FloatingButton({ onCapture, onClose, aiUrlName, onGetAiName }: FloatingButtonProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '36px',
        zIndex: 999999,
      }}
    >
      <button
        onClick={onCapture}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          backgroundColor: 'rgba(255, 255, 255)',
          border: '1px solid rgba(229, 231, 235, 1)',
          borderRadius: '9999px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backdropFilter: 'blur(4px)',
        }}
        title={`Get ${aiUrlName} Summary`}
        onMouseEnter={(e) => {
          onGetAiName();
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
          // Show close button on parent hover
          const closeButton = e.currentTarget.querySelector('.close-button') as HTMLElement;
          if (closeButton) {
            closeButton.style.opacity = '0.7';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          // Hide close button when leaving parent
          const closeButton = e.currentTarget.querySelector('.close-button') as HTMLElement;
          if (closeButton) {
            closeButton.style.opacity = '0';
          }
        }}
      >
        <Sparkles
          style={{
            width: '20px',
            height: '20px',
            color: '#3b82f6',
          }}
        />

        <button
          className="close-button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '12px',
            height: '12px',
            backgroundColor: 'rgba(243, 244, 246, 0.5)',
            border: '1px solid transparent',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            padding: '1px',
            opacity: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(243, 244, 246, 0.7)';
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Remove button"
        >
          <X
            style={{
              width: '10px',
              height: '10px',
              color: 'brown',
            }}
          />
        </button>
      </button>
    </div>
  );
}
