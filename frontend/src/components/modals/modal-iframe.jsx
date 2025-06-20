import { Dialog, DialogContent } from "../ui/dialog";

export function ModalIframe({ open, onCancel, url }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="h-11/12">
        <iframe
          src={url}
          title="Payment Link"
          className="w-full h-full rounded-xl border-0"
          style={{
            background: "inherit",
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
