import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User, Home, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { registerWithEmail } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const STEPS = ['Welcome', 'Account', 'Community', 'Interests']

const accountSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type AccountData = z.infer<typeof accountSchema>

const INTERESTS = ['Events', 'Fitness', 'Gardening', 'Pets', 'Book Club', 'Tech', 'Cooking', 'Music', 'Kids', 'Seniors', 'Sports', 'Art']

export function OnboardingPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [step, setStep] = useState(0)
  const [communityCode, setCommunityCode] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<AccountData>({
    resolver: zodResolver(accountSchema),
  })

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep(s => Math.max(s - 1, 0))

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  const finish = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { email, password, displayName } = getValues()
      const user = await registerWithEmail(displayName, email, password, 'resident' as const, communityCode || '')
      setUser(user)
      navigate('/resident')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-border">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* STEP 0 – Welcome */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="w-full max-w-sm text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-4xl font-bold">K</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">Welcome to<br />Kommunity</h1>
              <p className="text-muted-foreground mb-8">The operating system for modern neighbourhoods. Connect with your community, access services, and stay informed.</p>
              <div className="grid grid-cols-2 gap-3 mb-8 text-left">
                {['Announcements & Events', 'Marketplace & Services', 'Issue Reporting', 'Neighbour Connect'].map(feat => (
                  <div key={feat} className="card p-3 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-xs text-foreground font-medium">{feat}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={next}>
                Get Started
              </Button>
            </motion.div>
          )}

          {/* STEP 1 – Account */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-1">Create your account</h2>
              <p className="text-muted-foreground mb-6 text-sm">Join thousands of residents already on Kommunity</p>
              <form className="space-y-4" onSubmit={handleSubmit(next)}>
                <Input label="Full Name" placeholder="Alex Johnson" leftIcon={<User className="w-4 h-4" />} error={errors.displayName?.message} {...register('displayName')} />
                <Input label="Email" type="email" placeholder="alex@example.com" leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} {...register('email')} />
                <Input label="Password" type="password" placeholder="8+ characters" leftIcon={<Lock className="w-4 h-4" />} error={errors.password?.message} {...register('password')} />
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={back} leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                  <Button type="submit" className="flex-1" rightIcon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2 – Community */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-1">Join your community</h2>
              <p className="text-muted-foreground mb-6 text-sm">Enter the invite code from your RWA or building manager</p>
              <div className="space-y-4">
                <Input
                  label="Community Invite Code"
                  placeholder="e.g. BGLR-2024"
                  leftIcon={<Home className="w-4 h-4" />}
                  value={communityCode}
                  onChange={e => setCommunityCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Don't have a code? You can skip this and request to join later from your profile.</p>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={back} leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                  <Button className="flex-1" onClick={next} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    {communityCode ? 'Join Community' : 'Skip for now'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 – Interests */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-1">Your interests</h2>
              <p className="text-muted-foreground mb-6 text-sm">Pick what matters to you — we'll personalize your feed</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedInterests.includes(interest)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-card text-foreground border-border'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              {error && <p className="text-destructive text-sm mb-3">{error}</p>}
              <div className="flex gap-3">
                <Button variant="ghost" onClick={back} leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                <Button className="flex-1" onClick={finish} isLoading={isLoading} rightIcon={<CheckCircle2 className="w-4 h-4" />}>
                  Finish Setup
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 pb-8">
        {STEPS.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </div>
    </div>
  )
}
