import { useSignIn, useSignUp } from "@clerk/expo";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useEffect, useState } from "react";

import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthScreen } from "@/components/auth/auth-screen";
import { CodeInput } from "@/components/auth/code-input";
import { Alert, Button } from "@/components/ui";
import { authErrorMessage, logAuthIssue, MISSING_FIELDS_MESSAGE } from "@/lib/auth/errors";
import { afterFinalize } from "@/lib/auth/finish";
import { validateCode } from "@/lib/auth/validate";

const RESEND_SECONDS = 30;
const FALLBACK = authErrorMessage(null);

type Flow = "sign-up" | "sign-in";
type Result = Promise<{ error: unknown }>;

/** Enter the emailed code: finishes a sign-up (email verification) or a sign-in (new-device check). */
export default function Verify() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; flow?: Flow }>();
  const flow: Flow = params.flow === "sign-in" ? "sign-in" : "sign-up";
  const email = params.email;
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [wait, setWait] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  // Without an attempt waiting for a code (e.g. after a reload), start the flow again.
  const pending =
    flow === "sign-up"
      ? signUp.status === "missing_requirements" || signUp.status === "complete"
      : signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor" || signIn.status === "complete";
  if (!email || !pending) return <Redirect href={flow === "sign-up" ? "/sign-up" : "/sign-in"} />;

  const verify = (value: string): Result =>
    flow === "sign-up"
      ? signUp.verifications.verifyEmailCode({ code: value })
      : signIn.mfa.verifyEmailCode({ code: value });

  const finalize = (): Result => {
    const navigate = afterFinalize(router, () => {
      logAuthIssue(`verify (${flow}): session has a pending task`, {});
      setError(FALLBACK);
    });
    return flow === "sign-up" ? signUp.finalize({ navigate }) : signIn.finalize({ navigate });
  };

  const submit = async (value = code) => {
    const found = validateCode(value);
    setError(found);
    setResent(false);
    if (found) return;

    setSubmitting(true);
    try {
      const verified = await verify(value);
      if (verified.error) return setError(authErrorMessage(verified.error, `verify (${flow}): verify code`));
      if (flow === "sign-up" && signUp.status !== "complete") {
        // The code was accepted, but Clerk still wants more before it creates the user.
        logAuthIssue("verify (sign-up): code accepted but sign-up not complete", {
          status: signUp.status,
          missingFields: signUp.missingFields,
          unverifiedFields: signUp.unverifiedFields,
        });
        return setError(MISSING_FIELDS_MESSAGE);
      }
      if (flow === "sign-in" && signIn.status !== "complete") {
        logAuthIssue("verify (sign-in): code accepted but sign-in not complete", { status: signIn.status });
        return setError(FALLBACK);
      }
      const done = await finalize();
      if (done.error) setError(authErrorMessage(done.error, `verify (${flow}): finalize()`));
    } catch (e) {
      setError(authErrorMessage(e, `verify (${flow}): unexpected`));
    } finally {
      setSubmitting(false);
    }
  };

  const onChange = (next: string) => {
    setCode(next);
    setError(undefined);
    if (next.length === 6) submit(next);
  };

  const resend = async () => {
    setResending(true);
    setError(undefined);
    try {
      const sent: Awaited<Result> =
        flow === "sign-up" ? await signUp.verifications.sendEmailCode() : await signIn.mfa.sendEmailCode();
      if (sent.error) return setError(authErrorMessage(sent.error, `verify (${flow}): resend code`));
      setResent(true);
      setWait(RESEND_SECONDS);
    } catch (e) {
      setError(authErrorMessage(e, `verify (${flow}): resend unexpected`));
    } finally {
      setResending(false);
    }
  };

  const finish = flow === "sign-up" ? "finish creating your account" : "finish signing in";

  return (
    <AuthScreen
      title={"Check your\nemail"}
      body={`We sent a 6-digit code to ${email}. Enter it below to ${finish}.`}
      footer={
        <AuthFooter
          prompt="Didn't get a code?"
          action={wait > 0 ? `Resend in 0:${String(wait).padStart(2, "0")}` : "Resend"}
          disabled={wait > 0 || resending || submitting}
          onPress={resend}
        />
      }
    >
      <CodeInput value={code} onChange={onChange} invalid={!!error} editable={!submitting} />
      {resent && !error && <Alert variant="success" message={`We sent a new code to ${email}.`} className="mt-6" />}
      {error && <Alert variant="error" message={error} className="mt-6" />}
      <Button title="Verify" trailingIcon={ArrowRight} loading={submitting} onPress={() => submit()} className="mt-6" />
    </AuthScreen>
  );
}
