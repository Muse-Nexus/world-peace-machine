import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { PledgeNag } from "@/components/PledgeNag";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Manifesto from "./pages/Manifesto.tsx";
import Synthesism from "./pages/Synthesism.tsx";
import Snacks from "./pages/Snacks.tsx";
import { NoNukes, NoBickering } from "./pages/PledgeWalls.tsx";
import Slacktivate from "./pages/Slacktivate.tsx";
import Validate from "./pages/Validate.tsx";
import Chat from "./pages/Chat.tsx";
import Shop from "./pages/Shop.tsx";
import ShopSuccess from "./pages/ShopSuccess.tsx";
import ShopCancel from "./pages/ShopCancel.tsx";
import OpenSource from "./pages/OpenSource.tsx";
import Auth from "./pages/Auth.tsx";
import Neighbors from "./pages/Neighbors.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import { BlogIndex, BlogPost } from "./pages/Blog.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <PledgeNag />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/manifesto" element={<Manifesto />} />
        <Route path="/synthesism" element={<Synthesism />} />
        <Route path="/snacks" element={<Snacks />} />
        <Route path="/neighbors" element={<Neighbors />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/no-nukes" element={<NoNukes />} />
        <Route path="/no-bickering" element={<NoBickering />} />
        <Route path="/slacktivate" element={<Slacktivate />} />
        <Route path="/validate" element={<Validate />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/success" element={<ShopSuccess />} />
        <Route path="/shop/cancel" element={<ShopCancel />} />
        <Route path="/open-source" element={<OpenSource />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
