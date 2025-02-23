import { Sparkles, X, Settings } from 'lucide-react';
import { styles } from './styles';

interface FloatingButtonProps {
  onCapture: () => void;
  onClose: () => void;
  onSettings: () => void;
  aiServiceName: string;
  onGetAiName: () => Promise<void>;
}

export function FloatingButton({
  onCapture,
  onClose,
  onSettings,
  aiServiceName,
  onGetAiName
}: FloatingButtonProps) {
  const handleMainButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean) => {
    if (isEnter) {
      onGetAiName();
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      const buttons = e.currentTarget.querySelectorAll('.floating-button') as NodeListOf<HTMLElement>;
      buttons.forEach(button => {
        button.style.opacity = '0.7';
      });
    } else {
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      const buttons = e.currentTarget.querySelectorAll('.floating-button') as NodeListOf<HTMLElement>;
      buttons.forEach(button => {
        button.style.opacity = '0';
      });
    }
  };

  const handleFloatingButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean) => {
    if (isEnter) {
      e.currentTarget.style.backgroundColor = '#fff';
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'scale(1.1)';
    } else {
      e.currentTarget.style.backgroundColor = '#fdfdfd';
      e.currentTarget.style.opacity = '0.5';
      e.currentTarget.style.transform = 'scale(1)';
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={onCapture}
        style={styles.mainButton}
        title={`Get ${aiServiceName} Summary`}
        onMouseEnter={(e) => handleMainButtonHover(e, true)}
        onMouseLeave={(e) => handleMainButtonHover(e, false)}
      >
        <Sparkles style={styles.sparklesIcon} />

        <button
          className="floating-button"
          onClick={(e) => {
            e.stopPropagation();
            onSettings();
          }}
          style={{ ...styles.floatingButton, ...styles.settingsButton }}
          onMouseEnter={(e) => handleFloatingButtonHover(e, true)}
          onMouseLeave={(e) => handleFloatingButtonHover(e, false)}
          title="Extension Settings"
        >
          <Settings style={{ ...styles.icon, color: '#6B7280' }} />
        </button>

        <button
          className="floating-button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ ...styles.floatingButton, ...styles.closeButton }}
          onMouseEnter={(e) => handleFloatingButtonHover(e, true)}
          onMouseLeave={(e) => handleFloatingButtonHover(e, false)}
          title="Remove button"
        >
          <X style={{ ...styles.icon, color: 'brown' }} />
        </button>
      </button>
    </div>
  );
}