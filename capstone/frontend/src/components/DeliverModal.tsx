import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle } from 'lucide-react'
import QRCode from "react-qr-code"

interface DeliverModalProps {
  isOpen: boolean
  onClose: () => void
  productId: number
}

export function DeliverModal({ isOpen, onClose, productId }: DeliverModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deliver Product</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start space-x-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            <p className="text-sm">
              Consumer must scan it <strong>before</strong><br />
              you give him the product!
            </p>
          </div>
          <QRCode value={`https://farmlink.com/deliver/${productId}`} size={256} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

