import { writable } from "svelte/store";
import PrecisionNumber from "../PrecisionNumber";

export const loanQuantity = writable(PrecisionNumber.ZERO());
