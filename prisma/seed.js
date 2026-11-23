const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Shorthand so ingredient lists stay readable: i('maize flour', '2', 'cups')
const i = (name, amount, unit) => ({ name, amount, unit });

const users = [
  { name: 'Ochieng Otieno', email: 'ochieng.otieno@example.com', bio: 'Luo grill master from Kisumu. Weekends are for nyama choma and fresh tilapia.' },
  { name: 'Wanjiru Kamau', email: 'wanjiru.kamau@example.com', bio: 'Kikuyu home cook from Nyeri who learned mukimo and githeri from her grandmother.' },
  { name: 'Amina Hassan', email: 'amina.hassan@example.com', bio: 'Swahili cook from Mombasa. Pilau, mandazi and anything cooked in coconut milk.' },
];

// Each recipe references its author by index in the users array above.
const recipes = [
  // ---------- Kenyan ----------
  {
    author: 0,
    title: 'Nyama Choma',
    description: 'Kenyan grilled goat meat, the king of the weekend. Slow-grilled over charcoal and served with ugali and kachumbari.',
    prepTime: 30, cookTime: 45, servings: 6, difficulty: 'medium', category: 'Kenyan',
    ingredients: [
      i('goat ribs or leg, bone-in', '1.5', 'kg'),
      i('lemons, juiced', '2', 'whole'),
      i('salt', '2', 'tsp'),
      i('black pepper, freshly ground', '1', 'tsp'),
      i('garlic, crushed', '4', 'cloves'),
      i('vegetable oil', '3', 'tbsp'),
      i('tomatoes, diced (kachumbari)', '3', 'whole'),
      i('red onions, thinly sliced (kachumbari)', '2', 'whole'),
      i('fresh coriander, chopped (kachumbari)', '1', 'bunch'),
    ],
    steps: [
      'Cut the goat meat into large pieces with the bone left in, about the size of your palm, so it stays juicy on the fire.',
      'Rub the meat with salt, black pepper, crushed garlic, lemon juice and oil. Let it marinate for at least 30 minutes.',
      'Light charcoal and wait until the flames die and the coals turn white-grey. Cooking over open flames will only char the outside.',
      'Place the meat on the grill, about 15 cm above the coals, and cover loosely with foil or a lid.',
      'Turn the meat every 5-7 minutes for 35-45 minutes, brushing with a little oil, until browned outside and cooked through.',
      'Make kachumbari by mixing tomatoes, onions and coriander with a squeeze of lemon and a pinch of salt.',
      'Chop the meat on a wooden board and serve hot with ugali, kachumbari and a pinch of salt for dipping.',
    ],
  },
  {
    author: 1,
    title: 'Ugali & Sukuma Wiki',
    description: 'The everyday Kenyan plate: firm maize-flour ugali with sukuma wiki (collard greens) sautéed with onions and tomatoes.',
    prepTime: 5, cookTime: 20, servings: 4, difficulty: 'easy', category: 'Kenyan',
    ingredients: [
      i('white maize flour (unga wa mahindi)', '2', 'cups'),
      i('water', '3', 'cups'),
      i('salt', '1', 'pinch'),
      i('sukuma wiki (collard greens), shredded', '1', 'large bunch'),
      i('red onion, chopped', '1', 'whole'),
      i('tomatoes, chopped', '2', 'whole'),
      i('cooking oil', '3', 'tbsp'),
      i('salt (for the greens)', '1', 'tsp'),
    ],
    steps: [
      'Bring the 3 cups of water to a rolling boil in a heavy-bottomed sufuria and add a pinch of salt.',
      'Take a little of the maize flour and mix it with a small amount of cold water to make a thin porridge, then stir it into the boiling water and let it bubble for 2 minutes.',
      'Reduce the heat. Gradually sprinkle in the remaining maize flour with one hand while stirring with a mwiko (wooden spoon) in the other, to avoid lumps.',
      'Keep stirring and pressing the ugali against the side of the sufuria to break lumps. Cover and cook on low heat for 5 minutes, then stir again until it is thick and pulls away from the sides.',
      'Shape the ugali into a dome by turning it with the mwiko, then turn it out onto a plate or bowl.',
      'For the sukuma wiki, heat the oil in a pan and fry the onion until soft and golden, about 3 minutes.',
      'Add the tomatoes and cook until they break down into a soft sauce, about 4 minutes.',
      'Add the shredded greens and salt, stir well and cook uncovered for 5-6 minutes until wilted but still bright green.',
      'Serve the hot ugali with the sukuma wiki on the side.',
    ],
  },
  {
    author: 2,
    title: 'Pilau',
    description: 'Swahili spiced rice cooked in beef stock with pilau masala, caramelised onions and potatoes. A Kenyan celebration dish.',
    prepTime: 40, cookTime: 60, servings: 6, difficulty: 'hard', category: 'Kenyan',
    ingredients: [
      i('beef, cut in cubes (with bone if possible)', '750', 'g'),
      i('basmati or pishori rice, washed', '3', 'cups'),
      i('red onions, thinly sliced', '4', 'whole'),
      i('potatoes, peeled and quartered', '3', 'whole'),
      i('garlic, crushed', '6', 'cloves'),
      i('fresh ginger, grated', '1', 'tbsp'),
      i('pilau masala', '2', 'tbsp'),
      i('cumin seeds', '1', 'tsp'),
      i('cinnamon stick', '1', 'piece'),
      i('cardamom pods', '4', 'whole'),
      i('whole cloves', '4', 'whole'),
      i('black peppercorns', '1', 'tsp'),
      i('cooking oil', '0.5', 'cup'),
      i('salt', '2', 'tsp'),
      i('hot water or beef stock', '6', 'cups'),
    ],
    steps: [
      'Put the beef in a pot with 4 cups of water, half of the garlic, the ginger and a teaspoon of salt. Simmer for 40 minutes until tender, then drain and keep the stock.',
      'In a large heavy pot, heat the oil and add the cumin seeds, cinnamon, cardamom, cloves and peppercorns. Fry for 30 seconds until fragrant.',
      'Add the sliced onions and fry on medium heat, stirring often, for 15-20 minutes until deep golden brown. This colour gives pilau its flavour and tone.',
      'Add the remaining garlic and the pilau masala and fry for 1 minute.',
      'Add the cooked beef and the potatoes and brown them in the spiced onions for 5 minutes.',
      'Add the washed rice and stir gently for 2 minutes so every grain is coated in the spices.',
      'Pour in 6 cups of hot beef stock (top up with hot water), add the remaining salt and bring to a boil.',
      'When the liquid has reduced to the level of the rice, cover tightly and cook on the lowest heat for 20-25 minutes without lifting the lid.',
      'Turn off the heat and let it rest covered for 10 minutes, then fluff gently with a fork. Serve with kachumbari.',
    ],
  },
  {
    author: 1,
    title: 'Chapati',
    description: 'Soft, layered Kenyan flatbread. Rolled, coiled and pan-fried in oil, it is the star of every Kenyan celebration and Sunday lunch.',
    prepTime: 40, cookTime: 30, servings: 8, difficulty: 'medium', category: 'Kenyan',
    ingredients: [
      i('all-purpose flour', '4', 'cups'),
      i('warm water', '1.5', 'cups'),
      i('salt', '1', 'tsp'),
      i('sugar', '1', 'tbsp'),
      i('cooking oil (for the dough)', '3', 'tbsp'),
      i('cooking oil (for rolling and frying)', '0.5', 'cup'),
    ],
    steps: [
      'Mix the flour, salt and sugar in a large bowl. Add 3 tablespoons of oil and rub it into the flour with your fingers.',
      'Add the warm water slowly while kneading until you have a soft, elastic dough, about 8-10 minutes. It should not stick to your hands.',
      'Cover the dough with a damp cloth and rest it for 30 minutes.',
      'Divide the dough into 8 equal balls. Roll one ball out on a floured surface into a thin circle.',
      'Brush the circle with oil, then roll it up like a rope. Coil the rope into a spiral like a snail shell and tuck the end underneath. Repeat with all the balls and rest them for 10 minutes.',
      'Roll each coil flat again into a circle about 3 mm thick.',
      'Heat a flat pan or non-stick frying pan over medium heat. Cook the chapati for 1 minute until bubbles form.',
      'Flip, brush with a little oil, cook for 1 minute, flip again and brush the other side. Press with a spatula until golden brown with light brown spots.',
      'Wrap the cooked chapatis in a clean cloth to keep them soft and serve warm.',
    ],
  },
  {
    author: 2,
    title: 'Mandazi',
    description: 'Swahili coconut-and-cardamom fried dough triangles, lightly sweet and perfect with chai.',
    prepTime: 70, cookTime: 20, servings: 8, difficulty: 'medium', category: 'Kenyan',
    ingredients: [
      i('all-purpose flour', '3', 'cups'),
      i('sugar', '0.5', 'cup'),
      i('instant yeast', '2', 'tsp'),
      i('ground cardamom', '1', 'tsp'),
      i('coconut milk, warm', '1', 'cup'),
      i('egg', '1', 'whole'),
      i('salt', '0.25', 'tsp'),
      i('vegetable oil (for frying)', '3', 'cups'),
    ],
    steps: [
      'Mix the flour, sugar, yeast, cardamom and salt in a large bowl.',
      'Beat the egg into the warm coconut milk, then pour into the dry mix and knead for 8-10 minutes until the dough is smooth and soft.',
      'Cover and leave in a warm place for 1 hour until doubled in size.',
      'Punch down the dough and roll it out on a floured surface to about 1 cm thick.',
      'Cut into triangles or squares with a knife.',
      'Heat the oil in a deep pan to about 170°C. Test with a small piece of dough: it should rise and sizzle gently.',
      'Fry the mandazi in batches for 2-3 minutes per side until puffed and golden brown, turning once.',
      'Drain on paper towels and serve warm with chai.',
    ],
  },
  {
    author: 1,
    title: 'Githeri',
    description: 'A Kikuyu staple of maize and beans slow-cooked until soft, then finished with onions, tomatoes and sometimes potatoes or carrots.',
    prepTime: 15, cookTime: 120, servings: 6, difficulty: 'easy', category: 'Kenyan',
    ingredients: [
      i('dried maize kernels (mbaazi/muthokoi), soaked overnight', '2', 'cups'),
      i('dried kidney beans, soaked overnight', '1', 'cup'),
      i('water', '8', 'cups'),
      i('red onion, chopped', '1', 'large'),
      i('tomatoes, chopped', '3', 'whole'),
      i('potatoes, cubed', '2', 'whole'),
      i('carrots, diced', '2', 'whole'),
      i('cooking oil', '3', 'tbsp'),
      i('salt', '1.5', 'tsp'),
      i('fresh coriander, chopped', '2', 'tbsp'),
    ],
    steps: [
      'Drain the soaked maize and beans and rinse them under cold water.',
      'Put them in a large sufuria with 8 cups of water. Bring to a boil, then reduce the heat, cover and simmer for 1.5 hours, topping up with hot water if it dries out.',
      'Test a kernel of maize: it should be tender and the beans should be soft but not mushy.',
      'In a separate pan, heat the oil and fry the onion until golden, about 5 minutes.',
      'Add the tomatoes and cook until they turn into a thick paste.',
      'Add the carrots and potatoes to the githeri pot with the salt and tip in the onion-tomato mix.',
      'Simmer for another 25-30 minutes until the potatoes are tender and the stew is thick.',
      'Sprinkle with coriander and serve hot.',
    ],
  },
  {
    author: 1,
    title: 'Mukimo',
    description: 'Central Kenyan mash of potatoes, green peas, maize and pumpkin leaves. Traditionally served with nyama choma or stew.',
    prepTime: 15, cookTime: 45, servings: 6, difficulty: 'medium', category: 'Kenyan',
    ingredients: [
      i('potatoes, peeled and cubed', '1', 'kg'),
      i('green peas (fresh or frozen)', '1', 'cup'),
      i('maize kernels, boiled', '1', 'cup'),
      i('pumpkin leaves (or spinach), finely shredded', '2', 'cups'),
      i('onion, chopped', '1', 'whole'),
      i('butter or cooking oil', '3', 'tbsp'),
      i('salt', '1.5', 'tsp'),
      i('milk', '0.25', 'cup'),
    ],
    steps: [
      'Boil the potatoes in salted water for 20 minutes until fork-tender.',
      'In the last 10 minutes of boiling, add the peas to the same pot.',
      'In a separate pan, melt the butter and fry the onion until soft, about 4 minutes.',
      'Add the pumpkin leaves and cook for 5 minutes until wilted. Add the boiled maize.',
      'Drain the potatoes and peas, keeping a little of the water.',
      'Add the potatoes, peas and the leaf mix back to the pot and mash with a mwiko or masher until combined into a thick, green, lumpy mash. Add the milk or a splash of the cooking water if too dry.',
      'Season with salt and serve hot with nyama choma or beef stew.',
    ],
  },

  // ---------- Italian ----------
  {
    author: 0,
    title: 'Spaghetti Carbonara',
    description: 'Roman pasta with eggs, pecorino and crispy pancetta. No cream, just a glossy sauce made from egg and pasta water.',
    prepTime: 10, cookTime: 15, servings: 4, difficulty: 'medium', category: 'Italian',
    ingredients: [
      i('spaghetti', '400', 'g'),
      i('pancetta or guanciale, diced', '150', 'g'),
      i('egg yolks', '4', 'whole'),
      i('whole egg', '1', 'whole'),
      i('Pecorino Romano, finely grated', '60', 'g'),
      i('black pepper, freshly ground', '1', 'tsp'),
      i('salt (for pasta water)', '1', 'tbsp'),
    ],
    steps: [
      'Bring a large pot of water to a boil and salt it well.',
      'Whisk the egg yolks, whole egg, pecorino and plenty of black pepper in a bowl to form a thick paste.',
      'Fry the pancetta in a cold pan over medium heat until the fat renders and it is crisp, about 6-8 minutes. Turn off the heat.',
      'Cook the spaghetti until al dente, then reserve a cup of the pasta water and drain.',
      'Add the hot pasta to the pancetta pan, off the heat, and toss to coat in the fat.',
      'Pour in the egg mixture and toss quickly, adding splashes of pasta water until you have a creamy sauce. Do not return to the heat or the eggs will scramble.',
      'Serve immediately with extra pecorino and black pepper.',
    ],
  },
  {
    author: 2,
    title: 'Margherita Pizza',
    description: 'Classic Neapolitan pizza with tomato sauce, fresh mozzarella and basil on a thin, chewy crust.',
    prepTime: 90, cookTime: 12, servings: 4, difficulty: 'medium', category: 'Italian',
    ingredients: [
      i('bread flour', '3', 'cups'),
      i('warm water', '1.25', 'cups'),
      i('instant yeast', '1', 'tsp'),
      i('salt', '2', 'tsp'),
      i('olive oil', '2', 'tbsp'),
      i('canned crushed tomatoes', '1', 'cup'),
      i('fresh mozzarella, torn', '250', 'g'),
      i('fresh basil leaves', '1', 'handful'),
    ],
    steps: [
      'Mix the flour, yeast and salt, then add the water and olive oil and knead for 10 minutes until smooth.',
      'Cover and let the dough rise in a warm place for 1 hour until doubled.',
      'Heat your oven to its highest setting (250°C or more) with a baking tray or pizza stone inside.',
      'Divide the dough in two and stretch each piece by hand into a thin round on a floured surface.',
      'Spread a thin layer of crushed tomatoes on each, leaving a border, and season with a pinch of salt.',
      'Scatter on the mozzarella and slide the pizza onto the hot tray.',
      'Bake for 8-12 minutes until the crust is blistered and the cheese is bubbling.',
      'Top with fresh basil and a drizzle of olive oil before serving.',
    ],
  },

  // ---------- Indian ----------
  {
    author: 2,
    title: 'Butter Chicken',
    description: 'Tandoori-style chicken simmered in a mild, creamy tomato sauce rich with butter and fenugreek.',
    prepTime: 30, cookTime: 40, servings: 4, difficulty: 'medium', category: 'Indian',
    ingredients: [
      i('boneless chicken thighs, cubed', '700', 'g'),
      i('plain yogurt', '0.5', 'cup'),
      i('garam masala', '2', 'tsp'),
      i('turmeric', '0.5', 'tsp'),
      i('Kashmiri chilli powder', '1', 'tsp'),
      i('butter', '4', 'tbsp'),
      i('onion, finely chopped', '1', 'large'),
      i('ginger-garlic paste', '1', 'tbsp'),
      i('tomato purée', '1', 'cup'),
      i('heavy cream', '0.5', 'cup'),
      i('dried fenugreek leaves (kasuri methi)', '1', 'tsp'),
      i('salt', '1.5', 'tsp'),
    ],
    steps: [
      'Marinate the chicken with yogurt, half the garam masala, turmeric, chilli powder and 1 tsp salt for at least 30 minutes.',
      'Sear the chicken in a hot pan or under a grill until lightly charred, about 8 minutes. It does not need to be cooked through.',
      'Melt the butter in a pot and cook the onion until soft and golden, 8 minutes.',
      'Add the ginger-garlic paste and cook for 1 minute, then add the tomato purée and cook for 10 minutes until the oil separates.',
      'Stir in the remaining garam masala and add the chicken. Simmer for 10 minutes.',
      'Pour in the cream, crush the fenugreek leaves between your palms and add them. Simmer gently for 5 minutes.',
      'Adjust the salt and serve with naan or basmati rice.',
    ],
  },
  {
    author: 0,
    title: 'Chana Masala',
    description: 'North Indian chickpea curry cooked in a tangy tomato-onion gravy with whole and ground spices.',
    prepTime: 15, cookTime: 35, servings: 4, difficulty: 'easy', category: 'Indian',
    ingredients: [
      i('cooked chickpeas (or 2 cans, drained)', '3', 'cups'),
      i('onions, finely chopped', '2', 'whole'),
      i('tomatoes, chopped', '3', 'whole'),
      i('ginger, grated', '1', 'tbsp'),
      i('garlic, minced', '4', 'cloves'),
      i('cumin seeds', '1', 'tsp'),
      i('coriander powder', '2', 'tsp'),
      i('chana masala powder', '1.5', 'tbsp'),
      i('turmeric', '0.5', 'tsp'),
      i('green chilli, slit', '1', 'whole'),
      i('cooking oil', '3', 'tbsp'),
      i('salt', '1', 'tsp'),
      i('lemon juice', '1', 'tbsp'),
    ],
    steps: [
      'Heat the oil and fry the cumin seeds until they sizzle, about 30 seconds.',
      'Add the onions and cook for 8-10 minutes until deep golden.',
      'Stir in the ginger, garlic and green chilli and fry for 1 minute.',
      'Add the tomatoes, turmeric, coriander powder and salt. Cook for 8 minutes until it breaks into a thick paste.',
      'Add the chana masala powder and the chickpeas with 1 cup of water. Simmer for 15 minutes, mashing a few chickpeas to thicken the gravy.',
      'Finish with lemon juice and serve with rice or bhatura.',
    ],
  },

  // ---------- Chinese ----------
  {
    author: 0,
    title: 'Egg Fried Rice',
    description: 'Wok-fried day-old rice with scrambled egg, spring onions and soy sauce.',
    prepTime: 10, cookTime: 10, servings: 3, difficulty: 'easy', category: 'Chinese',
    ingredients: [
      i('cooked rice, cold (day-old)', '4', 'cups'),
      i('eggs, beaten', '3', 'whole'),
      i('spring onions, sliced', '4', 'whole'),
      i('garlic, minced', '2', 'cloves'),
      i('soy sauce', '2', 'tbsp'),
      i('sesame oil', '1', 'tsp'),
      i('vegetable oil', '3', 'tbsp'),
      i('frozen peas', '0.5', 'cup'),
      i('white pepper', '0.25', 'tsp'),
    ],
    steps: [
      'Break up any clumps in the cold rice with your fingers.',
      'Heat 1 tablespoon of oil in a wok over high heat. Pour in the eggs and scramble until just set, then remove from the wok.',
      'Add the remaining oil, then the garlic and the white parts of the spring onions. Stir-fry for 20 seconds.',
      'Add the rice and stir-fry for 3-4 minutes, pressing it against the wok so the grains toast and separate.',
      'Add the peas, soy sauce and white pepper, and toss to combine.',
      'Return the eggs, add the green spring onions and the sesame oil, and toss for 30 seconds. Serve hot.',
    ],
  },
  {
    author: 2,
    title: 'Kung Pao Chicken',
    description: 'Sichuan stir-fry of diced chicken, peanuts and dried chillies in a sweet, sour and savoury sauce.',
    prepTime: 25, cookTime: 12, servings: 4, difficulty: 'medium', category: 'Chinese',
    ingredients: [
      i('chicken breast, diced', '500', 'g'),
      i('roasted peanuts', '0.5', 'cup'),
      i('dried red chillies', '8', 'whole'),
      i('Sichuan peppercorns', '1', 'tsp'),
      i('garlic, minced', '3', 'cloves'),
      i('fresh ginger, minced', '1', 'tbsp'),
      i('spring onions, cut into 2 cm pieces', '4', 'whole'),
      i('light soy sauce', '2', 'tbsp'),
      i('Chinkiang black vinegar', '1', 'tbsp'),
      i('sugar', '1', 'tbsp'),
      i('cornflour', '2', 'tsp'),
      i('vegetable oil', '3', 'tbsp'),
    ],
    steps: [
      'Marinate the chicken with 1 tablespoon soy sauce and 1 teaspoon cornflour for 15 minutes.',
      'Mix the remaining soy sauce, black vinegar, sugar and cornflour with 2 tablespoons water to make the sauce.',
      'Heat the oil in a wok over high heat. Fry the chillies and Sichuan peppercorns for 20 seconds until fragrant but not burnt.',
      'Add the chicken and stir-fry for 4-5 minutes until golden and cooked through.',
      'Add the garlic, ginger and spring onions and fry for 30 seconds.',
      'Pour in the sauce and toss until it thickens and coats the chicken, about 1 minute.',
      'Stir in the peanuts and serve at once with steamed rice.',
    ],
  },

  // ---------- Mexican ----------
  {
    author: 0,
    title: 'Chicken Tacos',
    description: 'Soft corn tortillas filled with spiced pulled chicken, onion, coriander and lime.',
    prepTime: 20, cookTime: 25, servings: 4, difficulty: 'easy', category: 'Mexican',
    ingredients: [
      i('chicken thighs', '600', 'g'),
      i('cumin', '1', 'tsp'),
      i('smoked paprika', '1', 'tsp'),
      i('chilli powder', '1', 'tsp'),
      i('garlic, minced', '3', 'cloves'),
      i('lime', '2', 'whole'),
      i('small corn tortillas', '12', 'whole'),
      i('white onion, finely diced', '1', 'whole'),
      i('fresh coriander, chopped', '0.5', 'cup'),
      i('salt', '1', 'tsp'),
      i('vegetable oil', '2', 'tbsp'),
    ],
    steps: [
      'Rub the chicken with cumin, paprika, chilli powder, garlic, salt and the juice of one lime.',
      'Heat the oil in a pan and cook the chicken for 10-12 minutes per side until it is cooked through (75°C inside).',
      'Rest the chicken for 5 minutes, then shred it with two forks.',
      'Warm the tortillas for 30 seconds per side on a dry hot pan.',
      'Fill each tortilla with chicken, onion and coriander.',
      'Serve with lime wedges and salsa.',
    ],
  },
  {
    author: 1,
    title: 'Guacamole',
    description: 'Chunky Mexican avocado dip with lime, onion, tomato and coriander.',
    prepTime: 10, cookTime: 0, servings: 4, difficulty: 'easy', category: 'Mexican',
    ingredients: [
      i('ripe avocados', '3', 'whole'),
      i('lime, juiced', '1', 'whole'),
      i('red onion, finely diced', '0.25', 'cup'),
      i('tomato, deseeded and diced', '1', 'whole'),
      i('jalapeño, minced', '1', 'whole'),
      i('fresh coriander, chopped', '2', 'tbsp'),
      i('salt', '0.5', 'tsp'),
    ],
    steps: [
      'Halve the avocados, remove the stones and scoop the flesh into a bowl.',
      'Mash with a fork, leaving some chunks for texture.',
      'Stir in the lime juice, onion, jalapeño and salt.',
      'Fold in the tomato and coriander gently.',
      'Taste and adjust salt and lime. Serve immediately with tortilla chips.',
    ],
  },

  // ---------- Desserts ----------
  {
    author: 2,
    title: 'Chocolate Chip Cookies',
    description: 'Chewy cookies with crisp edges and pockets of melted chocolate.',
    prepTime: 20, cookTime: 12, servings: 24, difficulty: 'easy', category: 'Desserts',
    ingredients: [
      i('all-purpose flour', '2.25', 'cups'),
      i('baking soda', '1', 'tsp'),
      i('salt', '1', 'tsp'),
      i('butter, softened', '1', 'cup'),
      i('brown sugar', '0.75', 'cup'),
      i('white sugar', '0.5', 'cup'),
      i('eggs', '2', 'whole'),
      i('vanilla extract', '2', 'tsp'),
      i('chocolate chips', '2', 'cups'),
    ],
    steps: [
      'Heat the oven to 190°C and line two baking trays with baking paper.',
      'Whisk together the flour, baking soda and salt.',
      'Beat the butter and both sugars until pale and fluffy, about 3 minutes.',
      'Beat in the eggs one at a time, then the vanilla.',
      'Mix in the dry ingredients until just combined, then fold in the chocolate chips.',
      'Scoop tablespoon-sized balls onto the trays, spaced 5 cm apart.',
      'Bake for 9-12 minutes until the edges are golden but the centres are still soft.',
      'Cool on the tray for 5 minutes, then move to a wire rack.',
    ],
  },
  {
    author: 1,
    title: 'Vanilla Cheesecake',
    description: 'Creamy baked cheesecake on a buttery biscuit base, cooled slowly to prevent cracks.',
    prepTime: 30, cookTime: 60, servings: 10, difficulty: 'hard', category: 'Desserts',
    ingredients: [
      i('digestive biscuits, crushed', '250', 'g'),
      i('butter, melted', '100', 'g'),
      i('cream cheese, room temperature', '600', 'g'),
      i('sugar', '150', 'g'),
      i('eggs', '3', 'whole'),
      i('sour cream', '150', 'g'),
      i('vanilla extract', '2', 'tsp'),
      i('cornflour', '2', 'tbsp'),
    ],
    steps: [
      'Heat the oven to 160°C and grease a 23 cm springform tin.',
      'Mix the crushed biscuits with the melted butter and press firmly into the base of the tin. Chill for 15 minutes.',
      'Beat the cream cheese and sugar on low speed until smooth. Do not overbeat or the cake will crack.',
      'Beat in the eggs one at a time, then the sour cream, vanilla and cornflour.',
      'Pour the filling over the base and tap the tin to remove air bubbles.',
      'Bake for 55-60 minutes until the edges are set and the centre has a slight wobble.',
      'Turn off the oven, open the door slightly and let the cheesecake cool inside for 1 hour.',
      'Refrigerate for at least 6 hours before removing from the tin and serving.',
    ],
  },
];

async function main() {
  // Wipe existing data and reset ids so the seed can be re-run safely.
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Favorite", "Rating", "Recipe", "User" RESTART IDENTITY CASCADE'
  );

  const createdUsers = [];
  for (const u of users) {
    createdUsers.push(await prisma.user.create({ data: u }));
  }

  for (const { author, ...recipe } of recipes) {
    await prisma.recipe.create({
      data: { ...recipe, authorId: createdUsers[author].id },
    });
  }

  console.log(`Seeded ${createdUsers.length} users and ${recipes.length} recipes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
