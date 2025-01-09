import dayjs from "dayjs";

export const germanDate = (date: string) => dayjs(date).format("DD.MM.YYYY");

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function formatPrice(price?: string) {
  if (!price) return "0";
  return price.replace(/€(\d+)/, "$1 € pro Tag");
}
