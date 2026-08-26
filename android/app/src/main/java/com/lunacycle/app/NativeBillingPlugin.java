package com.lunacycle.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import androidx.annotation.NonNull;
import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Native Google Play Billing boundary. It accepts only store data and never imports health modules. */
@CapacitorPlugin(name = "NativeBilling")
public class NativeBillingPlugin extends Plugin {
    private static final String MONTHLY = "luna_plus_monthly";
    private static final String YEARLY = "luna_plus_yearly";
    private BillingClient billingClient;
    private final Map<String, ProductDetails> products = new HashMap<>();
    private PluginCall pendingPurchaseCall;

    @Override
    public void load() {
        billingClient = BillingClient.newBuilder(getContext())
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .setListener(this::onPurchasesUpdated)
            .build();
    }

    @PluginMethod
    public void initialize(PluginCall call) {
        ensureConnected(new BillingAction() { public void run() { call.resolve(); } }, call);
    }

    @PluginMethod
    public void getProducts(PluginCall call) {
        ensureConnected(new BillingAction() { public void run() { queryProducts(call); } }, call);
    }

    @PluginMethod
    public void purchase(PluginCall call) {
        String productId = call.getString("productId");
        if (!isKnownProduct(productId)) { call.reject("PRODUCT_UNAVAILABLE"); return; }
        pendingPurchaseCall = call;
        ProductDetails product = products.get(productId);
        ProductDetails.SubscriptionOfferDetails offer = selectBasePlan(product, productId);
        if (offer == null) { pendingPurchaseCall = null; call.reject("PRODUCT_UNAVAILABLE"); return; }
        BillingFlowParams.ProductDetailsParams item = BillingFlowParams.ProductDetailsParams.newBuilder()
            .setProductDetails(product).setOfferToken(offer.getOfferToken()).build();
        BillingFlowParams params = BillingFlowParams.newBuilder().setProductDetailsParamsList(java.util.Collections.singletonList(item)).build();
        BillingResult result = billingClient.launchBillingFlow(getActivity(), params);
        if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
            pendingPurchaseCall = null;
            call.resolve(purchaseResult(result.getResponseCode(), productId));
        }
    }

    @PluginMethod
    public void refreshEntitlements(PluginCall call) {
        queryPurchases(call, false);
    }

    @PluginMethod
    public void restore(PluginCall call) {
        queryPurchases(call, true);
    }

    @PluginMethod
    public void manageSubscription(PluginCall call) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/account/subscriptions?package=" + getContext().getPackageName()));
            getContext().startActivity(intent);
            call.resolve(new JSObject().put("opened", true));
        } catch (Exception exception) { call.resolve(new JSObject().put("opened", false)); }
    }

    private void queryProducts(PluginCall call) {
        List<QueryProductDetailsParams.Product> list = new ArrayList<>();
        list.add(QueryProductDetailsParams.Product.newBuilder().setProductId(MONTHLY).setProductType(BillingClient.ProductType.SUBS).build());
        list.add(QueryProductDetailsParams.Product.newBuilder().setProductId(YEARLY).setProductType(BillingClient.ProductType.SUBS).build());
        billingClient.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(list).build(), (result, details) -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) { call.reject("PRODUCT_QUERY_FAILED"); return; }
            products.clear();
            JSArray output = new JSArray();
            for (ProductDetails detail : details.getProductDetailsList()) { products.put(detail.getProductId(), detail); output.put(productJson(detail)); }
            call.resolve(new JSObject().put("products", output));
        });
    }

    private void queryPurchases(PluginCall call, boolean restore) {
        ensureConnected(new BillingAction() { public void run() {
            billingClient.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build(), (result, purchases) -> {
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) { call.reject("PURCHASE_QUERY_FAILED"); return; }
                Purchase active = null;
                for (Purchase purchase : purchases) {
                    if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) { active = purchase; acknowledgeIfNeeded(purchase); break; }
                }
                call.resolve(entitlementJson(active));
            });
        } }, call);
    }

    private void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        PluginCall call = pendingPurchaseCall; pendingPurchaseCall = null;
        if (call == null) return;
        if (result.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null && !purchases.isEmpty()) {
            Purchase purchase = purchases.get(0); acknowledgeIfNeeded(purchase); call.resolve(purchaseResult(BillingClient.BillingResponseCode.OK, firstProductId(purchase)));
        } else call.resolve(purchaseResult(result.getResponseCode(), null));
    }

    private void acknowledgeIfNeeded(Purchase purchase) {
        if (purchase.isAcknowledged() || purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED) return;
        billingClient.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(purchase.getPurchaseToken()).build(), result -> { });
    }

    private JSObject entitlementJson(Purchase purchase) {
        boolean active = purchase != null;
        return new JSObject().put("entitlement", active ? "luna_plus" : "free").put("status", active ? "active" : "free").put("source", "android_play").put("lastCheckedAt", isoNow()).put("expiresAt", (String) null).put("cachedAt", (String) null);
    }

    private JSObject productJson(ProductDetails detail) {
        String id = detail.getProductId(); String kind = id.equals(YEARLY) ? "yearly" : "monthly"; String price = null; String currency = null; String period = kind.equals("yearly") ? "P1Y" : "P1M";
        if (detail.getSubscriptionOfferDetails() != null && !detail.getSubscriptionOfferDetails().isEmpty()) {
            ProductDetails.PricingPhase phase = detail.getSubscriptionOfferDetails().get(0).getPricingPhases().getPricingPhaseList().get(0); price = phase.getFormattedPrice(); currency = phase.getPriceCurrencyCode(); period = phase.getBillingPeriod();
        }
        return new JSObject().put("id", id).put("kind", kind).put("localizedPrice", price).put("currencyCode", currency).put("billingPeriod", period).put("offerDetails", (String) null);
    }

    private JSObject purchaseResult(int code, String productId) {
        String state = code == BillingClient.BillingResponseCode.OK ? "SUCCESS" : code == BillingClient.BillingResponseCode.USER_CANCELED ? "USER_CANCELLED" : code == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED ? "ALREADY_OWNED" : code == BillingClient.BillingResponseCode.ITEM_UNAVAILABLE ? "PRODUCT_UNAVAILABLE" : code == BillingClient.BillingResponseCode.SERVICE_UNAVAILABLE ? "STORE_UNAVAILABLE" : code == BillingClient.BillingResponseCode.SERVICE_DISCONNECTED ? "NETWORK_ERROR" : "UNKNOWN_ERROR";
        return new JSObject().put("state", state).put("productId", productId).put("message", state.equals("USER_CANCELLED") ? "Kullanıcı satın alımı iptal etti." : null);
    }

    private void ensureConnected(BillingAction action, PluginCall call) {
        if (billingClient.isReady()) { action.run(); return; }
        billingClient.startConnection(new BillingClientStateListener() {
            public void onBillingSetupFinished(@NonNull BillingResult result) { if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) action.run(); else call.reject("BILLING_UNAVAILABLE"); }
            public void onBillingServiceDisconnected() { }
        });
    }

    private boolean isKnownProduct(String id) { return MONTHLY.equals(id) || YEARLY.equals(id); }
    private ProductDetails.SubscriptionOfferDetails selectBasePlan(ProductDetails product, String id) { if (product == null || product.getSubscriptionOfferDetails() == null) return null; for (ProductDetails.SubscriptionOfferDetails offer : product.getSubscriptionOfferDetails()) if (offer.getBasePlanId() != null && offer.getBasePlanId().equals(id.equals(YEARLY) ? "yearly" : "monthly")) return offer; return product.getSubscriptionOfferDetails().get(0); }
    private String firstProductId(Purchase purchase) { return purchase.getProducts().isEmpty() ? null : purchase.getProducts().get(0); }
    private String isoNow() { return new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX", java.util.Locale.US).format(new java.util.Date()); }
    private interface BillingAction { void run(); }
}
