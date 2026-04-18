import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import OpenSource from "./pages/OpenSource.tsx";
import Auth from "./pages/Auth.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/synthesism" element={<Synthesism />} />
          <Route path="/snacks" element={<Snacks />} />
          <Route path="/no-nukes" element={<NoNukes />} />
          <Route path="/no-bickering" element={<NoBickering />} />
          <Route path="/slacktivate" element={<Slacktivate />} />
          <Route path="/validate" element={<Validate />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/open-source" element={<OpenSource />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
