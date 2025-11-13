"use client"

import { useState, useEffect } from "react"
import { Shield, ShieldAlert, ShieldCheck, Clock, RefreshCw, Copy, Check, Info, Eye, EyeOff, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { calculatePasswordStrength, estimateCrackTime, generatePassword } from "@/lib/password-utils"

export default function PasswordChecker() {
  const [password, setPassword] = useState("")
  const [strength, setStrength] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])
  const [crackTime, setCrackTime] = useState("")
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [focusedRequirement, setFocusedRequirement] = useState<string | null>(null)
  const [animateStrength, setAnimateStrength] = useState(false)

  // Password generator settings
  const [passwordLength, setPasswordLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)

  useEffect(() => {
    if (password) {
      setIsAnalyzing(true)
      // Simulate analysis delay for better UX
      const timer = setTimeout(() => {
        const result = calculatePasswordStrength(password)
        setStrength(result.score * 25)
        setFeedback(result.feedback)
        setCrackTime(estimateCrackTime(result.entropy))
        setAnimateStrength(true)
        setTimeout(() => setAnimateStrength(false), 600)
        setIsAnalyzing(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setStrength(0)
      setFeedback([])
      setCrackTime("")
    }
  }, [password])

  const getStrengthColor = () => {
    if (strength <= 25) return "bg-red-500"
    if (strength <= 50) return "bg-orange-500"
    if (strength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (strength <= 25) return "Very Weak"
    if (strength <= 50) return "Weak"
    if (strength <= 75) return "Strong"
    return "Very Strong"
  }

  const getStrengthIcon = () => {
    if (strength <= 50) return <ShieldAlert className="h-6 w-6 text-red-500" />
    if (strength <= 75) return <Shield className="h-6 w-6 text-yellow-500" />
    return <ShieldCheck className="h-6 w-6 text-green-500" />
  }

  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password)
  const isLongEnough = password.length >= 12

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(
      passwordLength,
      includeLowercase,
      includeUppercase,
      includeNumbers,
      includeSymbols,
    )
    setPassword(newPassword)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider>
      <Card
        className={`w-full bg-black/80 border-green-500 text-white backdrop-blur-sm transition-all duration-300 ${animateStrength ? "shadow-lg shadow-green-500/30" : ""}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            {getStrengthIcon()}
            <span>SecureX Password Analyzer</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Test how secure your password is against brute force attacks
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative group">
            <Input
              type={visible ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`bg-gray-900/60 border-gray-700 text-white pr-24 transition-all duration-300 group-hover:border-green-500/50 ${
                password && strength > 50 ? "border-green-500/50" : ""
              }`}
            />
            <div className="absolute right-0 top-0 h-full flex gap-1">
              {isAnalyzing && (
                <div className="flex items-center px-2">
                  <Zap className="h-4 w-4 text-green-400 animate-pulse" />
                </div>
              )}
              {password && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full px-2 text-gray-400 hover:text-green-400 transition-colors"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copied!" : "Copy password"}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-full px-3 text-gray-400 hover:text-green-400 transition-colors"
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="text-green-400 border-green-500 hover:bg-green-500/20 bg-transparent transition-all hover:shadow-lg hover:shadow-green-500/20"
              onClick={() => setShowGenerator(!showGenerator)}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${showGenerator ? "rotate-180" : ""} transition-transform`} />
              {showGenerator ? "Hide Generator" : "Generate Password"}
            </Button>

            {password && (
              <div className="text-sm font-mono animate-fade-in">
                Length: <span className="text-green-400 font-bold">{password.length}</span>
              </div>
            )}
          </div>

          {showGenerator && (
            <div className="overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-4 p-4 bg-gray-900/60 rounded-md border border-gray-700 hover:border-green-500/30 transition-colors">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password-length" className="text-green-300">
                      Length: {passwordLength}
                    </Label>
                    <span className="text-green-400 text-sm font-mono">{passwordLength} chars</span>
                  </div>
                  <Slider
                    id="password-length"
                    min={8}
                    max={32}
                    step={1}
                    value={[passwordLength]}
                    onValueChange={(value) => setPasswordLength(value[0])}
                    className="[&>span]:bg-green-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 hover:text-green-300 transition-colors cursor-pointer group">
                    <Switch
                      id="lowercase"
                      checked={includeLowercase}
                      onCheckedChange={setIncludeLowercase}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Label htmlFor="lowercase" className="cursor-pointer group-hover:text-green-300">
                      Lowercase (a-z)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 hover:text-green-300 transition-colors cursor-pointer group">
                    <Switch
                      id="uppercase"
                      checked={includeUppercase}
                      onCheckedChange={setIncludeUppercase}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Label htmlFor="uppercase" className="cursor-pointer group-hover:text-green-300">
                      Uppercase (A-Z)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 hover:text-green-300 transition-colors cursor-pointer group">
                    <Switch
                      id="numbers"
                      checked={includeNumbers}
                      onCheckedChange={setIncludeNumbers}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Label htmlFor="numbers" className="cursor-pointer group-hover:text-green-300">
                      Numbers (0-9)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 hover:text-green-300 transition-colors cursor-pointer group">
                    <Switch
                      id="symbols"
                      checked={includeSymbols}
                      onCheckedChange={setIncludeSymbols}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Label htmlFor="symbols" className="cursor-pointer group-hover:text-green-300">
                      Symbols (!@#$%)
                    </Label>
                  </div>
                </div>

                <Button
                  onClick={handleGeneratePassword}
                  className="w-full bg-green-600 hover:bg-green-700 transition-all hover:shadow-lg hover:shadow-green-500/20"
                >
                  Generate Secure Password
                </Button>
              </div>
            </div>
          )}

          {password && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center font-semibold">
                    Strength:
                    <span
                      className={`ml-2 px-3 py-1 rounded-full text-sm font-bold transition-all ${
                        strength <= 25
                          ? "bg-red-500/20 text-red-400"
                          : strength <= 50
                            ? "bg-orange-500/20 text-orange-400"
                            : strength <= 75
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {getStrengthText()}
                    </span>
                  </span>
                  <span
                    className={`text-sm font-mono font-bold transition-all ${animateStrength ? "scale-110 text-green-300" : ""}`}
                  >
                    {strength}%
                  </span>
                </div>
                <Progress
                  value={strength}
                  className="h-3 transition-all"
                  indicatorClassName={`${getStrengthColor()} transition-all`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-gray-800/40 rounded-md border border-gray-700 hover:border-green-500/30 transition-colors">
                <div
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                    hasLowercase ? "text-green-400 bg-green-500/10" : "text-gray-500 opacity-50"
                  }`}
                  onMouseEnter={() => setFocusedRequirement("lowercase")}
                  onMouseLeave={() => setFocusedRequirement(null)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${hasLowercase ? "border-green-400 bg-green-500/30" : "border-gray-600"}`}
                  >
                    {hasLowercase && <span className="text-green-400 text-xs">✓</span>}
                  </div>
                  <span className="text-xs font-medium">Lowercase</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                    hasUppercase ? "text-green-400 bg-green-500/10" : "text-gray-500 opacity-50"
                  }`}
                  onMouseEnter={() => setFocusedRequirement("uppercase")}
                  onMouseLeave={() => setFocusedRequirement(null)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${hasUppercase ? "border-green-400 bg-green-500/30" : "border-gray-600"}`}
                  >
                    {hasUppercase && <span className="text-green-400 text-xs">✓</span>}
                  </div>
                  <span className="text-xs font-medium">Uppercase</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                    hasNumbers ? "text-green-400 bg-green-500/10" : "text-gray-500 opacity-50"
                  }`}
                  onMouseEnter={() => setFocusedRequirement("numbers")}
                  onMouseLeave={() => setFocusedRequirement(null)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${hasNumbers ? "border-green-400 bg-green-500/30" : "border-gray-600"}`}
                  >
                    {hasNumbers && <span className="text-green-400 text-xs">✓</span>}
                  </div>
                  <span className="text-xs font-medium">Numbers</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                    hasSpecialChars ? "text-green-400 bg-green-500/10" : "text-gray-500 opacity-50"
                  }`}
                  onMouseEnter={() => setFocusedRequirement("special")}
                  onMouseLeave={() => setFocusedRequirement(null)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${hasSpecialChars ? "border-green-400 bg-green-500/30" : "border-gray-600"}`}
                  >
                    {hasSpecialChars && <span className="text-green-400 text-xs">✓</span>}
                  </div>
                  <span className="text-xs font-medium">Symbols</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all col-span-2 ${
                    isLongEnough ? "text-green-400 bg-green-500/10" : "text-gray-500 opacity-50"
                  }`}
                  onMouseEnter={() => setFocusedRequirement("length")}
                  onMouseLeave={() => setFocusedRequirement(null)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isLongEnough ? "border-green-400 bg-green-500/30" : "border-gray-600"}`}
                  >
                    {isLongEnough && <span className="text-green-400 text-xs">✓</span>}
                  </div>
                  <span className="text-xs font-medium">12+ Characters</span>
                </div>
              </div>

              {crackTime && (
                <div className="flex items-center gap-3 text-sm p-3 bg-gradient-to-r from-gray-800/80 to-gray-800/40 rounded-md border border-green-500/30 hover:border-green-500/60 transition-all group cursor-help">
                  <Clock className="h-5 w-5 text-green-400 group-hover:animate-pulse" />
                  <div className="flex-1">
                    <span className="block text-gray-300 text-xs mb-1">Time to crack:</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-green-300 font-mono font-bold text-lg group-hover:text-green-200 transition-colors border-b-2 border-dotted border-green-400/50">
                          {crackTime}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Estimated time for a modern computer to crack this password using brute force methods</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}

              {feedback.length > 0 && (
                <div className="space-y-2 text-sm p-3 bg-gray-800/80 rounded-md border border-yellow-500/30 hover:border-yellow-500/60 transition-colors">
                  <p className="font-semibold flex items-center text-yellow-300">
                    <Info className="h-4 w-4 mr-2" />
                    Suggestions to improve:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    {feedback.map((item, index) => (
                      <li key={index} className="text-yellow-200 hover:text-yellow-100 transition-colors text-xs">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-start text-xs text-gray-400 border-t border-gray-800 pt-4 hover:text-gray-300 transition-colors">
          <p>🔒 Your password is never stored or transmitted. All analysis happens in your browser.</p>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
