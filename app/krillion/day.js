const TIME_ZONE = "America/New_York";

export function currentDay() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}
