export const transactionType = [
    "Expense",
    "Income",
    "Savings",
    "Liability",
    "Investment",
];

// Type-specific categories
export const categoryByType = {
    Expense: [
        "Food",
        "Transportation",
        "Education",
        "Subscription",
        "Bills",
        "Healthcare",
        "Entertainment",
        "Shopping",
        "Utilities",
        "Personal Care",
        "Insurance",
        "Other",
    ],
    Income: [
        "Salary",
        "Commission",
        "Dividend",
        "Interest",
        "Bonus",
        "Freelance",
        "Gift",
        "Refund",
        "Rental Income",
        "Business Income",
        "Other",
    ],
    Savings: [
        "Emergency Fund",
        "Retirement",
        "Investment Fund",
        "Education Fund",
        "Vacation",
        "House Down Payment",
        "Other",
    ],
    Liability: [
        "Credit Card",
        "Personal Loan",
        "Mortgage",
        "Auto Loan",
        "Student Loan",
        "Tax",
        "Medical Bill",
        "Other",
    ],
    Investment: [
        "Stocks",
        "Bonds",
        "Mutual Funds",
        "ETF",
        "Real Estate",
        "Crypto",
        "Commodities",
        "Retirement Account",
        "Other",
    ],
};

// Legacy categories for backward compatibility
export const categories = categoryByType.Expense;

// Dynamic field labels based on transaction type
export const fieldLabelsByType = {
    Expense: {
        merchant: "Merchant",
        merchantPlaceholder: "ex. Jollibee",
    },
    Income: {
        merchant: "Source",
        merchantPlaceholder: "ex. Acme Corp",
    },
    Savings: {
        merchant: "Account",
        merchantPlaceholder: "ex. High Yield Savings",
    },
    Liability: {
        merchant: "Creditor",
        merchantPlaceholder: "ex. Bank of America",
    },
    Investment: {
        merchant: "Platform/Broker",
        merchantPlaceholder: "ex. Vanguard",
    },
};
