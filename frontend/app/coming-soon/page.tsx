"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "@/lib/axios";
import Logo from "@/components/Logo";

type ComingSoonFormValues = {
  name: string;
  email: string;
  sendCopy: boolean;
  mailingList: boolean;
};

type SubmissionType = "DEMO" | "RADIO";

type SubmissionFormValues = {
  name: string;
  email: string;
  message?: string;
  type: SubmissionType;
  file: FileList;
};

const ACCESS_STORAGE_KEY = "incus-site-access";
const ACCESS_PASSWORD =
  process.env.NEXT_PUBLIC_SITE_ACCESS_PASSWORD || "incus-dev";

export default function ComingSoonPage() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComingSoonFormValues>();

  const {
    register: registerSubmission,
    handleSubmit: handleSubmitSubmission,
    reset: resetSubmission,
    formState: { errors: submissionErrors },
  } = useForm<SubmissionFormValues>({
    defaultValues: {
      type: "DEMO",
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasAccess = window.localStorage.getItem(ACCESS_STORAGE_KEY) === "1";
    if (hasAccess) {
      router.replace("/");
    }
  }, [router]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === ACCESS_PASSWORD) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(ACCESS_STORAGE_KEY, "1");
      }
      setPasswordError("");
      setShowPasswordModal(false);
      setPassword("");
      router.push("/");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const onSubmit = async (data: ComingSoonFormValues) => {
    try {
      setFormStatus("submitting");
      setFormError(null);

      await axios.post("/contact-submissions", data);

      setFormStatus("success");
      reset();
    } catch (error) {
      console.error("Failed to submit form", error);
      setFormStatus("error");
      setFormError(
        "Something went wrong sending your message. Please try again shortly.",
      );
    } finally {
      setTimeout(() => {
        setFormStatus("idle");
      }, 4000);
    }
  };

  const onSubmitSubmission = async (data: SubmissionFormValues) => {
    const file = data.file?.[0];
    if (!file) {
      setSubmissionStatus("error");
      setSubmissionError("Please attach an audio file for your submission.");
      return;
    }

    try {
      setSubmissionStatus("submitting");
      setSubmissionError(null);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.message) {
        formData.append("message", data.message);
      }
      formData.append("type", data.type);
      formData.append("file", file);

      // Use the Next.js API proxy so multipart/form-data is forwarded
      // correctly to the backend.
      await axios.post("/submissions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmissionStatus("success");
      resetSubmission();
    } catch (error) {
      console.error("Failed to submit demo/radio submission", error);
      setSubmissionStatus("error");
      setSubmissionError(
        "Something went wrong uploading your audio. Please check the file type/size and try again.",
      );
    } finally {
      setTimeout(() => {
        setSubmissionStatus("idle");
      }, 5000);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center py-16 overflow-hidden">
      {/* Background image + overlays within container */}
      <div className="pointer-events-none absolute inset-0 z-1">
        {/* Base image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-lg"
          style={{
            backgroundImage: "url('/coming-soon-bg.jpg')",
          }}
        />
        {/* Glass tint layer */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Noise texture on top */}
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: "url('/noise.png')",
            backgroundRepeat: "repeat",
            opacity: 0.075,
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl w-full space-y-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="scale-150 md:scale-[2]">
            <Logo size="text-4xl" />
          </div>
          <h1 className="mt-6 text-3xl md:text-4xl font-medium text-foreground">
            <span className="inline-block bg-background/65 text-foreground px-2 pt-2 pb-1 rounded-sm">
              Website Under Construction
            </span>
          </h1>
          <p className="max-w-xl text-foreground/80 text-sm md:text-base mt-3">
            Incus is an independent electronic music label focused on
            forward-thinking releases and artist-driven creativity. Built by
            artists, for artists, the label exists to champion originality,
            quality, and longevity in electronic music.
          </p>
          <p className="text-foreground/80 text-sm md:text-base mt-3">
            With a clear emphasis on club-ready sound and strong artistic
            identity, Incus Audio supports emerging producers while maintaining
            a polished, professional standard across every release. Each project
            is curated with real-world listening in mind, from the dancefloor to
            headphones, without chasing trends or hype.
          </p>
          <p className="text-foreground/80 text-sm md:text-base mt-3">
            At its core, Incus is about precision, impact, and community -
            creating music that lasts and a platform that grows alongside the
            artists behind it.
          </p>
        </div>

        <div className="space-y-10">
          {/* Demo / Radio submissions card */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Demo &amp; radio submissions
            </h2>
            <p className="text-sm text-foreground/80">
              Share unreleased tracks or show material with us. We&apos;ll
              listen and keep them strictly within the Incus team.
            </p>

            <form
              onSubmit={handleSubmitSubmission(onSubmitSubmission)}
              className="mt-4 space-y-4 border border-foreground/10 rounded-xl p-4 md:p-5 bg-background/70 backdrop-blur"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/70">
                    Name
                  </label>
                  <input
                    type="text"
                    className="h-10 rounded-md border border-foreground/15 bg-background/80 px-3 text-sm text-foreground outline-none focus:border-foreground/60 focus:ring-1 focus:ring-foreground/40 transition"
                    placeholder="Your name or artist alias"
                    {...registerSubmission("name", {
                      required: "Name is required",
                    })}
                  />
                  {submissionErrors.name && (
                    <p className="text-xs text-red-500">
                      {submissionErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/70">
                    Email
                  </label>
                  <input
                    type="email"
                    className="h-10 rounded-md border border-foreground/15 bg-background/80 px-3 text-sm text-foreground outline-none focus:border-foreground/60 focus:ring-1 focus:ring-foreground/40 transition"
                    placeholder=""
                    {...registerSubmission("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {submissionErrors.email && (
                    <p className="text-xs text-red-500">
                      {submissionErrors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/70">
                  Submission type
                </span>
                <div className="flex flex-wrap gap-4 text-xs">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      value="DEMO"
                      className="h-3.5 w-3.5 rounded-full border border-foreground/40 bg-background/80 accent-foreground"
                      {...registerSubmission("type", { required: true })}
                    />
                    <span>Demo submission</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      value="RADIO"
                      className="h-3.5 w-3.5 rounded-full border border-foreground/40 bg-background/80 accent-foreground"
                      {...registerSubmission("type", { required: true })}
                    />
                    <span>Radio submission</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/70">
                  Audio file
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  className="block w-full text-xs text-foreground file:mr-3 file:rounded-full file:border file:border-foreground/40 file:bg-background/80 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-[0.12em] hover:file:bg-foreground hover:file:text-background transition"
                  {...registerSubmission("file", { required: true })}
                />
                <p className="text-[11px] text-foreground/60">
                  Accepted formats: MP3, WAV, FLAC, OGG, AAC (max 100MB).
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/70">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  className="rounded-md border border-foreground/15 bg-background/80 px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/60 focus:ring-1 focus:ring-foreground/40 transition resize-none"
                  placeholder="Label / collective info, link context, or anything helpful."
                  {...registerSubmission("message")}
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-foreground/60">
                  We&apos;ll review everything manually – no automated playlist
                  drops.
                </p>
                <button
                  type="submit"
                  disabled={submissionStatus === "submitting"}
                  className="inline-flex items-center justify-center rounded-full border border-foreground bg-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:bg-background hover:text-foreground transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submissionStatus === "submitting"
                    ? "Uploading..."
                    : "Submit"}
                </button>
              </div>

              <div className="min-h-[20px] pt-1">
                {submissionStatus === "success" && (
                  <p className="text-xs text-emerald-400">
                    Thanks for sending something in – we&apos;ll listen soon.
                  </p>
                )}
                {submissionStatus === "error" && submissionError && (
                  <p className="text-xs text-red-500">{submissionError}</p>
                )}
              </div>
            </form>
          </div>

          {/* General contact form */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Stay in the loop
            </h2>
            <p className="text-sm text-foreground/80">
              Sign up to hear about launch plans, releases, early drops and
              other label news.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 space-y-4 border border-foreground/10 rounded-xl p-4 md:p-5 bg-background/60 backdrop-blur"
            >
              {/* Hidden mailing list opt-in (always true for this form) */}
              <input
                type="checkbox"
                className="hidden"
                defaultChecked
                {...register("mailingList")}
              />
              <input
                type="checkbox"
                className="hidden"
                defaultChecked={false}
                {...register("sendCopy")}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/70">
                    Name
                  </label>
                  <input
                    type="text"
                    className="h-10 rounded-md border border-foreground/15 bg-background/80 px-3 text-sm text-foreground outline-none focus:border-foreground/60 focus:ring-1 focus:ring-foreground/40 transition"
                    placeholder=""
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/70">
                    Email
                  </label>
                  <input
                    type="email"
                    className="h-10 rounded-md border border-foreground/15 bg-background/80 px-3 text-sm text-foreground outline-none focus:border-foreground/60 focus:ring-1 focus:ring-foreground/40 transition"
                    placeholder=""
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="inline-flex items-center justify-center rounded-full border border-foreground bg-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:bg-background hover:text-foreground transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formStatus === "submitting" ? "Sending..." : "Send"}
                </button>
              </div>

              {(formStatus === "success" || formStatus === "error") && (
                <div className="min-h-[20px] pt-1">
                  {formStatus === "success" && (
                    <p className="text-xs text-emerald-400">
                      Thanks for signing up to the mailing list.
                    </p>
                  )}
                  {formStatus === "error" && formError && (
                    <p className="text-xs text-red-500">{formError}</p>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="space-y-4 text-sm text-foreground/80">
            <div className="border border-foreground/10 rounded-xl p-4 bg-background/60 backdrop-blur">
              <p className="font-semibold text-foreground mb-2">
                Direct contact
              </p>
              <p className="text-xs leading-relaxed">
                Prefer direct email? Reach out at{" "}
                <a
                  href="mailto:hello@incusaudio.com"
                  className="underline hover:no-underline"
                >
                  hello@incusaudio.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-foreground/70">
          <button
            type="button"
            onClick={() => {
              setPassword("");
              setPasswordError("");
              setShowPasswordModal(true);
            }}
            className="underline hover:no-underline text-foreground/80"
          >
            Enter site
          </button>
          <p className="text-center md:text-right">
            © 2026 Incus Audio. All rights reserved. | A{" "}
            <a
              href="https://forta.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              forta.studio
            </a>{" "}
            production.
          </p>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-foreground/20 bg-background px-5 py-6 shadow-xl">
            <h2 className="text-sm font-semibold text-foreground mb-2">
              Enter access password
            </h2>
            <p className="text-xs text-foreground/70 mb-4">
              This temporary gate helps us quietly build Incus while we finish
              things up.
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/70">
                  Password
                </label>
                <input
                  type="password"
                  className="h-10 rounded-md border border-foreground/20 bg-background/80 px-3 text-sm text-foreground outline-none focus:border-foreground/60 focus:ring-1 focus:ring-foreground/40 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-xs text-red-500">{passwordError}</p>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="text-xs text-foreground/70 hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-foreground bg-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:bg-background hover:text-foreground transition"
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
