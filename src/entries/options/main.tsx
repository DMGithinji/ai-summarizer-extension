import { createRoot } from 'react-dom/client';
import { Options } from './components/Options';
import '@/styles/index.css'

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Options />);
}
