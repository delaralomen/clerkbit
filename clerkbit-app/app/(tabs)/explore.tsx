import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import PaymentPopup from '@/components/PaymentPopup';

const cafe_menu_chf = {
  "Hot Beverages": {
    "Espresso": 3.50,
    "Double Espresso": 4.80,
    "Cappuccino": 4.80,
    "Caffè Latte": 5.20,
    "Flat White": 5.00,
    "Hot Chocolate": 4.50,
    "Chai Latte": 5.00,
    "Tea (variety of blends)": 3.80
  },
  "Cold Drinks": {
    "Iced Latte": 5.50,
    "Iced Americano": 4.80,
    "Fresh Orange Juice": 5.80,
    "Homemade Lemonade": 4.50,
    "Sparkling Water (50cl)": 3.00,
    "Local Apple Juice": 4.50
  },
  "Pastries & Sweets": {
    "Butter Croissant": 2.80,
    "Pain au Chocolat": 3.20,
    "Cinnamon Roll": 4.00,
    "Seasonal Fruit Tart": 5.20,
    "Vegan Brownie": 4.80,
    "Slice of Carrot Cake": 5.50
  },
  "Light Bites": {
    "Mozzarella & Tomato Ciabatta": 8.50,
    "Ham & Cheese Croissant": 7.90,
    "Vegan Hummus Wrap": 9.20,
    "Quiche Lorraine (slice)": 6.80,
    "Mixed Salad Bowl": 9.50
  }
};

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isPaymentPopupVisible, setIsPaymentPopupVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);


  const handlePayPressed = () => {
    console.log("pay pressed")
    console.log(totalPrice)
    setIsPaymentPopupVisible(true);
  }

  const handleQuantityChange = (item: string, value: string) => {
    const num = parseInt(value, 10);
    setQuantities((prev) => ({
      ...prev,
      [item]: isNaN(num) ? 0 : Math.max(0, num),
    }));
  };

  const increment = (item: string) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: (prev[item] || 0) + 1,
    }));
  };

  const decrement = (item: string) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: Math.max(0, (prev[item] || 0) - 1),
    }));
  };

  const handleOrderSubmit = () => {
    const order = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([item, qty]) => {
        let price = 0;

        for (const category of Object.values(cafe_menu_chf) as Record<string, number>[]) {
          if (item in category) {
            price = category[item];
            break;
          }
        }

        return { item, qty, price, subtotal: price * qty };
      });

    if (order.length === 0) {
      console.log("No items selected.");
      return;
    }

    const total = order.reduce((sum, entry) => sum + entry.subtotal, 0);

    console.log("Order submitted:", order);
    console.log("Total Price: CHF", total.toFixed(2));
    const newTotal = totalPrice + total;
    setTotalPrice(newTotal)
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
      ]}
      contentContainerStyle={{ paddingBottom: 100 }} // space for button
      stickyHeaderIndices={[0]}
    >
      {/* Sticky Header */}
      <View
        style={[
          styles.stickyHeaderWrapper,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
        ]}
      >
        <View style={styles.stickyHeaderContent}>
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? '#fff' : '#000' },
            ]}
          >
            Menu
          </Text>
          <Pressable
            style={[styles.payButton, { backgroundColor: '#7C3AED' }]}
            onPress={handlePayPressed }
          >
            <Text style={styles.payButtonText}>Pay</Text>
          </Pressable>

        </View>
      </View>

      {/* Menu Content */}
      <View style={styles.contentWrapper}>
        {Object.entries(cafe_menu_chf).map(([category, items]) => (
          <View key={category} style={styles.categoryContainer}>
            <Text
              style={[
                styles.categoryTitle,
                { color: isDark ? '#A78BFA' : '#7C3AED' },
              ]}
            >
              {category}
            </Text>
            {Object.entries(items).map(([itemName, price]) => (
              <View
                key={itemName}
                style={[
                  styles.itemRow,
                  { borderColor: isDark ? '#333' : '#ddd' },
                ]}
              >
                <View style={styles.itemInfo}>
                  <Text
                    style={[
                      styles.itemName,
                      { color: isDark ? '#fff' : '#000' },
                    ]}
                  >
                    {itemName}
                  </Text>
                  <Text
                    style={[
                      styles.itemIngredients,
                      { color: isDark ? '#aaa' : '#555' },
                    ]}
                  >
                    Ingredients: (to be filled later)
                  </Text>
                  <Text
                    style={[
                      styles.itemPrice,
                      { color: isDark ? '#ddd' : '#333' },
                    ]}
                  >
                    CHF {price.toFixed(2)}
                  </Text>
                </View>

                {/* Quantity Selector */}
                <View style={styles.quantityContainer}>
                  <Pressable
                    style={[styles.qtyButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => decrement(itemName)}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </Pressable>
                  <TextInput
                    style={[
                      styles.qtyInput,
                      {
                        backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9',
                        color: isDark ? '#fff' : '#000',
                        borderColor: isDark ? '#555' : '#ccc',
                      },
                    ]}
                    keyboardType="numeric"
                    value={(quantities[itemName] || 0).toString()}
                    onChangeText={(value) =>
                      handleQuantityChange(itemName, value)
                    }
                  />
                  <Pressable
                    style={[styles.qtyButton, { backgroundColor: '#34D399' }]}
                    onPress={() => increment(itemName)}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Order Button */}
      <View style={styles.orderButtonWrapper}>
        <Pressable
          style={[styles.orderButton, { backgroundColor: '#10B981' }]}
          onPress={handleOrderSubmit}
        >
          <Text style={styles.orderButtonText}>Order</Text>
        </Pressable>
      </View>

      {/* Payment Popup */}
      <PaymentPopup
        visible={isPaymentPopupVisible}
        onClose={() => setIsPaymentPopupVisible(false)}
        total={totalPrice}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stickyHeaderWrapper: {
    width: '100%',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  stickyHeaderContent: {
    width: '100%',
    maxWidth: 900,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  payButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 900,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  categoryContainer: {
    marginBottom: 24,
    width: '100%',
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemIngredients: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  qtyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  qtyInput: {
    width: 50,
    textAlign: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 4,
    fontSize: 16,
  },
  orderButtonWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  orderButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
