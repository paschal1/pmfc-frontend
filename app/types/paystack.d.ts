// types/paystack.d.ts

declare module '@paystack/inline-js' {
  interface PaystackTransaction {
    key: string
    email: string
    amount: number
    metadata?: {
      custom_fields?: Array<{
        display_name: string
        variable_name: string
        value: string | number
      }>
    }
    onSuccess: (response: PaystackResponse) => void
    onCancel: () => void
  }

  interface PaystackResponse {
    reference: string
    status: string
  }

  class PaystackPop {
    newTransaction(options: PaystackTransaction): void
  }

  export = PaystackPop
}