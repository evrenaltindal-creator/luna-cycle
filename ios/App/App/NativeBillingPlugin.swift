import Capacitor
import Foundation
import StoreKit
import UIKit

@objc(NativeBillingPlugin)
public final class NativeBillingPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "NativeBillingPlugin"
    public let jsName = "NativeBilling"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "initialize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getProducts", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "refreshEntitlements", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "manageSubscription", returnType: CAPPluginReturnPromise)
    ]

    private let productIDs = ["luna_plus_monthly", "luna_plus_yearly"]

    @objc public func initialize(_ call: CAPPluginCall) {
        call.resolve()
    }

    @objc public func getProducts(_ call: CAPPluginCall) {
        Task {
            do {
                let products = try await Product.products(for: productIDs)
                let byID = Dictionary(uniqueKeysWithValues: products.map { ($0.id, $0) })
                let output = productIDs.compactMap { byID[$0] }.map(productJSON)
                call.resolve(["products": output])
            } catch {
                call.reject("Unable to load App Store products.", "PRODUCT_QUERY_FAILED")
            }
        }
    }

    @objc public func purchase(_ call: CAPPluginCall) {
        guard let productID = call.getString("productId"), productIDs.contains(productID) else {
            call.resolve(purchaseResult(state: "PRODUCT_UNAVAILABLE"))
            return
        }

        Task {
            do {
                guard let product = try await Product.products(for: [productID]).first else {
                    call.resolve(purchaseResult(state: "PRODUCT_UNAVAILABLE", productID: productID))
                    return
                }

                switch try await product.purchase() {
                case .success(let verification):
                    switch verification {
                    case .verified(let transaction):
                        guard productIDs.contains(transaction.productID) else {
                            call.resolve(purchaseResult(state: "UNKNOWN_ERROR", productID: productID))
                            return
                        }
                        await transaction.finish()
                        call.resolve(purchaseResult(state: "SUCCESS", productID: transaction.productID))
                    case .unverified:
                        call.resolve(purchaseResult(state: "UNKNOWN_ERROR", productID: productID))
                    }
                case .pending:
                    call.resolve(purchaseResult(state: "PENDING", productID: productID))
                case .userCancelled:
                    call.resolve(purchaseResult(state: "USER_CANCELLED", productID: productID))
                @unknown default:
                    call.resolve(purchaseResult(state: "UNKNOWN_ERROR", productID: productID))
                }
            } catch {
                call.resolve(purchaseResult(state: "STORE_UNAVAILABLE", productID: productID))
            }
        }
    }

    @objc public func restore(_ call: CAPPluginCall) {
        Task {
            do {
                try await AppStore.sync()
                call.resolve(await entitlementJSON())
            } catch {
                call.reject("Unable to restore App Store purchases.", "STORE_UNAVAILABLE")
            }
        }
    }

    @objc public func refreshEntitlements(_ call: CAPPluginCall) {
        Task {
            call.resolve(await entitlementJSON())
        }
    }

    @objc public func manageSubscription(_ call: CAPPluginCall) {
        Task { @MainActor in
            guard let scene = bridge?.viewController?.view.window?.windowScene else {
                call.resolve(["opened": false])
                return
            }

            do {
                try await AppStore.showManageSubscriptions(in: scene)
                call.resolve(["opened": true])
            } catch {
                call.resolve(["opened": false])
            }
        }
    }

    private func productJSON(_ product: Product) -> [String: Any] {
        let yearly = product.id == "luna_plus_yearly"
        return [
            "id": product.id,
            "kind": yearly ? "yearly" : "monthly",
            "localizedPrice": product.displayPrice,
            "currencyCode": NSNull(),
            "billingPeriod": yearly ? "P1Y" : "P1M",
            "offerDetails": NSNull()
        ]
    }

    private func purchaseResult(state: String, productID: String? = nil) -> [String: Any] {
        var result: [String: Any] = ["state": state]
        if let productID { result["productId"] = productID }
        return result
    }

    private func entitlementJSON() async -> [String: Any] {
        var activeTransaction: StoreKit.Transaction?

        for await verification in StoreKit.Transaction.currentEntitlements {
            guard case .verified(let transaction) = verification,
                  productIDs.contains(transaction.productID),
                  transaction.revocationDate == nil else { continue }
            if let expirationDate = transaction.expirationDate, expirationDate <= Date() { continue }

            if let current = activeTransaction {
                let currentExpiry = current.expirationDate ?? .distantFuture
                let candidateExpiry = transaction.expirationDate ?? .distantFuture
                if candidateExpiry > currentExpiry { activeTransaction = transaction }
            } else {
                activeTransaction = transaction
            }
        }

        let now = ISO8601DateFormatter().string(from: Date())
        guard let transaction = activeTransaction else {
            return [
                "entitlement": "free",
                "status": "free",
                "source": "ios_storekit",
                "lastCheckedAt": now,
                "expiresAt": NSNull(),
                "cachedAt": NSNull()
            ]
        }

        let expiresAt: Any
        if let expirationDate = transaction.expirationDate {
            expiresAt = ISO8601DateFormatter().string(from: expirationDate)
        } else {
            expiresAt = NSNull()
        }

        return [
            "entitlement": "luna_plus",
            "status": "active",
            "source": "ios_storekit",
            "lastCheckedAt": now,
            "expiresAt": expiresAt,
            "cachedAt": NSNull()
        ]
    }
}
