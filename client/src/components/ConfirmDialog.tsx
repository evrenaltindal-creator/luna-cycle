// Style: Sessiz Ay Takvimi — bone canvas, sage ink, lemon moments; confirmation surfaces stay calm, explicit, and destructive actions remain visually distinct.
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  eyebrow?: string;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  eyebrow = "GÜNLÜK KAYIT",
  title,
  description,
  confirmLabel,
  cancelLabel = "İptal",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && !loading && onCancel()}>
      <AlertDialogContent className="record-modal confirm-dialog">
        <AlertDialogHeader className="confirm-dialog-header">
          <span className="tiny-label">{eyebrow}</span>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter className="modal-actions confirm-dialog-actions">
          <AlertDialogCancel className="ghost-button" disabled={loading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={destructive ? "danger-solid" : "primary-solid"}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Siliniyor…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
