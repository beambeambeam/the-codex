import Link from 'next/link';

function RegisterPage() {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="flex items-center justify-center h-full flex-col ">
        <div>
          <h1 className="text-3xl font-bold">The Codex</h1>
          <h1 className="text-3xl">Your’s Agentic Ai Librarians</h1>
        </div>
      </div>
      <div className="flex items-center justify-center h-full">
        <p className="text-accent-foreground/60">
          Already have an account?{' '}
          <Link href="/sign-in">
            <b>Sign in!</b>
          </Link>
        </p>
      </div>
    </div>
  );
}
export default RegisterPage;
