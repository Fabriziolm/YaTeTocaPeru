"use client";
import { useEffect,useId,useRef } from "react";
import { Close } from "@/components/icons";

export function Modal({open,onClose,title,children,wide=false}:{open:boolean;onClose:()=>void;title:string;children:React.ReactNode;wide?:boolean}){
  const panel=useRef<HTMLDivElement>(null),titleId=useId(),onCloseRef=useRef(onClose);
  useEffect(()=>{onCloseRef.current=onClose},[onClose]);
  useEffect(()=>{if(!open)return;const previous=document.activeElement as HTMLElement|null;const key=(event:KeyboardEvent)=>{if(event.key==="Escape")onCloseRef.current();if(event.key==="Tab"&&panel.current){const focusable=[...panel.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1)!;if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}};document.body.style.overflow="hidden";window.addEventListener("keydown",key);requestAnimationFrame(()=>panel.current?.querySelector<HTMLElement>("input,button[aria-label='Cerrar'],a")?.focus());return()=>{document.body.style.overflow="";window.removeEventListener("keydown",key);previous?.focus()}},[open]);
  if(!open)return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={event=>event.target===event.currentTarget&&onClose()}><div ref={panel} className={`max-h-[94vh] w-full overflow-y-auto rounded-t-[28px] border border-[#263859] bg-[#081020] p-5 shadow-2xl sm:rounded-[28px] sm:p-7 ${wide?"max-w-4xl":"max-w-xl"}`} role="dialog" aria-modal="true" aria-labelledby={titleId}><div className="mb-5 flex items-center justify-between gap-4"><h2 id={titleId} className="display text-xl font-bold">{title}</h2><button onClick={onClose} className="rounded-full border border-white/10 p-2 text-slate-300" aria-label="Cerrar"><Close/></button></div>{children}</div></div>;
}
