import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { ArrowRight, Lock, Mail } from "lucide-react-native";
import { useRef, useState } from "react";
import type { TextInputInstance } from "react-native";
import { View } from "react-native";

import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthScreen } from "@/components/auth/auth-screen";
import { GoogleButton } from "@/components/auth/google-button";
import { OrDivider } from "@/components/auth/or-divider";
import { Alert, Button, Input } from "@/components/ui";
import { authErrorMessage, logAuthIssue } from "@/lib/auth/errors";
import { afterFinalize, finishAuth } from "@/lib/auth/finish";
import { firstError, validateEmail, validatePassword, type FieldErrors } from "@/lib/auth/validate";

type Field = "email" | "password";
const ORDER: Field[] = ["email", "password"];

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [values, setValues] = useState<Record<Field, string>>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<TextInputInstance>(null);

  const set = (field: Field) => (text: string) => {
    setValues((v) => ({ ...v, [field]: text }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setFormError(undefined);
  };

  const submit = async () => {
    const found: FieldErrors<Field> = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    };
    setErrors(found);
    const first = firstError(found, ORDER);
    setFormError(first);
    if (first) return;

    setSubmitting(true);
    try {
      const email = values.email.trim();
      const attempt = await signIn.password({ emailAddress: email, password: values.password });
      if (attempt.error) return setFormError(authErrorMessage(attempt.error, "sign-in: password()"));

      if (signIn.status === "complete") {
        const done = await signIn.finalize({ navigate: afterFinalize(router, () => {
            logAuthIssue("sign-in: session has a pending task", {});
            setFormError(authErrorMessage(null));
          }) });
        if (done.error) setFormError(authErrorMessage(done.error, "sign-in: finalize()"));
        return;
      }

      // New device (or email second factor): Clerk wants an emailed code before finishing.
      const emailFactor = signIn.supportedSecondFactors?.some((f) => f.strategy === "email_code");
      if ((signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") && emailFactor) {
        const sent = await signIn.mfa.sendEmailCode();
        if (sent.error) return setFormError(authErrorMessage(sent.error, "sign-in: send device code"));
        router.push({ pathname: "/verify", params: { email, flow: "sign-in" } });
        return;
      }

      logAuthIssue("sign-in: unhandled status", {
        status: signIn.status,
        secondFactors: signIn.supportedSecondFactors?.map((f) => f.strategy),
      });
      setFormError(authErrorMessage(null));
    } catch (e) {
      setFormError(authErrorMessage(e, "sign-in: unexpected"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      title={"Welcome\nback"}
      body="Sign in to see your saved stays and pick up where you left off."
      footer={<AuthFooter prompt="New to roam?" action="Create an account" onPress={() => router.replace("/sign-up")} />}
    >
      <View className="gap-3.5">
        <Input
          showLabel
          icon={Mail}
          label="Email address"
          placeholder="you@example.com"
          value={values.email}
          onChangeText={set("email")}
          invalid={!!errors.email}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <Input
          ref={passwordRef}
          showLabel
          icon={Lock}
          label="Password"
          placeholder="Your password"
          value={values.password}
          onChangeText={set("password")}
          invalid={!!errors.password}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>
      {formError && <Alert variant="error" message={formError} className="mt-6" />}
      <Button title="Sign in" trailingIcon={ArrowRight} loading={submitting} onPress={submit} className="mt-6" />
      <OrDivider className="mt-5" />
      <GoogleButton
        className="mt-3"
        disabled={submitting}
        onSuccess={() => finishAuth(router)}
        onError={setFormError}
      />
    </AuthScreen>
  );
}
