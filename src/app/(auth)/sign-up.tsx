import { useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { ArrowRight, Lock, Mail, User } from "lucide-react-native";
import { useRef, useState } from "react";
import type { TextInputInstance } from "react-native";
import { View } from "react-native";

import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthScreen } from "@/components/auth/auth-screen";
import { GoogleButton } from "@/components/auth/google-button";
import { OrDivider } from "@/components/auth/or-divider";
import { Alert, Button, Input } from "@/components/ui";
import { authErrorMessage, logAuthIssue, MISSING_FIELDS_MESSAGE, splitName } from "@/lib/auth/errors";
import { afterFinalize, finishAuth } from "@/lib/auth/finish";
import {
  firstError,
  validateEmail,
  validateName,
  validateNewPassword,
  type FieldErrors,
} from "@/lib/auth/validate";

type Field = "name" | "email" | "password";
const ORDER: Field[] = ["name", "email", "password"];

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useSignUp();
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);

  const set = (field: Field) => (text: string) => {
    setValues((v) => ({ ...v, [field]: text }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setFormError(undefined);
  };

  const submit = async () => {
    const found: FieldErrors<Field> = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      password: validateNewPassword(values.password),
    };
    setErrors(found);
    const first = firstError(found, ORDER);
    setFormError(first);
    if (first) return;

    setSubmitting(true);
    try {
      const email = values.email.trim();
      const created = await signUp.password({ emailAddress: email, password: values.password, ...splitName(values.name) });
      if (created.error) return setFormError(authErrorMessage(created.error, "sign-up: password()"));
      // An earlier attempt on this device already verified the email: nothing left to confirm.
      if (signUp.status === "complete") {
        const done = await signUp.finalize({
          navigate: afterFinalize(router, () => {
            logAuthIssue("sign-up: session has a pending task", {});
            setFormError(authErrorMessage(null));
          }),
        });
        if (done.error) setFormError(authErrorMessage(done.error, "sign-up: finalize()"));
        return;
      }
      // Clerk wants a field this form doesn't collect: no code would ever finish this sign-up.
      if (signUp.missingFields.length > 0) {
        logAuthIssue("sign-up: missing fields", { status: signUp.status, missingFields: signUp.missingFields });
        return setFormError(MISSING_FIELDS_MESSAGE);
      }
      const sent = await signUp.verifications.sendEmailCode();
      if (sent.error) return setFormError(authErrorMessage(sent.error, "sign-up: sendEmailCode()"));
      router.push({ pathname: "/verify", params: { email, flow: "sign-up" } });
    } catch (e) {
      setFormError(authErrorMessage(e, "sign-up: unexpected"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      title={"Create\nyour account"}
      body="Join roam to save your stays, get personalized recommendations and access them across all your devices."
      footer={<AuthFooter prompt="Already have an account?" action="Sign in" onPress={() => router.replace("/sign-in")} />}
    >
      <View className="gap-3.5">
        <Input
          showLabel
          icon={User}
          label="Full name"
          placeholder="e.g. Adrian Hajdin"
          value={values.name}
          onChangeText={set("name")}
          invalid={!!errors.name}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <Input
          ref={emailRef}
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
          placeholder="At least 8 characters"
          value={values.password}
          onChangeText={set("password")}
          invalid={!!errors.password}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>
      {formError && <Alert variant="error" message={formError} className="mt-6" />}
      {/* Clerk bot protection mounts its challenge here. */}
      <View nativeID="clerk-captcha" />
      <Button title="Create account" trailingIcon={ArrowRight} loading={submitting} onPress={submit} className="mt-6" />
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
