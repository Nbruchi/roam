import { Heart, MapPin, Star } from "lucide-react-native";
import { Image } from "expo-image";
import { View, Pressable } from "react-native";

import { cx } from "./cx";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import { Tag } from "./tag";
import { Text } from "./text";
import type { LucideIcon } from "lucide-react-native";

export function ListingCard({
  title,
  location,
  rating,
  reviews,
  pricePerNight,
  imageUrl,
  amenities,
  saved,
  onToggleSaved,
  onPress,
  className,
}: {
  title: string;
  location: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  imageUrl: string;
  amenities: { label: string; icon: LucideIcon }[];
  saved?: boolean;
  onToggleSaved?: () => void;
  onPress?: () => void;
  className?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${location}, $${pricePerNight} per night`}
      onPress={onPress}
      className={cx(
        "flex-row gap-4 rounded-xl bg-surface p-3 shadow-card active:opacity-90",
        className,
      )}
    >
      <View>
        <View className="size-40 overflow-hidden rounded-lg">
          <Image source={{ uri: imageUrl }} contentFit="cover" style={{ flex: 1 }} />
        </View>
        <IconButton
          icon={Heart}
          label={saved ? "Remove from saved" : "Save stay"}
          size="sm"
          bordered={false}
          fill={saved ? "danger" : undefined}
          iconColor={saved ? "danger" : "ink"}
          onPress={onToggleSaved}
          className="absolute right-2 top-2 bg-surface"
        />
      </View>
      <View className="flex-1 justify-between py-1">
        <View className="gap-1">
          <Text variant="title">{title}</Text>
          <View className="flex-row items-center gap-1">
            <Icon icon={MapPin} size={16} color="inkMuted" />
            <Text variant="caption" numberOfLines={1} className="flex-1">
              {location}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Icon icon={Star} size={16} color="primary" fill="primary" />
            <Text variant="label">{rating.toFixed(1)}</Text>
            <Text variant="caption">({reviews})</Text>
          </View>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {amenities.map((a) => (
            <Tag key={a.label} title={a.label} icon={a.icon} />
          ))}
        </View>
        <Text variant="title">
          ${pricePerNight} <Text variant="caption">/ night</Text>
        </Text>
      </View>
    </Pressable>
  );
}
