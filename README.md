# **Blogger**

Blogger is a full-featured blog application built using **Next.js**, **TypeScript**, **GraphQL**, **Tailwind CSS**, and **MongoDB**. The platform allows users to create, read, update, and delete blog posts with seamless authentication and user-specific content filtering. It also includes **AI-powered blog generation and summarization** features, real-time chat integration, a settings page, and more.

## **Features**

### **1. AI-Powered Blog Features**
- **AI Blog Generation:** Users can generate entire blog posts using AI, making content creation faster and easier.
- **AI Summarization:** Summarize existing blogs using AI, providing concise overviews of longer content.

### **2. User Authentication**
- **JWT-based Authentication:** Secure login and signup functionalities using JWT.
- **HTTP-only Cookies:** Tokens are stored in HTTP-only cookies for secure authentication.
- **Current User Context:** The logged-in user is accessed globally via a custom hook `useMyContext()` to ensure a smooth user experience across the platform.

### **3. Blog Management**
- **Create Blog:** Authenticated users can create blog posts with rich content.
- **Update Blog:** Users can edit their existing blog posts.
- **Delete Blog:** Users can delete their blog posts.
- **View Blogs:** All blogs are displayed with pagination, sorted by creation date, or user-specific filters.
- **User-Specific Blogs:** Authenticated users can view only their blogs by filtering via GraphQL relationships.

### **4. GraphQL Integration**
- **Apollo Client Setup:** For seamless data fetching and state management across the frontend.
- **Typed Queries and Mutations:** Using **codegen**, all queries and mutations are type-safe, ensuring the integrity of data throughout the application.
- **Relationships:** Fetch blogs related to the currently logged-in user using GraphQL relationships.

### **5. Real-Time Communication**
- **Live Chat Integration (Exploring):** You can choose between Firebase Realtime Database, WebSockets, or MongoDB to implement a live chat feature.

### **6. Dynamic Theming**
- **Light/Dark Mode:** Toggle between light and dark themes using the `ThemeSwitcher` component built with **next-themes**.
- **Persistent Theme:** The selected theme is stored locally and persists across sessions.

### **7. Responsive Design**
- Fully responsive across devices, from desktops to mobile screens, ensuring a consistent user experience using **Tailwind CSS**.

### **8. Smooth Animations**
- **Framer Motion:** Adds dynamic page transitions, hover effects, and other animations to enhance the user interface.

### **9. Settings Page**
- A user settings page built with **Tailwind CSS** and **Framer Motion**, featuring a minimalistic black-and-white color scheme.

### **10. Custom Middleware**
- Middleware handles authentication and routing protection, ensuring only authenticated users can access certain pages like blog creation and management.

## **Tech Stack**

### **Frontend:**
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn**
- **Apollo Client** (for GraphQL)

### **Backend:**
- **Node.js**
- **GraphQL**
- **MongoDB** (Database)
- **Mongoose** (MongoDB ODM)
- **Zod** (for schema validation)
- **JWT Authentication**

### **Deployment:**
- **Vercel** (Frontend)
- **Render** (Backend)

## **Installation and Setup**

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/blogger.git
   cd blogger
