import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import type { ReactNode } from 'react';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modals')!;

type TModalProps = {
  title?: string;
  ariaLabel?: string;
  children: ReactNode;
  onClose: () => void;
};

export const Modal = ({
  title,
  ariaLabel,
  children,
  onClose,
}: TModalProps): React.JSX.Element => {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }

      if (event.key === 'Tab') {
        const elements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
        );
        const first = elements?.[0];
        const last = elements?.[elements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.layer}>
      <ModalOverlay onClose={onClose} />
      <section
        ref={dialogRef}
        className={`${styles.modal} custom-scroll p-10`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : (ariaLabel ?? 'Модальное окно')}
      >
        <header className={title ? styles.header : styles.header_empty}>
          {title && (
            <h2 id={titleId} className="text text_type_main-large">
              {title}
            </h2>
          )}
          <button
            ref={closeRef}
            className={styles.close}
            type="button"
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            <CloseIcon type="primary" />
          </button>
        </header>
        {children}
      </section>
    </div>,
    modalRoot
  );
};
