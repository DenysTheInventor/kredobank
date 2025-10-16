import type { Card, Transaction, SavingsPot, PotTransaction } from './types.ts';
import { Send, CreditCard, PieChart, Landmark } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const MOCK_USER = {
  firstName: 'Jane',
  lastName: 'Doe',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

export const INITIAL_MOCK_CARDS: Card[] = [
  {
    id: 'card-1',
    brand: 'Visa',
    last4: '1234',
    balance: 54321.99,
    currency: 'UAH',
    isPrimary: true,
    colorGradient: 'from-purple-500 to-indigo-600',
    isBlocked: false,
    expirationDate: '12/26',
    cvv: '123',
    limits: { online: 50000, withdrawal: 20000 },
  },
  {
    id: 'card-2',
    brand: 'Mastercard',
    last4: '5678',
    balance: 1250.75,
    currency: 'USD',
    isPrimary: false,
    colorGradient: 'from-cyan-500 to-blue-500',
    isBlocked: false,
    expirationDate: '08/25',
    cvv: '456',
    limits: { online: 2000, withdrawal: 500 },
  },
   {
    id: 'card-3',
    brand: 'Mastercard',
    last4: '9876',
    balance: 150000.00,
    currency: 'THB',
    isPrimary: false,
    colorGradient: 'from-orange-500 to-amber-500',
    isBlocked: false,
    expirationDate: '10/27',
    cvv: '789',
    limits: { online: 100000, withdrawal: 30000 },
  },
];

export const generateMockTransactions = (): Transaction[] => {
    const transactions: Transaction[] = [];
    const endDate = new Date('2025-10-17T23:59:59');
    const startDate = new Date('2025-04-26T00:00:00');

    const chiangMaiCafes: { desc: string; cat: Transaction['category']; min: number; max: number }[] = [
        { desc: 'Ristr8to Lab', cat: 'Food', min: 100, max: 400 },
        { desc: 'Akha Ama Coffee', cat: 'Food', min: 80, max: 350 },
        { desc: 'Gateway Coffee Roasters', cat: 'Food', min: 120, max: 500 },
        { desc: 'The Baristro at Ping River', cat: 'Food', min: 150, max: 600 },
        { desc: 'GRAPH contemporary', cat: 'Food', min: 100, max: 450 },
        { desc: 'Fern Forest Cafe', cat: 'Food', min: 200, max: 800 },
        { desc: 'Goodsouls Kitchen', cat: 'Food', min: 250, max: 1000 },
        { desc: 'Asama Cafe', cat: 'Food', min: 90, max: 300 },
        { desc: 'No.39 Cafe', cat: 'Food', min: 100, max: 500 },
        { desc: 'Clay Studio Coffee', cat: 'Food', min: 100, max: 400 },
    ];

    const thaiShops: { desc: string; cat: Transaction['category']; min: number; max: number }[] = [
        { desc: 'Tops Market', cat: 'Groceries', min: 300, max: 2500 },
        { desc: 'Rimping Supermarket', cat: 'Groceries', min: 400, max: 3000 },
        { desc: 'Big C Supercenter', cat: 'Groceries', min: 500, max: 4000 },
        { desc: '7-Eleven', cat: 'Groceries', min: 50, max: 500 },
        { desc: 'Grab Ride', cat: 'Transport', min: 60, max: 400 },
        { desc: 'Bolt Ride', cat: 'Transport', min: 50, max: 350 },
    ];

    const techShops: { desc: string; cat: Transaction['category']; min: number; max: number }[] = [
        { desc: 'Banana IT', cat: 'Shopping', min: 1000, max: 50000 },
        { desc: 'Power Buy', cat: 'Shopping', min: 1500, max: 60000 },
    ];
    
    const thbCardId = 'card-3';
    const uahCardId = 'card-1';

    let currentDate = new Date(endDate);

    while (currentDate >= startDate) {
        const dayOfMonth = currentDate.getDate();

        // ~20-25 cafe visits per month
        if (Math.random() < 0.85 && currentDate.getDay() !== 0) { // High chance, except on Sundays maybe
             const template = chiangMaiCafes[Math.floor(Math.random() * chiangMaiCafes.length)];
             const amount = Math.random() * (template.max - template.min) + template.min;
             transactions.push({
                id: `tx-cafe-${currentDate.getTime()}-${Math.random()}`,
                cardId: thbCardId,
                description: template.desc,
                amount: -parseFloat(amount.toFixed(2)),
                currency: 'THB',
                date: new Date(currentDate.getTime() - Math.random() * 1000 * 60 * 60 * 12).toISOString(),
                type: 'expense',
                category: template.cat,
            });
        }
        
        // 1-2 other shop/transport tx per day
        for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
             const template = thaiShops[Math.floor(Math.random() * thaiShops.length)];
             const amount = Math.random() * (template.max - template.min) + template.min;
             transactions.push({
                id: `tx-shop-${currentDate.getTime()}-${i}`,
                cardId: thbCardId,
                description: template.desc,
                amount: -parseFloat(amount.toFixed(2)),
                currency: 'THB',
                date: new Date(currentDate.getTime() - Math.random() * 1000 * 60 * 60 * 20).toISOString(),
                type: 'expense',
                category: template.cat,
            });
        }

        // 2-3 tech shop purchases per month
        if (dayOfMonth === 10 || dayOfMonth === 25 || (dayOfMonth === 15 && Math.random() > 0.5)) {
             const template = techShops[Math.floor(Math.random() * techShops.length)];
             const amount = Math.random() * (template.max - template.min) + template.min;
             transactions.push({
                id: `tx-tech-${currentDate.getTime()}`,
                cardId: thbCardId,
                description: template.desc,
                amount: -parseFloat(amount.toFixed(2)),
                currency: 'THB',
                date: new Date(currentDate.getTime() - Math.random() * 1000 * 60 * 60 * 10).toISOString(),
                type: 'expense',
                category: template.cat,
            });
        }

        // Add incoming transfer once a month to UAH card
        if (dayOfMonth === 5) {
            transactions.push({
                id: `tx-${currentDate.getTime()}-income`,
                cardId: uahCardId,
                description: 'Incoming Transfer',
                amount: 45000.00,
                currency: 'UAH',
                date: currentDate.toISOString(),
                type: 'income',
                category: 'Freelance',
            });
        }

        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Sort transactions by date descending
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};


export const INITIAL_MOCK_TRANSACTIONS: Transaction[] = generateMockTransactions();


export const QUICK_ACTIONS: { labelKey: string, icon: LucideIcon, action: 'transfer' | 'pay' | 'topup' | 'cards' }[] = [
    { labelKey: 'transfer', icon: Send, action: 'transfer' },
    { labelKey: 'pay', icon: CreditCard, action: 'pay' },
    { labelKey: 'topup', icon: Landmark, action: 'topup' },
    { labelKey: 'analytics', icon: PieChart, action: 'cards' },
];

export const MOCK_SAVINGS_POTS: SavingsPot[] = [
    { id: 'pot-1', ownerUserId: 'user-1', title: 'Vacation to Italy', targetAmount: 80000, currentAmount: 35000, currency: 'UAH', imageUrl: 'https://images.unsplash.com/photo-1515859005805-2452062d0981?q=80&w=800', status: 'active', createdAt: new Date().toISOString() },
    { id: 'pot-2', ownerUserId: 'user-1', title: 'New Laptop', targetAmount: 1500, currentAmount: 1450, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800', status: 'active', createdAt: new Date().toISOString() },
];

export const MOCK_POT_TRANSACTIONS: PotTransaction[] = [
    { id: 'ptx-1', potId: 'pot-1', type: 'top_up', amount: 5000, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'ptx-2', potId: 'pot-1', type: 'top_up', amount: 10000, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'ptx-3', potId: 'pot-2', type: 'top_up', amount: 500, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];

export const texts = {
    ua: {
        hello: 'Привіт',
        mainBalance: 'Загальний баланс',
        quickActions: 'Швидкі дії',
        transfer: 'Переказ',
        pay: 'Платіж',
        topup: 'Поповнити',
        cards: 'Картки',
        recentTransactions: 'Останні транзакції',
        home: 'Головна',
        analytics: 'Аналітика',
        savings: 'Накопичення',
        support: 'Підтримка',
        settings: 'Налаштування',
        cardBlocked: 'Картку заблоковано',
        chatWelcome: "Привіт! Я ваш фінансовий помічник. Чим можу допомогти?",
        generatingResponse: "Генерую відповідь...",
        chatPlaceholder: "Запитайте щось...",
        loginTitle: 'KredoBank',
        loginSubtitle: 'Ваш надійний мобільний банкінг',
        enterPin: 'Введіть PIN-код',
        incorrectPin: 'Неправильний PIN',
        passkeyLoginSuccess: 'Автентифікація успішна!',
        passkeyError: 'Помилка автентифікації',
        transferFunds: 'Переказ коштів',
        fromCard: 'З картки',
        recipientCardNumber: 'Номер картки отримувача',
        amount: 'Сума',
        send: 'Надіслати',
        transferSuccess: 'Переказ успішний!',
        transferOffline: 'Транзакція збережена і буде виконана, коли з\'явиться зв\'язок.',
        notEnoughFunds: 'Недостатньо коштів',
        appInstalled: 'Додаток встановлено',
        installApp: 'Встановити додаток',
        profile: 'Профіль',
        changePhoto: 'Змінити фото',
        firstName: 'Ім\'я',
        lastName: 'Прізвище',
        saveProfile: 'Зберегти профіль',
        profileSaved: 'Профіль збережено!',
        theme: 'Тема',
        light: 'Світла',
        dark: 'Темна',
        language: 'Мова',
        passkey: 'Ключ доступу (Passkey)',
        registerPasskey: 'Зареєструвати Passkey',
        passkeyRegistered: 'Passkey успішно зареєстровано!',
        logout: 'Вийти',
        manageCard: 'Керування карткою',
        blockCard: 'Заблокувати картку',
        spendingLimits: 'Ліміти витрат',
        onlineLimit: 'Онлайн-ліміт',
        withdrawalLimit: 'Ліміт на зняття готівки',
        perMonth: 'на місяць',
        security: 'Безпека',
        changePin: 'Змінити PIN',
        cardDetails: 'Дані картки',
        cardNumber: 'Номер картки',
        expires: 'Термін дії',
        saveChanges: 'Зберегти зміни',
        changesSaved: 'Зміни збережено!',
        pinChangedSuccess: 'PIN успішно змінено!',
        mySavingsPots: 'Мої Банки',
        createNewPot: 'Створити Банку',
        collected: 'Накопичено',
        of: 'з',
        withdraw: 'Зняти',
        potHistory: 'Історія Банки',
        topUpPot: 'Поповнити Банку',
        withdrawFromPot: 'Зняти з Банки',
        operationSuccessful: 'Операція успішна!',
        insufficientFundsInPot: 'Недостатньо коштів у Банці.',
        potTitle: 'Назва Банки',
        potTitlePlaceholder: 'Наприклад, "На новий iPhone"',
        targetAmount: 'Цільова сума',
        currency: 'Валюта',
        imageUrl: 'URL зображення (необов\'язково)',
        imageUrlPlaceholder: 'Залиште порожнім для авто-генерації',
        create: 'Створити',
        spendingByCategory: 'Витрати за категоріями',
        viewAll: 'Дивитись усі',
        allTransactions: 'Всі транзакції',
        startDate: 'Початкова дата',
        endDate: 'Кінцева дата',
        today: 'Сьогодні',
        yesterday: 'Вчора',
        debugPanel: 'Панель налагодження',
        updateBalances: 'Оновити баланси',
        balancesUpdated: 'Баланси оновлено!',
        addNewTransaction: 'Додати нову транзакцію',
        transactionAdded: 'Транзакцію додано!',
        description: 'Опис',
        category: 'Категорія',
        type: 'Тип',
        income: 'Дохід',
        expense: 'Витрата',
        date: 'Дата',
        selectCard: 'Вибрати картку',
        confirmLogout: 'Підтвердити вихід',
        exchangeRates: 'Курси валют',
        viewAllExchangeRates: 'Переглянути всі курси валют',
    },
    en: {
        hello: 'Hello',
        mainBalance: 'Main balance',
        quickActions: 'Quick Actions',
        transfer: 'Transfer',
        pay: 'Pay',
        topup: 'Top-up',
        cards: 'Cards',
        recentTransactions: 'Recent Transactions',
        home: 'Home',
        analytics: 'Analytics',
        savings: 'Savings',
        support: 'Support',
        settings: 'Settings',
        cardBlocked: 'Card is blocked',
        chatWelcome: "Hi! I'm your financial assistant. How can I help you?",
        generatingResponse: "Generating response...",
        chatPlaceholder: "Ask me anything...",
        loginTitle: 'KredoBank',
        loginSubtitle: 'Your trusted mobile banking',
        enterPin: 'Enter PIN code',
        incorrectPin: 'Incorrect PIN',
        passkeyLoginSuccess: 'Authentication successful!',
        passkeyError: 'Authentication failed.',
        transferFunds: 'Transfer Funds',
        fromCard: 'From card',
        recipientCardNumber: 'Recipient card number',
        amount: 'Amount',
        send: 'Send',
        transferSuccess: 'Transfer successful!',
        transferOffline: 'Transaction saved and will be processed when you are back online.',
        notEnoughFunds: 'Not enough funds',
        appInstalled: 'App is installed',
        installApp: 'Install App',
        profile: 'Profile',
        changePhoto: 'Change photo',
        firstName: 'First Name',
        lastName: 'Last Name',
        saveProfile: 'Save Profile',
        profileSaved: 'Profile saved!',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        language: 'Language',
        passkey: 'Passkey',
        registerPasskey: 'Register Passkey',
        passkeyRegistered: 'Passkey registered successfully!',
        logout: 'Log out',
        manageCard: 'Manage Card',
        blockCard: 'Block card',
        spendingLimits: 'Spending Limits',
        onlineLimit: 'Online limit',
        withdrawalLimit: 'Withdrawal limit',
        perMonth: 'per month',
        security: 'Security',
        changePin: 'Change PIN',
        cardDetails: 'Card Details',
        cardNumber: 'Card number',
        expires: 'Expires',
        saveChanges: 'Save Changes',
        changesSaved: 'Changes saved!',
        pinChangedSuccess: 'PIN changed successfully!',
        mySavingsPots: 'My Savings Pots',
        createNewPot: 'Create New Pot',
        collected: 'Collected',
        of: 'of',
        withdraw: 'Withdraw',
        potHistory: 'Pot History',
        topUpPot: 'Top-up Pot',
        withdrawFromPot: 'Withdraw from Pot',
        operationSuccessful: 'Operation successful!',
        insufficientFundsInPot: 'Insufficient funds in the pot.',
        potTitle: 'Pot Title',
        potTitlePlaceholder: 'e.g., "For a new iPhone"',
        targetAmount: 'Target Amount',
        currency: 'Currency',
        imageUrl: 'Image URL (optional)',
        imageUrlPlaceholder: 'Leave empty to auto-generate',
        create: 'Create',
        spendingByCategory: 'Spending by Category',
        viewAll: 'View all',
        allTransactions: 'All Transactions',
        startDate: 'Start Date',
        endDate: 'End Date',
        today: 'Today',
        yesterday: 'Yesterday',
        debugPanel: 'Debug Panel',
        updateBalances: 'Update Balances',
        balancesUpdated: 'Balances updated!',
        addNewTransaction: 'Add New Transaction',
        transactionAdded: 'Transaction added!',
        description: 'Description',
        category: 'Category',
        type: 'Type',
        income: 'Income',
        expense: 'Expense',
        date: 'Date',
        selectCard: 'Select Card',
        confirmLogout: 'Confirm Logout',
        exchangeRates: 'Exchange Rates',
        viewAllExchangeRates: 'View all exchange rates',
    }
};