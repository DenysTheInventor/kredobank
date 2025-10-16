export interface User {
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface Card {
  id: string;
  brand: 'Visa' | 'Mastercard';
  last4: string;
  balance: number;
  currency: 'UAH' | 'USD' | 'EUR' | 'THB';
  isPrimary: boolean;
  colorGradient: string;
  isBlocked: boolean;
  expirationDate: string;
  cvv: string;
  limits: {
    online: number;
    withdrawal: number;
  };
}

export interface Transaction {
  id: string;
  cardId: string;
  description: string;
  amount: number;
  currency: 'UAH' | 'USD' | 'EUR' | 'THB';
  date: string;
  type: 'income' | 'expense';
  category: 'Groceries' | 'Transport' | 'Entertainment' | 'Health' | 'Shopping' | 'Utilities' | 'Salary' | 'Freelance' | 'Rent' | 'Food';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export interface SavingsPot {
  id: string;
  ownerUserId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: 'UAH' | 'USD' | 'EUR' | 'THB';
  imageUrl: string;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface PotTransaction {
    id: string;
    potId: string;
    type: 'top_up' | 'withdraw';
    amount: number;
    date: string;
}