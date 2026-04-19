import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published_at: string;
}

export const BlogIndex = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data as Post[]);
        setLoading(false);
      });
  }, []);

  return (
    <PageShell>
      <section className="container py-12 md:py-20 max-w-5xl">
        <div className="space-y-2">
          <span className="official-border bg-coral text-coral-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">The Blog · listicles &amp; vibes</span>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">
            Top <span className="text-primary">5</span>-ish Reasons.
          </h1>
          <p className="font-mono text-lg max-w-xl">
            Long-form takes from a man who hacked world peace and wants to tell you about it, gracefully.
          </p>
        </div>

        {loading ? (
          <p className="mt-12 font-mono text-muted-foreground">Loading hot takes…</p>
        ) : (
          <div className="mt-12 space-y-4">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="block official-border official-shadow bg-card p-6 hover:bg-accent hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
              >
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {new Date(p.published_at).toLocaleDateString()}
                </p>
                <h2 className="font-display uppercase text-2xl md:text-3xl mt-1 leading-tight">{p.title}</h2>
                <p className="font-mono text-sm mt-2">{p.excerpt}</p>
                <p className="text-xs font-mono uppercase mt-4 underline">read it →</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
};

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setPost(data as Post);
        setLoading(false);
      });
  }, [slug]);

  return (
    <PageShell>
      <section className="container py-12 md:py-20 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-coral">
          <ArrowLeft className="h-3 w-3" /> back to the blog
        </Link>

        {loading ? (
          <p className="mt-12 font-mono text-muted-foreground">Loading…</p>
        ) : !post ? (
          <p className="mt-12 font-mono">Post not found. Maybe it was vibe-deleted.</p>
        ) : (
          <article className="mt-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {new Date(post.published_at).toLocaleDateString()}
            </p>
            <h1 className="font-display uppercase text-4xl md:text-6xl leading-tight mt-2">{post.title}</h1>
            <p className="font-mono text-lg mt-4 text-muted-foreground">{post.excerpt}</p>

            <div className="mt-8 official-border bg-card p-6 md:p-10 official-shadow-coral prose prose-sm md:prose-base max-w-none font-mono">
              <ReactMarkdown>{post.body}</ReactMarkdown>
            </div>
          </article>
        )}
      </section>
    </PageShell>
  );
};
