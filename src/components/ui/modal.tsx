import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Modal = React.forwardRef<HTMLDialogElement, ModalProps>(
  ({ className, isOpen, onClose, title, children, ...props }, ref) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    // Resolve combined ref logic
    const resolvedRef = (ref as React.RefObject<HTMLDialogElement | null>) || dialogRef;

    React.useEffect(() => {
      const dialog = resolvedRef.current;
      if (!dialog) return;

      if (isOpen) {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        if (dialog.open) {
          dialog.close();
        }
      }
    }, [isOpen, resolvedRef]);

    React.useEffect(() => {
      const dialog = resolvedRef.current;
      if (!dialog) return;

      const handleCancel = (e: Event) => {
        e.preventDefault();
        onClose();
      };

      dialog.addEventListener('cancel', handleCancel);
      return () => dialog.removeEventListener('cancel', handleCancel);
    }, [onClose, resolvedRef]);

    return (
      <dialog
        ref={resolvedRef}
        className={cn(
          'backdrop:bg-space-black/75 backdrop:backdrop-blur-md bg-card border border-border/80 rounded-lg p-6 max-w-lg w-full shadow-dialog outline-none text-foreground font-sans',
          className
        )}
        {...props}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-border/30 pb-2">
            {title && (
              <h2 className="font-title text-lg font-bold tracking-wide text-white">{title}</h2>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary/45 p-1 rounded-sm cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="modal-body text-slate-300 text-sm leading-relaxed">{children}</div>
        </div>
      </dialog>
    );
  }
);
Modal.displayName = 'Modal';

export { Modal };

