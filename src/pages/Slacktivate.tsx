import { PageShell } from "@/components/PageShell";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";

const friendSchema = z.object({
  name: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(254),
  note: z.string().trim().max(280).optional(),
});

const Slacktivate = () => {
  const [shareUrl] = useState(typeof window !== "undefined" ? window.location.origin : "https://ivibecodedworldpeace.com");
  const [friend, setFriend] = useState({ name: "", email: "", note: "" });

  const sendToFriend = () => {
    const parsed = friendSchema.safeParse(friend);
    if (!parsed.success) { toast.error("Check the name and email."); return; }
    const subject = encodeURIComponent("hey — world peace was open-sourced");
    const body = encodeURIComponent(
      `${parsed.data.name},\n\n${parsed.data.note || "thought of you. someone vibe-coded world peace, and i think you'd vibe with it."}\n\n${shareUrl}\n\n— a real one`
    );
    window.location.href = `mailto:${parsed.data.email}?subject=${subject}&body=${body}`;
    toast.success("Email opening. You're a real one.");
  };

  return (
    <PageShell>
      <section className="container py-12 md:py-20 max-w-5xl">
        <div className="space-y-2">
          <span className="brutal-border bg-accent text-accent-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">Bar is on the floor</span>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">
            Slack<span className="text-primary">tivate</span>.
          </h1>
          <p className="font-mono text-lg max-w-2xl">
            Don't want to give? Heard. Here are four (4) ways to do almost nothing and still count.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {/* SHARE */}
          <div className="brutal-card brutal-shadow-orange">
            <p className="font-display uppercase text-2xl">01 · Post it</p>
            <p className="font-mono text-sm mt-2">Share the link. We rebuilt the share buttons. They are square.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("i vibe coded world peace lol")}&url=${encodeURIComponent(shareUrl)}`}>
                <Button className="brutal-border bg-foreground text-background font-mono">X / Twitter</Button>
              </a>
              <a target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}>
                <Button className="brutal-border bg-secondary text-secondary-foreground font-mono">Facebook</Button>
              </a>
              <a target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}>
                <Button className="brutal-border bg-accent text-accent-foreground font-mono">LinkedIn</Button>
              </a>
              <Button onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success("Link copied."); }} className="brutal-border bg-mustard text-mustard-foreground font-mono">
                Copy Link
              </Button>
            </div>
          </div>

          {/* SEND TO FRIEND */}
          <div className="brutal-card">
            <p className="font-display uppercase text-2xl">02 · Send to a friend</p>
            <p className="font-mono text-sm mt-2">Tell one person. That's enough.</p>
            <div className="mt-3 space-y-2">
              <Input placeholder="Friend's name" value={friend.name} onChange={(e) => setFriend({ ...friend, name: e.target.value })} className="brutal-border" maxLength={60} />
              <Input placeholder="Friend's email" type="email" value={friend.email} onChange={(e) => setFriend({ ...friend, email: e.target.value })} className="brutal-border" maxLength={254} />
              <Textarea placeholder="Optional note (280)" value={friend.note} onChange={(e) => setFriend({ ...friend, note: e.target.value })} className="brutal-border" maxLength={280} />
              <Button onClick={sendToFriend} className="brutal-border bg-primary text-primary-foreground font-display uppercase w-full">Send Peace</Button>
            </div>
          </div>

          {/* AI VALIDATOR */}
          <div className="brutal-card bg-mustard text-mustard-foreground">
            <p className="font-display uppercase text-2xl">03 · Tell the AI a kind thought</p>
            <p className="font-mono text-sm mt-2">Spike will validate it. Honestly. Not in a fake way. They'll point out what they actually liked.</p>
            <Link to="/validate"><Button className="mt-4 brutal-border bg-foreground text-background font-display uppercase">Get Validated →</Button></Link>
          </div>

          {/* PET GLOBE */}
          <div className="brutal-card bg-secondary text-secondary-foreground">
            <p className="font-display uppercase text-2xl">04 · TOUCH THE GLOBE</p>
            <p className="font-mono text-sm mt-2">Go home. Click the globe. Each pet is recorded by no one and counted by you alone. Surprisingly fulfilling.</p>
            <Link to="/"><Button className="mt-4 brutal-border bg-mustard text-mustard-foreground font-display uppercase">To the Globe →</Button></Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Slacktivate;
