import { Sparkles, X } from 'lucide-react';

interface FloatingButtonProps {
  onCapture: () => void;
  onClose: () => void;
}

export function FloatingButton({ onCapture, onClose }: FloatingButtonProps) {
  return (
    <div
      style={{
        position: 'fixed', // Ensure it's fixed to the viewport
        bottom: '20px', // Bottom padding
        right: '44px', // Right padding
        zIndex: 999999, // High z-index to stay above other elements
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
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(229, 231, 235, 1)',
          borderRadius: '9999px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backdropFilter: 'blur(4px)',
        }}
        title="Summarize with AI"
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
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
            backgroundColor: 'rgba(243, 244, 246, 0.5)', // Transparent background
            border: '1px solid transparent',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            padding: '1px',
            opacity: 0.7,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#e5e7eb'; // Solid background on hover
            e.currentTarget.style.opacity = '1'; // Fully visible
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(243, 244, 246, 0.7)'; // Reset to transparent
            e.currentTarget.style.opacity = '0.5'; // Partially visible
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseOver={e => {
            e.currentTarget.style.opacity = '1'; // Fully visible when hovering over the parent
          }}
          title="Remove button"
          className="group-hover:opacity-50" // CSS helper for hover state visibility
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
