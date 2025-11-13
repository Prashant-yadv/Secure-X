import PasswordChecker from "@/components/password-checker"
import MatrixBackground from "@/components/matrix-background"

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-4">
      <MatrixBackground />
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="mb-4 inline-block">
            <h1 className="text-6xl font-bold mb-2 text-green-400 font-mono tracking-tight drop-shadow-lg hover:drop-shadow-2xl transition-all hover:scale-105 duration-300">
              SecureX
            </h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
          </div>
          <p className="text-green-300 text-lg font-light tracking-wide hover:text-green-200 transition-colors">
            Advanced Password Security Analyzer
          </p>
        </div>
        <PasswordChecker />
        <div className="mt-6 text-center text-xs text-green-500/70 hover:text-green-400/70 transition-colors">
          <p>© {new Date().getFullYear()} SecureX Security • Analyze • Protect • Secure</p>
        </div>
      </div>
    </main>
  )
}
