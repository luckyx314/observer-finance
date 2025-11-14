"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { walletAPI } from "@/services/api";
import type { Wallet } from "@/types";

export function WalletManager() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);

    const [name, setName] = useState("");
    const [balance, setBalance] = useState("");
    const [currency, setCurrency] = useState("PHP");

    const fetchWallets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await walletAPI.getAll();
            setWallets(data);
        } catch (error) {
            console.error("Failed to load wallets", error);
            toast.error("Unable to load wallets");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    const totalBalance = useMemo(
        () => wallets.reduce((acc, wallet) => acc + wallet.balance, 0),
        [wallets]
    );

    const resetForm = () => {
        setName("");
        setBalance("");
        setCurrency("PHP");
        setEditingWallet(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!name.trim()) {
            toast.error("Please enter a wallet name");
            return;
        }
        const parsedBalance = Number(balance);
        if (Number.isNaN(parsedBalance)) {
            toast.error("Please enter a valid balance");
            return;
        }

        const payload = {
            name: name.trim(),
            balance: parsedBalance,
            currency: currency.trim().toUpperCase() || "PHP",
        };

        try {
            if (editingWallet) {
                setSavingEdit(true);
                const updated = await walletAPI.update(editingWallet.id, payload);
                setWallets((prev) =>
                    prev.map((wallet) => (wallet.id === updated.id ? updated : wallet))
                );
                toast.success(`Wallet "${updated.name}" updated`);
            } else {
                setSubmitting(true);
                const newWallet = await walletAPI.create(payload);
                setWallets((prev) => [newWallet, ...prev]);
                toast.success(`Wallet "${newWallet.name}" added`);
            }

            resetForm();
        } catch (error) {
            console.error("Failed to save wallet", error);
            toast.error("Unable to save wallet");
        } finally {
            setSubmitting(false);
            setSavingEdit(false);
        }
    };

    const handleRemoveWallet = async (id: number) => {
        try {
            setDeletingId(id);
            await walletAPI.remove(id);
            setWallets((prev) => prev.filter((wallet) => wallet.id !== id));
            toast.success("Wallet removed");
        } catch (error) {
            console.error("Failed to remove wallet", error);
            toast.error("Unable to remove wallet");
        } finally {
            setDeletingId(null);
        }
    };

    const startEditing = (wallet: Wallet) => {
        setEditingWallet(wallet);
        setName(wallet.name);
        setBalance(wallet.balance.toString());
        setCurrency(wallet.currency);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Wallets</CardTitle>
                <CardDescription>Track balances across banks, cash, and cards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form className="grid gap-4 md:grid-cols-[2fr,2fr,1fr,auto]" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="wallet-name">Wallet name</Label>
                        <Input
                            id="wallet-name"
                            placeholder="e.g. Payroll Account"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="wallet-balance">Current balance</Label>
                        <Input
                            id="wallet-balance"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={balance}
                            onChange={(event) => setBalance(event.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="wallet-currency">Currency</Label>
                        <Input
                            id="wallet-currency"
                            maxLength={5}
                            value={currency}
                            onChange={(event) => setCurrency(event.target.value.toUpperCase())}
                        />
                    </div>
                    <div className="flex items-end justify-end gap-3">
                        {editingWallet && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={resetForm}
                                disabled={savingEdit}
                                className="px-6"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={submitting || savingEdit}
                            className="px-6"
                        >
                            {editingWallet
                                ? savingEdit
                                    ? "Updating..."
                                    : "Update"
                                : submitting
                                  ? "Adding..."
                                  : "Add"}
                        </Button>
                    </div>
                </form>

                <Separator />

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Total balance</p>
                        <p className="text-2xl font-semibold">
                            ₱
                            {totalBalance.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" disabled={loading} onClick={fetchWallets}>
                        Refresh
                    </Button>
                </div>

                {loading ? (
                    <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                        Loading wallets...
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {wallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className="rounded-lg border border-border/60 p-4 shadow-xs"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-medium">{wallet.name}</p>
                                        <p className="text-xs text-muted-foreground">{wallet.currency}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs text-muted-foreground"
                                            onClick={() => startEditing(wallet)}
                                            disabled={deletingId === wallet.id}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs text-muted-foreground"
                                            onClick={() => handleRemoveWallet(wallet.id)}
                                            disabled={deletingId === wallet.id}
                                        >
                                            {deletingId === wallet.id ? "Removing..." : "Remove"}
                                        </Button>
                                    </div>
                                </div>
                                <p className="mt-2 text-xl font-semibold">
                                    ₱
                                    {wallet.balance.toLocaleString("en-PH", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        ))}
                        {wallets.length === 0 && (
                            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                                No wallets yet. Add one to get started.
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
