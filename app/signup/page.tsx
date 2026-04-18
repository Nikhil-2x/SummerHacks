import Link from "next/link";
import AuthForm from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 bottom-4 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -right-28 top-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_hsl(var(--accent)/0.14),_transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-primary"
          >
            LabLens
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Already registered?
          </Link>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex justify-center lg:justify-start">
            <AuthForm mode="signup" />
          </section>

          <section className="hidden space-y-5 lg:block lg:justify-self-end">
            <p className="inline-flex rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Create account
            </p>
            <h1 className="max-w-xl text-4xl font-serif leading-tight tracking-tight">
              Build your personal health baseline with LabLens.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Sign up using email and password, then upload your reports and
              keep every insight in one organized, secure workspace.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
