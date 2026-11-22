
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

from services.market_basket_service import prepare_transactions


def perform_market_basket_analysis(
    min_support=0.02,
    min_confidence=0.3,
    min_lift=1.0
):
    """
    Perform Market Basket Analysis using Apriori algorithm.
    """

    # Prepare transaction matrix
    basket_matrix = prepare_transactions()

    # Find frequent itemsets
    frequent_itemsets = apriori(
        basket_matrix,
        min_support=min_support,
        use_colnames=True
    )

    if frequent_itemsets.empty:
        return {
            "total_transactions": len(basket_matrix),
            "frequent_itemsets": [],
            "association_rules": []
        }

    # Generate association rules
    rules = association_rules(
        frequent_itemsets,
        metric="confidence",
        min_threshold=min_confidence
    )

    # Filter rules using lift
    rules = rules[rules["lift"] >= min_lift]

    # Convert itemsets into readable strings
    frequent_itemsets["itemsets"] = frequent_itemsets[
        "itemsets"
    ].apply(lambda items: ", ".join(sorted(items)))

    rules["antecedents"] = rules["antecedents"].apply(
        lambda items: ", ".join(sorted(items))
    )

    rules["consequents"] = rules["consequents"].apply(
        lambda items: ", ".join(sorted(items))
    )

    # Sort rules by lift
    rules = rules.sort_values(
        by="lift",
        ascending=False
    )

    return {
        "total_transactions": len(basket_matrix),
        "total_frequent_itemsets": len(frequent_itemsets),
        "total_rules": len(rules),
        "frequent_itemsets": frequent_itemsets.to_dict(
            orient="records"
        ),
        "association_rules": rules[
            [
                "antecedents",
                "consequents",
                "support",
                "confidence",
                "lift"
            ]
        ].to_dict(orient="records")
    }
