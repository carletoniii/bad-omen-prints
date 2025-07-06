# Bad Omen Prints

**Bad Omen Prints** is a custom Shopify Hydrogen storefront for selling original film photography prints. This project demonstrates a modern, performant e-commerce experience and serves as a portfolio piece for full-stack web development.

---

## 🛠 Tech Stack

- [Shopify Hydrogen](https://hydrogen.shopify.dev/) (v2)
- TypeScript
- Tailwind CSS
- Vite
- Shopify Storefront API
- Remix

---

## 🎯 Features

- **Custom storefront** for original film photography prints (print-on-demand)
- Modern, responsive design with custom UI components
- Full Shopify integration: cart, checkout, customer accounts, and more
- Predictive and standard search with custom guides
- Account management: profile, addresses, order history
- SEO-friendly routing and meta tags
- Modular, reusable React components
- **Extensible for subscriptions** (see below)
- Accessibility and performance best practices

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- A Shopify store with Hydrogen enabled
- (Optional) Shopify Subscriptions app for recurring products

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/badomenprints.git
   cd badomenprints
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Shopify Storefront API credentials.

4. **Start the development server:**
   ```sh
   npm run dev
   ```

5. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## 🧩 Project Structure

```
badomenprints/
  app/
    assets/         # Static assets (favicons, etc.)
    components/     # Reusable React components (cart, product, layout, etc.)
    graphql/        # Custom GraphQL queries and mutations
    lib/            # Utility libraries and fragments
    routes/         # Remix routes (pages, API endpoints)
    styles/         # CSS and Tailwind styles
    entry.*.tsx     # Remix entry points
    root.tsx        # Root layout and providers
    routes.ts       # Remix route config
  guides/           # Custom documentation and feature guides
  public/           # Static files (images, fonts, favicons)
  package.json      # Project metadata and scripts
  CHANGELOG.md      # Release notes and changes
  README.md         # Project documentation
  tsconfig.json     # TypeScript configuration
  vite.config.ts    # Vite configuration
```

---

## 📦 Scripts

- `npm run dev` – Start the development server with codegen
- `npm run build` – Build for production (with codegen)
- `npm run preview` – Preview the production build
- `npm run lint` – Lint the codebase
- `npm run typecheck` – Type-check TypeScript
- `npm run codegen` – Regenerate GraphQL types

---

## 🛒 Subscriptions Support

This project is **extensible for subscription-based products** using Shopify's Subscriptions app and selling plans.  
To enable subscriptions:

1. Install the [Shopify Subscriptions app](https://apps.shopify.com/shopify-subscriptions) in your Shopify admin.
2. Add selling plans to products in the Shopify admin.
3. Extend the storefront with a `SellingPlanSelector` component and update cart/product logic (see the [Hydrogen Subscriptions Recipe](https://shopify.dev/docs/custom-storefronts/hydrogen/examples/subscriptions) or the included Cursor rule for details).

---

## 📚 Guides & Documentation

- `guides/search/search.md` – Custom search implementation
- `guides/predictiveSearch/predictiveSearch.md` – Predictive search feature
- More guides can be added for onboarding or feature documentation.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## 📄 License

This project is for demonstration and portfolio purposes.  
If you wish to use it commercially, please contact the author.

---

## 🙋‍♂️ Contact

For questions, feedback, or collaboration, please open an issue or reach out via [your preferred contact method].