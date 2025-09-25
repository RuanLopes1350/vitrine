'use client';

interface DebugAuthToggleProps {
  isLoggedIn: boolean;
  onToggle: () => void;
}

export default function DebugAuthToggle({ isLoggedIn, onToggle }: DebugAuthToggleProps) {
  // Este componente é só para desenvolvimento - remover em produção
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={onToggle}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 text-sm"
      >
        {isLoggedIn ? 'Simular Logout' : 'Simular Login'}
      </button>
    </div>
  );
}