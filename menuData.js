const menuData = [
  // Veg Soup
  { id: 1, name: 'Tomato Soup', price: 120, category: 'Veg Soup', isVeg: true, isSpecial: false },
  { id: 2, name: 'Sweet Corn Soup', price: 130, category: 'Veg Soup', isVeg: true, isSpecial: false },
  // Non-Veg Soup
  { id: 3, name: 'Chicken Manchow Soup', price: 150, category: 'Non-Veg Soup', isVeg: false, isSpecial: false },
  { id: 4, name: 'Mutton Bone Soup', price: 180, category: 'Non-Veg Soup', isVeg: false, isSpecial: true },
  // Salad & Papads
  { id: 5, name: 'Green Salad', price: 80, category: 'Salad & Papads', isVeg: true, isSpecial: false },
  { id: 6, name: 'Masala Papad', price: 50, category: 'Salad & Papads', isVeg: true, isSpecial: false },
  // Andhra Bhojanam (Assuming Thali)
  { id: 7, name: 'Veg Andhra Thali', price: 250, category: 'Andhra Bhojanam', isVeg: true, isSpecial: false },
  // Non-Veg Thali
  { id: 8, name: 'Chicken Andhra Thali', price: 350, category: 'Non-Veg Thali', isVeg: false, isSpecial: true },
  // Veg Starters
  { id: 9, name: 'Paneer Tikka', price: 280, category: 'Veg Starters', isVeg: true, isSpecial: false },
  { id: 10, name: 'Gobi Manchurian', price: 220, category: 'Veg Starters', isVeg: true, isSpecial: false },
  { id: 11, name: 'Veg Spring Rolls', price: 200, category: 'Veg Starters', isVeg: true, isSpecial: false },
  // Non-Veg Starters
  { id: 12, name: 'Chicken 65', price: 320, category: 'Non-Veg Starters', isVeg: false, isSpecial: true },
  { id: 13, name: 'Chilli Chicken', price: 310, category: 'Non-Veg Starters', isVeg: false, isSpecial: false },
  { id: 14, name: 'Apollo Fish', price: 450, category: 'Non-Veg Starters', isVeg: false, isSpecial: false },
  // Egg Starters
  { id: 15, name: 'Egg Pakora', price: 180, category: 'Egg Starters', isVeg: false, isSpecial: false }, // Note: Often considered non-veg in this context
  { id: 16, name: 'Egg Bhurji', price: 160, category: 'Egg Starters', isVeg: false, isSpecial: false },
  // Kamju (Quail - Assuming Non-Veg)
  { id: 17, name: 'Kamju Fry', price: 380, category: 'Kamju', isVeg: false, isSpecial: true },
  // Natukodi (Country Chicken - Assuming Non-Veg)
  { id: 18, name: 'Natukodi Fry', price: 420, category: 'Natukodi', isVeg: false, isSpecial: true },
  { id: 19, name: 'Natukodi Pulusu', price: 440, category: 'Natukodi', isVeg: false, isSpecial: false },
  // Mutton
  { id: 20, name: 'Mutton Rogan Josh', price: 480, category: 'Mutton', isVeg: false, isSpecial: false },
  { id: 21, name: 'Mutton Keema Curry', price: 460, category: 'Mutton', isVeg: false, isSpecial: false },
  // Sea Foods
  { id: 22, name: 'Prawns Masala', price: 520, category: 'Sea Foods', isVeg: false, isSpecial: false },
  { id: 23, name: 'Fish Tikka', price: 490, category: 'Sea Foods', isVeg: false, isSpecial: false },
  // Veg Tandoori
  { id: 24, name: 'Tandoori Paneer', price: 300, category: 'Veg Tandoori', isVeg: true, isSpecial: false },
  { id: 25, name: 'Tandoori Mushroom', price: 280, category: 'Veg Tandoori', isVeg: true, isSpecial: false },
  // Non-Veg Tandoori
  { id: 26, name: 'Tandoori Chicken (Half)', price: 350, category: 'Non-Veg Tandoori', isVeg: false, isSpecial: false },
  { id: 27, name: 'Chicken Tikka', price: 380, category: 'Non-Veg Tandoori', isVeg: false, isSpecial: false },
  // Indian Main Course Veg
  { id: 28, name: 'Paneer Butter Masala', price: 320, category: 'Indian Main Course Veg', isVeg: true, isSpecial: false },
  { id: 29, name: 'Dal Makhani', price: 260, category: 'Indian Main Course Veg', isVeg: true, isSpecial: false },
  { id: 30, name: 'Mixed Vegetable Curry', price: 240, category: 'Indian Main Course Veg', isVeg: true, isSpecial: false },
  // Indian Main Course Non-Veg
  { id: 31, name: 'Butter Chicken', price: 400, category: 'Indian Main Course Non-Veg', isVeg: false, isSpecial: false },
  { id: 32, name: 'Kadai Chicken', price: 390, category: 'Indian Main Course Non-Veg', isVeg: false, isSpecial: false },
  // Biryani
  { id: 33, name: 'Veg Dum Biryani', price: 280, category: 'Biryani', isVeg: true, isSpecial: false },
  { id: 34, name: 'Chicken Dum Biryani', price: 350, category: 'Biryani', isVeg: false, isSpecial: true },
  { id: 35, name: 'Mutton Dum Biryani', price: 450, category: 'Biryani', isVeg: false, isSpecial: false },
  // Rice & Noodles
  { id: 36, name: 'Veg Fried Rice', price: 200, category: 'Rice & Noodles', isVeg: true, isSpecial: false },
  { id: 37, name: 'Chicken Schezwan Noodles', price: 250, category: 'Rice & Noodles', isVeg: false, isSpecial: false },
  // Breads
  { id: 38, name: 'Tandoori Roti', price: 30, category: 'Breads', isVeg: true, isSpecial: false },
  { id: 39, name: 'Butter Naan', price: 50, category: 'Breads', isVeg: true, isSpecial: false },
  { id: 40, name: 'Garlic Naan', price: 60, category: 'Breads', isVeg: true, isSpecial: false },
  // Family Packs (Assuming Biryani)
  { id: 41, name: 'Chicken Biryani Family Pack', price: 800, category: 'Family Packs', isVeg: false, isSpecial: true },
  { id: 42, name: 'Veg Biryani Family Pack', price: 650, category: 'Family Packs', isVeg: true, isSpecial: false },
  // Combos
  { id: 43, name: 'North Indian Veg Combo', price: 350, category: 'Combos', isVeg: true, isSpecial: false },
  { id: 44, name: 'Chicken Combo Meal', price: 450, category: 'Combos', isVeg: false, isSpecial: false },
  // Fresh Juice
  { id: 45, name: 'Orange Juice', price: 100, category: 'Fresh Juice', isVeg: true, isSpecial: false },
  { id: 46, name: 'Watermelon Juice', price: 90, category: 'Fresh Juice', isVeg: true, isSpecial: false },
  // Milkshake
  { id: 47, name: 'Chocolate Milkshake', price: 150, category: 'Milkshake', isVeg: true, isSpecial: false },
  { id: 48, name: 'Vanilla Milkshake', price: 140, category: 'Milkshake', isVeg: true, isSpecial: false },
  // Ice Cream
  { id: 49, name: 'Vanilla Ice Cream (Scoop)', price: 80, category: 'Ice Cream', isVeg: true, isSpecial: false },
  { id: 50, name: 'Chocolate Fudge Sundae', price: 180, category: 'Ice Cream', isVeg: true, isSpecial: false },
];

// Export if using modules, otherwise it's globally available when script is loaded
// export default menuData; // Uncomment if you set up JS modules 