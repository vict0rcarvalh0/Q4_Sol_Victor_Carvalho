'use client'

import {getBlinksfromscratchProgram, getBlinksfromscratchProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useBlinksfromscratchProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getBlinksfromscratchProgramId(cluster.network as Cluster), [cluster])
  const program = getBlinksfromscratchProgram(provider)

  const accounts = useQuery({
    queryKey: ['blinksfromscratch', 'all', { cluster }],
    queryFn: () => program.account.blinksfromscratch.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['blinksfromscratch', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ blinksfromscratch: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useBlinksfromscratchProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useBlinksfromscratchProgram()

  const accountQuery = useQuery({
    queryKey: ['blinksfromscratch', 'fetch', { cluster, account }],
    queryFn: () => program.account.blinksfromscratch.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['blinksfromscratch', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ blinksfromscratch: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['blinksfromscratch', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ blinksfromscratch: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['blinksfromscratch', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ blinksfromscratch: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['blinksfromscratch', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ blinksfromscratch: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
