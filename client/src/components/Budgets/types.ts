import type { Icon } from "@tabler/icons-react";
import type { Budget } from "@/types";

export type BudgetStatus = "on-track" | "at-risk" | "exceeded";

export interface ComputedBudget extends Budget {
    icon: Icon;
    spent: number;
    variance: number;
    utilization: number;
    status: BudgetStatus;
}

export interface BudgetInsight {
    id: number;
    label: string;
    status: Exclude<BudgetStatus, "on-track">;
    variance: number;
    limit: number;
}

export interface BudgetFormInput {
    label: string;
    category: string;
    limit: number;
    description?: string;
}

export interface PaymentReminderInput {
    name: string;
    category: string;
    amount: number;
    dueDate: string;
    autoPay: boolean;
    status?: string;
}
