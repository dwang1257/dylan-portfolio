const TIME_ZONE = "America/Los_Angeles";

export function currentDay() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}
