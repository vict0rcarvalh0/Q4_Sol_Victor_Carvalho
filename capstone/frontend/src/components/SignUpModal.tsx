'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from '@/hooks/use-toast'
import { createFarmer } from '../services/farmer' // Updated path

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [email, setEmail] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  useEffect(() => {
    if (connected && isConnecting) {
      setIsConnecting(false)
      handleSignUp()
    }
  }, [connected, isConnecting])

  const handleConnectWallet = () => {
    setIsConnecting(true)
    onClose()
    setTimeout(() => setVisible(true), 50)
  }

  const handleSignUp = async () => {
    if (!email || !publicKey) {
      toast({
        title: "Error",
        description: "Please enter a valid email and connect your wallet.",
        variant: "destructive",
      })
      return
    }

    try {
      await createFarmer({
        email,
        wallet_address: publicKey.toBase58(),
      })

      toast({
        title: "Sign Up Successful",
        description: "Your email and wallet have been registered.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      })
      console.error('SignUp Error:', error)
    }
  }

  if (isConnecting) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription>
            Enter your email to sign up. You will need to connect your wallet to complete the process.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={connected ? handleSignUp : handleConnectWallet}>
            {connected ? 'Sign Up' : 'Connect Wallet & Sign Up'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
