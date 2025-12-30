/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 12-30-2025
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class OrderController {

    @AuraEnabled(cacheable=true)
    public static String getOrder(String orderId) {
        if (String.isBlank(orderId)) {
            throw new AuraHandledException('Order ID is required');
        }

        // Step 1: Query OrderSummary using OriginalOrderId
        OrderSummary os = [
            SELECT Id, OrderNumber, OriginalOrderId
            FROM OrderSummary
            WHERE Id = :orderId
            LIMIT 1
        ];

        if (os == null || os.OriginalOrderId == null) {
            throw new AuraHandledException('No related Order found for this Order Summary');
        }

        // Step 2: Query actual Order using OriginalOrderId
        Order ord = [
            SELECT Id, OrderNumber, Status, EffectiveDate, AccountId, TotalAmount, CurrencyIsoCode
            FROM Order
            WHERE Id = :os.OriginalOrderId
            LIMIT 1
        ];

        // Return JSON
        return JSON.serialize(ord);
    }
}
