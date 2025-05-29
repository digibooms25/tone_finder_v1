import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Share2, Copy, Check } from 'lucide-react';
import Button from '../components/Button';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showShareFallback, setShowShareFallback] = useState(false);

  const handleShare = async () => {
    if (!navigator.share) {
      setShowShareFallback(true);
      return;
    }

    try {
      await navigator.share({
        title: 'Why Having Your Own Tone of Voice in the Age of AI Is Basically a Superpower',
        url: window.location.href
      });
    } catch (error) {
      if (error instanceof Error) {
        // Only show fallback if it's not a user cancellation
        if (error.name !== 'AbortError') {
          setShowShareFallback(true);
        }
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopySuccess(true);
      setShowShareFallback(false);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back to Home</span>
        </button>

        <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
                <FileText size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Why Having Your Own Tone of Voice in the Age of AI Is Basically a Superpower
                </h1>
                <p className="text-gray-600 mt-2">May 28, 2025</p>
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              Let's be honest—these days, everyone's writing. And not because we've all suddenly discovered our inner poet or dream of penning the next great novel. Nope. It's because AI made writing… easy. Quick. Painless. Maybe even kind of fun.
            </p>

            <p className="text-gray-700 mb-6">
              But here's the thing: if you've been using AI to help you write emails, blog posts, LinkedIn updates, or that awkward "About Me" section—you might've noticed something strange. You sound suspiciously like… everyone else. A little too polished. A little too polite. A little too ChatGPT-y, if we're being real.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              The Great AI Voice Crisis: Everyone Sounds the Same
            </h2>

            <p className="text-gray-700 mb-6">
              We're living through what I like to call the beige-ification of the internet. Thanks to tools like ChatGPT, writing has gone mainstream—fast. According to Microsoft, three out of four people using a computer for work are now also using generative AI. And in the world of marketing? It's even more intense—88% of marketers use AI every single day, and 83% have already published AI-written content. So, yeah… it's crowded out there.
            </p>

            <p className="text-gray-700 mb-6">
              We're drowning in nice-sounding, well-structured, kind-of-bland content. It's like everyone's writing in the same voice—and surprise! It's not yours.
            </p>

            <p className="text-gray-700 mb-6">
              Even readers can tell. A recent survey found that people can spot AI-written copy more than half the time—and not in a "wow, that's impressive!" kind of way. More like, "huh, this sounds like the same thing I read five minutes ago."
            </p>

            <p className="text-gray-700 mb-6">
              Worse? Half of consumers say they actually don't trust brands that rely too much on AI to talk to them. Oof. That hurts. Because while AI might save time, what it's also doing is quietly scrubbing out all the little quirks, edges, and humanity that made your voice memorable in the first place.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              But Wait—You Do Have a Voice
            </h2>

            <p className="text-gray-700 mb-6">
              Now, maybe you're thinking, "But I'm not a writer. I've never had a voice!" And to that I say: nonsense.
            </p>

            <p className="text-gray-700 mb-6">
              Everyone has a voice. You've just never had a tool that helped you find it—let alone taught you how to use it with AI. That's where the magic happens.
            </p>

            <p className="text-gray-700 mb-6">
              See, when you bring your tone—your real, human, delightfully imperfect tone—into the AI equation, things start to change. Suddenly, your emails don't sound like a tech support bot. Your website copy feels warm. Alive. Like there's an actual person behind it (because there is—hi!).
            </p>

            <div className="bg-blue-50 p-6 rounded-xl my-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">And here's the kicker:</h3>
              <p className="text-blue-800 font-medium mb-4">A unique tone isn't just nice to have. It's a secret weapon.</p>
              <ul className="space-y-2 text-blue-700">
                <li>• A study from the Journal of Consumer Research found that having a consistent, unique voice boosts trust by 33%.</li>
                <li>• Content with a recognizable tone gets remembered 27% more.</li>
                <li>• And in a sea of AI-generated content (which might make up 90% of everything online by 2026, by the way), sounding human is the best way to stand out.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              So What Do You Do About It?
            </h2>

            <p className="text-gray-700 mb-6">
              Well, that's where we come in. Toneofvoice.ai is built for exactly this moment. We help you discover your tone—the one you already have but maybe haven't fully met yet. Then we turn that tone into custom AI prompts that make tools like ChatGPT, Gemini, or Claude actually write like you.
            </p>

            <p className="text-gray-700 mb-6">
              Not like a robot version of you. Not like "Professional LinkedIn You." Just… you. On a really good day. Maybe with an extra cup of coffee.
            </p>

            <p className="text-gray-700 mb-6">
              Because here's the truth: You can use AI every day and still sound like yourself. You can get the speed, the help, the magic—and keep your soul intact.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              Before the Internet Becomes One Big Monologue…
            </h2>

            <p className="text-gray-700 mb-6">
              ...take your voice back. The web is about to get flooded with AI-generated everything. But the people who will actually get noticed? Remembered? Trusted? They're the ones who still sound like humans.
            </p>

            <p className="text-gray-700 mb-6">
              Not like ChatGPT. Not like a slightly smug productivity guru. Just like you.
            </p>

            <p className="text-gray-700 mb-6">
              And if you don't know where to start—we got you. toneofvoice.ai will help you find your voice, then you can teach your AI to use it. Because in this new world, the one thing that can't be automated is you being you.
            </p>

            <div className="bg-gray-50 p-6 rounded-xl mt-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources:</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• <a href="https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part" className="text-blue-600 hover:text-blue-800 transition-colors">Microsoft Work Trend Index, 2024</a></li>
                <li>• <a href="https://blog.hubspot.com/marketing/state-of-generative-ai" className="text-blue-600 hover:text-blue-800 transition-colors">HubSpot State of AI, 2024</a></li>
                <li>• <a href="https://www.reuters.com/technology/artificial-intelligence/openai-says-chatgpts-weekly-users-have-grown-200-million-2024-08-29/" className="text-blue-600 hover:text-blue-800 transition-colors">Reuters, Jan 2024</a></li>
                <li>• <a href="https://www.edelman.com/trust/2024/trust-barometer" className="text-blue-600 hover:text-blue-800 transition-colors">Edelman Trust Barometer, 2024</a></li>
              </ul>
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-600">
                This article was written in the The Casual Storyteller tone.
              </p>
              <div className="mt-4 bg-white p-4 rounded-lg">
                <p className="text-gray-700 text-sm">
                  Write in a tone that is informal and expressive, not concerned with brevity but rather focuses on directness. Your writing should also weave in threads of warmth and humor to add a comforting touch and connect better with the audience.
                </p>
                <button 
                  onClick={() => navigator.clipboard.writeText("Write in a tone that is informal and expressive, not concerned with brevity but rather focuses on directness. Your writing should also weave in threads of warmth and humor to add a comforting touch and connect better with the audience.")}
                  className="mt-2 text-blue-600 hover:text-blue-700 flex items-center text-sm"
                >
                  <Copy size={14} className="mr-1" />
                  Copy prompt
                </button>
              </div>
            </div>
          </div>
        </article>

        <div className="flex justify-between items-center relative">
          <Button
            onClick={() => navigate('/quiz')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Find Your Voice
          </Button>

          <div className="relative">
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
              title="Share article"
            >
              <Share2 size={20} />
            </button>

            {/* Share fallback popup */}
            {showShareFallback && (
              <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg p-3 min-w-[200px]">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {showCopySuccess ? (
                    <>
                      <Check size={16} className="text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;