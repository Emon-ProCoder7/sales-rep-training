import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas-black px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(232,209,171,0.14) 0%, rgba(16,16,16,0) 70%)",
        }}
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <img
            src="/beige-icon.png"
            alt="Beige"
            className="h-14 w-14 rounded-full"
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-warm-beige">
              Beige Sales Rep Training
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold text-pure-white">
              Welcome back
            </h1>
          </div>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
