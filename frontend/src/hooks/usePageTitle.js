import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => { document.title = title ? `${title} — Eventos` : 'Eventos — Universidad de Cartagena'; }, [title]);
}
