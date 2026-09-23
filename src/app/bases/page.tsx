import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/site";

export const metadata: Metadata = {
  title: "Bases legales — borrador | YaTeToca Perú",
  robots: { index: false, follow: false },
};

const Pending = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-amber-200">{children}</span>
);

export default function Bases() {
  return (
    <Legal title="Bases legales — borrador de trabajo">
      <Notice />

      <h2>1. Organizador y denominación</h2>
      <p>
        La dinámica se denomina <strong>YaTeToca Auto Nuevo</strong> y será organizada por <Pending>[[razón social o nombre completo]]</Pending>, RUC/DNI <Pending>[[●]]</Pending>, con domicilio en <Pending>[[●]]</Pending>, correo <Pending>[[●]]</Pending> y teléfono <Pending>[[●]]</Pending> (el “Organizador”). Estos datos deben completarse antes de publicar o cobrar.
      </p>

      <h2>2. Ámbito y vigencia</h2>
      <p>
        Participan personas ubicadas en cualquier departamento del Perú. La vigencia será desde <Pending>[[fecha de inicio por confirmar]]</Pending> hasta el <strong>22 de diciembre de 2026</strong>, o hasta agotar los 3,000 cupos, lo que ocurra primero. El año y la fecha de inicio deben confirmarse en la versión firmada.
      </p>

      <h2>3. Participantes</h2>
      <p>
        Pueden participar únicamente personas naturales mayores de 18 años, con DNI o carné de extranjería vigente y capacidad para contratar. Cada persona solo podrá tener una cuenta y deberá registrar nombre completo, celular y correo propios. Se excluye al Organizador, sus trabajadores, proveedores directamente involucrados y sus familiares hasta el grado que determine la versión aprobada.
      </p>

      <h2>4. Cupos, tickets y límite de compra</h2>
      <p>
        La dinámica tendrá 3,000 oportunidades numeradas. El precio es S/50 por ticket. Los paquetes son: 1 ticket por S/50, 3 tickets por S/130 y 5 tickets por S/220. El máximo es de 5 tickets por persona para esta dinámica. Un número solo será elegible cuando el pago haya sido recibido, conciliado y validado por el Organizador.
      </p>

      <h2>5. Compra y medios de pago</h2>
      <p>
        La persona elige un paquete en el carrito y proporciona sus datos. Se admitirán Yape y tarjeta de débito/crédito cuando los canales estén habilitados. Una operación aparecerá como “pendiente” hasta verificar el abono; no se asignará un número definitivo con una captura ilegible, duplicada o inconsistente. La política final de anulaciones, devoluciones, contracargos y pagos no conciliados debe aprobarse antes de abrir ventas: <Pending>[[pendiente de definir]]</Pending>.
      </p>

      <h2>6. Reprogramación</h2>
      <p>
        Si no se completan los cupos, ocurre un hecho de fuerza mayor o existe una causa objetiva que impida realizar el sorteo, el Organizador podrá reprogramarlo hasta dos veces, por un máximo de 15 días calendario cada vez. La nueva fecha y motivo se comunicarán en la web y redes oficiales, además de los canales de contacto disponibles. El tratamiento de los pagos si el sorteo no pudiera realizarse después de la segunda reprogramación queda <Pending>[[pendiente de definir y revisar legalmente]]</Pending>.
      </p>

      <h2>7. Premios</h2>
      <ol>
        <li><strong>Premio estelar:</strong> una Changan X7 Plus modelo 2027, valor referencial S/54,565, a entregar en Lima. Versión, color, equipamiento, placa, inscripción, seguro, impuestos y gastos de transferencia: <Pending>[[confirmar por escrito]]</Pending>.</li>
        <li><strong>Segundo premio:</strong> un iPhone 17 Pro nuevo y sellado. Capacidad, color, operador y condiciones de garantía: <Pending>[[confirmar]]</Pending>.</li>
        <li><strong>Tercer premio:</strong> viaje para dos personas a Cusco con pasajes y hospedaje. El ganador propondrá las fechas, sujetas a disponibilidad, restricciones de temporada y condiciones del proveedor. Número de noches, ruta, categoría, impuestos y exclusiones: <Pending>[[confirmar]]</Pending>.</li>
        <li><strong>Premios cuarto a séptimo:</strong> cuatro premios de S/200 cada uno. Forma y plazo de entrega: <Pending>[[transferencia, efectivo u otro; confirmar]]</Pending>.</li>
      </ol>
      <p>Los seis ganadores serán personas distintas. Los premios no son canjeables por dinero, salvo que la versión definitiva disponga expresamente lo contrario y la ley lo permita.</p>

      <h2>8. Sorteo y transparencia</h2>
      <p>
        El sorteo se realizará en vivo en la cuenta oficial de Instagram de YaTeToca Perú, con participación o certificación de un notario. Se utilizará la página Sortea2 como herramienta de selección aleatoria, sobre el listado cerrado de números pagados y validados. El orden previsto es: cuatro premios de S/200, viaje a Cusco, iPhone 17 Pro y Changan X7 Plus como gran final. Se conservará y publicará el acta, la grabación y el resultado verificable, en la medida permitida por la protección de datos. El método técnico y la fecha exacta deben ser validados por el notario antes del sorteo.
      </p>

      <h2>9. Contacto, validación y reclamo del premio</h2>
      <p>
        El Organizador contactará a cada ganador hasta en tres oportunidades, utilizando distintos canales razonables (correo, celular, WhatsApp u otros datos registrados). El ganador tendrá 30 días calendario desde la primera comunicación fehaciente para acreditar su identidad y reclamar. Si no responde, no cumple los requisitos o sus datos son falsos, se dejará constancia y se realizará una nueva selección conforme al método aprobado, comunicándolo públicamente.
      </p>

      <h2>10. Entrega</h2>
      <p>
        Todos los premios se entregan en Perú; el vehículo se entrega en Lima. La entrega queda sujeta a la verificación de identidad y a la firma del cargo o acta correspondiente. Gastos de traslado del ganador, tributos, registros, seguros y cualquier costo asociado deben quedar asignados expresamente en la versión final para cada premio.
      </p>

      <h2>11. Sorteos flash y comunidad</h2>
      <p>
        Para sorteos flash independientes, podrá exigirse pertenecer a la comunidad oficial y seguir los canales de WhatsApp, Instagram y TikTok indicados en la convocatoria. Este requisito no se aplica automáticamente a YaTeToca Auto Nuevo. Cada sorteo flash tendrá sus propias bases, fechas, premios y mecanismo publicados antes de participar.
      </p>

      <h2>12. Exclusiones y prevención de fraude</h2>
      <p>
        Se anularán participaciones duplicadas, obtenidas con datos de terceros, mediante comprobantes falsos, manipulación del sistema, bots, contracargos o cualquier conducta destinada a alterar la igualdad de oportunidades. El Organizador podrá solicitar documentos razonables para validar identidad y pago, dejando constancia de la decisión.
      </p>

      <h2>13. Datos personales y derechos ARCO</h2>
      <p>
        Se tratarán nombre, celular y correo para registrar la participación, conciliar pagos, asignar números, contactar ganadores, gestionar entregas, atender consultas y cumplir obligaciones legales. Responsable del banco de datos, política de privacidad, plazo de conservación y contacto para ejercer derechos de acceso, rectificación, cancelación y oposición (ARCO): <Pending>[[completar correo y domicilio]]</Pending>.
      </p>

      <h2>14. Consultas y reclamos</h2>
      <p>
        Canal de atención: <Pending>[[correo, WhatsApp y domicilio]]</Pending>. Libro de Reclamaciones y procedimiento de atención: <Pending>[[completar antes de publicar]]</Pending>.
      </p>

      <h2>15. Autorizaciones y condición de lanzamiento</h2>
      <p>
        El Organizador declara que, a la fecha de este borrador, aún no cuenta con las autorizaciones y permisos definitivos. No deben abrirse ventas ni recibirse pagos hasta verificar la autorización administrativa que corresponda, la presencia o certificación notarial, las obligaciones tributarias y la revisión de estas bases por un abogado en Perú. La versión que se publique deberá indicar la autoridad, número y fecha de cada autorización aplicable.
      </p>

      <h2>16. Aceptación y jurisdicción</h2>
      <p>
        La participación implica aceptar las bases definitivas publicadas y la legislación peruana. Cualquier cambio deberá comunicarse antes de afectar derechos ya adquiridos y conservarse en un historial público de versiones.
      </p>

      <p className="muted mt-10 text-sm">Versión técnica: {BRAND.legalVersion}. Documento de trabajo no habilitado para ventas.</p>
    </Legal>
  );
}

function Notice() {
  return (
    <div className="mb-8 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5 text-amber-100">
      <strong>NO PUBLICAR NI ACEPTAR PAGOS CON ESTE TEXTO.</strong>
      <p className="mt-2 text-sm leading-6">Es un borrador técnico. Faltan datos del organizador, permisos, condiciones de los premios, canal ARCO, reclamos y reglas de devolución. Debe revisarlo un abogado peruano y validarlo con notario antes de lanzar.</p>
    </div>
  );
}

function Legal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="shell py-16">
      <Link href="/" className="text-blue-300">← Volver</Link>
      <article className="prose prose-invert mt-10 max-w-4xl [&_h1]:font-[var(--font-display)] [&_h1]:text-4xl [&_h2]:mt-10 [&_h2]:font-[var(--font-display)] [&_h2]:text-2xl [&_p]:leading-7 [&_p]:text-slate-300 [&_li]:text-slate-300"><h1>{title}</h1>{children}</article>
    </main>
  );
}
