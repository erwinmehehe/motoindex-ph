import type { Motorcycle } from "./types";
import { estimatedEfficiency, ownershipDefaults } from "./ownership";

export const DEFAULT_COMMUTE_DAYS = 22;
export const DEFAULT_DAILY_KM = 20;
export const DEFAULT_FUEL_PRICE_PHP = 65;

export function hasAbs(model: Motorcycle) {
  return /\bABS\b/i.test(model.abs) && !/^No ABS/i.test(model.abs);
}

export function modelEfficiency(model: Motorcycle) {
  return model.fuelConsumptionKmL || estimatedEfficiency(model);
}

export function commuteMonthlyCosts(model: Motorcycle, dailyKm = DEFAULT_DAILY_KM, days = DEFAULT_COMMUTE_DAYS, fuelPrice = DEFAULT_FUEL_PRICE_PHP, parkingPerDay = 0, maintenanceMonthly?: number) {
  const monthlyKm = Math.max(0, dailyKm) * Math.max(0, days);
  const kmpl = Math.max(1, modelEfficiency(model));
  const liters = monthlyKm / kmpl;
  const fuel = liters * Math.max(0, fuelPrice);
  const maintenance = maintenanceMonthly ?? ownershipDefaults(model).maintenancePerMonth;
  const parking = Math.max(0, parkingPerDay) * Math.max(0, days);
  const total = fuel + maintenance + parking;
  return { monthlyKm, kmpl, liters, fuel, maintenance, parking, total, perWorkday: days > 0 ? total / days : 0 };
}

export function maxPurchasePriceFromBudget(monthlyTakeHome:number, sharePct:number, runningReserve:number, downPayment:number, annualRatePct:number, months:number) {
  const totalMonthlyBudget = Math.max(0, monthlyTakeHome) * Math.max(0, Math.min(100, sharePct)) / 100;
  const paymentBudget = Math.max(0, totalMonthlyBudget - Math.max(0, runningReserve));
  const r = Math.max(0, annualRatePct) / 100 / 12;
  const principal = months <= 0 ? 0 : r === 0 ? paymentBudget * months : paymentBudget * (Math.pow(1+r,months)-1) / (r*Math.pow(1+r,months));
  return { totalMonthlyBudget, paymentBudget, principal, maxPurchasePrice: principal + Math.max(0, downPayment) };
}
