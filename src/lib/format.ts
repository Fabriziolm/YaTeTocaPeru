export const money = (value:number) => new Intl.NumberFormat("es-PE", { style:"currency", currency:"PEN", maximumFractionDigits:0 }).format(value);
export const percent = (quantity:number, total:number) => `${((quantity / total) * 100).toFixed(2)}%`;
export const ticketLabel = (number:number, total:number) => `#${String(number).padStart(String(total).length,"0")}`;
