import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Privacidad() {
  return <main className="shell py-16"><Link href="/" className="text-blue-300">← Volver</Link><article className="mt-10 max-w-3xl"><h1 className="display text-4xl font-bold">Privacidad — borrador</h1><div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-100">Completar con asesoría legal, responsable del banco de datos, finalidades, transferencias, conservación y canal ARCO antes del lanzamiento.</div><p className="muted mt-8 leading-7">La aplicación recopila nombre, DNI, celular, correo y datos del pago para validar la participación, prevenir duplicados, asignar números y contactar al comprador. Los comprobantes se almacenan de forma privada y solo son accesibles para administradores autorizados mediante enlaces temporales.</p><p className="muted mt-5 leading-7">No se publican datos personales en el listado de números. La persona puede solicitar acceso, rectificación, cancelación u oposición a través del canal que el organizador indique en la versión definitiva.</p></article></main>;
}
