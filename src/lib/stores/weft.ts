import { writable } from "svelte/store";
import PrecisionNumber from "../PrecisionNumber";

function createAmmountToCollect() {
  const { subscribe, update } = writable(new Map<string, PrecisionNumber>());

  function add(resourceAddress: string, amount: PrecisionNumber): void {
    update((amounts) => {
      const exsingAmount = amounts.get(resourceAddress);
      if (exsingAmount) {
        amounts.set(resourceAddress, exsingAmount.plus(amount));
      } else {
        amounts.set(resourceAddress, amount);
      }
      return amounts;
    });
  }

  function remove(resourceAddress: string, amount: PrecisionNumber): void {
    update((amounts) => {
      const exsingAmount = amounts.get(resourceAddress);
      if (exsingAmount) {
        amounts.set(resourceAddress, exsingAmount.minus(amount));
        if (
          amounts
            .get(resourceAddress)
            ?.isLessThanOrEqualTo(PrecisionNumber.ZERO())
        ) {
          amounts.delete(resourceAddress);
        }
      } else {
        amounts.set(resourceAddress, amount);
      }
      return amounts;
    });
  }

  return {
    subscribe,
    add,
    remove,
  };
}
export const amountToCollect = createAmmountToCollect();
