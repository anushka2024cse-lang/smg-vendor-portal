// src/api/operationsApi.js

const BASE_URL = "http://localhost:4000/api/operations";

export async function getProductionSchedule() {
  const res = await fetch(`${BASE_URL}/production-schedule`);
  if (!res.ok) {
    throw new Error("Failed to fetch production schedule");
  }
  return res.json();
}

export async function getStoreBins() {
  const res = await fetch(`${BASE_URL}/store-bins`);
  if (!res.ok) {
    throw new Error("Failed to fetch store / bin details");
  }
  return res.json();
}
