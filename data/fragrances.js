const fragrances = [
  { id: "creed-aventus", name: "Aventus", brand: "Creed", family: "Woody", type: "Eau de Parfum", gender: "men", price: 435, image: "https://www.boutiquederoyal.com/cdn/shop/files/4_39016292-a5ba-497b-83ac-a1a73d4ea2cb_1400x.jpg?v=1756897974", notes: ["Blackcurrant","Bergamot","Apple"], description: "Bold and powerful.", buyLinks: {} },
  { id: "chanel-bleu", name: "Bleu de Chanel", brand: "Chanel", family: "Woody", type: "Eau de Parfum", gender: "men", price: 162, image: "https://www.essensa.ee/wp-content/uploads/2024/07/ESSENSA.ee-v2-1000x750-Blogipostituse-pais-77.png", notes: ["Citrus","Ginger"], description: "Fresh and clean.", buyLinks: {} },
  { id: "dior-sauvage", name: "Sauvage", brand: "Dior", family: "Amber", type: "Eau de Toilette", gender: "men", price: 145, image: "https://khayest.pk/cdn/shop/files/Dior-Sauvage-Parfum-Men-100ml-3.webp?v=1758297928", notes: ["Bergamot","Pepper"], description: "Mass appealing scent.", buyLinks: {} },

  { id: "ysl-y", name: "Y Eau de Parfum", brand: "Yves Saint Laurent", family: "Aromatic", type: "Eau de Parfum", gender: "men", price: 135, image: "https://enemmall.com/cdn/shop/files/4104981_22a39625-3491-417a-92ee-85856ebcf632_1800x1800.jpg?v=1757333619", notes: ["Apple","Ginger","Sage"], description: "Modern fresh masculine scent.", buyLinks: {} },

  { id: "versace-eros", name: "Eros", brand: "Versace", family: "Aromatic", type: "Eau de Toilette", gender: "men", price: 110, image: "https://fimgs.net/mdimg/perfume/375x500.16657.jpg", notes: ["Mint","Vanilla"], description: "Sweet clubbing fragrance.", buyLinks: {} },

  { id: "paco-rabanne-1million", name: "1 Million", brand: "Paco Rabanne", family: "Spicy", type: "Eau de Toilette", gender: "men", price: 105, image: "https://fimgs.net/mdimg/perfume/375x500.85.jpg", notes: ["Cinnamon","Leather"], description: "Bold and flashy.", buyLinks: {} },

  { id: "armani-acqua-di-gio", name: "Acqua di Gio", brand: "Giorgio Armani", family: "Aquatic", type: "Eau de Toilette", gender: "men", price: 120, image: "https://fimgs.net/mdimg/perfume/375x500.410.jpg", notes: ["Marine","Citrus"], description: "Fresh aquatic classic.", buyLinks: {} },

  { id: "tom-ford-oud-wood", name: "Oud Wood", brand: "Tom Ford", family: "Woody", type: "Eau de Parfum", gender: "unisex", price: 295, image: "https://fimgs.net/mdimg/perfume/375x500.1827.jpg", notes: ["Oud","Vanilla"], description: "Luxury oud fragrance.", buyLinks: {} },

  { id: "mfk-baccarat-rouge-540", name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", family: "Amber", type: "Eau de Parfum", gender: "unisex", price: 325, image: "https://fimgs.net/mdimg/perfume/375x500.33519.jpg", notes: ["Saffron","Amberwood"], description: "Sweet luxury scent.", buyLinks: {} },

  { id: "le-labo-santal-33", name: "Santal 33", brand: "Le Labo", family: "Woody", type: "Eau de Parfum", gender: "unisex", price: 310, image: "https://fimgs.net/mdimg/perfume/375x500.12201.jpg", notes: ["Sandalwood","Leather"], description: "Iconic niche fragrance.", buyLinks: {} },

  { id: "kilian-angels-share", name: "Angel's Share", brand: "By Kilian", family: "Gourmand", type: "Eau de Parfum", gender: "unisex", price: 250, image: "https://fimgs.net/mdimg/perfume/375x500.62615.jpg", notes: ["Cognac","Vanilla"], description: "Warm sweet boozy scent.", buyLinks: {} },

  { id: "chanel-coco-mademoiselle", name: "Coco Mademoiselle", brand: "Chanel", family: "Floral", type: "Eau de Parfum", gender: "women", price: 155, image: "https://static.sweetcare.com/img/prd/488/v-638560299678169024/chanel-002456cl-2.webp", notes: ["Orange","Rose"], description: "Elegant feminine fragrance.", buyLinks: {} },

  { id: "dior-jadore", name: "J'adore", brand: "Dior", family: "Floral", type: "Eau de Parfum", gender: "women", price: 140, image: "https://fimgs.net/mdimg/perfume/375x500.17.jpg", notes: ["Jasmine","Rose"], description: "Classic feminine scent.", buyLinks: {} },

  { id: "ysl-black-opium", name: "Black Opium", brand: "YSL", family: "Gourmand", type: "Eau de Parfum", gender: "women", price: 135, image: "https://fimgs.net/mdimg/perfume/375x500.25324.jpg", notes: ["Coffee","Vanilla"], description: "Sweet and addictive.", buyLinks: {} },

  { id: "lancome-la-vie-est-belle", name: "La Vie Est Belle", brand: "Lancôme", family: "Gourmand", type: "Eau de Parfum", gender: "women", price: 130, image: "https://fimgs.net/mdimg/perfume/375x500.14982.jpg", notes: ["Iris","Praline"], description: "Popular sweet fragrance.", buyLinks: {} },

  // ===== USA POPULAR PERFUMES =====
{ id: "chanel-bleu", name: "Bleu de Chanel", brand: "Chanel", gender: "men", price: 162, image: "https://fimgs.net/mdimg/perfume/375x500.410.jpg", notes: ["Citrus","Ginger"], description: "One of the best-selling men's fragrances in the US.", buyLinks: {} },
{ id: "dior-sauvage", name: "Sauvage", brand: "Dior", gender: "men", price: 145, image: "https://fimgs.net/mdimg/perfume/375x500.17.jpg", notes: ["Bergamot","Pepper"], description: "Mass-appealing fresh spicy scent.", buyLinks: {} },
{ id: "giorgio-armani-acqua-di-gio", name: "Acqua di Gio", brand: "Giorgio Armani", gender: "men", price: 120, image: "https://fimgs.net/mdimg/perfume/375x500.410.jpg", notes: ["Marine","Citrus"], description: "Classic fresh aquatic favorite.", buyLinks: {} },
{ id: "paco-rabanne-1million", name: "1 Million", brand: "Paco Rabanne", gender: "men", price: 105, image: "https://fimgs.net/mdimg/perfume/375x500.85.jpg", notes: ["Cinnamon","Leather"], description: "Iconic spicy sweet scent.", buyLinks: {} },
{ id: "versace-eros", name: "Eros", brand: "Versace", gender: "men", price: 110, image: "https://fimgs.net/mdimg/perfume/375x500.16657.jpg", notes: ["Mint","Vanilla"], description: "Popular clubbing fragrance.", buyLinks: {} },
{ id: "armani-code", name: "Armani Code", brand: "Giorgio Armani", gender: "men", price: 115, image: "https://fimgs.net/mdimg/perfume/375x500.412.jpg", notes: ["Tonka","Lemon"], description: "Elegant evening scent.", buyLinks: {} },

{ id: "ysl-libre", name: "Libre", brand: "Yves Saint Laurent", gender: "women", price: 140, image: "https://fimgs.net/mdimg/perfume/375x500.56077.jpg", notes: ["Lavender","Orange Blossom"], description: "Top-selling women’s fragrance.", buyLinks: {} },
{ id: "chanel-coco-mademoiselle", name: "Coco Mademoiselle", brand: "Chanel", gender: "women", price: 155, image: "https://static.sweetcare.com/img/prd/488/v-638560299678169024/chanel-002456cl-2.webp", notes: ["Orange","Rose"], description: "Classic and enduringly popular.", buyLinks: {} },
{ id: "ysl-black-opium", name: "Black Opium", brand: "YSL", gender: "women", price: 135, image: "https://fimgs.net/mdimg/perfume/375x500.25324.jpg", notes: ["Coffee","Vanilla"], description: "Sweet and addictive best-seller.", buyLinks: {} },
{ id: "lancome-la-vie-est-belle", name: "La Vie Est Belle", brand: "Lancôme", gender: "women", price: 130, image: "https://fimgs.net/mdimg/perfume/375x500.14982.jpg", notes: ["Iris","Praline"], description: "Widely loved gourmand scent.", buyLinks: {} },
{ id: "prada-paradoxe", name: "Prada Paradoxe", brand: "Prada", gender: "women", price: 150, image: "https://fimgs.net/mdimg/perfume/375x500.50429.jpg", notes: ["Iris","Cashmeran"], description: "Fast-rising bestseller.", buyLinks: {} },
{ id: "marc-jacobs-daisy", name: "Daisy", brand: "Marc Jacobs", gender: "women", price: 120, image: "https://fimgs.net/mdimg/perfume/375x500.1185.jpg", notes: ["Strawberry","Violet"], description: "Popular everyday floral.", buyLinks: {} }
];

export default fragrances;