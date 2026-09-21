"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type InviteState = "checking" | "ready" | "invalid" | "saving" | "done";

export function AdminAccept() {
  const [state, setState] = useState<InviteState>("checking");
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const token = params.get("access_token") ?? "";
      const type = params.get("type");
      if (!token || (type && type !== "invite" && type !== "recovery")) {
        setState("invalid");
        return;
      }
      setAccessToken(token);
      setState("ready");
    }, 0);
    return () => window.clearTimeout(handle);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key || !accessToken) {
      setError("El enlace no está completo. Solicita una nueva invitación.");
      return;
    }

    setState("saving");
    const response = await fetch(`${url}/auth/v1/user`, {
      method: "PUT",
      headers: {
        apikey: key,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(
        body?.message ??
          "No se pudo guardar la contraseña. Solicita una nueva invitación.",
      );
      setState("ready");
      return;
    }

    window.history.replaceState(null, "", "/admin/accept");
    setAccessToken("");
    setState("done");
  }

  if (state === "checking")
    return <p className="text-center text-slate-300">Validando invitación…</p>;
  if (state === "invalid")
    return (
      <div className="card rounded-[28px] p-7 text-center">
        <h1 className="display text-2xl font-bold">Enlace no válido</h1>
        <p className="muted mt-3 text-sm">
          Abre el enlace completo desde el correo de invitación.
        </p>
        <Link href="/admin/login" className="button-secondary mt-6">
          Volver al acceso
        </Link>
      </div>
    );
  if (state === "done")
    return (
      <div className="card rounded-[28px] p-7 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#b6f500] text-2xl text-[#0b1020]">
          ✓
        </div>
        <h1 className="display mt-5 text-2xl font-bold">Contraseña creada</h1>
        <p className="muted mt-3 text-sm">
          Ya puedes ingresar al panel de YaTeTocaPerú.
        </p>
        <Link href="/admin/login" className="button-primary mt-6">
          Ingresar al panel
        </Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="card rounded-[28px] p-7">
      <h1 className="display text-3xl font-bold">Activa tu acceso</h1>
      <p className="muted mt-3 text-sm">
        Crea una contraseña exclusiva para administrar YaTeTocaPerú.
      </p>
      <div className="mt-6">
        <label className="field-label" htmlFor="password">
          Nueva contraseña
        </label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
        />
      </div>
      <div className="mt-4">
        <label className="field-label" htmlFor="confirmation">
          Repite la contraseña
        </label>
        <input
          className="input"
          id="confirmation"
          name="confirmation"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
        />
      </div>
      {error && (
        <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <button
        className="button-primary mt-6 w-full"
        disabled={state === "saving"}
      >
        {state === "saving" ? "Guardando…" : "Crear contraseña"}
      </button>
    </form>
  );
}
