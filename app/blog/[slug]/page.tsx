"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";
import type React from "react";

type BlogComment = { user_email: string; text: string; created_at: string };

type Blog = {
  id: string;
  slug: string;
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
};

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [comment, setComment] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientComponentClient();
    const fetchData = async () => {
      // Fetch blog
      const { data: blogData } = await supabase.from("blogs").select("*").eq("slug", slug).single();
      setBlog(blogData);
      // Fetch user
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
      // Fetch likes
      if (blogData) {
        const { count: likesCount } = await supabase
          .from("blog_likes")
          .select("*", { count: "exact", head: true })
          .eq("blog_id", blogData.id);
        setLikes(likesCount || 0);
        if (userData.user) {
          const { count: userLike } = await supabase
            .from("blog_likes")
            .select("*", { count: "exact", head: true })
            .eq("blog_id", blogData.id)
            .eq("user_id", userData.user.id);
          setLiked(!!userLike);
        }
        // Fetch comments
        const { data: commentsData } = await supabase
          .from("blog_comments")
          .select("user_email, text, created_at")
          .eq("blog_id", blogData.id)
          .order("created_at", { ascending: true });
        setComments(commentsData || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  const handleLike = async () => {
    if (!user || !blog) return;
    const supabase = createClientComponentClient();
    if (liked) {
      await supabase.from("blog_likes").delete().eq("blog_id", blog.id).eq("user_id", user.id);
      setLikes((l) => l - 1);
      setLiked(false);
    } else {
      await supabase.from("blog_likes").insert({ blog_id: blog.id, user_id: user.id });
      setLikes((l) => l + 1);
      setLiked(true);
    }
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !blog || !comment.trim()) return;
    const supabase = createClientComponentClient();
    await supabase.from("blog_comments").insert({
      blog_id: blog.id,
      user_id: user.id,
      user_email: user.email ?? '',
      text: comment,
    });
    setComments((prev) => [...prev, { user_email: user.email ?? '', text: comment, created_at: new Date().toISOString() }]);
    setComment("");
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!blog) return <div className="p-8 text-center">Blog not found.</div>;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/blog" className="text-brand-green hover:underline text-sm">← Back to Blog</Link>
      <div className="flex flex-col items-center gap-4 mb-8 mt-2">
        <span className="inline-block animate-bounce">
          <Image src={blog.image || "/raccoon.png"} alt="Raccoon Mascot" width={48} height={48} />
        </span>
        <h1 className="text-3xl font-bold text-brand-blue dark:text-brand-blue text-center">{blog.title}</h1>
        <p className="text-xs text-gray-500">By {blog.author} • {blog.date}</p>
      </div>
      <article className="prose prose-brand dark:prose-invert max-w-none mb-8">
        {blog.content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </article>
      {/* Likes */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant={liked ? "default" : "outline"}
          size="sm"
          onClick={handleLike}
          disabled={!user}
        >
          👍 {likes}
        </Button>
        {!user && <span className="text-xs text-gray-500">Sign in to like</span>}
      </div>
      {/* Comments */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        <div className="flex flex-col gap-3">
          {comments.length === 0 && <span className="text-gray-500 text-sm">No comments yet.</span>}
          {comments.map((c, i) => (
            <div key={i} className="bg-brand-gray dark:bg-card rounded p-2 text-sm">
              <span className="font-semibold text-brand-blue dark:text-brand-blue">{c.user_email}</span>: {c.text}
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>
        {user ? (
          <form className="flex gap-2 mt-4" onSubmit={handleComment}>
            <input
              className="flex-1 rounded border px-2 py-1 text-sm bg-white dark:bg-card text-brand-blue dark:text-brand-blue"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" size="sm">Comment</Button>
          </form>
        ) : (
          <div className="text-xs text-gray-500 mt-2">Sign in to comment</div>
        )}
      </div>
    </main>
  );
}