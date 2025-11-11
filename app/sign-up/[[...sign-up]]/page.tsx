import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <SignUp
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-xl border border-gray-100 rounded-2xl w-full",
            },
          }}
        />
      </div>
    </div>
  );
}
