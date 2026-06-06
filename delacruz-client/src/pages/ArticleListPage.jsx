import { useState, useEffect } from 'react';
import Button from '../components/Button';
import ArticleList from '../components/ArticleList';
import localArticles from '../assets/article-content';
import { fetchArticles } from '../services/ArticleService';

const ArticleListPage = () => {
  const [articles, setArticles] = useState(localArticles);

  useEffect(() => {
    fetchArticles()
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          // Map backend shape → what ArticleList expects
          const mapped = data
            .filter((a) => a.isActive !== false && a.status !== 'inactive')
            .map((a) => ({
              slug:     a.slug,
              name:     a.slug,   // ArticleList uses .name or .slug for the link
              title:    a.title,
              preview:  a.preview ?? (a.paragraphs?.[0] ?? ''),
              imageUrl: a.imageUrl ?? '',
              content:  a.paragraphs ?? [],
            }));
          setArticles(mapped);
        }
      })
      .catch(() => {/* keep local fallback */});
  }, []);

  return (
    <div className="flex w-full flex-col gap-6" style={{ background: '#FBE8CE' }}>

      {/* Hero */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#E4DFB5] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
          Articles
        </p>
        <h1 className="max-w-xl text-3xl font-bold leading-tight text-[#5a6e44] sm:text-4xl">
          Featured articles in a simple card grid
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[#5a6e44] sm:text-base">
          A clean wireframe section for article thumbnails, titles, short descriptions, and one
          clear action per card.
        </p>
        <div className="mt-6">
          <Button to="/home">Back Home</Button>
        </div>
      </section>

      {/* Article Grid */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#FBE8CE] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
            Featured Articles
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#5a6e44]">Article card grid</h2>
        </div>

        <ArticleList articles={articles} />
      </section>

    </div>
  );
};

export default ArticleListPage;
