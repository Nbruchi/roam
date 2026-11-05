import {
  Armchair,
  Bookmark,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Heart,
  House,
  List,
  Lock,
  Map,
  MapPin,
  MessageCircleQuestion,
  PawPrint,
  Search,
  Settings,
  Share,
  SlidersHorizontal,
  Tent,
  User,
  UserRound,
  Briefcase,
  ArrowRight,
  Star,
  Waves,
  Palmtree,
} from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, View } from "react-native";

import {
  Alert,
  Button,
  Chip,
  GlassTabBar,
  Icon,
  IconButton,
  Input,
  ListingCard,
  PolicyCard,
  ProfileGroup,
  ProfileRow,
  SegmentedControl,
  Stepper,
  Tag,
  Text,
  Toggle,
} from "@/components/ui";

// Dev-only preview of the design system. Remove or gate behind __DEV__ before release.
function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <View className="gap-4 rounded-xl bg-surface p-4">
      <Text variant="label">
        {n}. {title}
      </Text>
      {children}
    </View>
  );
}

const PHOTO =
  "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=600&q=70";

export default function DesignSystem() {
  const [filters, setFilters] = useState<string[]>(["Cabins"]);
  const [category, setCategory] = useState("All Stays");
  const [view, setView] = useState<"list" | "map">("list");
  const [tab, setTab] = useState<"home" | "search" | "trips" | "profile">("home");
  const [on, setOn] = useState(true);
  const [guests, setGuests] = useState(1);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("Joanna Smith");
  const [alerts, setAlerts] = useState({ ok: true, err: true });

  const toggleFilter = (f: string) =>
    setFilters((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  return (
    <ScrollView
      className="flex-1 bg-surface-alt"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-4 p-4 pb-16"
    >
      <Section n="01" title="Brand">
        <Text variant="display">roam</Text>
        <Text variant="heading" className="text-ink-muted">
          Find unforgettable stays for every kind of trip.
        </Text>
      </Section>

      <Section n="02" title="Color palette">
        <View className="flex-row flex-wrap gap-3">
          {[
            ["bg-primary", "Primary"],
            ["bg-lavender", "Lavender"],
            ["bg-ink", "Text"],
            ["bg-ink-muted", "Text 2"],
            ["bg-surface border border-line", "Surface"],
            ["bg-surface-alt border border-line", "Gray"],
            ["bg-line", "Border"],
            ["bg-glass border border-line", "Glass"],
          ].map(([cls, label]) => (
            <View key={label} className="w-20 gap-1">
              <View className={`h-14 rounded-lg ${cls}`} />
              <Text variant="caption">{label}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section n="03" title="Typography">
        <Text variant="display">Find your next stay</Text>
        <Text variant="heading">Modern Cabin with Hot Tub</Text>
        <Text variant="body">
          From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for
          every kind of trip.
        </Text>
        <Text variant="caption">Lake Arrowhead, CA</Text>
        <Button title="Book this stay" className="self-start" />
      </Section>

      <Section n="04" title="Buttons">
        <Button title="Book this stay" trailingIcon={ArrowRight} />
        <Button
          title="Continue with Google"
          variant="secondary"
          leadingNode={
            // PLACEHOLDER: replace with assets/images/google.png once provided.
            <View className="size-6 items-center justify-center rounded-full bg-surface-alt">
              <Text variant="caption" className="font-jakarta-bold text-ink">
                G
              </Text>
            </View>
          }
        />
        <View className="flex-row gap-3">
          <IconButton icon={Heart} label="Save" />
          <IconButton icon={Share} label="Share" />
          <IconButton icon={Search} label="Search" />
          <IconButton icon={Bookmark} label="Bookmark" />
        </View>
        <Button title="Loading" loading />
        <Button title="Disabled" disabled />
      </Section>

      <Section n="05" title="Input fields">
        <Input
          label="Search stays"
          icon={Search}
          placeholder="Cabins in California"
          trailing={<Icon icon={SlidersHorizontal} />}
        />
        <Input label="Name" icon={User} placeholder="Enter your name" />
        <Input label="Full name" icon={User} value={name} onChangeText={setName} autoFocus={false} />
        <Input label="Password" icon={Lock} secureTextEntry defaultValue="123456789" />
      </Section>

      <Section n="06" title="Filter chips">
        <View className="flex-row flex-wrap gap-3">
          {["Cabins", "Under $300", "Pet Friendly", "Quiet"].map((f) => (
            <Chip key={f} title={f} selected={filters.includes(f)} onPress={() => toggleFilter(f)} />
          ))}
        </View>
        <View className="flex-row flex-wrap gap-3">
          {[
            ["All Stays", House],
            ["Cabins", Tent],
            ["Beach", Waves],
            ["City", Building2],
            ["Villas", Palmtree],
          ].map(([t, ic]) => (
            <Chip
              key={t as string}
              variant="category"
              title={t as string}
              icon={ic as typeof House}
              selected={category === t}
              onPress={() => setCategory(t as string)}
            />
          ))}
        </View>
      </Section>

      <Section n="07" title="Listing card">
        <ListingCard
          title="Modern Cabin with Hot Tub"
          location="Lake Arrowhead, CA"
          rating={4.9}
          reviews={342}
          pricePerNight={280}
          imageUrl={PHOTO}
          amenities={[
            { label: "Hot Tub", icon: Armchair },
            { label: "Pet Friendly", icon: PawPrint },
          ]}
          saved={saved}
          onToggleSaved={() => setSaved((s) => !s)}
        />
      </Section>

      <Section n="08" title="Policy card">
        <PolicyCard
          icon={MessageCircleQuestion}
          title="Ask about policies"
          description="Cancellation, house rules, pets, check-in and more."
        />
        <PolicyCard
          icon={ClipboardList}
          title="Free cancellation"
          description="Full refund up to 7 days before check-in."
        />
      </Section>

      <Section n="09" title="Profile row">
        <ProfileGroup>
          <ProfileRow icon={UserRound} title="Personal info" />
          <ProfileRow icon={CreditCard} title="Payment methods" />
          <ProfileRow icon={Briefcase} title="Trips" />
        </ProfileGroup>
      </Section>

      <Section n="10" title="Bottom navigation">
        <GlassTabBar
          active={tab}
          onChange={setTab}
          items={[
            { key: "home", label: "Home", icon: House },
            { key: "search", label: "Search", icon: Search },
            { key: "trips", label: "Trips", icon: CalendarDays },
            { key: "profile", label: "Profile", icon: User },
          ]}
        />
      </Section>

      <Section n="11" title="Iconography">
        <View className="flex-row flex-wrap gap-3">
          {[House, Search, Heart, CalendarDays, User, Settings, MapPin, SlidersHorizontal].map(
            (ic, i) => (
              <View
                key={i}
                className="size-14 items-center justify-center rounded-full border border-line bg-surface"
              >
                <Icon icon={ic} />
              </View>
            ),
          )}
        </View>
      </Section>

      <Section n="12" title="Segmented control">
        <SegmentedControl
          value={view}
          onChange={setView}
          segments={[
            { value: "list", label: "List", icon: List },
            { value: "map", label: "Map", icon: Map },
          ]}
        />
      </Section>

      <Section n="13" title="Toggles / Steppers">
        <View className="flex-row items-center gap-6">
          <Toggle label="Pets allowed" value={on} onValueChange={setOn} />
          <Stepper label="Guests" value={guests} onChange={setGuests} min={1} max={16} />
        </View>
      </Section>

      <Section n="14" title="Status / Alerts">
        {alerts.ok && (
          <Alert
            message="Account created successfully"
            onDismiss={() => setAlerts((a) => ({ ...a, ok: false }))}
          />
        )}
        {alerts.err && (
          <Alert
            variant="error"
            message="Something went wrong. Please try again."
            onDismiss={() => setAlerts((a) => ({ ...a, err: false }))}
          />
        )}
      </Section>

      <Section n="15" title="Tags / Badges">
        <View className="flex-row flex-wrap gap-3">
          <Tag variant="highlight" title="Guest favorite" icon={Star} />
          <Tag variant="success" title="New" />
          <Tag variant="danger" title="20% off" />
          <Tag variant="info" title="Superhost" />
        </View>
      </Section>
    </ScrollView>
  );
}
