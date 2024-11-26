import { create } from "zustand";

export const useReceiptStore = create((set) => ({
  receiptsStore: [],
  addReceipt: (loadReceipts) =>
    set(() => ({
      receiptsStore: loadReceipts,
    })),

  deleteReceipt: (id) =>
    set((state) => ({
      receiptsStore: state.receiptsStore.filter(
        (receipt) => receipt[0].id !== id
      ),
    })),
}));
