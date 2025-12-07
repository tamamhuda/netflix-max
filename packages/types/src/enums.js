"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaType = exports.ContentBrand = exports.SubscriptionPlan = void 0;
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["BASIC"] = "basic";
    SubscriptionPlan["STANDARD"] = "standard";
    SubscriptionPlan["PREMIUM"] = "premium";
    SubscriptionPlan["MAX"] = "max";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
var ContentBrand;
(function (ContentBrand) {
    ContentBrand["NETFLIX"] = "netflix";
    ContentBrand["HBO"] = "hbo";
    ContentBrand["DC"] = "dc";
    ContentBrand["WB"] = "wb";
})(ContentBrand || (exports.ContentBrand = ContentBrand = {}));
var MediaType;
(function (MediaType) {
    MediaType["MOVIE"] = "movie";
    MediaType["TV"] = "tv";
})(MediaType || (exports.MediaType = MediaType = {}));
//# sourceMappingURL=enums.js.map