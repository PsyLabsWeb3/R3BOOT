export interface BalanceEntry {
    sku: string;
    balance: string;
    icon: string;
}

export interface TransactionEntry {
  type: "Sent" | "Received";
  from: string;
  to: string;
  amount: string;
  status: "Completed" | "Pending";
  timestamp: number;
  link: string;
}