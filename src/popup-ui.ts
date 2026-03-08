export type HintsState =
  | { status: 'loading' }
  | { status: 'ready'; hints: string }
  | { status: 'error'; message: string }
  | { status: 'no-code' };

export function renderHints(container: HTMLElement, state: HintsState): void {
  container.innerHTML = '';

  switch (state.status) {
    case 'loading': {
      const el = document.createElement('p');
      el.textContent = 'Loading hints…';
      container.appendChild(el);
      break;
    }
    case 'ready': {
      const el = document.createElement('pre');
      el.textContent = state.hints;
      container.appendChild(el);
      break;
    }
    case 'error': {
      const el = document.createElement('p');
      el.textContent = `Error: ${state.message}`;
      container.appendChild(el);
      break;
    }
    case 'no-code': {
      const el = document.createElement('p');
      el.textContent = 'No code detected on this page. Navigate to a coding challenge to get hints.';
      container.appendChild(el);
      break;
    }
  }
}
