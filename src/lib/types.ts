export type Raffle = { id:string; name:string; slug:string; description:string; totalSlots:number; soldSlots:number; drawDate:string|null; drawLabel:string; approximateValue:number; status:"draft"|"active"|"sold_out"|"drawn"|"cancelled"; demo?:boolean; features:string[]; estimatedDelivery:string; prizeImages:string[]; };
export type OrderStatus = "pending" | "validated" | "rejected";
export type AdminOrder = { id:string; orderCode:string; fullName:string; dni:string; phone:string; email:string; quantity:number; amount:number; paymentOperation:string; paymentProofUrl:string|null; status:OrderStatus; createdAt:string; ticketNumbers:number[]; };
export type OrderLookupResult = { orderCode:string; status:OrderStatus; ticketNumbers:number[]; message:string; };
export type WinnerStory = {
  id: string;
  winnerName: string;
  prizeName: string;
  city: string;
  drawDate: string;
  ticketLabel: string;
  story: string | null;
  photoUrl: string | null;
  status: "draft" | "published";
};
