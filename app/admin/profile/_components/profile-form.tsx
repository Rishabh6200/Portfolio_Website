"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  User,
  Mail,
  Calendar,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  MapPin,
  Clock,
  Sparkles,
  BarChart3,
  Share2,
} from "lucide-react"
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/custom-ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProfileAction } from "../actions"
import { DEFAULT_PROFILE, type ProfileData } from "@/lib/constants/profile"

interface ProfileFormProps {
  initialData: ProfileData
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()

  // Personal Info
  const [name, setName] = useState(initialData.name || "")
  const [role, setRole] = useState(initialData.role || "")
  const [tagline, setTagline] = useState(initialData.tagline || "")
  const [bio, setBio] = useState(initialData.bio || "")
  const [status, setStatus] = useState(initialData.status || "Open for Work")
  const [location, setLocation] = useState(initialData.location || "")
  const [timezone, setTimezone] = useState(initialData.timezone || "Asia/Kolkata")
  const [email, setEmail] = useState(initialData.email || "")

  // Fixed Social Links (Essential Pack)
  const [github, setGithub] = useState(initialData.socials?.github || "")
  const [linkedin, setLinkedin] = useState(initialData.socials?.linkedin || "")
  const [twitter, setTwitter] = useState(initialData.socials?.twitter || "")
  const [cal, setCal] = useState(initialData.socials?.cal || "")
  const [socialEmail, setSocialEmail] = useState(initialData.socials?.email || initialData.email || "")

  // Portfolio Stats
  const [stats, setStats] = useState(
    initialData.stats?.length
      ? initialData.stats
      : DEFAULT_PROFILE.stats
  )


  const handleStatChange = (index: number, field: "label" | "value" | "subtext", val: string) => {
    setStats((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: val }
      return next
    })
  }

  const handleAddStat = () => {
    setStats((prev) => [...prev, { label: "New Metric", value: "10+", subtext: "Description" }])
  }

  const handleRemoveStat = (index: number) => {
    if (stats.length <= 1) {
      toast.error("You must keep at least one stat card.")
      return
    }
    setStats((prev) => prev.filter((_, i) => i !== index))
  }

  const handleQuickStatus = (presetStatus: string) => {
    setStatus(presetStatus)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Name cannot be empty.")
      return
    }

    if (!role.trim()) {
      toast.error("Role title cannot be empty.")
      return
    }

    startTransition(async () => {
      const res = await updateProfileAction({
        name: name.trim(),
        role: role.trim(),
        tagline: tagline.trim(),
        bio: bio.trim(),
        status: status.trim(),
        location: location.trim(),
        timezone: timezone.trim(),
        email: email.trim(),
        socials: {
          github: github.trim(),
          linkedin: linkedin.trim(),
          twitter: twitter.trim(),
          cal: cal.trim(),
          email: socialEmail.trim() || email.trim(),
        },
        stats: stats.map((s) => ({
          label: s.label.trim(),
          value: s.value.trim(),
          subtext: s.subtext.trim(),
        })),
      })

      if (res.success) {
        toast.success("Profile & Social Links updated successfully!", {
          description: "All changes are now live across your website.",
        })
      } else {
        toast.error("Failed to save changes", {
          description: res.error,
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Sticky Save Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-20 pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            <span>Profile & Social Links</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your personal bio, live availability status, fixed social links, and portfolio metric cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium px-5 cursor-pointer"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 1. Live Availability Status Indicator */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <span>Availability & Status Pill</span>
              </CardTitle>
              <CardDescription className="text-xs">
                This status displays prominently in the hero section and mobile navigation.
              </CardDescription>
            </div>

            {/* Live Preview Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/70 shadow-xs dark:border-white/10 dark:bg-white/4 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-neutral-800 dark:text-neutral-200">
                {status || "Open for Work"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {[
              "Open for Work",
              "Available for High-Impact Roles",
              "Consulting & Contract Only",
              "Currently Booked",
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickStatus(preset)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  status === preset
                    ? "border-primary bg-primary/10 text-primary font-medium shadow-xs"
                    : "border-border bg-background hover:bg-muted text-muted-foreground"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 pt-1">
            <Label htmlFor="status" className="text-xs text-muted-foreground">
              Custom Status Text
            </Label>
            <Input
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="e.g. Open for Work, Full-Time Roles, Contract"
              className="max-w-md h-9 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Personal Information */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>Personal Bio & Titles</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Core identity displayed on the hero banner and throughout the portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">
                Display Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rishabh"
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs">
                Role Title *
              </Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Full-Stack & Systems Developer"
                required
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span>Primary Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rc4556c@gmail.com"
                className="h-9 text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>Location</span>
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mohali, India (IST)"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="timezone" className="text-xs flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>Timezone (IANA)</span>
              </Label>
              <Input
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="Asia/Kolkata"
                className="h-9 text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tagline" className="text-xs">
              Hero Tagline
            </Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="I build robust, high-throughput backend APIs and polished web applications."
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-xs">
              About Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Short bio explaining your experience and expertise..."
              className="text-sm leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Fixed Social Links (Essential Pack) */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            <span>Social Link Options (Essential Pack)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Fixed professional platforms with custom branding, tested URLs, and live site integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GitHub */}
          <div className="p-3 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
                <GithubIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">GitHub</div>
                <div className="text-[10px] text-muted-foreground">Code & Repos</div>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <Input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="h-9 text-xs font-mono"
              />
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
                  title="Test link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* LinkedIn */}
          <div className="p-3 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                <LinkedinIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">LinkedIn</div>
                <div className="text-[10px] text-muted-foreground">Professional Profile</div>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <Input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="h-9 text-xs font-mono"
              />
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
                  title="Test link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* X (Twitter) */}
          <div className="p-3 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
                <XIcon className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold">X (Twitter)</div>
                <div className="text-[10px] text-muted-foreground">Public Discourse</div>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <Input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/username"
                className="h-9 text-xs font-mono"
              />
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
                  title="Test link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Cal.com / Meeting Booking */}
          <div className="p-3 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">Cal.com</div>
                <div className="text-[10px] text-muted-foreground">1-on-1 Scheduling</div>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <Input
                value={cal}
                onChange={(e) => setCal(e.target.value)}
                placeholder="https://cal.com/username"
                className="h-9 text-xs font-mono"
              />
              {cal && (
                <a
                  href={cal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
                  title="Test link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Social Contact Email */}
          <div className="p-3 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">Direct Email</div>
                <div className="text-[10px] text-muted-foreground">Contact Inquiries</div>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <Input
                value={socialEmail}
                onChange={(e) => setSocialEmail(e.target.value)}
                placeholder="rc4556c@gmail.com"
                className="h-9 text-xs font-mono"
              />
              {socialEmail && (
                <a
                  href={`mailto:${socialEmail}`}
                  className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
                  title="Test email link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Portfolio Stats Editor */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>Portfolio Stats Editor</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Metric cards shown at the base of your hero section (e.g. Years Experience, Production Apps).
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStat}
              className="gap-1.5 text-xs h-8 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Stat</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border bg-card hover:border-border/80 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">
                    Metric #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer"
                    title="Delete metric"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                      placeholder="6+"
                      className="h-8 text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                      placeholder="Years Experience"
                      className="h-8 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Subtext</Label>
                  <Input
                    value={stat.subtext}
                    onChange={(e) => handleStatChange(idx, "subtext", e.target.value)}
                    placeholder="Full-stack & distributed APIs"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
