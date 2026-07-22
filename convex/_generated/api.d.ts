/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as accommodations from "../accommodations.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as destinations from "../destinations.js";
import type * as files from "../files.js";
import type * as homeRouteSlides from "../homeRouteSlides.js";
import type * as http from "../http.js";
import type * as offers from "../offers.js";
import type * as orders from "../orders.js";
import type * as settings from "../settings.js";
import type * as slides from "../slides.js";
import type * as stripe from "../stripe.js";
import type * as trips from "../trips.js";
import type * as vehicleRentalImages from "../vehicleRentalImages.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  accommodations: typeof accommodations;
  auth: typeof auth;
  categories: typeof categories;
  destinations: typeof destinations;
  files: typeof files;
  homeRouteSlides: typeof homeRouteSlides;
  http: typeof http;
  offers: typeof offers;
  orders: typeof orders;
  settings: typeof settings;
  slides: typeof slides;
  stripe: typeof stripe;
  trips: typeof trips;
  vehicleRentalImages: typeof vehicleRentalImages;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
