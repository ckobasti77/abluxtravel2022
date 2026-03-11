import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  settings: defineTable({
    key: v.literal("global"),
    workingHours: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    instagramUrl: v.string(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
  trips: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(),
    nights: v.number(),
    days: v.number(),
    transport: v.union(
      v.literal("bus"),
      v.literal("plane"),
      v.literal("car"),
      v.literal("train"),
      v.literal("self")
    ),
    departureDate: v.string(),
    returnDate: v.string(),
    departureCity: v.string(),
    hotelInfo: v.optional(v.string()),
    depositPercentage: v.optional(v.number()),
    depositDeadline: v.optional(v.string()),
    itinerary: v.array(
      v.object({
        day: v.number(),
        date: v.string(),
        description: v.string(),
      })
    ),
    included: v.array(v.string()),
    notIncluded: v.array(v.string()),
    imageStorageIds: v.array(v.id("_storage")),
    status: v.union(
      v.literal("active"),
      v.literal("upcoming"),
      v.literal("completed")
    ),
    featured: v.boolean(),
    order: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status_order", ["status", "order"])
    .index("by_featured", ["featured"]),
  accommodations: defineTable({
    tripId: v.id("trips"),
    name: v.string(),
    type: v.union(
      v.literal("villa"),
      v.literal("apartment"),
      v.literal("hotel"),
      v.literal("room"),
      v.literal("hostel"),
      v.literal("other")
    ),
    description: v.string(),
    pricePerPerson: v.number(),
    currency: v.string(),
    capacity: v.number(),
    amenities: v.array(v.string()),
    boardType: v.optional(
      v.union(
        v.literal("ro"),
        v.literal("bb"),
        v.literal("hb"),
        v.literal("fb"),
        v.literal("ai")
      )
    ),
    roomInfo: v.optional(v.string()),
    checkIn: v.optional(v.string()),
    checkOut: v.optional(v.string()),
    distanceToCenter: v.optional(v.string()),
    imageStorageIds: v.array(v.id("_storage")),
    order: v.number(),
    isActive: v.boolean(),
    updatedAt: v.number(),
  }).index("by_trip_order", ["tripId", "order"]),
  users: defineTable({
    username: v.string(),
    email: v.optional(v.string()),
    passwordHash: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_username", ["username"])
    .index("by_email", ["email"]),
  slides: defineTable({
    title: v.string(),
    subtitle: v.string(),
    badge: v.optional(v.string()),
    copy: v.optional(v.string()),
    mediaType: v.optional(v.union(v.literal("video"), v.literal("image"))),
    videoUrl: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    order: v.number(),
    isActive: v.boolean(),
  }).index("by_order", ["order"]),
  sources: defineTable({
    slug: v.string(),
    name: v.string(),
    status: v.union(
      v.literal("planned"),
      v.literal("connected"),
      v.literal("syncing"),
      v.literal("paused")
    ),
    syncEverySeconds: v.number(),
    apiBaseUrl: v.optional(v.string()),
    webhookSecretLabel: v.optional(v.string()),
    isEnabled: v.boolean(),
    lastSyncAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_enabled", ["isEnabled"]),
  offers: defineTable({
    sourceSlug: v.string(),
    externalId: v.string(),
    title: v.string(),
    destination: v.string(),
    departureCity: v.optional(v.string()),
    departureDate: v.optional(v.string()),
    returnDate: v.optional(v.string()),
    price: v.number(),
    currency: v.string(),
    seatsLeft: v.optional(v.number()),
    tags: v.array(v.string()),
    pdfStorageId: v.optional(v.id("_storage")),
    pdfFileName: v.optional(v.string()),
    imageStorageIds: v.optional(v.array(v.id("_storage"))),
    normalizedHash: v.string(),
    score: v.optional(v.number()),
    rawSnapshot: v.optional(v.string()),
    isActive: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_source_external", ["sourceSlug", "externalId"])
    .index("by_active_updated", ["isActive", "updatedAt"])
    .index("by_destination_price", ["destination", "price"]),
});
