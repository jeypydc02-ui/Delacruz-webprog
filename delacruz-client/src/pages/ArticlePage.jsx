import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import localArticles from '../assets/article-content';
import { fetchArticles } from '../services/ArticleService';

function ArticlePage() {
  const { name } = useParams();
  const [article, setArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Try backend first
    fetchArticles()
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          const found = data.find((a) => a.slug === name);
          if (found) {
            setArticle({
              title:    found.title,
              name:     found.slug,
              imageUrl: found.imageUrl ?? '',
              content:  found.paragraphs ?? [],
            });
            return;
          }
        }
        // Fall back to local seed
        const local = localArticles.find((a) => a.name === name);
        if (local) {
          setArticle(local);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        const local = localArticles.find((a) => a.name === name);
        if (local) setArticle(local);
        else setNotFound(true);
      });
  }, [name]);

  if (notFound || (!article && !notFound && name)) {
    // Still loading — show nothing briefly; "not found" shown below
    if (!notFound) return null;
    return (
      <div className="flex w-full flex-col gap-6" style={{ background: '#FBE8CE' }}>
        <section className="border-y-2 border-[#3d4a2e] bg-[#E4DFB5] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-[#3d4a2e]">Article not found</h1>
            <Button to="/articles" className="mt-6">Back to Articles</Button>
          </div>
        </section>
      </div>
    );
  }

  if (!article) return null;

  const imgSrc = article.imageUrl || article.image || null;

  return (
    <div className="flex w-full flex-col gap-6" style={{ background: '#FBE8CE' }}>

      {/* Header */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#E4DFB5] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4">
            <Button to="/articles">← Back to Articles</Button>
          </div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
            Article
          </p>
          <h1 className="text-3xl font-bold leading-tight text-[#3d4a2e] sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-2 text-sm text-[#5a6e44]">
            {(article.name ?? '')
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#FBE8CE] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Cover image or placeholder */}
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={article.title}
              className="w-full aspect-4/3 object-cover rounded-[1.25rem] mb-8 border-2 border-[#3d4a2e]"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] border-2 border-[#3d4a2e] bg-[#C3CC9B] mb-8">
              <div className="h-24 w-24 border-2 border-[#3d4a2e] bg-[#9AB17A] rounded-2xl" />
            </div>
          )}

          {/* Article body */}
          <div className="prose prose-sm max-w-none space-y-4 text-[#5a6e44]">
            {(article.content ?? []).map((paragraph, index) => (
              <p key={index} className="text-base leading-7 text-[#5a6e44] whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 border-t-2 border-[#3d4a2e] pt-6">
            <Button to="/articles">Back to Articles</Button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ArticlePage;
